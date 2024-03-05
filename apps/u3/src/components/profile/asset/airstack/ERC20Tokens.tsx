import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import styled from 'styled-components';

import { ERC20TokensQuery } from '../../../../services/shared/queries';
import { TokenType } from './types';

function Token({
  amount,
  symbol,
  type,
  logo,
}: {
  type: string;
  symbol: string;
  amount: number;
  logo: string;
}) {
  return (
    <TokenInfoBox>
      <div>
        {logo && <img src={logo} alt="" />}
        <div>
          <h3>{symbol}</h3>
          <span>{type}</span>
        </div>
      </div>
      <span>{amount.toFixed(2)}</span>
    </TokenInfoBox>
  );
}

const loaderData = Array(3).fill({ poapEvent: {} });

function Loader() {
  return (
    <>
      {loaderData.map((_, index) => (
        <div
          className="skeleton-loader [&>div]:mb-0 mb-5"
          data-loader-type="block"
          data-loader-bg="glass"
          // eslint-disable-next-line react/no-array-index-key
          key={index}
        >
          <Token key={''} amount={0} symbol={''} type={''} logo="" />
        </div>
      ))}
    </>
  );
}

export function ERC20Tokens() {
  const session = useSession();
  const sessId = session?.id || '';

  const [tokens, setTokens] = useState<{
    ethereum: TokenType[];
    polygon: TokenType[];
  }>({
    ethereum: [],
    polygon: [],
  });

  const sessWallet = useMemo(() => sessId.split(':').pop() || '', [sessId]);

  const [fetch, { data, loading, pagination }] =
    useLazyQueryWithPagination(ERC20TokensQuery);
  // const { address: owner, tokenType } = useSearchInput();

  useEffect(() => {
    const owner = sessWallet;
    // console.log('sessWallet', sessWallet);
    if (owner) {
      setTokens({
        ethereum: [],
        polygon: [],
      });
      fetch({
        owner,
        limit: 100,
      });
    }
  }, [fetch, sessWallet]);

  useEffect(() => {
    if (data) {
      setTokens((existingTokens) => ({
        ethereum: [
          ...existingTokens.ethereum,
          ...(data?.ethereum?.TokenBalance || []),
        ],
        polygon: [
          ...existingTokens.polygon,
          ...(data?.polygon?.TokenBalance || []),
        ],
      }));
    }
  }, [data]);

  const { hasNextPage, getNextPage } = pagination;

  const handleNext = useCallback(() => {
    console.log('handleNext', handleNext);
    if (!loading && hasNextPage) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage, loading]);

  const items = useMemo((): TokenType[] => {
    return [...tokens.ethereum, ...tokens.polygon];
  }, [tokens.ethereum, tokens.polygon]);

  return (
    <div>
      <div>
        {items.length === 0 && !loading && null}

        <InfiniteScroll
          next={handleNext}
          dataLength={items.length}
          hasMore={hasNextPage}
          loader={<Loader />}
          scrollableTarget="top-wrapper"
        >
          {items.map((token, index) => (
            <Token
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              amount={token?.formattedAmount}
              symbol={token?.token?.symbol}
              type={token?.token?.name}
              logo={
                token?.token?.logo?.small ||
                token?.token?.projectDetails?.imageUrl
              }
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

const TokenInfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;

  border-bottom: 1px solid #14171a;
  > div {
    display: flex;
    gap: 10px;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    h3 {
      margin: 0;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: #ffffff;
    }

    span {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      /* identical to box height */

      /* #718096 */

      color: #718096;
    }
  }
  img {
    width: 48px;
    border-radius: 50%;
  }

  > span {
    margin: 0;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    text-align: right;

    color: #ffffff;
  }
`;
