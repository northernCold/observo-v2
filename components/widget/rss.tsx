"use client"

import type { Feed, WidgetLayout } from '@/types/widget'
import { useEffect, useState } from 'react'
import Parser from 'rss-parser'

const parser = new Parser<Feed>()

async function fetchRSS(url: string) {
  try {
    const feed = await parser.parseURL(url)

    return feed
  } catch (error) {
    console.error(error)
  }
}

function Rss(props: WidgetLayout) {
  const { dataSource } = props

  const [feeds, setFeeds] = useState<Feed[]>([])

  useEffect(() => {
    async function fetchFeeds() {
      try {
        const data = await fetchRSS(dataSource)

        setFeeds(data!.items as Feed[])
      } catch (error) {
        console.error('Failed to fetch RSS feeds:', error)
      }
    }

    fetchFeeds()
  })

  return (
    <div className="h-full w-full">
      <ul
        className="h-full w-full list-inside list-decimal overflow-auto scrollbar-hide"
        onScroll={e => e.preventDefault()}>
        {feeds &&
          feeds.map((feed: Feed) => {
            return (
              <li className="text-xs leading-relaxed truncate">
                <a className="truncate" href={feed.link} target="_blank" rel="noreferrer" title={feed.contentSnippet}>
                  {feed.title}
                </a>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export {
  Rss
}