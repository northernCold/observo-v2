# Widget 组件重构说明

## 重构目标

将 widget 组件中的数据获取逻辑与展示逻辑分离，实现关注点分离的设计原则。

## 重构内容

### 1. 创建数据服务层

#### `lib/widget-data-service.ts`
- **WidgetDataService**: 统一的数据获取服务类
- **fetchRSSData()**: RSS数据获取方法
- **fetchListData()**: 列表数据获取方法
- **fetchData()**: 通用数据获取方法，支持自动类型检测

#### `lib/hooks/use-widget-data.ts`
- **useWidgetData**: 通用数据管理Hook
- **useRSSData**: RSS数据专用Hook
- **useListData**: 列表数据专用Hook
- 支持自动刷新、错误处理、加载状态管理

#### `lib/hooks/use-data-source.ts`
- **useDataSource**: 复杂数据源Hook
- 专门处理DataSource对象（Notion、自定义数据源等）

### 2. 重构Widget组件

#### RSS组件 (`components/widget/rss.tsx`)
**重构前**:
```tsx
// 组件内部包含数据获取逻辑
async function fetchRSS(url: string) { /* ... */ }
function Rss() {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(false)
  // 复杂的数据获取和状态管理逻辑
  useEffect(() => { /* 数据获取逻辑 */ }, [])
  // 展示逻辑
}
```

**重构后**:
```tsx
// 组件只关注展示逻辑
function Rss(props: WidgetLayout) {
  const rssUrl = extractUrlFromDataSource(props.dataSource)
  const { data: feeds, loading, error } = useRSSData(rssUrl, {
    autoRefresh: true,
    refreshInterval: 10
  })
  // 纯展示逻辑
}
```

#### List组件 (`components/widget/list.tsx`)
- 移除内部的`fetchListData`函数
- 使用`useListData` Hook管理数据状态
- 组件只关注数据展示

#### Universal组件 (`components/widget/universal.tsx`)
- 使用`useDataSource` Hook处理复杂数据源
- 支持多种显示类型（list、cards、feed）
- 数据获取逻辑完全外部化

### 3. 优势

#### 关注点分离
- **数据层**: 专门负责数据获取、缓存、错误处理
- **展示层**: 专门负责UI渲染和用户交互
- **状态管理**: 通过Hook统一管理数据状态

#### 可复用性提升
- 数据服务可以在多个组件间共享
- Hook可以在不同的widget类型中复用
- 数据获取逻辑可以独立测试

#### 维护性提升
- 数据获取逻辑集中管理，便于维护
- 组件代码更简洁，专注于展示逻辑
- 类型安全，减少运行时错误

#### 功能增强
- 统一的错误处理机制
- 自动刷新功能
- 加载状态管理
- 支持不同数据源类型

## 使用示例

### 简单RSS Widget
```tsx
function MyRSSWidget() {
  return (
    <Rss 
      dataSource="https://example.com/rss.xml"
      title="最新资讯"
    />
  )
}
```

### 复杂数据源Widget
```tsx
function MyNotionWidget() {
  const dataSource: DataSource = {
    type: 'notion',
    integration: {
      token: 'your-token',
      databaseId: 'your-database-id'
    },
    refreshInterval: 15
  }
  
  return (
    <UniversalWidget 
      dataSource={dataSource}
      title="Notion 任务"
      displayType="cards"
      maxItems={20}
      showDate={true}
      showTags={true}
    />
  )
}
```

### 自定义数据Hook
```tsx
function MyCustomWidget() {
  const { data, loading, error, refresh } = useWidgetData('https://api.example.com/data', {
    autoRefresh: true,
    refreshInterval: 5,
    dataType: 'list'
  })
  
  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>
  
  return (
    <div>
      <button onClick={refresh}>刷新</button>
      {data.map(item => <div key={item.id}>{item.title}</div>)}
    </div>
  )
}
```

## 扩展性

这种架构使得添加新的数据源类型或widget类型变得非常容易：

1. **新数据源**: 在`WidgetDataService`中添加新的fetch方法
2. **新Hook**: 基于`useWidgetData`创建专门的Hook
3. **新Widget**: 使用现有Hook，专注于展示逻辑

## 迁移指南

如果你有现有的widget组件需要迁移：

1. 识别组件中的数据获取逻辑
2. 将数据获取逻辑移动到`WidgetDataService`
3. 使用合适的Hook替换useState + useEffect模式
4. 简化组件，只保留展示逻辑
5. 添加适当的类型注解