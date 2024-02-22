import { FARCASTER_NETWORK } from '../../constants/farcaster';
import { LENS_ENV } from '../../constants/lens';
import { getAddressWithDidPkh, isDidPkh } from '../shared/did';

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
export const LENS_NAMESPACE = BIOLINK_LENS_NETWORK === 'dev' ? 'test' : 'lens';

export const isLensHandle = (handle: string) => {
  return LENS_SUFFIXS.some((suffix) => handle.endsWith(`.${suffix}`));
};
export const isFarcasterHandle = (handle: string) => {
  return FARCASTER_SUFFIXS.some((suffix) => handle.endsWith(`.${suffix}`));
};
export const isDIDHandle = (handle: string) => {
  return isDidPkh(handle);
};
export const lensHandleToBioLinkHandle = (handle: string) => {
  return handle
    ? `${handle
        .replace(`${LENS_NAMESPACE}/`, '')
        .replace(/\.[^.]+$/, '')}.${BIOLINK_LENS_SUFFIX}`
    : '';
};
export const farcasterHandleToBioLinkHandle = (handle: string) => {
  return handle
    ? `${handle.replace(/\.[^.]+$/, '')}.${BIOLINK_FARCASTER_SUFFIX}`
    : '';
};
export const DIDHandleToBioLinkHandle = (handle: string) => {
  return handle ? getAddressWithDidPkh(handle) : '';
};
