import prisma from '../../../../../../lib/prisma';
import { parseDate } from '../../../../../../lib/api/utils';
import { errorResponse, successResponse, formatReward } from '../../../../../../lib/api/responses';


async function findReward(userId, availableAt) {
  const foundRewards = await prisma.reward.findMany({
    where: { availableAt, userId: parseInt(userId) },
  });
  return foundRewards[0];
}

async function redeemReward(reward) {
  return await prisma.reward.update({
    where: {
      id: reward.id,
    },
    data: {
      redeemedAt: new Date(),
    },
  })
}

export default async function rewards(req, res) {
  const { method, query: { userId, rewardId } } = req;

  if (method !== 'PATCH') {
    res.status(405).json(
      errorResponse(`${method} method not allowed. Please use PATCH`)
    );
    return;
  }

  let availableAt;
  try {
    availableAt = parseDate(rewardId);
  } catch {
    res.status(400).json(
      errorResponse(
        `The 'rewardId' in your path should be a valid ISO datetime string, e.g. ${new Date().toISOString()}`
      )
    );
    return;
  }

  const reward = await findReward(userId, availableAt);
  if (!reward) {
    res.status(404).json(errorResponse('Reward not found'));
    return;
  }

  if (new Date() > new Date(reward.expiresAt)) {
    res.status(400).json(errorResponse('This reward is already expired'));
    return;
  }

  if (reward.redeemedAt) {
    res.status(400).json(errorResponse('This reward has been redeemed'));
    return;
  }

  const redeemedReward = await redeemReward(reward); 
  res.json(successResponse(formatReward(redeemedReward)));
}
