import { useCallback, useState } from 'react'
import { FeedsDataItem, FeedsPageInfo, getFeeds } from '../api/feeds'

export function useLoadFeeds() {
  const [feeds, setFeeds] = useState<Array<FeedsDataItem>>([])
  const [farcasterUserData, setFarcasterUserData] = useState<{
    [key: string]: { type: number; value: string }[]
  }>({})

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
        const res = await getFeeds({
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
    [],
  )

  const loadMoreFeeds = useCallback(
    async (opts?: { keyword?: string; activeLensProfileId?: string }) => {
      if (firstLoading || moreLoading || !pageInfo.hasNextPage) return
      setMoreLoading(true)
      try {
        const res = await getFeeds({
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
    [pageInfo, firstLoading, moreLoading],
  )

  return {
    firstLoading,
    moreLoading,
    feeds,
    farcasterUserData,
    pageInfo,
    loadFirstFeeds,
    loadMoreFeeds,
  }
}
