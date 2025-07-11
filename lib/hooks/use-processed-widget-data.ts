import { useState, useEffect, useCallback } from 'react'
import { WidgetDataProcessor } from '@/lib/widget-data-processor'
import type { RSSItem, ListItem } from '@/lib/widget-data-service'
import type { DataSource } from '@/types/widget'

/**
 * 为 List Widget 提供已处理的列表数据
 * 返回：ListItem[] - 已处理的列表项数组
 */
export function useProcessedListData(
  dataSource: DataSource | string | null,
  options: { autoRefresh?: boolean; refreshInterval?: number } = {}
) {
  const [data, setData] = useState<ListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const processedData = await WidgetDataProcessor.processListData(dataSource)
      setData(processedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch list data')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [dataSource])

  const refresh = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 自动刷新
  useEffect(() => {
    if (!options.autoRefresh || !options.refreshInterval) return
    
    const interval = setInterval(fetchData, options.refreshInterval * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData, options.autoRefresh, options.refreshInterval])

  return { data, loading, error, refresh }
}

/**
 * 为 RSS Widget 提供已处理的 RSS 数据
 * 返回：RSSItem[] - 已处理的 RSS 项目数组
 */
export function useProcessedRSSData(
  dataSource: DataSource | string | null,
  options: { autoRefresh?: boolean; refreshInterval?: number } = {}
) {
  const [data, setData] = useState<RSSItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const processedData = await WidgetDataProcessor.processRSSData(dataSource)
      setData(processedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch RSS data')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [dataSource])

  const refresh = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 自动刷新
  useEffect(() => {
    if (!options.autoRefresh || !options.refreshInterval) return
    
    const interval = setInterval(fetchData, options.refreshInterval * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData, options.autoRefresh, options.refreshInterval])

  return { data, loading, error, refresh }
}

/**
 * 为 Link Widget 提供已处理的链接数据
 * 返回：string - 已处理的链接 URL
 */
export function useProcessedLinkData(dataSource: DataSource | string | null): string {
  return WidgetDataProcessor.processLinkData(dataSource)
}