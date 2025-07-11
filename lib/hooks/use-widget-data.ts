import { useState, useEffect, useCallback } from 'react'
import { WidgetDataService, type RSSItem, type ListItem } from '@/lib/widget-data-service'
import type { DataItem } from '@/lib/data-source'

// 数据状态接口
interface DataState<T = DataItem> {
  data: T[]
  loading: boolean
  error: string | null
}

// Hook选项接口
interface UseWidgetDataOptions {
  refreshInterval?: number // 刷新间隔（分钟）
  autoRefresh?: boolean // 是否自动刷新
  dataType?: 'rss' | 'list' | 'auto' // 数据类型
}

/**
 * Widget数据管理Hook
 * 负责数据获取、缓存、错误处理和自动刷新
 */
export function useWidgetData<T extends DataItem = DataItem>(
  dataSource: string | null,
  options: UseWidgetDataOptions = {}
): DataState<T> & {
  refresh: () => Promise<void>
  clearError: () => void
} {
  const {
    refreshInterval = 0,
    autoRefresh = false,
    dataType = 'auto'
  } = options

  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取数据的核心方法
  const fetchData = useCallback(async () => {
    if (!dataSource) {
      setData([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await WidgetDataService.fetchData(dataSource, dataType)
      setData(result as T[])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(errorMessage)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [dataSource, dataType])

  // 手动刷新数据
  const refresh = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  // 清除错误状态
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // 初始化和数据源变化时获取数据
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 自动刷新机制
  useEffect(() => {
    if (!autoRefresh || !refreshInterval || refreshInterval <= 0 || !dataSource) {
      return
    }

    const intervalMs = refreshInterval * 60 * 1000 // 转换为毫秒
    const interval = setInterval(() => {
      fetchData()
    }, intervalMs)

    return () => clearInterval(interval)
  }, [fetchData, autoRefresh, refreshInterval, dataSource])

  return {
    data,
    loading,
    error,
    refresh,
    clearError
  }
}

/**
 * RSS数据专用Hook
 */
export function useRSSData(
  dataSource: string | null,
  options: Omit<UseWidgetDataOptions, 'dataType'> = {}
) {
  return useWidgetData<RSSItem>(dataSource, { ...options, dataType: 'rss' })
}

/**
 * 列表数据专用Hook
 */
export function useListData(
  dataSource: string | null,
  options: Omit<UseWidgetDataOptions, 'dataType'> = {}
) {
  return useWidgetData<ListItem>(dataSource, { ...options, dataType: 'list' })
}