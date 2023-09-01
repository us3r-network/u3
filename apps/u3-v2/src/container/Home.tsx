import styled from 'styled-components'
import { useEffect, useMemo } from 'react'
import LensPostCard from '../components/lens/LensPostCard'
import { useActiveProfile } from '@lens-protocol/react-web'
import FCast from '../components/farcaster/FCast'
// import { useLoadFeeds } from '../hooks/useLoadFeeds'
import { useFarcasterCtx } from '../contexts/FarcasterCtx'
import { useSearchParams } from 'react-router-dom'
import ButtonBase from '../components/common/button/ButtonBase'
import Loading from '../components/common/loading/Loading'
import { useLoadFollowingFeeds } from '../hooks/useLoadFollowingFeeds'
import { useAccount } from 'wagmi'
import useFarcasterCurrFid from '../hooks/useFarcasterCurrFid'

export default function Home() {
  const { data: activeLensProfile, loading: activeLensProfileLoading } =
    useActiveProfile()
  const fid = useFarcasterCurrFid()

  const { address } = useAccount()
  // const {
  //   firstLoading,
  //   moreLoading,
  //   feeds,
  //   pageInfo,
  //   loadFirstFeeds,
  //   loadMoreFeeds,
  // } = useLoadFeeds()

  const {
    firstLoading,
    moreLoading,
    feeds,
    pageInfo,
    loadFirstFeeds,
    loadMoreFeeds,
  } = useLoadFollowingFeeds()

  const { openFarcasterQR, farcasterUserData } = useFarcasterCtx()

  const [searchParams] = useSearchParams()
  const currentSearchParams = useMemo(
    () => ({
      keyword: searchParams.get('keyword') || '',
    }),
    [searchParams],
  )

  useEffect(() => {
    if (activeLensProfileLoading) return
    loadFirstFeeds({
      activeLensProfileId: activeLensProfile?.id,
      keyword: currentSearchParams.keyword,
      address,
      fid,
    })
  }, [
    loadFirstFeeds,
    activeLensProfileLoading,
    activeLensProfile?.id,
    currentSearchParams.keyword,
    address,
    fid,
  ])

  return (
    <HomeWrapper>
      <MainWrapper>
        {firstLoading ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : (
          <PostList>
            {feeds.map(({ platform, data }) => {
              if (platform === 'lens') {
                return <LensPostCard key={data.id} data={data} />
              }
              if (platform === 'farcaster') {
                const key = Buffer.from(data.hash.data).toString('hex')
                return (
                  <FCast
                    key={key}
                    cast={data}
                    openFarcasterQR={openFarcasterQR}
                    farcasterUserData={farcasterUserData}
                  />
                )
              }
              return null
            })}
          </PostList>
        )}

        <p>
          {!firstLoading && pageInfo.hasNextPage && (
            <LoadMoreBtn
              onClick={() => {
                if (moreLoading) return
                loadMoreFeeds({
                  keyword: currentSearchParams.keyword,
                  activeLensProfileId: activeLensProfile?.id,
                  address,
                  fid,
                })
              }}
            >
              {moreLoading ? 'Loading ...' : 'Load more'}
            </LoadMoreBtn>
          )}
        </p>
      </MainWrapper>
      <SidebarWrapper>Comming soon</SidebarWrapper>
    </HomeWrapper>
  )
}

const HomeWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  gap: 40px;
`
const MainWrapper = styled.div`
  width: 750px;
`
const LoadingWrapper = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;

  border-radius: 20px;
  background: #212228;
  overflow: hidden;
  & > *:not(:first-child) {
    border-top: 1px solid #191a1f;
  }
`
const SidebarWrapper = styled.div`
  width: 0;
  flex: 1;
  height: 344px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #212228;

  display: flex;
  justify-content: center;
  align-items: center;
`
const LoadMoreBtn = styled(ButtonBase)`
  width: 100%;
  height: 40px;
  border-radius: 20px;
  background: #212228;
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`
