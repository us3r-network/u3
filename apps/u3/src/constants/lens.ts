export const LENS_ENV = (process.env.REACT_APP_LENS_ENV || 'dev') as
  | 'dev'
  | 'production';

export const LENS_ENV_POLYGON_CHAIN_ID = LENS_ENV === 'dev' ? 80001 : 137;
