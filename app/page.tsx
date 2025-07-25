'use client'

import { useState, useEffect } from 'react'
import { calculateGridStyles, type GridItem, type GridConfig } from '@/lib/grid-layout-utils'
import { Widget } from '@/components/widget-renderer'
import { WidgetConfigService } from '@/lib/widget-config-service'
import { WidgetConfig } from '@/components/widget-config-form'
import { WidgetContextMenu } from '@/components/widget-context-menu'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import WidgetConfigForm from '@/components/widget-config-form'

// Grid 布局配置
const gridConfig: GridConfig = {
  unitSize: 128,
  unitGap: 30,
  gridCols: 8,
  maxRows: 20
}

// 默认的示例组件配置
const defaultWidgetConfigs: WidgetConfig[] = [
  {
    id: 'demo-clock',
    name: '时钟组件',
    type: 'clock',
    dataSource: { type: 'url', source: '' },
    fieldMapping: {},
    size: { width: 2, height: 2 }
  },
  {
    id: 'demo-list',
    name: '列表组件',
    type: 'list',
    dataSource: { type: 'url', source: 'https://jsonplaceholder.typicode.com/posts' },
    fieldMapping: { title: 'title', content: 'body', id: 'id' },
    size: { width: 4, height: 2 }
  },
  {
    id: 'demo-water',
    name: '饮水计数器',
    type: 'water-counter',
    dataSource: { type: 'url', source: '' },
    fieldMapping: {},
    size: { width: 2, height: 2 }
  }
]

export default function Home() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWidget, setEditingWidget] = useState<WidgetConfig | undefined>()

  useEffect(() => {
    const userWidgets = WidgetConfigService.loadConfigs()
    setWidgets(userWidgets.length > 0 ? userWidgets : defaultWidgetConfigs)
  }, [])

  // 将 widget 配置转换为网格项
  const gridItems: GridItem[] = widgets.map(widget => ({
    sizeX: widget.size.width,
    sizeY: widget.size.height
  }))

  // 计算网格样式
  const gridStyles = calculateGridStyles(gridItems, gridConfig)

  // 将 WidgetConfig 转换为 Widget 组件所需的 schema 格式
  const convertToSchema = (config: WidgetConfig) => ({
    type: config.type,
    title: config.name,
    dataSource: config.dataSource.source,
    fieldMapping: config.fieldMapping,
    size: config.size
  })

  // 处理编辑 widget
  const handleEditWidget = (widget: WidgetConfig) => {
    setEditingWidget(widget)
    setDialogOpen(true)
  }

  // 处理删除 widget
  const handleDeleteWidget = (widget: WidgetConfig) => {
    const updatedWidgets = WidgetConfigService.deleteConfig(widget.id)
    setWidgets(updatedWidgets)
  }

  // 处理复制 widget
  const handleDuplicateWidget = (widget: WidgetConfig) => {
    const newWidget: WidgetConfig = {
      ...widget,
      id: `${widget.id}-copy-${Date.now()}`,
      name: `${widget.name} (副本)`
    }
    const updatedWidgets = WidgetConfigService.addConfig(newWidget)
    setWidgets(updatedWidgets)
  }

  // 处理新增 widget
  const handleAddWidget = () => {
    setEditingWidget(undefined)
    setDialogOpen(true)
  }

  // 处理快捷添加 widget
  const handleQuickAddWidget = (type: string) => {
    const quickWidgetConfigs: Record<string, Partial<WidgetConfig>> = {
      clock: {
        name: '时钟组件',
        type: 'clock',
        dataSource: { type: 'url', source: '' },
        fieldMapping: {},
        size: { width: 2, height: 2 }
      },
      list: {
        name: '列表组件',
        type: 'list',
        dataSource: { type: 'url', source: 'https://jsonplaceholder.typicode.com/posts' },
        fieldMapping: { title: 'title', content: 'body', id: 'id' },
        size: { width: 4, height: 2 }
      },
      rss: {
        name: 'RSS组件',
        type: 'rss',
        dataSource: { type: 'rss', source: 'https://feeds.feedburner.com/zhihu-daily' },
        fieldMapping: {},
        size: { width: 4, height: 4 }
      },
      'water-counter': {
        name: '饮水计数器',
        type: 'water-counter',
        dataSource: { type: 'url', source: '' },
        fieldMapping: {},
        size: { width: 2, height: 2 }
      },
      link: {
        name: '链接组件',
        type: 'link',
        dataSource: { type: 'url', source: 'https://www.example.com' },
        fieldMapping: {},
        size: { width: 1, height: 1 }
      }
    }

    const config = quickWidgetConfigs[type]
    if (config) {
      const newWidget: WidgetConfig = {
        id: `quick-${type}-${Date.now()}`,
        ...config
      } as WidgetConfig

      const updatedWidgets = WidgetConfigService.addConfig(newWidget)
      setWidgets(updatedWidgets)
    }
  }

  // 处理保存 widget
  const handleSaveWidget = (config: WidgetConfig) => {
    if (editingWidget) {
      const updatedWidgets = WidgetConfigService.updateConfig(editingWidget.id, config)
      setWidgets(updatedWidgets)
    } else {
      const updatedWidgets = WidgetConfigService.addConfig(config)
      setWidgets(updatedWidgets)
    }
    
    setDialogOpen(false)
    setEditingWidget(undefined)
  }

  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      {/* 主要内容区域 - 包含右键菜单的空白区域 */}
      <WidgetContextMenu
        onAdd={handleAddWidget}
        onQuickAdd={handleQuickAddWidget}
      >
        <div className="w-full min-h-screen p-4">
          {widgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96">
              <h2 className="text-xl font-semibold mb-4">还没有配置任何组件</h2>
              <p className="text-gray-600 mb-6">右键点击空白区域来添加组件</p>
            </div>
          ) : (
            <div className="relative w-full">
              {gridStyles.map((style, index) => {
                const widget = widgets[index]
                if (!widget) return null
                
                return (
                  <WidgetContextMenu
                    key={widget.id}
                    widget={widget}
                    onEdit={handleEditWidget}
                    onDelete={handleDeleteWidget}
                    onDuplicate={handleDuplicateWidget}
                  >
                    <div className="group cursor-pointer">
                      <Widget 
                        schema={convertToSchema(widget)} 
                        style={style} 
                      />
                    </div>
                  </WidgetContextMenu>
                )
              })}
            </div>
          )}
        </div>
      </WidgetContextMenu>

      {/* Widget 配置弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingWidget ? '编辑 Widget' : '新增 Widget'}
            </DialogTitle>
          </DialogHeader>
          <WidgetConfigForm 
            onSave={handleSaveWidget}
            initialConfig={editingWidget}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
