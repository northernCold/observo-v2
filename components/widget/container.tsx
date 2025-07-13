"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

// 容器变体样式 - iOS 设计风格
const containerVariants = cva(
  "rounded-xl transition-all duration-300 ease-out", 
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
      // 布局方向
      direction: {
        row: "flex flex-row",
        col: "flex flex-col",
        grid: "grid",
        none: "block",
      },
      // 对齐方式
      align: {
        start: "items-start justify-start",
        center: "items-center justify-center",
        end: "items-end justify-end",
        between: "items-center justify-between",
        around: "items-center justify-around",
        stretch: "items-stretch justify-stretch",
      },
      // 间距 - iOS 标准间距系统
      gap: {
        none: "gap-0",
        tight: "gap-1",
        cozy: "gap-2", 
        comfortable: "gap-3",
        spacious: "gap-4",
        loose: "gap-6",
        relaxed: "gap-8",
      },
    },
    defaultVariants: {
      background: "primary",
      border: "light",
      shadow: "soft",
      padding: "comfortable",
      direction: "col",
      align: "start",
      gap: "comfortable",
    },
  }
)

interface ContainerProps extends VariantProps<typeof containerVariants> {
  children: ReactNode
  className?: string
  // 容器尺寸（由父组件传递）
  width?: number
  height?: number
  // 自定义样式
  style?: React.CSSProperties
}

export function Container({
  children,
  className,
  background,
  border,
  shadow,
  padding,
  direction,
  align,
  gap,
  width,
  height,
  style,
  ...props
}: ContainerProps) {
  const containerStyle = {
    ...(width && { width: `${width}px` }),
    ...(height && { height: `${height}px` }),
    ...style,
  }

  return (
    <div
      className={cn(
        containerVariants({
          background,
          border,
          shadow,
          padding,
          direction,
          align,
          gap,
        }),
        className
      )}
      style={containerStyle}
      {...props}
    >
      {children}
    </div>
  )
}

export default Container
