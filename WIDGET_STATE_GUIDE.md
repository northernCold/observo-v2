// 统一的 Widget 状态管理组件使用指南

## 概述

我们已经成功创建了一个统一的加载状态管理系统，包括：

1. **WidgetState** - 基础状态组件
2. **withWidgetState** - 高阶组件
3. **useWidgetStateProps** - 辅助 Hook

## 使用方式

### 方式一：直接使用 WidgetState 组件

```tsx
import { WidgetState } from '@/components/ui/widget-state'
import { useProcessedListData } from './processed-widget-wrapper'
import { List } from './list'

export function ListDemo() {
  const { data: items, loading, error, refresh } = useProcessedListData(url)

  return (
    <div className="w-[360px] h-[240px] border rounded-lg">
      <WidgetState
        loading={loading}
        error={error}
        empty={!loading && !error && items.length === 0}
        width={360}
        height={240}
        onRetry={refresh}
        emptyMessage="暂无数据"
      >
        <List title="列表" items={items} />
      </WidgetState>
    </div>
  )
}
```

### 方式二：使用高阶组件（推荐）

```tsx
import { withWidgetState, useWidgetStateProps } from '@/components/ui/with-widget-state'
import { List } from './list'

const ListWithState = withWidgetState(List, '暂无列表数据')

export function AdvancedListDemo() {
  const hookResult = useProcessedListData(url)
  const stateProps = useWidgetStateProps(hookResult)

  return (
    <div className="w-[360px] h-[240px] border rounded-lg">
      <ListWithState
        {...stateProps}
        title="列表"
        items={hookResult.data}
        width={360}
        height={240}
      />
    </div>
  )
}
```

## 优势

1. **统一体验** - 所有 Widget 的加载、错误、空状态都保持一致
2. **减少重复** - 不再需要在每个组件中重复写加载和错误处理逻辑
3. **易于维护** - 状态样式的修改只需要在一个地方进行
4. **功能丰富** - 支持重试、自定义消息、图标等
5. **类型安全** - 完整的 TypeScript 支持

## 特性

- ✅ 加载中状态（旋转动画 + 文字）
- ✅ 错误状态（错误图标 + 消息 + 重试按钮）
- ✅ 空数据状态（空状态图标 + 自定义消息）
- ✅ 自定义尺寸和样式
- ✅ 重试功能
- ✅ 高阶组件支持
- ✅ TypeScript 类型安全