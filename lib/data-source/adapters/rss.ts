import type { DataSourceAdapter, DataModel } from '../types'
import Parser from 'rss-parser'

const rssParser = new Parser({
  customFields: {
    item: ['content:encoded', 'content']
  }
})

export class RssAdapter implements DataSourceAdapter {
  constructor(private feedUrl: string) {}

  async fetchData(): Promise<DataModel> {
    try {
      const response = await fetch(this.feedUrl)
      const text = await response.text()

      const feed = await rssParser.parseString(text)

      return {
        dataType: 'rss',
        data: feed.items.map((item, index) => ({
          id: item.guid || item.link || `rss-${index}`,
          title: item.title || 'Untitled',
          content: item['content:encoded'] || item.content || item.contentSnippet || '',
          contentSnippet:
            (item.contentSnippet || item.content || '')?.replace(/<[^>]*>/g, '')?.substring(0, 200) + '...' || '',
          link: item.link || '',
          date: item.pubDate || item.isoDate || '',
          pubDate: item.pubDate || item.isoDate || '',
          guid: item.guid || item.link || ''
        }))
      }

    } catch (error) {
      console.error('Failed to fetch data from RSS:', error)
      return { dataType: 'rss', data: [] }
    }
  }
}
