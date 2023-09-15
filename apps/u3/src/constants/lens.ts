export const LENS_ENV = (process.env.REACT_APP_LENS_ENV || 'dev') as
  | 'dev'
  | 'production';

export const PLOYGON_CHAIN_ID = 137;
export const MUMBAI_CHAIN_ID = 80001;
export const LENS_ENV_POLYGON_CHAIN_ID =
  LENS_ENV === 'dev' ? MUMBAI_CHAIN_ID : PLOYGON_CHAIN_ID;
