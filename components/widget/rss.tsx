"use client"

import type { RSSItem } from '@/lib/widget-data-service'

interface RssProps   {
  feeds: RSSItem[]
}

function Rss(props: RssProps) {
  const { title = 'RSS Feed', feeds } = props

  return (
    <div className="h-full w-full p-2">
      <div className="h-full w-full">
        <ul className="h-full w-full overflow-auto scrollbar-hide space-y-1">
          {feeds.length > 0 ? (
            feeds.map((feed, index) => (
              <li key={feed.guid || feed.id || index} className="text-xs leading-relaxed">
                <a
                  className="block hover:text-blue-600 transition-colors"
                  href={feed.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={feed.contentSnippet}
                >
                  <div className="truncate font-medium">{feed.title}</div>
                  {feed.contentSnippet && (
                    <div className="truncate text-gray-500 mt-1 line-clamp-2 text-xs leading-relaxed">
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