export type CommunityEntity = {
  id: number;
  name: string;
  logo: string;
  description: string;
  createdAt?: number;
  lastModifiedAt?: number;
  types: string[];
  apps?: Array<{
    logo: string;
    name: string;
    website: string;
  }>;
  tokens?: Array<{
    url: string;
    contract: string;
  }>;
  nfts?: Array<{
    url: string;
    contract: string;
  }>;
  points?: Array<{
    url: string;
  }>;
  channels?: Array<{
    name: string;
    image: string;
    channel_id: string;
    parent_url: string;
  }>;
};

export type CommunityStatistics = {
  memberInfo: {
    totalNumber?: number;
    newPostNumber?: number;
    friendMemberNumber?: number;
  };
};

export type MemberEntity = {
  id: number;
  name: string;
  avatar: string;
  address: string;
  bio: string;
};

export type CommunityInfo = CommunityEntity & CommunityStatistics;
