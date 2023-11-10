import { FARCASTER_NETWORK } from '../../constants/farcaster';
import { LENS_ENV } from '../../constants/lens';

export const BIOLINK_PLATFORMS = {
  lens: 'lens',
  farcaster: 'farcaster',
};
export const BIOLINK_LENS_NETWORK = LENS_ENV;
export const BIOLINK_FARCASTER_NETWORK = FARCASTER_NETWORK;
export const LENS_SUFFIXS = ['lens', 'lens-testnet'];
export const FARCASTER_SUFFIXS = ['fcast', 'fc', 'farcaster'];
export const BIOLINK_LENS_SUFFIX =
  BIOLINK_LENS_NETWORK === 'dev' ? 'lens-testnet' : 'lens';
export const BIOLINK_FARCASTER_SUFFIX = 'fcast';

export const isLensHandle = (handle: string) => {
  return LENS_SUFFIXS.some((suffix) => handle.endsWith(`.${suffix}`));
};
export const isFarcasterHandle = (handle: string) => {
  return FARCASTER_SUFFIXS.some((suffix) => handle.endsWith(`.${suffix}`));
};
export const lensHandleToBioLinkHandle = (handle: string) => {
  return handle
    ? `${handle
        .replace('test/', '')
        .replace(/\.[^.]+$/, '')}.${BIOLINK_LENS_SUFFIX}`
    : '';
};
export const farcasterHandleToBioLinkHandle = (handle: string) => {
  return handle
    ? `${handle.replace(/\.[^.]+$/, '')}.${BIOLINK_FARCASTER_SUFFIX}`
    : '';
};
