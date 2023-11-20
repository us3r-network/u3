import { Mirror, Post, Comment } from '@lens-protocol/react-web';

export type LensPost = Post & {
  timestamp?: number;
};

export type LensMirror = Mirror & {
  timestamp?: number;
};

export type LensComment = Comment & {
  timestamp?: number;
};
