import {
  PrimaryPublication,
  Profile,
  TriStateValue,
} from '@lens-protocol/react-web';

export const canComment = (publication: PrimaryPublication) => {
  return publication?.operations?.canComment === TriStateValue.Yes;
};

export const canMirror = (publication: PrimaryPublication) => {
  return publication?.operations?.canMirror === TriStateValue.Yes;
};

export const isFollowedByMe = (profile: Profile) => {
  return !!profile?.operations?.isFollowedByMe?.value;
};
