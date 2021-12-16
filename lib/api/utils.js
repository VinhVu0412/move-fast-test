export const parseDate = (dateString) => {
  const date = new Date(dateString);

  // make sure dateString is in ISO format
  if (date.toISOString().slice(0, 10) !== dateString.slice(0, 10)) {
    throw new Error('Invalid date format');
  }

  return date;
}
