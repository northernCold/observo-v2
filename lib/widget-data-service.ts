import Parser from 'rss-parser'
import type { DataItem } from './data-source'

// RSS解析器配置
const rssParser = new Parser({
  customFields: {
    item: ['content:encoded', 'content']
  }
})

// RSS数据项接口
export interface RSSItem extends DataItem {
  contentSnippet: string
  pubDate?: string
  guid?: string
}

// 列表数据项接口
export interface ListItem extends DataItem {
  // 继承DataItem的所有字段
}

// Widget数据服务类
export class WidgetDataService {
  
  /**
   * 获取RSS数据
   */
  static async fetchRSSData(url: string): Promise<RSSItem[]> {
    try {
      // 首先尝试使用 rss2json.com 的 API 服务来解析 RSS
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 'ok') {
        return data.items.map((item: any, index: number) => ({
          id: item.guid || item.link || `rss-${index}`,
          title: item.title || 'Untitled',
          content: item.content || item.description || '',
          contentSnippet: item.description?.replace(/<[^>]*>/g, '')?.substring(0, 200) + '...' || '',
          link: item.link || '',
          date: item.pubDate || '',
          pubDate: item.pubDate,
          guid: item.guid || item.link
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
        const feed = await rssParser.parseString(text)

        return feed.items.map((item, index) => ({
          id: item.guid || item.link || `rss-${index}`,
          title: item.title || 'Untitled',
          content: item['content:encoded'] || item.content || item.contentSnippet || '',
          contentSnippet: (item.contentSnippet || item.content || '')?.replace(/<[^>]*>/g, '')?.substring(0, 200) + '...' || '',
          link: item.link || '',
          date: item.pubDate || item.isoDate || '',
          pubDate: item.pubDate || item.isoDate || '',
          guid: item.guid || item.link || ''
        }))
      } catch (proxyError) {
        console.error('Proxy RSS fetch error:', proxyError)
        throw error // 返回原始错误
      }
    }
  }

  /**
   * 获取列表数据
   */
  static async fetchListData(url: string): Promise<ListItem[]> {
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // 假设API返回数组或包含items属性的对象
      const items = Array.isArray(data) ? data : data.items || []
      
      return items.map((item: any, index: number) => ({
        id: item.id || item.guid || `list-${index}`,
        title: item.title || item.name || 'Untitled',
        content: item.content || item.description || '',
        link: item.link || item.url || '',
        date: item.date || item.createdAt || item.updatedAt || '',
        tags: item.tags || [],
        status: item.status || ''
      }))
    } catch (error) {
      console.error('List fetch error:', error)
      throw error
    }
  }

  /**
   * 通用数据获取方法
   * 根据数据源类型自动选择合适的获取方法
   */
  static async fetchData(dataSource: string, dataType: 'rss' | 'list' | 'auto' = 'auto'): Promise<DataItem[]> {
    // 如果指定了数据类型，直接使用对应的方法
    if (dataType === 'rss') {
      return await this.fetchRSSData(dataSource)
    }
    
    if (dataType === 'list') {
      return await this.fetchListData(dataSource)
    }

    // 自动检测数据类型
    if (dataType === 'auto') {
      // 简单的URL判断逻辑，可以根据需要扩展
      if (dataSource.includes('rss') || dataSource.includes('feed') || dataSource.endsWith('.xml')) {
        return await this.fetchRSSData(dataSource)
      } else {
        return await this.fetchListData(dataSource)
      }
    }

    throw new Error(`Unsupported data type: ${dataType}`)
  }
}