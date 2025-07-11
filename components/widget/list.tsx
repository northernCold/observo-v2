import type { ListItem } from '@/lib/widget-data-service'

interface ListProps {
  title: string
  items: ListItem[]
}

function List(props: ListProps) {
  const { title = 'List', items } = props

  return (
    <div className="h-full w-full p-2">
      <div className="h-full w-full">
        <h3 className="text-sm font-medium mb-2 truncate" title={title}>
          {title}
        </h3>
        <ul className="h-full w-full overflow-auto scrollbar-hide space-y-1">
          {items.length > 0 ? (
            items.map(item => (
              <li key={item.id} className="text-xs leading-relaxed">
                {item.link ? (
                  <a
                    className="block hover:text-blue-600 transition-colors"
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.content}>
                    <div className="truncate font-medium">{item.title}</div>
                    {item.content && (
                      <div className="text-gray-500 mt-1 line-clamp-2 text-xs leading-relaxed">{item.content}</div>
                    )}
                  </a>
                ) : (
                  <div>
                    <div className="truncate font-medium">{item.title}</div>
                    {item.content && (
                      <div className="text-gray-500 mt-1 line-clamp-2 text-xs leading-relaxed">{item.content}</div>
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
