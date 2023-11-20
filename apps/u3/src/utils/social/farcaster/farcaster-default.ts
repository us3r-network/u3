const Key = 'farcaster-default';

export const setDefaultFarcaster = (fid: string) => {
  localStorage.setItem(Key, fid);
};

export const getDefaultFarcaster = () => {
  return localStorage.getItem(Key);
};
