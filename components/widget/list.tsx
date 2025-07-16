import type { ListItem } from '@/lib/widget-data-service'
import { Scroll } from './scroll'

interface ListProps {
  title: string
  items: ListItem[]
}

function List(props: ListProps) {
  const { title = 'List', items } = props

  return (
    <div className="h-full w-full p-3">
      <Scroll>
        <ul className="w-full">
          {items.length ? (
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
      </Scroll>
    </div>
  )
}

export { List }
