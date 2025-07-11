"use client"

import { useProcessedListData } from './processed-widget-wrapper'
import { List } from './list'
import { WidgetState } from '@/components/ui/widget-state'

export function ListBasicDemo() {
  const { data: items, loading, error, refresh } = useProcessedListData(
    'https://jsonplaceholder.typicode.com/posts',
    {
      autoRefresh: true,
      refreshInterval: 15,
    }
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
        <List
          title="示例列表"
          items={items}
        />
      </WidgetState>
    </div>
  )
}
