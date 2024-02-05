export type CommunityEntity = {
  id: number;
  name: string;
  image: string;
  description: string;
  types: string[];
};

export type CommunityStatistics = {
  postsCount: number;
  membersCount: number;
};

export type MemberEntity = {
  id: number;
  name: string;
  avatar: string;
  address: string;
  bio: string;
};

export type CommunityInfo = CommunityEntity &
  CommunityStatistics & {
    token?: {
      contract: string;
      url: string;
    };
    nft?: {
      contract: string;
      url: string;
    };
    point?: {
      contract: string;
      url: string;
    };
    dapps?: Array<{
      id: number;
      name: string;
      logo: string;
      url: string;
    }>;
  };
