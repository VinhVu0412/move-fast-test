import prisma from '../../../../../lib/prisma';
import { parseDate } from '../../../../../lib/api/utils';
import { successResponse, errorResponse, formatReward } from '../../../../../lib/api/responses';

function toLastSunday(at) {
  let date = parseDate(at);

  date.setDate(date.getDate() - date.getDay()); // set to the last sunday
  date.setUTCHours(0,0,0,0); // set to midnight
  return date;
}

async function getOrCreateUser(userId) {
  const id = parseInt(userId);
  const user = await prisma.user.findUnique({ where: { id } });
  if (user) return user;

  return await prisma.user.create({ data: { id } });
}

const NUM_REWARD_DAYS = 7; // a week

const getDateAfter = (fromDate, days) => {
  const date = new Date(fromDate);
  date.setDate(fromDate.getDate() + days);
  return date;
};

const toDateOnlyString = (dateObj) => dateObj.toISOString().slice(0, 10);

async function queryRewards(user, fromDate) {
  const rewards = await prisma.reward.findMany({
    where: {
      userId: user.id,
      availableAt: {
        gte: fromDate,
        lt: getDateAfter(fromDate, NUM_REWARD_DAYS),
      },
    },
    orderBy: {
      availableAt: 'asc',
    },
  });
  return (rewards || []).reduce(
    (accummulated, reward) => {
      const date = new Date(reward.availableAt);
      return {
        ...accummulated,
        [toDateOnlyString(date)]: reward,
      };
    },
    {}
  );
}

async function createMissingRewards(user, missingDates) {
  if (!missingDates || !missingDates.length) return [];

  const newRewards = missingDates.map((missingDate) => ({
    availableAt: missingDate.toISOString(),
    expiresAt: getDateAfter(missingDate, 1).toISOString(),
    userId: user.id,
  }));

  await prisma.reward.createMany({
    data: newRewards,
    skipDuplicates: true,
  });
  return newRewards;
}

async function getOrCreateRewards(user, fromDate) {
  const existingRewardsLookup = await queryRewards(user, fromDate);

  let missingDates = [];
  let rewards = [];
  for (let i = 0; i < NUM_REWARD_DAYS; i++) {
    const date = getDateAfter(fromDate, i);
    const dateString = toDateOnlyString(date);
    if (dateString in existingRewardsLookup) {
      rewards.push(existingRewardsLookup[dateString]);
    } else {
      missingDates.push(date);
    }
  }

  const newRewards = await createMissingRewards(user, missingDates);

  return rewards.concat(...newRewards).sort((r1, r2) => r1.expiresAt > r2.expiresAt);
}

export default async function rewards({ query: { userId, at } }, res) {
  if (!at) {
    res.status(400).json(errorResponse("Missing the 'at' query param"));
    return;
  }

  let sunday;
  try {
    sunday = toLastSunday(at);
  } catch {
    res.status(400).json(
      errorResponse(`The 'at' param should be a valid ISO datetime string, e.g. ${new Date().toISOString()}`)
    );
    return;
  }

  const user = await getOrCreateUser(userId);
  const rewards = await getOrCreateRewards(user, sunday);

  res.json(successResponse(rewards.map(formatReward)));
}
