export const errorResponse = (message) => ({ error: { message } });

export const successResponse = (data) => ({ data });

const formatOutputDateString = (dateString) => {
  if (!dateString) return null;

  // change :00.000Z to :00Z
  const isoString = new Date(dateString).toISOString()
  return `${isoString.slice(0, isoString.length - 5)}Z`;
}

export const formatReward = ({ availableAt, redeemedAt, expiresAt }) => ({
  availableAt: formatOutputDateString(availableAt),
  redeemedAt: formatOutputDateString(redeemedAt),
  expiresAt: formatOutputDateString(expiresAt),
});
