import { WidgetDataService, type RSSItem, type ListItem } from './widget-data-service'
import type { DataSource } from '@/types/widget'

/**
 * Widget 数据处理器
 * 负责将原始数据源转换为各个 widget 组件所需的特定数据格式
 */
export class WidgetDataProcessor {
  /**
   * 为 List Widget 处理数据
   * 输出：ListItem[] - 已处理的列表项数组
   */
  static async processListData(dataSource: DataSource | string | null): Promise<ListItem[]> {
    if (!dataSource) return []
    
    const url = typeof dataSource === 'string' ? dataSource : dataSource?.type === 'custom' ? dataSource.url : null
    if (!url) return []
    
    try {
      return await WidgetDataService.fetchListData(url)
    } catch (error) {
      console.error('Failed to process list data:', error)
      return []
    }
  }

  /**
   * 为 RSS Widget 处理数据
   * 输出：RSSItem[] - 已处理的 RSS 项目数组
   */
  static async processRSSData(dataSource: DataSource | string | null): Promise<RSSItem[]> {
    if (!dataSource) return []
    
    const url = typeof dataSource === 'string' ? dataSource : dataSource?.type === 'custom' ? dataSource.url : null
    if (!url) return []
    
    try {
      return await WidgetDataService.fetchRSSData(url)
    } catch (error) {
      console.error('Failed to process RSS data:', error)
      return []
    }
  }

  /**
   * 为 Link Widget 处理数据
   * 输出：string - 已处理的链接 URL
   */
  static processLinkData(dataSource: DataSource | string | null): string {
    if (!dataSource) return ''
    
    if (typeof dataSource === 'string') return dataSource
    
    // 对于复杂数据源，提取 URL
    if (dataSource?.type === 'custom' && dataSource.url) {
      return dataSource.url
    }
    
    return ''
  }

  /**
   * 通用数据处理方法
   * 根据 widget 类型自动选择合适的处理方法
   */
  static async processWidgetData(
    widgetType: 'list' | 'rss' | 'link' | 'clock' | 'water-counter',
    dataSource: DataSource | string | null
  ): Promise<any> {
    switch (widgetType) {
      case 'list':
        return await this.processListData(dataSource)
      case 'rss':
        return await this.processRSSData(dataSource)
      case 'link':
        return this.processLinkData(dataSource)
      case 'clock':
      case 'water-counter':
        // 这些组件不需要外部数据源
        return null
      default:
        throw new Error(`Unsupported widget type: ${widgetType}`)
    }
  }
}