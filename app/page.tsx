import { calculateGridStyles, type GridItem, type GridConfig } from '@/lib/grid-layout-utils'
import { Widget } from '@/components/widget-renderer'

// 定义 widget 配置数据
const widgetConfigs = Array(9)
  .fill(null)
  .map((_, index) => ({
    type: 'list' as const,
    title: '列表组件',
    dataSource: 'https://jsonplaceholder.typicode.com/posts'
  }))

// Grid 布局配置
const gridItems: GridItem[] = [
  { sizeX: 2, sizeY: 3 },
  { sizeX: 2, sizeY: 2 },
  { sizeX: 4, sizeY: 2 },
  { sizeX: 4, sizeY: 2 },
  { sizeX: 2, sizeY: 2 },
  { sizeX: 2, sizeY: 2 },
  { sizeX: 2, sizeY: 1 },
  { sizeX: 2, sizeY: 1 },
  { sizeX: 2, sizeY: 1 }
]

const gridConfig: GridConfig = {
  unitSize: 128,
  unitGap: 30,
  gridCols: 8,
  maxRows: 20
}

export default function Home() {
  // 计算网格样式
  const gridStyles = calculateGridStyles(gridItems, gridConfig)

  return (
    <div className="relative w-full h-screen bg-gray-50 p-4">
      {gridStyles.map((style, index) => (
        <Widget key={index} schema={widgetConfigs[index]} style={style} />
      ))}
    </div>
  )
}
