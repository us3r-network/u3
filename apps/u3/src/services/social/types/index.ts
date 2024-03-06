export enum ApiRespCode {
  SUCCESS = 0,
  ERROR = 1,
}

export type ApiResp<T> = {
  code: ApiRespCode;
  msg: string;
  data: T;
};

export type FarCastEmbedMetaCast = {
  type: 'cast';
  cast: Partial<FarCast>;
  user: { [key: string]: any }[];
};

export type FarCastEmbedMeta = {
  description: string;
  icon: string;
  image: string;
  title: string;
  url: string;
  collection: string | undefined;
  nftSchema: string | undefined;
  creatorAddress: string | undefined;
  contractAddress: string | undefined;
  twitter?: string;
  provider?: string;
  video?: string;
  fcFrame?: string;
  fcFrameButton1?: string;
  fcFrameButton2?: string;
  fcFrameButton3?: string;
  fcFrameButton4?: string;
  fcFrameImage?: string;
  fcFramePostUrl?: string;
  fcFrameInputText?: string;
};

export type FarCast = {
  created_at: string;
  createdAt: string;
  deleted_at: string | null;
  embeds: any[];
  fid: string;
  hash: { type: 'Buffer'; data: Uint8Array };
  id: string;
  mentions: number[];
  mentions_positions: string[];
  mentionsPositions: number[];
  parent_fid: string | null;
  parent_hash: { type: 'Buffer'; data: Uint8Array } | null;
  parent_url: string | null;
  rootParentUrl: string | null;
  parent: string | null;
  parentUrl: string | null;
  text: string;
  timestamp: string;
  updated_at: string;
  likes: string[];
  like_count: string | null;
  likesCount: string | null;

  recasts: string[];
  recast_count: string | null;
  recastsCount: string | null;

  replies?: string[];
  repliesCount: string | null;
  comments?: string[];
  comment_count: string | null;

  tipsTotalAmount: number;
};

export enum SocialPlatform {
  Farcaster = 'farcaster',
  Lens = 'lens',
}

export type PlatformAccountData = {
  platform: SocialPlatform;
  avatar: string;
  name: string;
  handle: string;
  id: string | number;
  bio: string;
  address?: string;
};

export type GalxeDataListItem = {
  id: string;
  name: string;
  image: string;
  chain: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
  campaign: {
    id: string;
    numberID: number;
    name: string;
    type: string;
    status: string;
  };
  nftCore: {
    id: string;
    contractAddress: string;
    name: string;
    info: string;
    symbol: string;
    chain: string;
    transferable: boolean;
  };
};

export type GalxeData = {
  addressInfo?: {
    nfts: {
      totalCount: number;
      pageInfo: {
        startCursor: string;
        endCursor: string;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
      list: Array<GalxeDataListItem>;
    };
  };
};

export type NooxDataListItem = {
  transaction_hash: string;
  address: string;
  block_timestamp: string;
  block_number: string;
  block_hash: string;
  data: string;
  topic0: string;
  topic1: string;
  topic2: string;
  transaction_index: number;
  log_index: number;
  uri: string;
  uriMetaData?: {
    name: string;
    description: string;
    description_eligibility: string;
    external_url: string;
    image: string;
    image_badge: string;
    image_thumbnail: string;
  };
};

export type NooxData = {
  total: number;
  result: Array<NooxDataListItem>;
};

export type PoapData = {
  event: {
    id: number;
    fancy_id: string;
    name: string;
    event_url: string;
    image_url: string;
    country: string;
    city: string;
    description: string;
    year: number;
    start_date: string;
    end_date: string;
    expiry_date: string;
    supply: number;
  };
  tokenId: string;
  owner: string;
  chain: string;
  created: string;
};
