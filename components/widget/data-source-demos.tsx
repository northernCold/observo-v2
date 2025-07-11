"use client"

import { useProcessedListData } from './processed-widget-wrapper'
import { UniversalWidget } from './universal'
import { WidgetState } from '@/components/ui/widget-state'
import type { CustomDataSource } from '@/types/widget'

// JSON 数据源演示
export function JSONDataSourceDemo() {
  const { data: items, loading, error, refresh } = useProcessedListData(
    'https://jsonplaceholder.typicode.com/posts',
    { autoRefresh: true, refreshInterval: 30 }
  )

  return (
    <div className="w-[360px] h-[240px] border rounded-lg">
      <WidgetState
        loading={loading}
        error={error}
        empty={!loading && !error && items.length === 0}
        width={360}
        height={240}
        onRetry={refresh}
      >
        <UniversalWidget
          title="JSON 数据源"
          items={items}
          width={360}
          height={240}
          dataSource={{ 
            type: 'custom', 
            url: 'https://jsonplaceholder.typicode.com/posts',
            refreshInterval: 30 
          }}
          displayType="list"
        />
      </WidgetState>
    </div>
  )
}

// RSS 数据源演示
export function RSSDataSourceDemo() {
  const { data: items, loading, error, refresh } = useProcessedListData(
    'https://feeds.bbci.co.uk/news/rss.xml',
    { autoRefresh: true, refreshInterval: 60 }
  )

  return (
    <div className="w-[360px] h-[240px] border rounded-lg">
      <WidgetState
        loading={loading}
        error={error}
        empty={!loading && !error && items.length === 0}
        width={360}
        height={240}
        onRetry={refresh}
      >
        <UniversalWidget
          title="BBC 新闻"
          items={items}
          width={360}
          height={240}
          dataSource={{ 
            type: 'custom', 
            url: 'https://feeds.bbci.co.uk/news/rss.xml',
            refreshInterval: 60 
          }}
          displayType="feed"
        />
      </WidgetState>
    </div>
  )
}

// Notion 数据源演示
export function NotionDataSourceDemo() {
  const dataSource: CustomDataSource = {
    type: 'custom',
    url: 'https://api.notion.com/v1/databases/your-database-id/query',
    refreshInterval: 120
  }

  const { data: items, loading, error, refresh } = useProcessedListData(
    dataSource.url,
    { autoRefresh: true, refreshInterval: dataSource.refreshInterval }
  )

  return (
    <div className="w-[360px] h-[240px] border rounded-lg">
      <WidgetState
        loading={loading}
        error={error}
        empty={!loading && !error && items.length === 0}
        width={360}
        height={240}
        onRetry={refresh}
        emptyMessage="请配置 Notion 数据库"
      >
        <UniversalWidget
          title="Notion 数据库"
          items={items}
          width={360}
          height={240}
          dataSource={dataSource}
          displayType="cards"
        />
      </WidgetState>
    </div>
  )
}