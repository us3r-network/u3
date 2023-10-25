import multiavatar from '@multiavatar/multiavatar';

export const getDefaultAvatarWithIdentity = (identity?: string) =>
  `data:image/svg+xml;utf-8,${encodeURIComponent(multiavatar(identity))}`;
