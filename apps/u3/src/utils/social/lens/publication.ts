import {
  Post,
  PrimaryPublication,
  TriStateValue,
} from '@lens-protocol/react-web';

export const canComment = (publication: PrimaryPublication) => {
  return publication?.operations?.canComment === TriStateValue.Yes;
};

export const canMirror = (publication: PrimaryPublication) => {
  return publication?.operations?.canMirror === TriStateValue.Yes;
};

export const hasUpvoted = (publication: PrimaryPublication) => {
  return !!publication?.operations?.hasUpvoted;
};

export const getUpvotes = (publication: PrimaryPublication) => {
  return publication?.stats?.upvotes || 0;
};

export const getComments = (publication: PrimaryPublication) => {
  return publication?.stats?.comments || 0;
};

export const getMirrors = (publication: PrimaryPublication) => {
  return publication?.stats?.mirrors || 0;
};

export const backendPublicationToLensPublication = (publication: any) => {
  const { stats = {} } = publication;
  return {
    ...publication,
    stats: {
      ...stats,
      upvotes: stats?.upvotes || stats?.upvoteReactions || 0,
    },
  } as Post;
};
