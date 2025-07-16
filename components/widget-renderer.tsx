import React from 'react'
import { Clock } from '@/components/widget/clock'
import { UniversalWidget } from '@/components/widget/universal'
import { Container } from '@/components/widget/container'
import { ResizableContainer } from '@/components/widget/resizable-container'
import { Link } from '@/components/widget/link'
import { Rss } from '@/components/widget/rss'
import { Tabs } from '@/components/widget/tabs'
import { WaterCounter } from '@/components/widget/water-counter'
import { List } from '@/components/widget/list'
import type { GridStyle } from '@/lib/grid-layout-utils'
import { Card } from '@/components/ui/card'

// 简化的 Widget 配置类型
interface WidgetConfig {
  type: 'clock' | 'universal' | 'container' | 'resizable-container' | 'link' | 'rss' | 'tabs' | 'water-counter' | 'list'
  title?: string
  dataSource?: string
}

interface WidgetProps {
  schema: WidgetConfig
  style: GridStyle
}

export function Widget({ schema, style }: WidgetProps) {
  const baseStyle = {
    position: 'absolute' as const,
    willChange: 'transform' as const,
    width: style.width,
    height: style.height,
    transform: `translate(${style.transformX}px, ${style.transformY}px)`
  }

  // 组件映射表
  const componentMap = {
    clock: Clock,
    universal: UniversalWidget,
    container: Container,
    'resizable-container': ResizableContainer,
    link: Link,
    rss: Rss,
    tabs: Tabs,
    'water-counter': WaterCounter,
    list: List
  } as const

  const title = schema?.title || ''

  console.log('Rendering widget:', schema.type)
  const WidgetComponent = componentMap[schema.type]

  const renderWidget = WidgetComponent ? (
    <WidgetComponent {...schema} />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
      <span className="text-gray-500 text-sm">Unknown widget type: {schema.type}</span>
    </div>
  )

  return (
    <Card className="relative" style={baseStyle}>
      {renderWidget}
      {title && <div className="absolute -bottom-[24px] text-sm right-0 w-full text-center text-gray-500">{title}</div>}
    </Card>
  )
}
