"use client"

import type { WidgetLayout } from '@/types/widget'
import { useEffect, useState } from 'react'

interface ListItem {
  id: string
  title: string
  content?: string
  link?: string
}

async function fetchListData(dataSource: string): Promise<ListItem[]> {
  try {
    const response = await fetch(dataSource)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Assuming the API returns an array of items or an object with items property
    const items = Array.isArray(data) ? data : data.items || []
    
    return items.map((item: any, index: number) => ({
      id: item.id || item.guid || `item-${index}`,
      title: item.title || item.name || 'Untitled',
      content: item.content || item.description || '',
      link: item.link || item.url || ''
    }))
  } catch (error) {
    console.error('List fetch error:', error)
    throw error
  }
}

function List(props: WidgetLayout) {
  const { dataSource, title = 'List' } = props

  const [items, setItems] = useState<ListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchItems() {
      if (!dataSource) return

      setLoading(true)
      setError(null)

      try {
        const data = await fetchListData(dataSource)
        setItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch list data')
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [dataSource])

  if (!dataSource) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-xs">请配置数据源地址</p>
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
          {items.length > 0 ? (
            items.map((item: ListItem) => (
              <li key={item.id} className="text-xs leading-relaxed">
                {item.link ? (
                  <a
                    className="block hover:text-blue-600 transition-colors"
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.content}
                  >
                    <div className="truncate font-medium">{item.title}</div>
                    {item.content && (
                      <div className="text-gray-500 mt-1 line-clamp-2 text-xs leading-relaxed">
                        {item.content}
                      </div>
                    )}
                  </a>
                ) : (
                  <div>
                    <div className="truncate font-medium">{item.title}</div>
                    {item.content && (
                      <div className="text-gray-500 mt-1 line-clamp-2 text-xs leading-relaxed">
                        {item.content}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="text-xs text-gray-500">暂无列表内容</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export { List }
