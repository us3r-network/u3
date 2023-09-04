import { useCallback, useState } from 'react'
import { FeedsDataItem, FeedsPageInfo, getTrendingFeeds } from '../api/feeds'
import { useFarcasterCtx } from '../contexts/FarcasterCtx'

export function useLoadTrendingFeeds() {
  const { setFarcasterUserData } = useFarcasterCtx()

  const [feeds, setFeeds] = useState<Array<FeedsDataItem>>([])

  const [pageInfo, setPageInfo] = useState<FeedsPageInfo>({
    hasNextPage: false,
    endFarcasterCursor: '',
    endLensCursor: '',
  })
  const [firstLoading, setFirstLoading] = useState(false)
  const [moreLoading, setMoreLoading] = useState(false)

  const loadFirstFeeds = useCallback(
    async (opts?: { keyword?: string; activeLensProfileId?: string }) => {
      setFirstLoading(true)
      try {
        const res = await getTrendingFeeds({
          activeLensProfileId: opts?.activeLensProfileId,
          keyword: opts?.keyword,
        })
        const { data, farcasterUserData, pageInfo } = res.data.data
        const temp: { [key: string]: { type: number; value: string }[] } = {}
        farcasterUserData.forEach((item) => {
          if (temp[item.fid]) {
            temp[item.fid].push(item)
          } else {
            temp[item.fid] = [item]
          }
        })
        setFeeds(data)
        setFarcasterUserData((pre) => ({ ...pre, ...temp }))
        setPageInfo(pageInfo)
      } catch (error) {
        console.error(error)
      } finally {
        setFirstLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const loadMoreFeeds = useCallback(
    async (opts?: { keyword?: string; activeLensProfileId?: string }) => {
      if (firstLoading || moreLoading || !pageInfo.hasNextPage) return
      setMoreLoading(true)
      try {
        const res = await getTrendingFeeds({
          endFarcasterCursor: pageInfo.endFarcasterCursor,
          endLensCursor: pageInfo.endLensCursor,
          activeLensProfileId: opts?.activeLensProfileId,
          keyword: opts?.keyword,
        })
        const { data, farcasterUserData, pageInfo: newPageInfo } = res.data.data
        const temp: { [key: string]: { type: number; value: string }[] } = {}
        farcasterUserData.forEach((item) => {
          if (temp[item.fid]) {
            temp[item.fid].push(item)
          } else {
            temp[item.fid] = [item]
          }
        })
        setFeeds((prev) => [...prev, ...data])
        setFarcasterUserData((pre) => ({ ...pre, ...temp }))
        setPageInfo(newPageInfo)
      } catch (error) {
        console.error(error)
      } finally {
        setMoreLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageInfo, firstLoading, moreLoading],
  )

  return {
    firstLoading,
    moreLoading,
    feeds,
    pageInfo,
    loadFirstFeeds,
    loadMoreFeeds,
  }
}
