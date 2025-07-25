import React from 'react'
import { WidgetConfig } from './widget-config-form'
import { Clock } from '@/components/widget/clock'
import { List } from '@/components/widget/list'
import { WaterCounter } from '@/components/widget/water-counter'
import { Link } from '@/components/widget/link'

interface WidgetPreviewProps {
  config: WidgetConfig
  data?: any[]
}

export function WidgetPreview({ config, data = [] }: WidgetPreviewProps) {
  // 模拟数据
  const getMockData = () => {
    switch (config.type) {
      case 'list':
        return data.length > 0 ? data : [
          { id: '1', title: '示例标题 1', content: '这是一个示例内容，用于展示列表组件的效果', link: '#' },
          { id: '2', title: '示例标题 2', content: '这是另一个示例内容', link: '#' },
          { id: '3', title: '示例标题 3', content: '更多示例内容...', link: '#' }
        ]
      case 'rss':
        return data.length > 0 ? data : [
          { id: '1', title: 'RSS 文章 1', content: 'RSS 文章内容摘要...', link: '#', pubDate: new Date().toISOString() },
          { id: '2', title: 'RSS 文章 2', content: '另一篇 RSS 文章...', link: '#', pubDate: new Date().toISOString() }
        ]
      default:
        return data
    }
  }

  // 根据配置的尺寸计算预览尺寸
  const getPreviewSize = () => {
    const baseSize = 80 // 基础尺寸
    return {
      width: config.size.width * baseSize,
      height: config.size.height * baseSize
    }
  }

  const previewSize = getPreviewSize()
  const mockData = getMockData()

  const renderWidget = () => {
    switch (config.type) {
      case 'clock':
        return (
          <Clock
            title={config.name}
            width={previewSize.width}
            height={previewSize.height}
            format="24h"
            showDate={true}
            timezone="Asia/Shanghai"
            // 使用模拟的 dataSource
            dataSource={{
              type: 'custom',
              url: '',
              headers: {},
              method: 'GET'
            }}
          />
        )
      
      case 'list':
        return (
          <List
            title={config.name}
            items={mockData}
          />
        )
      
      case 'rss':
        return (
          <List
            title={config.name}
            items={mockData}
          />
        )
      
      case 'link':
        return (
          <Link
            title={config.name}
            width={previewSize.width}
            height={previewSize.height}
            url={config.dataSource.source}
            logo="/globe.svg"
            // 使用模拟的 dataSource
            dataSource={{
              type: 'custom',
              url: config.dataSource.source,
              headers: {},
              method: 'GET'
            }}
          />
        )
      
      case 'water-counter':
        return (
          <WaterCounter
            title={config.name}
            width={previewSize.width}
            height={previewSize.height}
            dailyGoal={2000}
            cupSize={200}
            // 使用模拟的 dataSource
            dataSource={{
              type: 'custom',
              url: '',
              headers: {},
              method: 'GET'
            }}
          />
        )
      
      default:
        return (
          <div className="h-full w-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded">
            <span className="text-gray-500 text-sm">
              {config.type} 组件预览
            </span>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-sm font-medium text-gray-700">
        组件预览 ({config.size.width}×{config.size.height})
      </div>
      
      <div 
        className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden"
        style={{ 
          width: `${previewSize.width}px`, 
          height: `${previewSize.height}px`,
          minWidth: '160px',
          minHeight: '120px'
        }}
      >
        {renderWidget()}
      </div>
      
      <div className="text-xs text-gray-500 text-center max-w-xs">
        {config.dataSource.type === 'url' && (
          <div>数据源: {config.dataSource.source}</div>
        )}
        {Object.keys(config.fieldMapping).length > 0 && (
          <div className="mt-1">
            已配置字段映射: {Object.keys(config.fieldMapping).join(', ')}
          </div>
        )}
      </div>
    </div>
  )
}