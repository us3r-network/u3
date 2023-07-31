export interface TokenType {
  amount: string;
  tokenType: string;
  blockchain: 'ethereum' | 'polygon';
  tokenAddress: string;
  formattedAmount: number;
  tokenNfts: TokenNfts;
  token: Token;
}

export interface TokenNfts {
  tokenId: string;
  contentValue: ContentValue;
}

export interface ContentValue {
  image: Image;
}

export interface Image {
  small: string;
  medium: string;
}

export interface Token {
  name: string;
  symbol: string;
  logo: {
    small: string;
    medium: string;
  };
  projectDetails: {
    imageUrl: string;
  };
}

export type PoapType = {
  Poaps: {
    Poap: {
      id: string;
      blockchain: string;
      tokenId: string;
      tokenAddress: string;
      poapEvent: {
        city: string;
        eventName: string;
        startDate: string;
        eventId: string;
        logo: {
          image: {
            small: string;
            medium: string;
          };
        };
      };
    }[];
    pageInfo: {
      nextCursor: string;
      prevCursor: string;
    };
  };
};

export interface SocialsType {
  Wallet: Wallet;
}

export interface Wallet {
  primaryDomain: PrimaryDomain;
  domains: Domain[];
  socials: Social[];
  xmtp: Xmtp[];
}

export interface Xmtp {
  isXMTPEnabled: boolean;
}

// ERC20

export interface ERC20TokensType {
  ethereum: {
    TokenBalance: TokenBalance[];
  };
  polygon: {
    TokenBalance: TokenBalance[];
  };
}

export interface Ethereum {
  TokenBalance: TokenBalance[];
}

export interface TokenBalance {
  tokenAddress: string;
  formattedAmount: number;
  blockchain: string;
  tokenId: string;
  token: Token;
  owner: Owner;
  tokenType: string;
  id: string;
}

export interface Owner {
  identity: string;
  addresses: string[];
  poaps: Poap[];
  socials: Social[];
  primaryDomain: PrimaryDomain;
  domains: Domain[];
  xmtp: Xmtp[];
}

export interface Poap {
  dappName: string;
  tokenUri: string;
  tokenAddress: string;
  tokenId: string;
}

export interface Social {
  blockchain: string;
  dappSlug: string;
  profileName: string;
}

export interface PrimaryDomain {
  name: string;
}

export interface Domain {
  chainId: string;
  dappName: string;
  owner: string;
  name: string;
}
