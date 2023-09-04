import { useEffect, useMemo, useState } from 'react'
import { fetchQuery } from '@airstack/airstack-react'
import { ERC20TokensQuery, TokenType, TokensQuery } from '../../api/airstack'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../../constants'
import { Asset } from './Asset'
import { getBadges } from '../../api/badges'
import { GalxeData, NooxData, PoapData } from '../../api'
import { GalxeCard, NooxCard, PoapCard } from './Card'

export default function UserAssets({ addrs }: { addrs: string[] }) {
  const [nfts, setNfts] = useState<TokenType[]>([])
  const [tokens, setTokens] = useState<{
    ethereum: TokenType[]
    polygon: TokenType[]
  }>({
    ethereum: [],
    polygon: [],
  })
  const [poapData, setPoapData] = useState<Array<PoapData>>([])
  const [galxeData, setGalxeData] = useState<GalxeData>({})
  const [nooxData, setNooxData] = useState<NooxData>({ total: 0, result: [] })

  const getERC20Tokens = async (owners: string[]) => {
    try {
      const resp = await Promise.all(
        owners.map(async (owner) => {
          const { data, error } = await fetchQuery(
            ERC20TokensQuery,
            {
              owner,
              limit: 100,
            },
            { cache: true },
          )
          return { data, error }
        }),
      )
      resp.forEach(({ data, error }) => {
        if (error) {
          return
        }
        setTokens((existingTokens) => ({
          ethereum: [
            ...existingTokens.ethereum,
            ...(data?.ethereum?.TokenBalance || []),
          ],
          polygon: [
            ...existingTokens.polygon,
            ...(data?.polygon?.TokenBalance || []),
          ],
        }))
      })
    } catch (error) {
      console.error(error)
    }
  }

  const getNFTTokens = async (owners: string[]) => {
    try {
      const resp = await Promise.all(
        owners.map(async (owner) => {
          const { data, error } = await fetchQuery(
            TokensQuery,
            {
              owner,
              limit: 100,
              tokenType: ['ERC721', 'ERC1155'],
            },
            { cache: true },
          )
          return { data, error }
        }),
      )
      resp.forEach(({ data, error }) => {
        if (error) {
          return
        }
        const { ethereum, polygon } = data
        const ethTokens = ethereum?.TokenBalance || []
        const maticTokens = polygon?.TokenBalance || []
        setNfts((tks) => [...tks, ...ethTokens, ...maticTokens])
      })
    } catch (error) {
      console.error(error)
    }
  }

  const getBadgesData = async (owners: string[]) => {
    const resp = await getBadges({ addrs: owners })
    if (resp.data.code !== 0) {
      console.error(resp.data.msg)
      return
    }
    let galxe: GalxeData = {}
    let poap: Array<PoapData> = []
    let noox: NooxData = { total: 0, result: [] }
    resp.data.data.forEach((badge: any) => {
      const data: { galxe: GalxeData; noox: NooxData; poap: Array<PoapData> } =
        badge.data
      if (data.galxe.addressInfo) {
        galxe = {
          addressInfo: {
            nfts: {
              totalCount:
                (galxe?.addressInfo?.nfts?.totalCount || 0) +
                (data?.galxe?.addressInfo?.nfts?.totalCount || 0),
              pageInfo: data?.galxe?.addressInfo?.nfts?.pageInfo,
              list: [
                ...(galxe?.addressInfo?.nfts?.list || []),
                ...(data?.galxe?.addressInfo?.nfts?.list || []),
              ],
            },
          },
        }
      }
      if (data.poap) {
        poap = [...poap, ...data.poap]
      }
      if (data.noox) {
        noox = {
          total: (noox?.total ?? 0) + (data?.noox?.total ?? 0),
          result: [...(noox?.result ?? []), ...(data?.noox?.result ?? [])],
        }
      }
      setGalxeData(galxe)
      setNooxData(noox)
      setPoapData(poap)
    })
  }

  useEffect(() => {
    getERC20Tokens(addrs)
    getNFTTokens(addrs)
    getBadgesData(addrs)
  }, [addrs])

  const tokenItems = useMemo((): TokenType[] => {
    return [...tokens.ethereum, ...tokens.polygon]
  }, [tokens.ethereum, tokens.polygon])

  console.log(poapData)
  return (
    <div>
      <div>
        <div>badges</div>
        <div>
          {poapData.map((item) => {
            return <PoapCard key={item.event.id} data={item} />
          })}
          {galxeData.addressInfo?.nfts.list.map((item) => {
            return <GalxeCard key={item.id} data={item} />
          })}
          {nooxData.result.map((item) => {
            return <NooxCard key={item.transaction_hash} data={item} />
          })}
        </div>
      </div>
      <div>
        <div>Tokens</div>
        <div>
          {tokenItems.map((token, index) => (
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
        </div>
      </div>
      <div>
        <div>nfts</div>
        <div>
          {nfts.map((_token, index) => {
            const token = _token as TokenType

            const address = token.tokenAddress
            const id =
              token.tokenNfts?.tokenId && `#${token.tokenNfts?.tokenId}`

            const symbol = token?.token?.symbol || ''
            const type = token.tokenType || ''
            const blockchain = token.blockchain || 'ethereum'
            const name = token?.token?.name || ''
            const tokenId = token.tokenNfts?.tokenId
            const image = token.tokenNfts?.contentValue?.image?.medium || ''

            return (
              <NFT
                key={index}
                type={type}
                name={name}
                id={id}
                address={address}
                symbol={symbol}
                blockchain={blockchain}
                tokenId={tokenId}
                image={image}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

type NFTProps = {
  type: string
  name: string
  id: string
  address: string
  symbol: string
  blockchain: 'ethereum' | 'polygon'
  tokenId: string
  image?: string
  eventId?: string
}

function NFT({
  type,
  name,
  symbol,
  address,
  id,
  blockchain = 'ethereum',
  tokenId,
  image,
  eventId,
}: NFTProps) {
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
  )
}

function Token({
  amount,
  symbol,
  type,
  logo,
}: {
  type: string
  symbol: string
  amount: number
  logo: string
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
  )
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
`

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
`

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
`
