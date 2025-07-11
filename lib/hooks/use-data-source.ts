import { useState, useEffect, useCallback } from 'react'
import { DataSourceManager, type DataItem } from '@/lib/data-source'
import type { DataSource } from '@/types/widget'

// 数据状态接口
interface DataSourceState {
  data: DataItem[]
  loading: boolean
  error: string | null
}

// Hook选项接口
interface UseDataSourceOptions {
  maxItems?: number // 最大显示项目数
  autoRefresh?: boolean // 是否自动刷新
}

/**
 * 复杂数据源Hook
 * 专门用于处理DataSource对象（如Notion、自定义数据源等）
 */
export function useDataSource(
  dataSource: DataSource | null,
  options: UseDataSourceOptions = {}
): DataSourceState & {
  refresh: () => Promise<void>
  clearError: () => void
} {
  const {
    maxItems,
    autoRefresh = false
  } = options

  const [data, setData] = useState<DataItem[]>([])
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
      const result = await DataSourceManager.fetchData(dataSource)
      const finalData = maxItems ? result.slice(0, maxItems) : result
      setData(finalData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(errorMessage)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [dataSource, maxItems])

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
    if (!autoRefresh || !dataSource?.refreshInterval || dataSource.refreshInterval <= 0) {
      return
    }

    const intervalMs = dataSource.refreshInterval * 60 * 1000 // 转换为毫秒
    const interval = setInterval(() => {
      fetchData()
    }, intervalMs)

    return () => clearInterval(interval)
  }, [fetchData, autoRefresh, dataSource])

  return {
    data,
    loading,
    error,
    refresh,
    clearError
  }
}