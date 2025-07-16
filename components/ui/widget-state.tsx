import React from 'react'
import { Button } from './button'
import { Spinner } from '@radix-ui/themes'

interface WidgetStateProps {
  loading?: boolean
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  width?: number | string
  height?: number | string
  className?: string
  showRetry?: boolean
  onRetry?: () => void
  children?: React.ReactNode
}

/**
 * 统一的 Widget 状态组件
 * 处理加载中、错误、空数据等状态
 */
export function WidgetState({
  loading = false,
  error = null,
  empty = false,
  emptyMessage = '暂无数据',
  width = '100%',
  height = '100%',
  className = '',
  showRetry = true,
  onRetry,
  children
}: WidgetStateProps) {
  const containerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  }

  // 如果正在加载
  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={containerStyle}>
        <div className="text-center text-gray-500">
          <Spinner />
        </div>
      </div>
    )
  }

  // 如果有错误
  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={containerStyle}>
        <div className="text-center text-red-500">
          <div className="mb-2">
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-xs mb-1">加载失败</p>
          <p className="text-xs text-gray-500 mb-3 max-w-[200px] break-words">{error}</p>
          {showRetry && onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm" className="text-xs h-6 px-2">
              重试
            </Button>
          )}
        </div>
      </div>
    )
  }

  // 如果数据为空
  if (empty) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={containerStyle}>
        <div className="text-center text-gray-400">
          <div className="mb-2">
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m0 0l-4 4-4-4"
              />
            </svg>
          </div>
          <p className="text-xs">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  // 正常状态，显示子组件
  return <>{children}</>
}
