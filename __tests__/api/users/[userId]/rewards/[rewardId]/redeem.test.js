import redeem from '../../../../../../pages/api/users/[userId]/rewards/[rewardId]/redeem';
import rewards from '../../../../../../pages/api/users/[userId]/rewards';
import prisma from '../../../../../../lib/prisma';
import { createMockRes } from '../../../../utils'

describe('users/:userId/rewards/:rewardId/redeem', () => {
  afterEach(async () => {
    await prisma.reward.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it('should return error if rewardId is not a valid date string', async () => {
    const res = createMockRes();
    const req = {
      query: { userId: 1, rewardId: '2000' },
      method: 'PATCH',
    };
    await redeem(req, res);

    expect(res.status.mock.calls.length).toBe(1);
    expect(res.json.mock.calls.length).toBe(1);

    expect(res.status.mock.calls[0][0]).toEqual(400);
    expect(res.json.mock.calls[0][0].error.message).toEqual(
      expect.stringContaining("The 'rewardId' in your path should be a valid ISO datetime string, e.g. ")
    );
  });

  it('should not support GET method', async () => {
    const res = createMockRes();
    const req = {
      query: { userId: 1, rewardId: '2020-03-18T00:00:00Z' },
      method: 'GET',
    };
    await redeem(req, res);

    expect(res.status.mock.calls.length).toBe(1);
    expect(res.json.mock.calls.length).toBe(1);

    expect(res.status.mock.calls[0][0]).toEqual(405);
    expect(res.json.mock.calls[0][0]).toEqual({
      error: { message: 'GET method not allowed. Please use PATCH' },
    });
  });

  it('should return 404 if no matched reward found', async () => {
    const res = createMockRes();
    const req = {
      query: { userId: 1, rewardId: '2020-03-18T00:00:00Z' },
      method: 'PATCH',
    };
    await redeem(req, res);

    expect(res.status.mock.calls.length).toBe(1);
    expect(res.json.mock.calls.length).toBe(1);

    expect(res.status.mock.calls[0][0]).toEqual(404);
    expect(res.json.mock.calls[0][0]).toEqual({
      error: { message: 'Reward not found' },
    });
  });

  it('should return error if the reward is already expired', async () => {
    const rewardsRes = createMockRes();
    const rewardReq = { query: { userId: 1, at: '2020-03-19T12:00:00Z' } };
    await rewards(rewardReq, rewardsRes);

    expect(rewardsRes.json.mock.calls.length).toBe(1);
    expect(rewardsRes.json.mock.calls[0][0]).toEqual({
      data: [
        { availableAt: '2020-03-15T00:00:00Z', redeemedAt: null, 'expiresAt': '2020-03-16T00:00:00Z' },
        { availableAt: '2020-03-16T00:00:00Z', redeemedAt: null, 'expiresAt': '2020-03-17T00:00:00Z' },
        { availableAt: '2020-03-17T00:00:00Z', redeemedAt: null, 'expiresAt': '2020-03-18T00:00:00Z' },
        { availableAt: '2020-03-18T00:00:00Z', redeemedAt: null, 'expiresAt': '2020-03-19T00:00:00Z' },
        { availableAt: '2020-03-19T00:00:00Z', redeemedAt: null, 'expiresAt': '2020-03-20T00:00:00Z' },
        { availableAt: '2020-03-20T00:00:00Z', redeemedAt: null, 'expiresAt': '2020-03-21T00:00:00Z' },
        { availableAt: '2020-03-21T00:00:00Z', redeemedAt: null, 'expiresAt': '2020-03-22T00:00:00Z' },
      ],
    });

    const res = createMockRes();
    const req = {
      query: { userId: 1, rewardId: '2020-03-20T00:00:00Z' },
      method: 'PATCH',
    };
    await redeem(req, res);

    expect(res.status.mock.calls.length).toBe(1);
    expect(res.json.mock.calls.length).toBe(1);
    expect(res.status.mock.calls[0][0]).toEqual(400);
    expect(res.json.mock.calls[0][0]).toEqual({
      error: { message: 'This reward is already expired' },
    });
  });

  it('should able to redeem a valid reward', async () => {
    // TODO: we need to freeze time to improve readability
    const now = new Date();
    const todayMidnight = new Date();
    todayMidnight.setUTCHours(0,0,0,0); // set to midnight

    // create rewards
    const rewardsRes = createMockRes();
    const rewardReq = { query: { userId: 1, at: todayMidnight.toISOString() } };
    await rewards(rewardReq, rewardsRes);
    expect(rewardsRes.json.mock.calls.length).toBe(1);
    expect(rewardsRes.json.mock.calls[0][0].data.length).toEqual(7);

    // redeem a reward
    const res = createMockRes();
    const req = {
      query: { userId: 1, rewardId: todayMidnight.toISOString() },
      method: 'PATCH',
    };
    await redeem(req, res);

    expect(res.json.mock.calls.length).toBe(1);
    const reward = res.json.mock.calls[0][0].data;
    expect(reward.availableAt).toEqual(`${todayMidnight.toISOString().slice(0, 19)}Z`);

    const rounding = (date) => new Date(date.slice(0, 19)).getTime();
    expect(rounding(reward.redeemedAt)).toBeGreaterThanOrEqual(rounding(now.toISOString()));
    expect(rounding(reward.redeemedAt)).toBeLessThanOrEqual(rounding(new Date().toISOString()));

    // test redeem tiwce
    const secondRes = createMockRes();
    await redeem(req, secondRes);

    expect(secondRes.status.mock.calls.length).toBe(1);
    expect(secondRes.json.mock.calls.length).toBe(1);
    expect(secondRes.status.mock.calls[0][0]).toEqual(400);
    expect(secondRes.json.mock.calls[0][0]).toEqual({
      error: { message: 'This reward has been redeemed' },
    });
  });
});
