export const createMockRes = () => {
  const json = jest.fn();
  const statusRes = { json };
  const status = jest.fn().mockReturnValue(statusRes);

  return { json, status };
}
