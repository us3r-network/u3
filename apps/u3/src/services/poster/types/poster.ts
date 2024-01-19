export type PosterEntity = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  metadata: string;
  tokenId?: number;
  chainId?: number;
  tokenContract?: string;
  priceStrategyContract?: string;
  saleStart?: string;
  saleEnd?: string;
};

export type PosterMetadata = {
  name: string;
  description: string;
  external_url: string;
  properties: {
    imageOriginUrl: string;
    url: string;
    posterDataJson: string;
    createAt: Date;
  };
};

export type PosterPageInfo = {
  endCursor?: number;
  hasNextPage: boolean;
};
