import { Profile, TriStateValue } from '@lens-protocol/react-web';

export const getName = (profile: Profile) => {
  return profile?.metadata?.displayName || '';
};
export const getHandle = (profile: Profile) => {
  return profile?.handle?.localName || '';
};
export const getBio = (profile: Profile) => {
  return profile?.metadata?.bio || '';
};
export const getOwnedByAddress = (profile: Profile) => {
  return profile?.ownedBy?.address || '';
};
export const isFollowedByMe = (profile: Profile) => {
  return !!profile?.operations?.isFollowedByMe?.value;
};
export const canFollow = (profile: Profile) => {
  return profile?.operations?.canFollow === TriStateValue.Yes;
};

export const canUnfollow = (profile: Profile) => {
  return profile?.operations?.canUnfollow;
};
