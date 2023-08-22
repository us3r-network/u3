import { useCallback, useState } from 'react'
import { LensFeedPost, getFeeds } from '../../api/lens'

export function useLoadLensFeeds() {
  const [feeds, setFeeds] = useState<
    Array<{
      platform: 'lens'
      data: LensFeedPost
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

  const loadFirstLensFeeds = useCallback(async () => {
    setFirstLoading(true)
    try {
      const res = await getFeeds()
      setFeeds(res.data.data.data)
      setPageInfo(res.data.data.pageInfo)
    } catch (error) {
      console.error(error)
    } finally {
      setFirstLoading(false)
    }
  }, [])

  const loadMoreLensFeeds = useCallback(async () => {
    setMoreLoading(true)
    try {
      const res = await getFeeds({
        endLensCursor: pageInfo.endLensCursor,
      })
      setFeeds((prev) => [...prev, ...res.data.data.data])
      setPageInfo(res.data.data.pageInfo)
    } catch (error) {
      console.error(error)
    } finally {
      setMoreLoading(false)
    }
  }, [pageInfo.endLensCursor])

  return {
    firstLoading,
    moreLoading,
    feeds,
    pageInfo,
    loadFirstLensFeeds,
    loadMoreLensFeeds,
  }
}
