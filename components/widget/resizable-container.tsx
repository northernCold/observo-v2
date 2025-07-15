"use client"

import { ReactNode, useRef, useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

// 容器变体样式 - iOS 设计风格
const resizableContainerVariants = cva(
  "rounded-xl transition-all duration-300 ease-out relative overflow-hidden", 
  {
    variants: {
      // 背景样式 - iOS 风格
      background: {
        none: "bg-transparent",
        primary: "bg-white/95 backdrop-blur-xl",
        secondary: "bg-gray-50/90 backdrop-blur-xl",
        tertiary: "bg-gray-100/80 backdrop-blur-xl",
        accent: "bg-blue-50/90 backdrop-blur-xl",
        glass: "bg-white/70 backdrop-blur-2xl",
        darkGlass: "bg-black/10 backdrop-blur-2xl",
        tinted: "bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-xl",
      },
      // 边框样式 - iOS 细线边框
      border: {
        none: "border-0",
        light: "border border-gray-200/60",
        separator: "border border-gray-300/50",
        accent: "border border-blue-200/70",
        glass: "border border-white/20",
      },
      // 阴影样式 - iOS 柔和阴影
      shadow: {
        none: "shadow-none",
        subtle: "shadow-sm shadow-black/5",
        soft: "shadow-md shadow-black/8",
        medium: "shadow-lg shadow-black/10",
        elevated: "shadow-xl shadow-black/12",
        floating: "shadow-2xl shadow-black/15",
      },
      // 内边距 - iOS 标准间距
      padding: {
        none: "p-0",
        tight: "p-2",
        cozy: "p-3",
        comfortable: "p-4",
        spacious: "p-6",
        loose: "p-8",
      },
    },
    defaultVariants: {
      background: "primary",
      border: "light",
      shadow: "soft",
      padding: "comfortable",
    },
  }
)

interface ResizableContainerProps extends VariantProps<typeof resizableContainerVariants> {
  children: ReactNode
  className?: string
  // 初始尺寸
  initialWidth?: number
  initialHeight?: number
  // 最小尺寸
  minWidth?: number
  minHeight?: number
  // 最大尺寸
  maxWidth?: number
  maxHeight?: number
  // 是否可调整大小
  resizable?: boolean
  // 调整大小回调
  onResize?: (width: number, height: number) => void
  // 自定义样式
  style?: React.CSSProperties
}

export function ResizableContainer({
  children,
  className,
  background,
  border,
  shadow,
  padding,
  initialWidth = 300,
  initialHeight = 200,
  minWidth = 100,
  minHeight = 80,
  maxWidth = 800,
  maxHeight = 600,
  resizable = true,
  onResize,
  style,
  ...props
}: ResizableContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight
  })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState('')
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startDimensions, setStartDimensions] = useState({ width: 0, height: 0 })

  // 处理鼠标按下事件
  const handleMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    if (!resizable) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setIsResizing(true)
    setResizeDirection(direction)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartDimensions(dimensions)
  }, [resizable, dimensions])

  // 处理鼠标移动事件
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizable) return

    const deltaX = e.clientX - startPos.x
    const deltaY = e.clientY - startPos.y
    
    let newWidth = startDimensions.width
    let newHeight = startDimensions.height

    // 根据拖拽方向计算新尺寸
    if (resizeDirection.includes('right')) {
      newWidth = Math.max(minWidth, Math.min(maxWidth, startDimensions.width + deltaX))
    }
    if (resizeDirection.includes('left')) {
      newWidth = Math.max(minWidth, Math.min(maxWidth, startDimensions.width - deltaX))
    }
    if (resizeDirection.includes('bottom')) {
      newHeight = Math.max(minHeight, Math.min(maxHeight, startDimensions.height + deltaY))
    }
    if (resizeDirection.includes('top')) {
      newHeight = Math.max(minHeight, Math.min(maxHeight, startDimensions.height - deltaY))
    }

    const newDimensions = { width: newWidth, height: newHeight }
    setDimensions(newDimensions)
    
    if (onResize) {
      onResize(newWidth, newHeight)
    }
  }, [isResizing, resizable, startPos, startDimensions, resizeDirection, minWidth, minHeight, maxWidth, maxHeight, onResize])

  // 处理鼠标释放事件
  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    setResizeDirection('')
  }, [])

  // 添加全局事件监听器
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
      document.body.style.cursor = getResizeCursor(resizeDirection)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isResizing, handleMouseMove, handleMouseUp, resizeDirection])

  // 获取调整大小时的光标样式
  const getResizeCursor = (direction: string): string => {
    switch (direction) {
      case 'top':
      case 'bottom':
        return 'ns-resize'
      case 'left':
      case 'right':
        return 'ew-resize'
      case 'top-left':
      case 'bottom-right':
        return 'nw-resize'
      case 'top-right':
      case 'bottom-left':
        return 'ne-resize'
      default:
        return 'default'
    }
  }

  const containerStyle = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    ...style,
  }

  // 调整大小手柄组件
  const ResizeHandle = ({ direction, className: handleClassName }: { direction: string, className: string }) => (
    <div
      className={cn(
        "absolute bg-blue-500 opacity-0 hover:opacity-100 transition-opacity duration-200",
        isResizing && resizeDirection === direction && "opacity-100",
        handleClassName
      )}
      style={{ cursor: getResizeCursor(direction) }}
      onMouseDown={(e) => handleMouseDown(e, direction)}
    />
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        resizableContainerVariants({
          background,
          border,
          shadow,
          padding,
        }),
        "select-none",
        className
      )}
      style={containerStyle}
      {...props}
    >
      {children}
      
      {/* 调整大小手柄 */}
      {resizable && (
        <>
          {/* 边缘手柄 */}
          <ResizeHandle direction="top" className="top-0 left-2 right-2 h-1" />
          <ResizeHandle direction="bottom" className="bottom-0 left-2 right-2 h-1" />
          <ResizeHandle direction="left" className="left-0 top-2 bottom-2 w-1" />
          <ResizeHandle direction="right" className="right-0 top-2 bottom-2 w-1" />
          
          {/* 角落手柄 */}
          <ResizeHandle direction="top-left" className="top-0 left-0 w-3 h-3" />
          <ResizeHandle direction="top-right" className="top-0 right-0 w-3 h-3" />
          <ResizeHandle direction="bottom-left" className="bottom-0 left-0 w-3 h-3" />
          <ResizeHandle direction="bottom-right" className="bottom-0 right-0 w-3 h-3" />
        </>
      )}
      
      {/* 调整大小指示器 */}
      {resizable && (
        <div className="absolute bottom-1 right-1 text-gray-400 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M12 12L12 8L8 12L12 12Z" />
            <path d="M12 4L4 12L12 4Z" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default ResizableContainer
