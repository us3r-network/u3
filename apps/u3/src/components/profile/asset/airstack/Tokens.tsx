/* eslint-disable react/no-array-index-key */
import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { MEDIA_BREAK_POINTS } from 'src/constants';
import styled from 'styled-components';

import { POAPQuery, TokensQuery } from '../../../../services/shared/queries';
import { PoapType, TokenType } from './types';
import { Asset } from './Asset';
import Loading from '../../../common/loading/Loading';

type TokenProps = {
  type: string;
  name: string;
  id: string;
  address: string;
  symbol: string;
  blockchain: 'ethereum' | 'polygon';
  tokenId: string;
  image?: string;
  eventId?: string;
};

function Token({
  type,
  name,
  symbol,
  address,
  id,
  blockchain = 'ethereum',
  tokenId,
  image,
  eventId,
}: TokenProps) {
  return (
    <CardBox>
      <Box calcHeight>
        {(image || (address && tokenId)) && (
          <Asset
            image={image}
            address={address}
            tokenId={tokenId}
            chain={blockchain}
            name={name}
            preset="medium"
          />
        )}
      </Box>
      <div className="name">
        <p>{name}</p>
      </div>
    </CardBox>
  );
}

function Loader() {
  return (
    <div className="loading">
      <Loading />
    </div>
  );
}

type Poap = PoapType['Poaps']['Poap'][0];
const variables = {};
const config = {
  cache: false,
};

function TokensComponent() {
  const [
    fetchTokens,
    { data: tokensData, loading: loadingTokens, pagination: paginationTokens },
  ] = useLazyQueryWithPagination(TokensQuery, variables, config);

  const session = useSession();
  const sessId = session?.id || '';

  const [tokens, setTokens] = useState<(TokenType | Poap)[]>([]);
  const sessWallet = useMemo(() => sessId.split(':').pop() || '', [sessId]);
  useEffect(() => {
    const owner = sessWallet;
    if (owner) {
      fetchTokens({
        owner,
        limit: 100,
        tokenType: ['ERC721', 'ERC1155'],
      });

      setTokens([]);
    }
  }, [fetchTokens, sessWallet]);

  useEffect(() => {
    if (tokensData) {
      const { ethereum, polygon } = tokensData;
      const ethTokens = ethereum?.TokenBalance || [];
      const maticTokens = polygon?.TokenBalance || [];
      setTokens((tks) => [...tks, ...ethTokens, ...maticTokens]);
    }
  }, [tokensData]);

  const handleNext = useCallback(() => {
    if (!loadingTokens && paginationTokens?.hasNextPage) {
      paginationTokens.getNextPage();
    }
  }, [loadingTokens, paginationTokens]);

  const loading = loadingTokens;

  if (tokens.length === 0 && !loading) {
    return (
      <div className="flex flex-1 justify-center mt-10">No data found!</div>
    );
  }

  const hasNextPage = paginationTokens?.hasNextPage;
  if (tokens.length === 0 && loading) {
    return (
      <div className="flex flex-wrap gap-x-[55px] gap-y-[55px] justify-center md:justify-start">
        <Loader />
      </div>
    );
  }

  return (
    <InfiniteScroll
      next={handleNext}
      dataLength={tokens.length}
      hasMore={hasNextPage}
      loader={loading ? <Loader /> : null}
      className="data"
      scrollableTarget="top-wrapper"
    >
      {tokens.map((_token, index) => {
        const token = _token as TokenType;
        const poap = _token as Poap;
        const isPoap = Boolean(poap.poapEvent);
        const poapEvent: any = poap.poapEvent || {};
        const city = poapEvent.city || '';

        const address = token.tokenAddress || poap.tokenAddress;
        const id = token.tokenNfts?.tokenId
          ? `#${token.tokenNfts?.tokenId}`
          : poapEvent.eventName;

        const symbol = token?.token?.symbol || '';
        const type = token.tokenType || 'POAP';
        const blockchain = token.blockchain || 'ethereum';
        const name =
          token?.token?.name ||
          `${formatDate(poapEvent.startDate)}${city ? ` (${city})` : ''}`;
        const tokenId = token.tokenNfts?.tokenId || poap.tokenId;
        const image = token.tokenNfts?.contentValue?.image?.medium || '';
        const eventId = poapEvent?.eventId || '';

        return (
          <Token
            key={index}
            type={type}
            name={name}
            id={id}
            address={address}
            symbol={symbol}
            blockchain={blockchain}
            tokenId={tokenId}
            image={image}
            eventId={eventId}
          />
        );
      })}
    </InfiniteScroll>
  );
}

export const Tokens = memo(TokensComponent);

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (date.toDateString() === 'Invalid Date') return dateString;

  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const CardBox = styled.div`
  min-width: 162px;
  /* height: 225px; */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid #39424c;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc((100% - 20px * 3) / 4);
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) and (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc((100% - 20px * 2) / 3);
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    width: calc((100% - 20px * 1) / 2);
  }

  img {
    width: 100%;
    aspect-ratio: 1;
  }

  video {
    width: 100%;
    aspect-ratio: 1;
  }

  & > div.name {
    padding: 20px;
    > p {
      margin: 0;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      overflow: hidden;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #ffffff;
    }
  }
`;

const Box = styled.div<{ calcHeight: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #333;
  color: #fff;
  line-height: 100%;
  height: ${(props) => (props.calcHeight ? 'calc(100% - 60px)' : '100%')};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
