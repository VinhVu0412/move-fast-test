import rewards from '../../../../pages/api/users/[userId]/rewards';
import prisma from '../../../../lib/prisma';
import { createMockRes } from '../../utils'

describe('users/:userId/rewards', () => {
  afterEach(async () => {
    await prisma.reward.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it('should return error if missing at query param', async () => {
    const res = createMockRes();
    const req = {
      query: { userId: 1 },
    }
    await rewards(req, res);

    expect(res.status.mock.calls.length).toBe(1);
    expect(res.json.mock.calls.length).toBe(1);

    expect(res.status.mock.calls[0][0]).toEqual(400);
    expect(res.json.mock.calls[0][0]).toEqual({ error: { message: "Missing the 'at' query param" } });
  });

  it('should return rewards within the week', async () => {
    const res = createMockRes();
    const req = {
      query: { userId: 1, at: '2020-03-19T12:00:00Z' },
    }
    await rewards(req, res);

    expect(res.json.mock.calls.length).toBe(1);
    expect(res.json.mock.calls[0][0]).toEqual({
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
  });

  it('should return error if at is an invalid date string', async () => {
    const res = createMockRes();
    const req = {
      query: { userId: 1, at: '2020' },
    }
    await rewards(req, res);

    expect(res.status.mock.calls.length).toBe(1);
    expect(res.json.mock.calls.length).toBe(1);

    expect(res.status.mock.calls[0][0]).toEqual(400);
    expect(res.json.mock.calls[0][0].error.message).toEqual(
      expect.stringContaining("The 'at' param should be a valid ISO datetime string")
    );
  });
});
