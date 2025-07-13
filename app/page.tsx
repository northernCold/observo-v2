import { calculateGridStyles, type GridItem, type GridConfig } from '@/lib/grid-layout-utils'
import { Widget } from '@/components/widget-renderer'

// 定义 widget 配置数据
const widgetConfigs = [
  {
    type: 'clock' as const,
    props: {
      title: '时钟'
    }
  },
  {
    type: 'universal' as const,
    props: {
      title: '通用列表',
      items: [
        { id: '1', title: '项目 1', content: '这是第一个项目' },
        { id: '2', title: '项目 2', content: '这是第二个项目' }
      ]
    }
  },
  {
    type: 'container' as const,
    props: {
      title: '容器组件',
      variant: 'glass'
    }
  },
  {
    type: 'water-counter' as const,
    props: {
      title: '水杯计数器'
    }
  },
  {
    type: 'clock' as const,
    props: {
      title: '时钟 2'
    }
  },
  {
    type: 'list' as const,
    props: {
      title: '列表组件',
      items: [
        { id: '1', title: '列表项 1' },
        { id: '2', title: '列表项 2' }
      ]
    }
  },
  {
    type: 'clock' as const,
    props: {
      title: '时钟 3'
    }
  },
  {
    type: 'clock' as const,
    props: {
      title: '时钟 4'
    }
  },
  {
    type: 'clock' as const,
    props: {
      title: '时钟 5'
    }
  }
]

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
  unitGap: 20,
  gridCols: 8,
  maxRows: 20
}

export default function Home() {
  // 计算网格样式
  const gridStyles = calculateGridStyles(gridItems, gridConfig)

  return (
    <div className="relative w-full h-screen bg-gray-50 p-4">
      {gridStyles.map((style, index) => (
        <Widget
          key={index}
          config={widgetConfigs[index]}
          style={style}
        />
      ))}
    </div>
  )
}
