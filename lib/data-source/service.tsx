import type { DataModel, DataSourceAdapter } from './types'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

// 同步数据服务类
export class DataService {
  private adapter: DataSourceAdapter
  private data: DataModel = { dataType: 'custom', data: [] }
  private loading: boolean = false
  private error: Error | null = null
  private currentPromise: Promise<void> | null = null

  constructor(adapter: DataSourceAdapter) {
    this.adapter = adapter
  }

  // 同步获取数据状态
  getState() {
    return {
      data: this.data,
      loading: this.loading,
      error: this.error
    }
  }

  // 加载数据（返回 Promise 并跟踪当前操作）
  loadData(): Promise<void> {
    // 如果已有正在进行的请求，直接返回该 Promise
    if (this.currentPromise) {
      return this.currentPromise
    }

    this.loading = true
    this.error = null

    this.currentPromise = this.adapter
      .fetchData()
      .then(data => {
        this.data = data
      })
      .catch(error => {
        this.error = error as Error
        console.error('Failed to load data:', error)
      })
      .finally(() => {
        this.loading = false
        this.currentPromise = null // 重置 Promise 跟踪
      })

    return this.currentPromise
  }

  // 切换数据源适配器
  setAdapter(adapter: DataSourceAdapter) {
    this.adapter = adapter
    return this.loadData()
  }
}

// 创建 React 上下文
const DataServiceContext = createContext<DataService | null>(null)

// 数据服务提供者组件
export const DataServiceProvider = ({ children, dataService }: { children: ReactNode; dataService: DataService }) => {
  return <DataServiceContext.Provider value={dataService}>{children}</DataServiceContext.Provider>
}

// 自定义 Hook 获取数据服务
export const useDataService = () => {
  const context = useContext(DataServiceContext)
  if (!context) {
    throw new Error('useDataService must be used within a DataServiceProvider')
  }
  return context
}

// 自定义 Hook 获取数据状态（优化版）
export const useData = () => {
  const dataService = useDataService()
  const [state, setState] = useState(dataService.getState())

  // 使用 useCallback 缓存 loadData 函数
  const loadData = useCallback(async () => {
    await dataService.loadData()
    setState(dataService.getState()) // 数据加载完成后更新状态
  }, [dataService])

  // 初始加载数据
  useEffect(() => {
    loadData()
  }, [loadData])

  // 监听适配器变化（如果需要）
  useEffect(() => {
    setState(dataService.getState())
  }, [dataService])

  return { ...state, loadData } // 返回状态和加载函数
}
