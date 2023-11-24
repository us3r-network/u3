import { LENS_ENV } from '../../../constants/lens';

const HEY_PROD_HOST = 'https://hey.xyz';
const HEY_DEV_HOST = 'https://testnet.hey.xyz';
export const HEY_HOST =
  LENS_ENV === 'production' ? HEY_PROD_HOST : HEY_DEV_HOST;
export const getLensProfileExternalLinkWithHandle = (handle: string) => {
  if (!handle) return '';
  return `${HEY_HOST}/u/${handle}`;
};
