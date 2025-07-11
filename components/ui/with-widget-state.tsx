import React from 'react'
import { WidgetState } from './widget-state'

interface WithWidgetStateProps {
  loading?: boolean
  error?: string | null
  data?: any[] | any
  width?: number | string
  height?: number | string
  className?: string
  emptyMessage?: string
  onRetry?: () => void
}

/**
 * 高阶组件：为任何组件包装统一的状态处理
 */
export function withWidgetState<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultEmptyMessage = '暂无数据'
) {
  return function WithWidgetStateComponent(props: P & WithWidgetStateProps) {
    const {
      loading,
      error,
      data,
      width,
      height,
      className,
      emptyMessage = defaultEmptyMessage,
      onRetry,
      ...componentProps
    } = props

    // 判断是否为空数据
    const isEmpty = !loading && !error && (
      Array.isArray(data) 
        ? data.length === 0 
        : !data
    )

    return (
      <WidgetState
        loading={loading}
        error={error}
        empty={isEmpty}
        width={width}
        height={height}
        className={className}
        emptyMessage={emptyMessage}
        onRetry={onRetry}
      >
        <WrappedComponent {...(componentProps as P)} />
      </WidgetState>
    )
  }
}

/**
 * Hook：简化状态处理逻辑
 */
export function useWidgetStateProps(
  hookResult: { data: any; loading: boolean; error: string | null; refresh?: () => void }
) {
  return {
    loading: hookResult.loading,
    error: hookResult.error,
    data: hookResult.data,
    onRetry: hookResult.refresh
  }
}