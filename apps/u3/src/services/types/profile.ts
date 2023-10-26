import { type } from 'os';
import { ApiResp } from '.';

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

export type NFTDataListItem = {
  token_address: '0x50ac3fd26c79d6ba94ea23396977daaf19c86483';
  token_id: '26';
  amount: '1';
  owner_of: '0xee3ca4dd4ceb3416915eddc6cdadb4a6060434d4';
  token_hash: '26db5c22745601ead412de076f961162';
  block_number_minted: '16087335';
  block_number: '16087335';
  contract_type: 'ERC721';
  name: 'Web3 in 2032';
  symbol: 'WEB3IN2032';
  token_uri: 'Invalid uri';
  metadata: '{"name": "WEB3IN2032 #26","description": "WEB3IN2032 documents something that will have happened on Web3 in 2032..","image": "ipfs://bafkreihwaogtbxmxi6t3upypt47pp2mizmxnunq4lcie4jjanti64opx4i","attributes": [{"trait_type": "date", "value": "2032-01-01"}, {"trait_type": "price", "value": "0"}]}';
  last_token_uri_sync: '2022-12-02T03:36:33.815Z';
  last_metadata_sync: '2022-12-02T03:36:33.816Z';
  normalized_metadata: {
    name: 'WEB3IN2032 #26';
    description: 'WEB3IN2032 documents something that will have happened on Web3 in 2032..';
    animation_url: null;
    external_link: null;
    image: 'ipfs://bafkreihwaogtbxmxi6t3upypt47pp2mizmxnunq4lcie4jjanti64opx4i';
  };
};

export type NFTData = {
  total: number;
  cursor: string;
  result: Array<NFTDataListItem>;
};

export type ERC20Balances = Array<{
  token_address: string;
  name: string;
  symbol: string;
  logo: string;
  thumbnail: string;
  decimals: number;
  balance: string;
}>;

export type ProfileEntity = {
  erc20Balances: ERC20Balances;
  ethBalance: string;
  galxe: GalxeData;
  poap: Array<PoapData>;
  noox: NooxData;
  nfts: NFTData;
};
export type ProfileResponse = ApiResp<ProfileEntity>;

type ProfilesEntity = { data: ProfileEntity; wallet: string; chain: string };
export type ProfilesResponse = ApiResp<ProfilesEntity[]>;

export type ProfileWallet = {
  chain: string; // 'eth'
  wallet: string;
};
