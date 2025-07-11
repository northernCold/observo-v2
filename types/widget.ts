// 数据源类型枚举
export type DataSourceType = 'custom' | 'notion'

// 基础数据源接口
export interface BaseDataSource {
  type: DataSourceType
  refreshInterval?: number // 刷新间隔（分钟）
}

// 用户自定义数据源
export interface CustomDataSource extends BaseDataSource {
  type: 'custom'
  url: string
  headers?: Record<string, string>
  method?: 'GET' | 'POST'
  body?: string
  // 数据转换规则（可选）
  transform?: {
    listPath?: string // 如果API返回嵌套对象，指定列表数据的路径，如 'data.items'
    titleField?: string // 标题字段名
    contentField?: string // 内容字段名
    linkField?: string // 链接字段名
    idField?: string // ID字段名
  }
}

// Notion数据源配置
export interface NotionDataSource extends BaseDataSource {
  type: 'notion'
  // Notion集成配置
  integration: {
    token: string // Notion Integration Token
    databaseId?: string // 数据库ID（用于数据库查询）
    pageId?: string // 页面ID（用于页面内容）
    blockId?: string // 块ID（用于特定块内容）
  }
  // 数据查询配置
  query?: {
    filter?: any // Notion API 过滤条件
    sorts?: any[] // 排序规则
    pageSize?: number // 页面大小
  }
  // 字段映射配置
  fieldMapping?: {
    title?: string // 标题属性名
    content?: string // 内容属性名
    link?: string // 链接属性名
    status?: string // 状态属性名
    tags?: string // 标签属性名
    date?: string // 日期属性名
  }
}

// 数据源联合类型
export type DataSource = CustomDataSource | NotionDataSource

export interface Widget {
  title: string
  sizeX: 1 | 2 | 4 | 'full'
  sizeY: 1 | 2 | 4
  // 更新为新的数据源类型
  dataSource: DataSource
}

export interface WidgetLayout extends Omit<Widget, 'sizeX' | 'sizeY'> {
  width: number
  height: number
  transformX?: string
  transformY?: string
  gridX?: number
  gridY?: number
}

export interface LinkWidget extends WidgetLayout {
  logo: string
}

export type Feed = {
  title: string
  link: string
  content: string
  contentSnippet: string
  guid: string
}

export interface rssWidget extends WidgetLayout {
  feeds: Feed[]
}
