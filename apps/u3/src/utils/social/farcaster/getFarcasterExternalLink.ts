export const WARPCAST_HOST = 'https://warpcast.com';
export const getFarcasterProfileExternalLinkWithHandle = (handle: string) => {
  if (!handle) return '';
  return `${WARPCAST_HOST}/${handle}`;
};
export const getOfficialCastUrl = (handle, id) => {
  return `${WARPCAST_HOST}/${handle}/0x${id.substring(0, 8)}`;
};
