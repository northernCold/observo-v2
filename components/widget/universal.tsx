"use client"

import type { WidgetLayout, DataSource } from '@/types/widget'
import type { DataItem } from '@/lib/data-source'

interface UniversalWidgetProps extends WidgetLayout {
  items: DataItem[]
  displayType?: 'list' | 'cards' | 'feed'
  maxItems?: number
  showDate?: boolean
  showTags?: boolean
  showStatus?: boolean
}

function UniversalWidget(props: UniversalWidgetProps) {
  const { 
    dataSource, 
    title = 'Widget', 
    items,
    displayType = 'list',
    maxItems = 10,
    showDate = false,
    showTags = false,
    showStatus = false
  } = props

  const displayItems = items.slice(0, maxItems)

  const renderDataSourceType = () => {
    if (!dataSource) return null
    const dsObject = dataSource as DataSource
    const type = dsObject.type
    const typeLabels = {
      'custom': '自定义',
      'notion': 'Notion'
    }
    return (
      <span className="text-xs text-gray-400 ml-2">
        ({typeLabels[type] || type})
      </span>
    )
  }

  const renderItem = (item: DataItem) => {
    return (
      <li key={item.id} className="text-xs leading-relaxed border-b border-gray-100 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
        {item.link ? (
          <a
            className="block hover:text-blue-600 transition-colors"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            title={item.content}
          >
            <ItemContent item={item} />
          </a>
        ) : (
          <ItemContent item={item} />
        )}
      </li>
    )
  }

  const ItemContent = ({ item }: { item: DataItem }) => (
    <div>
      <div className="font-medium truncate">{item.title}</div>
      
      {item.content && (
        <div className="text-gray-500 mt-1 line-clamp-2 text-xs leading-relaxed">
          {item.content}
        </div>
      )}
      
      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
        {showDate && item.date && (
          <span>{new Date(item.date).toLocaleDateString()}</span>
        )}
        
        {showStatus && item.status && (
          <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
            {item.status}
          </span>
        )}
        
        {showTags && item.tags && item.tags.length > 0 && (
          <div className="flex gap-1">
            {item.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-1 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-gray-400">+{item.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const renderList = () => (
    <ul className="h-full w-full overflow-auto scrollbar-hide space-y-1">
      {displayItems.length > 0 ? (
        displayItems.map(renderItem)
      ) : (
        <li className="text-xs text-gray-500">暂无数据</li>
      )}
    </ul>
  )

  const renderCards = () => (
    <div className="h-full w-full overflow-auto scrollbar-hide">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {displayItems.length > 0 ? (
          displayItems.map((item) => (
            <div key={item.id} className="p-2 bg-gray-50 rounded border">
              <ItemContent item={item} />
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500 col-span-full text-center">暂无数据</div>
        )}
      </div>
    </div>
  )

  const renderFeed = () => (
    <div className="h-full w-full overflow-auto scrollbar-hide space-y-3">
      {displayItems.length > 0 ? (
        displayItems.map((item) => (
          <article key={item.id} className="pb-3 border-b border-gray-100 last:border-b-0">
            <ItemContent item={item} />
          </article>
        ))
      ) : (
        <div className="text-xs text-gray-500 text-center">暂无数据</div>
      )}
    </div>
  )

  const renderContent = () => {
    switch (displayType) {
      case 'cards':
        return renderCards()
      case 'feed':
        return renderFeed()
      default:
        return renderList()
    }
  }

  return (
    <div className="h-full w-full p-2">
      <div className="h-full w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium truncate" title={title}>
            {title}
            {renderDataSourceType()}
          </h3>
          {displayItems.length > 0 && (
            <span className="text-xs text-gray-400">{displayItems.length}</span>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  )
}

export { UniversalWidget }