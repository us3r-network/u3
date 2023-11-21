export const WARPCAST_HOST = 'https://warpcast.com';
export const getFarcasterProfileExternalLinkWithHandle = (handle: string) => {
  if (!handle) return '';
  return `${WARPCAST_HOST}/${handle}`;
};
