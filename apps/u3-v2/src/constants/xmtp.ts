export const XMTP_ENV = (process.env.REACT_APP_XMTP_ENV || 'dev') as
  | 'local'
  | 'dev'
  | 'production'
