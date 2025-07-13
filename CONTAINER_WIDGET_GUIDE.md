# Container Widget 使用指南 - iOS 设计风格

Container 是一个专门用于布局和样式的容器组件，采用 iOS 设计语言，可以存放其他 widget 并提供丰富的布局选项。

## 🎯 核心功能

- **纯布局容器**：只处理布局和背景样式，不处理数据
- **iOS 设计风格**：圆角卡片、毛玻璃效果、柔和阴影
- **多种布局**：行、列、网格、块级布局
- **对齐控制**：支持各种对齐方式
- **响应式支持**：适配不同屏幕尺寸

## 🛠️ 基础用法

```tsx
import { Container } from '@/components/widget/container'

// 简单容器
<Container>
  <YourWidget />
</Container>

// iOS 风格带样式和尺寸的容器
<Container 
  background="primary" 
  border="light" 
  shadow="soft" 
  padding="comfortable"
  width={300}
  height={200}
>
  <YourWidget />
</Container>
```

## 📋 属性说明

### 样式属性（iOS 风格）

- **background**: `none` | `primary` | `secondary` | `tertiary` | `accent` | `glass` | `darkGlass` | `tinted`
- **border**: `none` | `light` | `separator` | `accent` | `glass`
- **shadow**: `none` | `subtle` | `soft` | `medium` | `elevated` | `floating`
- **padding**: `none` | `tight` | `cozy` | `comfortable` | `spacious` | `loose`

### 布局属性

- **direction**: `row` | `col` | `grid` | `none`
- **align**: `start` | `center` | `end` | `between` | `around` | `stretch`
- **gap**: `none` | `tight` | `cozy` | `comfortable` | `spacious` | `loose` | `relaxed`

### 尺寸属性

- **width**: `number` - 容器宽度（像素）
- **height**: `number` - 容器高度（像素）

## 🎨 样式组合示例

### 背景样式
```tsx
<Container background="white">白色背景</Container>
<Container background="gradient">渐变背景</Container>
<Container background="glass">玻璃效果</Container>
```

### 布局方向
```tsx
{/* 水平布局 */}
<Container direction="row" gap="md">
  <Widget1 />
  <Widget2 />
  <Widget3 />
</Container>

{/* 垂直布局 */}
<Container direction="col" gap="sm">
  <Widget1 />
  <Widget2 />
</Container>

{/* 网格布局 - 使用 Tailwind CSS 类 */}
<Container direction="grid" gap="lg" className="grid-cols-3">
  <Widget1 />
  <Widget2 />
  <Widget3 />
  <Widget4 />
  <Widget5 />
  <Widget6 />
</Container>
```

### 对齐方式
```tsx
{/* 居中对齐 */}
<Container direction="row" align="center">
  <Widget />
</Container>

{/* 两端对齐 */}
<Container direction="row" align="between">
  <Widget1 />
  <Widget2 />
</Container>
```

## 🏗️ 实际应用场景

### 仪表板布局
```tsx
<Container direction="grid" gridCols={3} gap="lg" background="gray" padding="lg">
  <Container background="white" shadow="md" padding="md">
    <ClockWidget />
  </Container>
  <Container background="white" shadow="md" padding="md" className="col-span-2">
    <ListWidget />
  </Container>
  <Container background="gradient" shadow="md" padding="md" align="center">
    <StatCard />
  </Container>
</Container>
```

### 侧边栏布局
```tsx
<Container direction="row" gap="lg">
  <Container direction="col" background="gray" padding="md" className="w-64">
    <NavigationMenu />
  </Container>
  <Container direction="col" background="white" padding="lg" className="flex-1">
    <MainContent />
  </Container>
</Container>
```

### 卡片组合
```tsx
<Container direction="row" gap="md" background="gradient" padding="lg">
  <Container background="white" shadow="md" padding="md">
    <StatCard title="用户数" value="1,234" />
  </Container>
  <Container background="glass" shadow="md" padding="md">
    <StatCard title="订单数" value="567" />
  </Container>
</Container>
```

## 💡 最佳实践

1. **合理嵌套**：避免过深的容器嵌套，保持结构清晰
2. **统一间距**：在同一个页面中使用一致的 gap 和 padding 值
3. **响应式设计**：配合 Tailwind 的响应式类名实现适配
4. **语义化使用**：根据内容类型选择合适的布局方向和对齐方式
5. **性能考虑**：大量 widget 时优先使用 grid 布局而非嵌套 flex

## 🎯 设计原则

- **单一职责**：只负责布局和样式，不处理业务逻辑
- **组合优于继承**：通过组合不同属性实现复杂布局
- **灵活性**：提供足够的定制选项满足各种需求
- **一致性**：保持视觉风格和交互体验的一致性
