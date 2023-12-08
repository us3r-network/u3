import { Mirror, Post, Comment } from '@lens-protocol/react-web';
import axios from 'axios';
import { REACT_APP_API_SOCIAL_URL } from 'src/constants';

export type LensPost = Post & {
  timestamp?: number;
};

export type LensMirror = Mirror & {
  timestamp?: number;
};

export type LensComment = Comment & {
  timestamp?: number;
};

export const FEEDS_PAGE_SIZE = 25;

export const FEEDS_SCROLL_THRESHOLD = `${FEEDS_PAGE_SIZE * 200}px`;

// for now use farcaster trending
export function getAllTrending() {
  throw new Error('Not implemented');
}

export function getAllWhatsnew({
  pageSize,
  endLensCursor,
  lensAccessToken,
  endFarcasterCursor,
  endTimestamp,
}: {
  pageSize?: number;
  endLensCursor?: string;
  lensAccessToken?: string;
  endFarcasterCursor?: string;
  endTimestamp?: number;
}) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-all/whatsnew`,
    method: 'get',
    headers: {
      'Lens-Access-Token': lensAccessToken ? `Bearer ${lensAccessToken}` : '',
    },
    params: {
      pageSize: pageSize || FEEDS_PAGE_SIZE,
      endLensCursor,
      endFarcasterCursor,
      endTimestamp,
    },
  });
}

export function getAllFollowing({
  pageSize,
  endLensCursor,
  lensProfileId,
  lensAccessToken,
  endFarcasterCursor,
  endTimestamp,
  fid,
  hasLensNextPage,
  hasFarcasterNextPage,
}: {
  pageSize?: number;
  endLensCursor?: string;
  lensAccessToken?: string;
  lensProfileId?: string;
  endFarcasterCursor?: string;
  endTimestamp?: number;
  fid?: number;
  hasLensNextPage?: boolean;
  hasFarcasterNextPage?: boolean;
}) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-all/following`,
    method: 'get',
    headers: {
      'Lens-Access-Token': lensAccessToken ? `Bearer ${lensAccessToken}` : '',
    },
    params: {
      pageSize: pageSize || FEEDS_PAGE_SIZE,
      endLensCursor,
      lensProfileId,
      endFarcasterCursor,
      endTimestamp,
      hasLensNextPage,
      hasFarcasterNextPage,
      fid,
    },
  });
}
