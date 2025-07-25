'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import WidgetConfigForm, { WidgetConfig } from '@/components/widget-config-form'
import { WidgetPreview } from '@/components/widget-preview'
import { WidgetConfigService } from '@/lib/widget-config-service'

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWidget, setEditingWidget] = useState<WidgetConfig | undefined>()
  const [testingWidget, setTestingWidget] = useState<string | null>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [previewWidget, setPreviewWidget] = useState<WidgetConfig | undefined>()
  const [previewData, setPreviewData] = useState<any[]>([])

  // 从服务加载配置
  useEffect(() => {
    setWidgets(WidgetConfigService.loadConfigs())
  }, [])

  const handleSaveWidget = (config: WidgetConfig) => {
    if (editingWidget) {
      // 编辑现有配置
      const updatedWidgets = WidgetConfigService.updateConfig(editingWidget.id, config)
      setWidgets(updatedWidgets)
    } else {
      // 添加新配置
      const updatedWidgets = WidgetConfigService.addConfig(config)
      setWidgets(updatedWidgets)
    }
    
    setDialogOpen(false)
    setEditingWidget(undefined)
  }

  const handleEditWidget = (widget: WidgetConfig) => {
    setEditingWidget(widget)
    setDialogOpen(true)
  }

  const handleAddWidget = () => {
    setEditingWidget(undefined)
    setDialogOpen(true)
  }

  const handleDeleteWidget = (id: string) => {
    if (confirm('确定要删除这个 widget 配置吗？')) {
      const updatedWidgets = WidgetConfigService.deleteConfig(id)
      setWidgets(updatedWidgets)
    }
  }

  const handleTestWidget = async (widget: WidgetConfig) => {
    setTestingWidget(widget.id)
    try {
      const result = await WidgetConfigService.testDataSource(widget)
      
      if (result.success) {
        const itemCount = result.data?.items?.length || 0
        alert(`✅ 数据源连接成功！\n获取到 ${itemCount} 条数据`)
        console.log('测试结果:', result.data)
      } else {
        alert(`❌ 数据源连接失败：\n${result.error}`)
      }
    } catch (error) {
      alert('❌ 测试失败: ' + (error instanceof Error ? error.message : '未知错误'))
    } finally {
      setTestingWidget(null)
    }
  }

  const handlePreviewWidget = async (widget: WidgetConfig) => {
    setPreviewWidget(widget)
    
    // 尝试获取真实数据
    try {
      const data = await WidgetConfigService.getConfigData(widget)
      setPreviewData(data.slice(0, 5)) // 只取前5条数据用于预览
    } catch (error) {
      console.warn('获取预览数据失败，使用模拟数据:', error)
      setPreviewData([])
    }
    
    setPreviewDialogOpen(true)
  }

  const handlePreviewData = async (widget: WidgetConfig) => {
    try {
      const data = await WidgetConfigService.getConfigData(widget)
      console.log('预览数据（应用字段映射后）:', data)
      
      // 创建一个简单的预览窗口
      const preview = data.slice(0, 3).map(item => 
        `标题: ${item.title || item.name || 'N/A'}\n内容: ${(item.content || item.description || 'N/A').substring(0, 100)}...`
      ).join('\n\n')
      
      alert(`📋 数据预览（前3条）：\n\n${preview}`)
    } catch (error) {
      alert('预览失败: ' + (error instanceof Error ? error.message : '未知错误'))
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Widget 管理</h1>
        <Button onClick={handleAddWidget}>
          新增 Widget
        </Button>
      </div>

      {widgets.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">还没有配置任何 Widget</h3>
          <p className="text-gray-600 mb-4">
            点击"新增 Widget"按钮来创建你的第一个组件配置
          </p>
          <Button onClick={handleAddWidget}>
            开始配置
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {widgets.map((widget) => (
            <Card key={widget.id} className="p-6">
              <div className="flex gap-6">
                {/* 左侧：Widget 预览 */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-32 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                    <WidgetPreview config={widget} />
                  </div>
                </div>
                
                {/* 右侧：Widget 信息和操作 */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-semibold">{widget.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {widget.type}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {widget.size.width}×{widget.size.height}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">数据源:</span> 
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded">
                          {widget.dataSource.type}
                        </span>
                        <span className="ml-2 text-xs">{widget.dataSource.source}</span>
                      </div>
                      
                      {Object.keys(widget.fieldMapping).length > 0 && (
                        <div>
                          <span className="font-medium">字段映射:</span>
                          <div className="ml-2 mt-1">
                            {Object.entries(widget.fieldMapping).map(([key, value]) => (
                              value && (
                                <span key={key} className="inline-block mr-2 mb-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                  {key}: {value}
                                </span>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePreviewWidget(widget)}
                    >
                      预览组件
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePreviewData(widget)}
                    >
                      预览数据
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestWidget(widget)}
                      disabled={testingWidget === widget.id}
                    >
                      {testingWidget === widget.id ? '测试中...' : '测试'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditWidget(widget)}
                    >
                      编辑
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteWidget(widget.id)}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

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

      {/* Widget 预览弹窗 */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {previewWidget?.name} - 组件预览
            </DialogTitle>
          </DialogHeader>
          {previewWidget && (
            <WidgetPreview config={previewWidget} data={previewData} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}