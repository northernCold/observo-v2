"use client"

import { useState, useEffect, useCallback } from 'react'
import { WidgetDataProcessor } from '@/lib/widget-data-processor'
import type { DataSource } from '@/types/widget'
import type { RSSItem, ListItem } from '@/lib/widget-data-service'

// Hook-based approach for data processing
export function useProcessedWidgetData(
  widgetType: 'list' | 'rss' | 'link' | 'clock' | 'water-counter' | 'scroll',
  dataSource: DataSource | string | null,
  options: { autoRefresh?: boolean; refreshInterval?: number } = {}
) {
  const { autoRefresh = false, refreshInterval = 15 } = options
  const [processedData, setProcessedData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 根据 widget 类型返回默认数据
  const getDefaultData = useCallback((type: string) => {
    switch (type) {
      case 'list':
      case 'rss':
        return []
      case 'link':
        return ''
      default:
        return null
    }
  }, [])

  const fetchAndProcessData = useCallback(async () => {
    // Clock、Water Counter 和 Scroll 不需要数据处理
    if (widgetType === 'clock' || widgetType === 'water-counter' || widgetType === 'scroll') {
      setProcessedData(null)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await WidgetDataProcessor.processWidgetData(widgetType, dataSource)
      setProcessedData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process data')
      setProcessedData(getDefaultData(widgetType))
    } finally {
      setLoading(false)
    }
  }, [widgetType, dataSource, getDefaultData])

  useEffect(() => {
    fetchAndProcessData()
  }, [fetchAndProcessData])

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh || !refreshInterval || widgetType === 'clock' || widgetType === 'water-counter' || widgetType === 'scroll') {
      return
    }

    const interval = setInterval(fetchAndProcessData, refreshInterval * 60 * 1000)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, widgetType, fetchAndProcessData])

  return { data: processedData, loading, error, refresh: fetchAndProcessData }
}

// Hook for List data
export function useProcessedListData(
  dataSource: DataSource | string | null,
  options: { autoRefresh?: boolean; refreshInterval?: number } = {}
) {
  const { autoRefresh = true, refreshInterval = 15 } = options
  const [processedData, setProcessedData] = useState<ListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await WidgetDataProcessor.processWidgetData('list', dataSource) as ListItem[]
      setProcessedData(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process data')
      setProcessedData([])
    } finally {
      setLoading(false)
    }
  }, [dataSource])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!autoRefresh || !refreshInterval) return
    const interval = setInterval(async () => {
      try {
        const data = await WidgetDataProcessor.processWidgetData('list', dataSource) as ListItem[]
        setProcessedData(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process data')
      }
    }, refreshInterval * 60 * 1000)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, dataSource])

  return { data: processedData, loading, error, refresh: fetchData }
}

// Hook for RSS data
export function useProcessedRSSData(
  dataSource: DataSource | string | null,
  options: { autoRefresh?: boolean; refreshInterval?: number } = {}
) {
  const { autoRefresh = true, refreshInterval = 10 } = options
  const [processedData, setProcessedData] = useState<RSSItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await WidgetDataProcessor.processWidgetData('rss', dataSource) as RSSItem[]
      setProcessedData(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process data')
      setProcessedData([])
    } finally {
      setLoading(false)
    }
  }, [dataSource])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!autoRefresh || !refreshInterval) return
    const interval = setInterval(async () => {
      try {
        const data = await WidgetDataProcessor.processWidgetData('rss', dataSource) as RSSItem[]
        setProcessedData(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process data')
      }
    }, refreshInterval * 60 * 1000)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, dataSource])

  return { data: processedData, loading, error, refresh: fetchData }
}

// Hook for Link data
export function useProcessedLinkData(dataSource: DataSource | string | null) {
  const [processedData, setProcessedData] = useState<string>('')

  const fetchData = useCallback(async () => {
    try {
      const data = await WidgetDataProcessor.processWidgetData('link', dataSource) as string
      setProcessedData(data || '')
    } catch {
      setProcessedData('')
    }
  }, [dataSource])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data: processedData, refresh: fetchData }
}

// Hook for Scroll data (静态数据，不需要网络请求)
export function useProcessedScrollData(items: Array<{ id: string; text: string; color?: string }>) {
  return { data: items }
}