# Widget 数据源设计文档

## 概述

Widget 数据源系统支持两种主要类型的数据源：
1. **自定义数据源** (`custom`) - 支持任意 HTTP API
2. **Notion 数据源** (`notion`) - 集成 Notion API

## 数据源类型

### 1. 自定义数据源 (Custom Data Source)

适用于任何 REST API，支持灵活的数据转换配置。

```typescript
interface CustomDataSource {
  type: 'custom'
  url: string                           // API 端点
  headers?: Record<string, string>      // 请求头
  method?: 'GET' | 'POST'              // HTTP 方法
  body?: string                        // 请求体（POST时）
  refreshInterval?: number             // 刷新间隔（分钟）
  transform?: {                        // 数据转换规则
    listPath?: string                  // 数据列表路径
    titleField?: string                // 标题字段映射
    contentField?: string              // 内容字段映射
    linkField?: string                 // 链接字段映射
    idField?: string                   // ID字段映射
  }
}
```

#### 使用示例

```typescript
// 简单 API
const simpleAPI: CustomDataSource = {
  type: 'custom',
  url: 'https://api.github.com/users/vercel/repos',
  refreshInterval: 30
}

// 带认证的 API
const authAPI: CustomDataSource = {
  type: 'custom',
  url: 'https://api.example.com/data',
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  },
  refreshInterval: 15
}

// 复杂数据转换
const complexAPI: CustomDataSource = {
  type: 'custom',
  url: 'https://api.example.com/nested-data',
  transform: {
    listPath: 'result.items',           // 数据在 result.items 下
    titleField: 'attributes.name',      // 标题来自 attributes.name
    contentField: 'attributes.desc',    // 内容来自 attributes.desc
    linkField: 'links.self',           // 链接来自 links.self
    idField: 'id'                      // ID 来自 id 字段
  }
}
```

### 2. Notion 数据源 (Notion Data Source)

集成 Notion API，支持数据库查询、页面内容和块内容。

```typescript
interface NotionDataSource {
  type: 'notion'
  refreshInterval?: number
  integration: {
    token: string                      // Notion Integration Token
    databaseId?: string                // 数据库 ID
    pageId?: string                    // 页面 ID
    blockId?: string                   // 块 ID
  }
  query?: {                           // 查询配置（仅数据库）
    filter?: any                      // 过滤条件
    sorts?: any[]                     // 排序规则
    pageSize?: number                 // 页面大小
  }
  fieldMapping?: {                    // 字段映射
    title?: string                    // 标题属性名
    content?: string                  // 内容属性名
    link?: string                     // 链接属性名
    status?: string                   // 状态属性名
    tags?: string                     // 标签属性名
    date?: string                     // 日期属性名
  }
}
```

#### 使用示例

```typescript
// 数据库查询
const notionDatabase: NotionDataSource = {
  type: 'notion',
  integration: {
    token: 'secret_xxx',
    databaseId: 'your-database-id'
  },
  query: {
    filter: {
      property: 'Status',
      select: { does_not_equal: 'Done' }
    },
    sorts: [{ property: 'Priority', direction: 'descending' }],
    pageSize: 20
  },
  fieldMapping: {
    title: 'Name',
    content: 'Description',
    status: 'Status',
    tags: 'Tags',
    date: 'Due Date'
  },
  refreshInterval: 10
}

// 页面内容
const notionPage: NotionDataSource = {
  type: 'notion',
  integration: {
    token: 'secret_xxx',
    pageId: 'your-page-id'
  },
  refreshInterval: 60
}
```

## 配置指南

### Notion 集成配置

1. **创建 Notion Integration**
   - 访问 https://www.notion.so/my-integrations
   - 点击 "New integration"
   - 填写基本信息并创建
   - 复制 "Internal Integration Token"

2. **配置权限**
   - 在需要访问的页面或数据库中点击 "Share"
   - 邀请你的 integration（搜索 integration 名称）
   - 确保有读取权限

3. **获取资源 ID**
   - **数据库 ID**: 从数据库 URL 中提取
     `https://notion.so/workspace/[database-id]?v=...`
   - **页面 ID**: 从页面 URL 中提取
     `https://notion.so/workspace/[page-id]`
   - **块 ID**: 通过 API 或开发者工具获取

### 数据转换配置

#### listPath 说明
当 API 返回嵌套对象时使用，例如：

```json
{
  "status": "success",
  "result": {
    "items": [
      { "id": 1, "name": "Item 1" },
      { "id": 2, "name": "Item 2" }
    ]
  }
}
```

配置 `listPath: "result.items"` 来提取数组数据。

#### 字段映射
指定如何从原始数据中提取标准字段：

```typescript
transform: {
  titleField: 'name',        // 使用 'name' 字段作为标题
  contentField: 'desc',      // 使用 'desc' 字段作为内容
  linkField: 'url',         // 使用 'url' 字段作为链接
  idField: 'id'             // 使用 'id' 字段作为唯一标识
}
```

## 最佳实践

### 1. 刷新间隔设置
- **高频更新数据**（如实时数据）: 1-5 分钟
- **一般业务数据**: 10-30 分钟  
- **静态内容**: 60 分钟或更长

### 2. 错误处理
系统会自动处理：
- 网络错误重试
- API 限流
- 数据格式错误
- 认证失败

### 3. 性能优化
- 合理设置 `maxItems` 限制数据量
- 使用 `pageSize` 控制单次请求数据量
- 避免过于频繁的刷新

### 4. 安全考虑
- Token 和 API 密钥应存储在环境变量中
- 使用 HTTPS 端点
- 定期轮换认证凭据

## 示例场景

### 1. 任务管理
```typescript
// Notion 任务数据库
const taskWidget: NotionDataSource = {
  type: 'notion',
  integration: { token: 'secret_xxx', databaseId: 'tasks-db-id' },
  query: {
    filter: { property: 'Assignee', people: { contains: 'user-id' } },
    sorts: [{ property: 'Due Date', direction: 'ascending' }]
  },
  fieldMapping: { title: 'Task', status: 'Status', date: 'Due Date' }
}
```

### 2. 博客文章
```typescript
// 自定义 CMS API
const blogWidget: CustomDataSource = {
  type: 'custom',
  url: 'https://api.blog.com/posts',
  headers: { 'Authorization': 'Bearer blog-token' },
  transform: {
    titleField: 'title',
    contentField: 'excerpt',
    linkField: 'permalink',
    idField: 'slug'
  }
}
```

### 3. 项目状态
```typescript
// GitHub API
const projectWidget: CustomDataSource = {
  type: 'custom',
  url: 'https://api.github.com/repos/user/repo/issues',
  headers: { 'Authorization': 'token github-token' },
  transform: {
    titleField: 'title',
    contentField: 'body',
    linkField: 'html_url',
    idField: 'number'
  }
}
```

## 故障排除

### 常见问题

1. **Notion API 403 错误**
   - 检查 integration 是否有页面访问权限
   - 确认 token 是否正确

2. **数据不显示**
   - 检查 `listPath` 配置是否正确
   - 验证字段映射是否匹配实际数据结构

3. **刷新不工作**
   - 确认 `refreshInterval` 设置合理（大于 0）
   - 检查浏览器是否限制后台定时器

4. **CORS 错误**
   - 使用代理 API 解决跨域问题
   - 确认目标 API 支持 CORS