'use client'

import React, { useState, useEffect } from 'react'
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
import { DataSourceFactory } from '@/lib/data-source/factory'

// 扩展的 Widget 配置类型
interface WidgetConfig {
  type: 'clock' | 'universal' | 'container' | 'resizable-container' | 'link' | 'rss' | 'tabs' | 'water-counter' | 'list'
  title?: string
  dataSource?: string
  fieldMapping?: {
    title?: string
    content?: string
    link?: string
    date?: string
    id?: string
  }
  size?: {
    width: number
    height: number
  }
  // tabs专用配置
  tabsConfig?: {
    tabs: {
      id: string
      title: string
      widget: {
        type: 'list' | 'rss' | 'link' | 'clock' | 'water-counter'
        dataSource: string
        fieldMapping?: {
          title?: string
          content?: string
          link?: string
          date?: string
          id?: string
        }
      }
    }[]
  }
}

interface WidgetProps {
  schema: WidgetConfig
  style: GridStyle
}

export function Widget({ schema, style }: WidgetProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 数据获取逻辑
  useEffect(() => {
    const fetchData = async () => {
      // 如果没有数据源配置，跳过数据获取
      if (!schema.dataSource || schema.type === 'clock' || schema.type === 'water-counter') {
        return
      }

      setLoading(true)
      setError(null)

      try {
        // 根据数据源类型创建适配器
        let dataSourceConfig
        
        if (schema.dataSource.startsWith('http')) {
          // URL 数据源
          dataSourceConfig = {
            type: 'url' as const,
            source: schema.dataSource,
            options: {}
          }
        } else if (schema.dataSource.includes('rss') || schema.dataSource.includes('feed')) {
          // RSS 数据源
          dataSourceConfig = {
            type: 'rss' as const,
            source: schema.dataSource,
            options: {}
          }
        } else {
          // 默认为 URL
          dataSourceConfig = {
            type: 'url' as const,
            source: schema.dataSource,
            options: {}
          }
        }

        const adapter = DataSourceFactory.createAdapter(dataSourceConfig)
        const result = await adapter.fetchData()
        
        // 应用字段映射
        let processedData = result.items || []
        if (schema.fieldMapping && Object.keys(schema.fieldMapping).length > 0) {
          processedData = processedData.map((item: any, index: number) => {
            const mappedItem: any = { ...item }
            
            // 应用字段映射
            if (schema.fieldMapping?.title && item[schema.fieldMapping.title]) {
              mappedItem.title = item[schema.fieldMapping.title]
            }
            if (schema.fieldMapping?.content && item[schema.fieldMapping.content]) {
              mappedItem.content = item[schema.fieldMapping.content]
            }
            if (schema.fieldMapping?.link && item[schema.fieldMapping.link]) {
              mappedItem.link = item[schema.fieldMapping.link]
            }
            if (schema.fieldMapping?.date && item[schema.fieldMapping.date]) {
              mappedItem.date = item[schema.fieldMapping.date]
            }
            if (schema.fieldMapping?.id && item[schema.fieldMapping.id]) {
              mappedItem.id = item[schema.fieldMapping.id]
            } else if (!mappedItem.id) {
              mappedItem.id = `item-${index}`
            }
            
            return mappedItem
          })
        }
        
        setData(processedData)
      } catch (err) {
        console.error('Failed to fetch widget data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [schema.dataSource, schema.fieldMapping])

  const baseStyle = {
    position: 'absolute' as const,
    willChange: 'transform' as const,
    width: style.width,
    height: style.height,
    transform: `translate(${style.transformX}px, ${style.transformY}px)`
  }

  const title = schema?.title || ''

  console.log('Rendering widget:', schema, 'Data:', data)

  const renderWidget = () => {
    if (loading) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded">
          <div className="text-gray-500 text-sm">加载中...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded">
          <div className="text-red-500 text-sm text-center px-2">
            <div>加载失败</div>
            <div className="text-xs mt-1">{error}</div>
          </div>
        </div>
      )
    }

    // 直接根据类型渲染对应组件，避免类型冲突
    switch (schema.type) {
      case 'list':
        return <List title={title} items={data} />
      
      case 'rss':
        return <Rss feeds={data} />
      
      case 'clock':
        return (
          <Clock
            title={title}
            width={style.width}
            height={style.height}
            format="24h"
            showDate={true}
            timezone="Asia/Shanghai"
            dataSource={{
              type: 'custom',
              url: '',
              headers: {},
              method: 'GET'
            }}
          />
        )
      
      case 'water-counter':
        return (
          <WaterCounter
            title={title}
            width={style.width}
            height={style.height}
            dailyGoal={2000}
            cupSize={200}
            dataSource={{
              type: 'custom',
              url: '',
              headers: {},
              method: 'GET'
            }}
          />
        )
      
      case 'link':
        return (
          <Link
            title={title}
            width={style.width}
            height={style.height}
            url={schema.dataSource || '#'}
            logo="/globe.svg"
            dataSource={{
              type: 'custom',
              url: schema.dataSource || '',
              headers: {},
              method: 'GET'
            }}
          />
        )
      
      case 'universal':
        return (
          <UniversalWidget
            title={title}
            width={style.width}
            height={style.height}
            items={data}
            dataSource={{
              type: 'custom',
              url: schema.dataSource || '',
              headers: {},
              method: 'GET'
            }}
          />
        )
      
      case 'container':
        return (
          <Container>
            {data.map((item, index) => (
              <div key={index} className="p-2 text-xs">{item.title || JSON.stringify(item)}</div>
            ))}
          </Container>
        )
      
      case 'resizable-container':
        return (
          <ResizableContainer
            initialWidth={style.width}
            initialHeight={style.height}
          >
            {data.map((item, index) => (
              <div key={index} className="p-2 text-xs">{item.title || JSON.stringify(item)}</div>
            ))}
          </ResizableContainer>
        )
      
      case 'tabs':
        // 为tabs类型渲染配置的子组件
        const tabItems = schema.tabsConfig?.tabs.map(tab => {
          // 为每个tab创建对应的组件
          let tabComponent;
          
          switch (tab.widget.type) {
            case 'list':
              tabComponent = (
                <div className="h-full p-2">
                  <div className="text-xs text-gray-600 mb-2">列表组件</div>
                  <div className="space-y-1">
                    <div className="text-xs">数据源: {tab.widget.dataSource}</div>
                    {tab.widget.fieldMapping?.title && (
                      <div className="text-xs text-gray-500">标题字段: {tab.widget.fieldMapping.title}</div>
                    )}
                  </div>
                </div>
              );
              break;
            case 'rss':
              tabComponent = (
                <div className="h-full p-2">
                  <div className="text-xs text-gray-600 mb-2">RSS组件</div>
                  <div className="text-xs">RSS源: {tab.widget.dataSource}</div>
                </div>
              );
              break;
            case 'clock':
              tabComponent = (
                <div className="h-full p-2 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-mono">{new Date().toLocaleTimeString()}</div>
                    <div className="text-xs text-gray-500">时钟组件</div>
                  </div>
                </div>
              );
              break;
            case 'water-counter':
              tabComponent = (
                <div className="h-full p-2 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm">💧 0/8</div>
                    <div className="text-xs text-gray-500">饮水计数器</div>
                  </div>
                </div>
              );
              break;
            case 'link':
              tabComponent = (
                <div className="h-full p-2 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm">🔗</div>
                    <div className="text-xs text-gray-500">链接组件</div>
                    <div className="text-xs mt-1">{tab.widget.dataSource}</div>
                  </div>
                </div>
              );
              break;
            default:
              tabComponent = (
                <div className="h-full p-2 flex items-center justify-center">
                  <div className="text-xs text-gray-500">
                    {tab.widget.type} 组件
                  </div>
                </div>
              );
          }
          
          return {
            id: tab.id,
            title: tab.title,
            component: tabComponent
          };
        }) || [];
        
        return (
          <Tabs
            title={title}
            width={style.width}
            height={style.height}
            dataSource={{
              type: 'custom',
              url: '',
              headers: {},
              method: 'GET'
            }}
            tabs={tabItems}
          />
        )
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
            <span className="text-gray-500 text-sm">Unknown widget type: {schema.type}</span>
          </div>
        )
    }
  }

  return (
    <Card className="relative" style={baseStyle}>
      {renderWidget()}
      {title && <div className="absolute -bottom-[24px] text-sm right-0 w-full text-center text-gray-500">{title}</div>}
    </Card>
  )
}
