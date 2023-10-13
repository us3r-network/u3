import { FARCASTER_NETWORK } from '../../constants/farcaster';
import { LENS_ENV } from '../../constants/lens';

export const BIOLINK_PLATFORMS = {
  lens: 'lens',
  farcaster: 'farcaster',
};
export const BIOLINK_LENS_NETWORK = LENS_ENV;
export const BIOLINK_FARCASTER_NETWORK = FARCASTER_NETWORK;
export const BIOLINK_LENS_SUFFIX =
  BIOLINK_LENS_NETWORK === 'dev' ? 'lens-testnet' : 'lens';
export const BIOLINK_FARCASTER_SUFFIX = 'fcast';

export const isLensHandle = (handle: string) => {
  return handle.endsWith(`.${BIOLINK_LENS_SUFFIX}`);
};
export const isFarcasterHandle = (handle: string) => {
  return handle.endsWith(`.${BIOLINK_FARCASTER_SUFFIX}`);
};
export const lensHandleToBioLinkHandle = (handle: string) => {
  return handle.replace(/\.[^.]+$/, `.${BIOLINK_LENS_SUFFIX}`);
};
export const farcasterHandleToBioLinkHandle = (handle: string) => {
  return `${handle}.${BIOLINK_FARCASTER_SUFFIX}`;
};
