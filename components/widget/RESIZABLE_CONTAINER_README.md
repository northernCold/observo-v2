# 可调整大小容器 (ResizableContainer)

## 概述

`ResizableContainer` 是一个支持动态拖拽调整宽度和高度的容器组件，采用 iOS 设计风格，提供流畅的用户交互体验。

## 特性

- ✅ **动态调整大小**：通过拖拽边缘和角落调整容器尺寸
- ✅ **iOS 设计风格**：毛玻璃效果、柔和阴影、圆角设计
- ✅ **灵活配置**：支持最小/最大尺寸限制
- ✅ **视觉反馈**：拖拽时的光标变化和视觉指示器
- ✅ **回调支持**：尺寸变化时的事件回调
- ✅ **禁用模式**：可选择禁用调整大小功能

## 使用示例

### 基础用法

```tsx
import { ResizableContainer } from '@/components/widget/resizable-container'

function App() {
  return (
    <ResizableContainer
      background="primary"
      shadow="soft"
      padding="comfortable"
    >
      <div>你的内容</div>
    </ResizableContainer>
  )
}
```

### 带尺寸限制的容器

```tsx
<ResizableContainer
  background="glass"
  initialWidth={300}
  initialHeight={200}
  minWidth={200}
  minHeight={150}
  maxWidth={600}
  maxHeight={400}
  onResize={(width, height) => {
    console.log(`新尺寸: ${width} x ${height}`)
  }}
>
  <div>内容区域</div>
</ResizableContainer>
```

### 固定大小容器（不可调整）

```tsx
<ResizableContainer
  background="secondary"
  initialWidth={250}
  initialHeight={150}
  resizable={false}
>
  <div>固定大小内容</div>
</ResizableContainer>
```

## API 参考

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 子组件内容 |
| `className` | `string` | - | 自定义 CSS 类名 |
| `background` | `'none' \| 'primary' \| 'secondary' \| 'tertiary' \| 'accent' \| 'glass' \| 'darkGlass' \| 'tinted'` | `'primary'` | 背景样式 |
| `border` | `'none' \| 'light' \| 'separator' \| 'accent' \| 'glass'` | `'light'` | 边框样式 |
| `shadow` | `'none' \| 'subtle' \| 'soft' \| 'medium' \| 'elevated' \| 'floating'` | `'soft'` | 阴影样式 |
| `padding` | `'none' \| 'tight' \| 'cozy' \| 'comfortable' \| 'spacious' \| 'loose'` | `'comfortable'` | 内边距 |
| `initialWidth` | `number` | `300` | 初始宽度（像素） |
| `initialHeight` | `number` | `200` | 初始高度（像素） |
| `minWidth` | `number` | `100` | 最小宽度（像素） |
| `minHeight` | `number` | `80` | 最小高度（像素） |
| `maxWidth` | `number` | `800` | 最大宽度（像素） |
| `maxHeight` | `number` | `600` | 最大高度（像素） |
| `resizable` | `boolean` | `true` | 是否可调整大小 |
| `onResize` | `(width: number, height: number) => void` | - | 尺寸变化回调 |
| `style` | `React.CSSProperties` | - | 自定义样式 |

### 背景样式

- `none` - 透明背景
- `primary` - 白色毛玻璃效果
- `secondary` - 浅灰色毛玻璃效果  
- `tertiary` - 中灰色毛玻璃效果
- `accent` - 蓝色调毛玻璃效果
- `glass` - 透明毛玻璃效果
- `darkGlass` - 暗色毛玻璃效果
- `tinted` - 渐变毛玻璃效果

### 交互方式

1. **边缘拖拽**：拖拽四条边缘可单向调整尺寸
2. **角落拖拽**：拖拽四个角落可双向调整尺寸
3. **视觉指示**：右下角有调整大小指示器
4. **光标变化**：悬停和拖拽时光标会相应变化

## 注意事项

- 容器使用绝对定位，确保父容器有足够的空间
- 拖拽时会临时禁用文本选择以提供更好的体验
- 建议设置合理的最小/最大尺寸限制以避免过小或过大的容器

## 浏览器兼容性

- Chrome 88+
- Firefox 87+
- Safari 14+
- Edge 88+
