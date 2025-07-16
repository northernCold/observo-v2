'use client'

import { useProcessedRSSData } from './processed-widget-wrapper'
import { Rss } from './rss'
import { WidgetState } from '@/components/ui/widget-state'
import { ResizableContainer } from './resizable-container'
import { Scroll } from './scroll'

function RssBasicDemo() {
  const { data: feeds, loading, error, refresh } = useProcessedRSSData(
    'http://www.ruanyifeng.com/blog/atom.xml',
    {
      autoRefresh: true,
      refreshInterval: 10,
    }
  )

  return (
    <div className="w-[360px] h-[240px] border rounded-lg">
      <WidgetState
        loading={loading}
        error={error}
        empty={!loading && !error && feeds.length === 0}
        width={360}
        height={240}
        onRetry={refresh}
        emptyMessage="暂无 RSS 内容">
        <Rss
          title="RSS Feed"
          feeds={feeds}
          width={360}
          height={240}
          dataSource={{ type: 'custom', url: '', refreshInterval: 60 }}
        />
      </WidgetState>
    </div>
  )
}

export function ResizableDemo() {
  const url = 'https://cprss.s3.amazonaws.com/javascriptweekly.com.xml';
  // const url = 'http://www.ruanyifeng.com/blog/atom.xml';
  const {
    data: feeds,
    loading,
    error,
    refresh
  } = useProcessedRSSData(url, {
    autoRefresh: true,
    refreshInterval: 10
  })
  return (
    <ResizableContainer background="primary" shadow="soft">
      <WidgetState
        loading={loading}
        error={error}
        empty={!loading && !error && feeds.length === 0}
        onRetry={refresh}
        emptyMessage="暂无 RSS 内容">
        <Scroll>
          <Rss feeds={feeds} />
        </Scroll>
      </WidgetState>
    </ResizableContainer>
  )
}

export { RssBasicDemo }
