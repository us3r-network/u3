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

export function getLensTrending({
  pageSize,
  endLensCursor,
  lensAccessToken,
}: {
  pageSize?: number;
  endLensCursor?: string;
  lensAccessToken?: string;
}) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-lens/trending`,
    method: 'get',
    headers: {
      'Lens-Access-Token': lensAccessToken ? `Bearer ${lensAccessToken}` : '',
    },
    params: {
      pageSize: pageSize || FEEDS_PAGE_SIZE,
      endLensCursor,
    },
  });
}
