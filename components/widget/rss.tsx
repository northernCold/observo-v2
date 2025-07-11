"use client"

import type { Feed, WidgetLayout } from '@/types/widget'
import { useEffect, useState } from 'react'
import Parser from 'rss-parser'

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'content']
  }
})

async function fetchRSS(url: string) {
  try {
    // 直接使用 rss2json.com 的 API 服务来解析 RSS
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status === 'ok') {
      return data.items.map((item: any) => ({
        title: item.title,
        link: item.link,
        content: item.content || item.description,
        contentSnippet: item.description?.replace(/<[^>]*>/g, '') || '',
        guid: item.guid || item.link,
        pubDate: item.pubDate
      }))
    } else {
      throw new Error(data.message || 'Failed to fetch RSS')
    }
  } catch (error) {
    console.error('RSS fetch error:', error)
    // 如果 rss2json.com 失败，尝试使用内部代理和 rss-parser
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`
      const response = await fetch(proxyUrl)

      if (!response.ok) {
        throw new Error(`Proxy error! status: ${response.status}`)
      }

      const text = await response.text()
      const feed = await parser.parseString(text)

      return feed.items.map((item) => ({
        title: item.title || 'Untitled',
        link: item.link || '',
        content: item['content:encoded'] || item.content || item.contentSnippet || '',
        contentSnippet: (item.contentSnippet || item.content || '')?.replace(/<[^>]*>/g, '') || '',
        guid: item.guid || item.link || '',
        pubDate: item.pubDate || item.isoDate || ''
      }))
    } catch (proxyError) {
      console.error('Proxy RSS fetch error:', proxyError)
      throw error // 返回原始错误
    }
  }
}

function Rss(props: WidgetLayout) {
  const { dataSource, title = 'RSS Feed' } = props

  const [feeds, setFeeds] = useState<Feed[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeeds() {
      if (!dataSource) return

      setLoading(true)
      setError(null)

      try {
        const data = await fetchRSS(dataSource)
        setFeeds(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch RSS feeds')
        setFeeds([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeeds()
  }, [dataSource])

  if (!dataSource) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-xs">请配置RSS源地址</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-xs">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xs mb-1">加载失败</p>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full p-2">
      <div className="h-full w-full">
        <h3 className="text-sm font-medium mb-2 truncate" title={title}>
          {title}
        </h3>
        <ul className="h-full w-full overflow-auto scrollbar-hide space-y-1">
          {feeds.length > 0 ? (
            feeds.map((feed: Feed, index: number) => (
              <li key={feed.guid || index} className="text-xs leading-relaxed">
                <a
                  className="block hover:text-blue-600 transition-colors"
                  href={feed.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={feed.contentSnippet}
                >
                  <div className="truncate font-medium">{feed.title}</div>
                  {feed.contentSnippet && (
                    <div className="text-gray-500 mt-1 line-clamp-2 text-xs leading-relaxed">
                      {feed.contentSnippet}
                    </div>
                  )}
                </a>
              </li>
            ))
          ) : (
            <li className="text-xs text-gray-500">暂无RSS内容</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export { Rss }