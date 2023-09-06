import { useCallback, useState } from 'react'
import { LensPublication, getLensFeeds } from '../../api/lens'

export function useLoadLensFeeds() {
  const [feeds, setFeeds] = useState<
    Array<{
      platform: 'lens'
      data: LensPublication
    }>
  >([])
  const [pageInfo, setPageInfo] = useState<{
    hasNextPage: boolean
    endLensCursor: string
  }>({
    hasNextPage: false,
    endLensCursor: '',
  })
  const [firstLoading, setFirstLoading] = useState(false)
  const [moreLoading, setMoreLoading] = useState(false)

  const loadFirstLensFeeds = useCallback(
    async (opts?: { keyword?: string; activeLensProfileId?: string }) => {
      setFirstLoading(true)
      try {
        const res = await getLensFeeds({
          activeLensProfileId: opts?.activeLensProfileId,
          keyword: opts?.keyword,
        })
        setFeeds(res.data.data.data)
        setPageInfo(res.data.data.pageInfo)
      } catch (error) {
        console.error(error)
      } finally {
        setFirstLoading(false)
      }
    },
    [],
  )

  const loadMoreLensFeeds = useCallback(
    async (opts?: { keyword?: string; activeLensProfileId?: string }) => {
      setMoreLoading(true)
      try {
        const res = await getLensFeeds({
          endLensCursor: pageInfo.endLensCursor,
          activeLensProfileId: opts?.activeLensProfileId,
          keyword: opts?.keyword,
        })
        setFeeds((prev) => [...prev, ...res.data.data.data])
        setPageInfo(res.data.data.pageInfo)
      } catch (error) {
        console.error(error)
      } finally {
        setMoreLoading(false)
      }
    },
    [pageInfo.endLensCursor],
  )

  return {
    firstLoading,
    moreLoading,
    feeds,
    pageInfo,
    loadFirstLensFeeds,
    loadMoreLensFeeds,
  }
}
