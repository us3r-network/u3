export enum ApiRespCode {
  SUCCESS = 0,
  ERROR = 1,
}

export type ApiResp<T> = {
  code: ApiRespCode
  msg: string
  data: T
}

export type FarCast = {
  created_at: string
  deleted_at: string | null
  embeds: string[]
  fid: string
  hash: { type: 'Buffer'; data: Uint8Array }
  id: string
  mentions: string[]
  mentions_positions: string[]
  parent_fid: string | null
  parent_hash: { type: 'Buffer'; data: Uint8Array } | null
  parent_url: string | null
  text: string
  timestamp: string
  updated_at: string
  likes: string[]
  like_count: string | null
  recasts: string[]
  recast_count: string | null
  comment_count: string | null
}

export enum SocailPlatform {
  Farcaster = 'farcaster',
  Lens = 'lens',
}
