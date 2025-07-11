import type { DataSource, CustomDataSource, NotionDataSource } from '@/types/widget'
import { ProxyAPI } from './proxy-api'

// 通用数据项接口
export interface DataItem {
  id: string
  title: string
  content?: string
  link?: string
  date?: string
  tags?: string[]
  status?: string
  [key: string]: any // 允许额外的自定义字段
}

// 数据源处理器基类
abstract class DataSourceHandler {
  protected dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  abstract fetchData(): Promise<DataItem[]>
}

// 自定义数据源处理器
class CustomDataSourceHandler extends DataSourceHandler {
  protected dataSource: CustomDataSource

  constructor(dataSource: CustomDataSource) {
    super(dataSource)
    this.dataSource = dataSource
  }

  async fetchData(): Promise<DataItem[]> {
    try {
      const { url, headers = {}, method = 'GET', body, transform } = this.dataSource

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        ...(body && method !== 'GET' && { body })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // 如果配置了数据路径，按路径获取数据
      let items = data
      if (transform?.listPath) {
        items = this.getNestedValue(data, transform.listPath)
      }

      // 确保是数组
      if (!Array.isArray(items)) {
        items = [items]
      }

      // 转换数据格式
      return items.map((item: any, index: number) => ({
        id: this.getFieldValue(item, transform?.idField) || `item-${index}`,
        title: this.getFieldValue(item, transform?.titleField) || item.title || item.name || 'Untitled',
        content: this.getFieldValue(item, transform?.contentField) || item.content || item.description || '',
        link: this.getFieldValue(item, transform?.linkField) || item.link || item.url || '',
        date: item.date || item.createdAt || item.updatedAt || '',
        tags: item.tags || [],
        status: item.status || '',
        ...item // 保留原始数据
      }))

    } catch (error) {
      console.error('Custom data source fetch error:', error)
      throw error
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  private getFieldValue(item: any, fieldName?: string): any {
    if (!fieldName) return undefined
    return this.getNestedValue(item, fieldName)
  }
}

// Notion数据源处理器
class NotionDataSourceHandler extends DataSourceHandler {
  protected dataSource: NotionDataSource

  constructor(dataSource: NotionDataSource) {
    super(dataSource)
    this.dataSource = dataSource
  }

  async fetchData(): Promise<DataItem[]> {
    try {
      // 自动使用保存的 token（如果没有在数据源中指定）
      const token = this.getToken()
      if (!token) {
        throw new Error('未找到 Notion token，请先在设置页面配置')
      }

      const { integration } = this.dataSource
      
      if (integration.databaseId) {
        return await this.fetchDatabaseItems(token)
      } else if (integration.pageId) {
        return await this.fetchPageContent(token)
      } else if (integration.blockId) {
        return await this.fetchBlockContent(token)
      } else {
        throw new Error('No valid Notion resource ID provided')
      }

    } catch (error) {
      console.error('Notion data source fetch error:', error)
      throw error
    }
  }

  private getToken(): string {
    // 优先使用数据源中指定的 token，否则使用保存的 token
    return this.dataSource.integration.token || NotionTokenManager.getToken() || ''
  }

  private async fetchDatabaseItems(token: string): Promise<DataItem[]> {
    const { query, fieldMapping } = this.dataSource
    
    const requestBody: any = {
      page_size: query?.pageSize || 100
    }

    if (query?.filter) {
      requestBody.filter = query.filter
    }

    if (query?.sorts) {
      requestBody.sorts = query.sorts
    }

    try {
      // 使用代理服务器调用 Notion API
      const proxyAPI = new ProxyAPI('https://api.notion.com', token)
      const data = await proxyAPI.post(
        `v1/databases/${this.dataSource.integration.databaseId}/query`,
        requestBody,
        {
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        }
      )

      return data.results.map((page: any) => ({
        id: page.id,
        title: this.extractPropertyValue(page.properties, fieldMapping?.title || 'Name'),
        content: this.extractPropertyValue(page.properties, fieldMapping?.content),
        link: page.url,
        date: this.extractPropertyValue(page.properties, fieldMapping?.date),
        tags: this.extractPropertyValue(page.properties, fieldMapping?.tags) || [],
        status: this.extractPropertyValue(page.properties, fieldMapping?.status),
        // 保留原始Notion页面数据
        _notionPage: page
      }))
    } catch (error) {
      console.error('Failed to fetch Notion database:', error)
      throw new Error(`Failed to fetch Notion database: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async fetchPageContent(token: string): Promise<DataItem[]> {
    const { integration } = this.dataSource

    try {
      // 使用代理服务器调用 Notion API
      const proxyAPI = new ProxyAPI('https://api.notion.com', token)
      
      const page = await proxyAPI.get(`v1/pages/${integration.pageId}`)

      // 获取页面的块内容
      const blocksData = await proxyAPI.get(`v1/blocks/${integration.pageId}/children`)
      const content = this.extractTextFromBlocks(blocksData.results)

      return [{
        id: page.id,
        title: this.extractPageTitle(page),
        content,
        link: page.url,
        date: page.created_time,
        tags: [],
        status: '',
        _notionPage: page
      }]
    } catch (error) {
      console.error('Failed to fetch Notion page:', error)
      throw new Error(`Failed to fetch Notion page: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async fetchBlockContent(token: string): Promise<DataItem[]> {
    const { integration } = this.dataSource

    if (!integration.blockId) {
      throw new Error('Block ID is required for block content fetch')
    }

    try {
      // 使用代理服务器调用 Notion API
      const proxyAPI = new ProxyAPI('https://api.notion.com', token)
      const data = await proxyAPI.get(`v1/blocks/${integration.blockId}/children`)
      const content = this.extractTextFromBlocks(data.results)

      return [{
        id: integration.blockId,
        title: 'Notion Block Content',
        content,
        link: '',
        date: '',
        tags: [],
        status: ''
      }]
    } catch (error) {
      console.error('Failed to fetch Notion block:', error)
      throw new Error(`Failed to fetch Notion block: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private extractPropertyValue(properties: any, propertyName?: string): any {
    if (!propertyName || !properties[propertyName]) return undefined

    const property = properties[propertyName]
    
    switch (property.type) {
      case 'title':
        return property.title?.[0]?.plain_text || ''
      case 'rich_text':
        return property.rich_text?.map((t: any) => t.plain_text).join('') || ''
      case 'select':
        return property.select?.name || ''
      case 'multi_select':
        return property.multi_select?.map((s: any) => s.name) || []
      case 'date':
        return property.date?.start || ''
      case 'url':
        return property.url || ''
      case 'email':
        return property.email || ''
      case 'phone_number':
        return property.phone_number || ''
      case 'number':
        return property.number || 0
      case 'checkbox':
        return property.checkbox || false
      default:
        return property
    }
  }

  private extractPageTitle(page: any): string {
    // 尝试从不同可能的标题属性中提取标题
    const properties = page.properties
    
    for (const key in properties) {
      const property = properties[key]
      if (property.type === 'title') {
        return property.title?.[0]?.plain_text || 'Untitled'
      }
    }
    
    return 'Untitled'
  }

  private extractTextFromBlocks(blocks: any[]): string {
    return blocks.map(block => {
      switch (block.type) {
        case 'paragraph':
          return block.paragraph?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        case 'heading_1':
          return block.heading_1?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        case 'heading_2':
          return block.heading_2?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        case 'heading_3':
          return block.heading_3?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        case 'bulleted_list_item':
          return '• ' + (block.bulleted_list_item?.rich_text?.map((t: any) => t.plain_text).join('') || '')
        case 'numbered_list_item':
          return block.numbered_list_item?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        case 'to_do':
          const checkbox = block.to_do?.checked ? '☑' : '☐'
          const text = block.to_do?.rich_text?.map((t: any) => t.plain_text).join('') || ''
          return `${checkbox} ${text}`
        default:
          return ''
      }
    }).filter(text => text.length > 0).join('\n')
  }
}

// 数据源处理器工厂
export class DataSourceManager {
  static createHandler(dataSource: DataSource): DataSourceHandler {
    switch (dataSource.type) {
      case 'custom':
        return new CustomDataSourceHandler(dataSource as CustomDataSource)
      case 'notion':
        return new NotionDataSourceHandler(dataSource as NotionDataSource)
      default:
        throw new Error(`Unsupported data source type: ${(dataSource as any).type}`)
    }
  }

  static async fetchData(dataSource: DataSource): Promise<DataItem[]> {
    const handler = this.createHandler(dataSource)
    return await handler.fetchData()
  }
}

// Notion token 管理工具
export class NotionTokenManager {
  private static readonly TOKEN_KEY = 'notion_token'

  // 获取保存的 token
  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  // 保存 token
  static setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  // 删除 token
  static removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.TOKEN_KEY)
  }

  // 检查是否有有效的 token
  static hasToken(): boolean {
    const token = this.getToken()
    return token !== null && token.trim().length > 0
  }

  // 验证 token 格式
  static isValidTokenFormat(token: string): boolean {
    return token.startsWith('secret_') && token.length > 20
  }
}

// Notion 数据源创建助手
export class NotionDataSourceHelper {
  // 创建数据库数据源（自动使用保存的 token）
  static createDatabaseSource(config: {
    databaseId: string
    fieldMapping?: NotionDataSource['fieldMapping']
    query?: NotionDataSource['query']
    refreshInterval?: number
  }): NotionDataSource {
    return {
      type: 'notion',
      integration: {
        token: '', // 将自动使用保存的 token
        databaseId: config.databaseId
      },
      fieldMapping: config.fieldMapping,
      query: config.query,
      refreshInterval: config.refreshInterval || 10
    }
  }

  // 创建页面数据源（自动使用保存的 token）
  static createPageSource(config: {
    pageId: string
    refreshInterval?: number
  }): NotionDataSource {
    return {
      type: 'notion',
      integration: {
        token: '', // 将自动使用保存的 token
        pageId: config.pageId
      },
      refreshInterval: config.refreshInterval || 60
    }
  }

  // 创建块数据源（自动使用保存的 token）
  static createBlockSource(config: {
    blockId: string
    refreshInterval?: number
  }): NotionDataSource {
    return {
      type: 'notion',
      integration: {
        token: '', // 将自动使用保存的 token
        blockId: config.blockId
      },
      refreshInterval: config.refreshInterval || 30
    }
  }

  // 检查是否可以创建 Notion 数据源
  static canCreateDataSource(): boolean {
    return NotionTokenManager.hasToken()
  }

  // 获取配置错误信息
  static getConfigurationError(): string | null {
    if (!NotionTokenManager.hasToken()) {
      return '请先在设置页面配置 Notion token'
    }
    return null
  }
}