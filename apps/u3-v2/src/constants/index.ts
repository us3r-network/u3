export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const CERAMIC_HOST = process.env.REACT_APP_CERAMIC_HOST as string

export const US3R_UPLOAD_IMAGE_ENDPOINT = process.env
  .REACT_APP_US3R_UPLOAD_IMAGE_ENDPOINT as string

export const WALLET_CONNECT_PROJECT_ID =
  process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID ||
  'c652d0148879353d7e965d7f6f361e59'

export const AIRSTACK_API_KEY =
  process.env.REACT_APP_AIRSTACK_API_KEY || '135391e4df1d47fa898d43c9f4b27329'

export const MEDIA_BREAK_POINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 992,
  xl: 1024,
  xxl: 1280,
  xxxl: 1440,
}
