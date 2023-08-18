import { useCallback, useEffect, useState } from 'react'
import { getFarcasterFeeds } from '../api/farcaster'
import { debounce } from 'lodash'
import { FarCast } from '../api'

export default function useLoadFarcasterFeeds() {
  const [farcasterFeeds, setFarcasterFeeds] = useState<
    {
      data: FarCast
      platform: 'farcaster'
    }[]
  >([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [cursor, setCursor] = useState('')

  const loadMoreFarcasterFeeds = useCallback(async () => {
    console.log({ loading, hasMore })
    if (loading || !hasMore) {
      return
    }
    setLoading(true)
    try {
      const resp = await getFarcasterFeeds({ endFarcasterCursor: cursor })
      const { data, pageInfo } = resp.data.data
      setFarcasterFeeds([...farcasterFeeds, ...data])
      setHasMore(pageInfo.hasNextPage)
      setCursor(pageInfo.endFarcasterCursor)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [cursor, farcasterFeeds, hasMore, loading])

  const loadFarcasterFeeds = async () => {
    setLoading(true)
    try {
      const resp = await getFarcasterFeeds({})
      const { data, pageInfo } = resp.data.data
      setFarcasterFeeds(data)
      setHasMore(pageInfo.hasNextPage)
      setCursor(pageInfo.endFarcasterCursor)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    debounce(loadFarcasterFeeds, 500)()
  }, [])

  return {
    loading,
    farcasterFeeds,
    loadMoreFarcasterFeeds,
  }
}
