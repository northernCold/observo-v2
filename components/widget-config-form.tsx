'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export interface WidgetConfig {
  id: string
  name: string
  type: 'list' | 'rss' | 'link' | 'clock' | 'water-counter'
  dataSource: {
    type: 'url' | 'rss' | 'notion'
    source: string
    options?: {
      headers?: Record<string, string>
      apiKey?: string
    }
  }
  fieldMapping: {
    title?: string
    content?: string
    link?: string
    date?: string
    id?: string
  }
  size: {
    width: 1 | 2 | 4
    height: 1 | 2 | 4
  }
}

export default function WidgetConfigForm({ 
  onSave, 
  initialConfig 
}: { 
  onSave: (config: WidgetConfig) => void
  initialConfig?: WidgetConfig 
}) {
  const [config, setConfig] = useState<WidgetConfig>(
    initialConfig || {
      id: '',
      name: '',
      type: 'list',
      dataSource: {
        type: 'url',
        source: '',
      },
      fieldMapping: {},
      size: { width: 2, height: 2 }
    }
  )

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const updateDataSource = (updates: Partial<WidgetConfig['dataSource']>) => {
    setConfig(prev => ({
      ...prev,
      dataSource: { ...prev.dataSource, ...updates }
    }))
  }

  const updateFieldMapping = (updates: Partial<WidgetConfig['fieldMapping']>) => {
    setConfig(prev => ({
      ...prev,
      fieldMapping: { ...prev.fieldMapping, ...updates }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!config.name || !config.dataSource.source) {
      alert('请填写组件名称和数据源')
      return
    }
    onSave({
      ...config,
      id: config.id || `widget-${Date.now()}`
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基础配置 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">基础配置</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">组件名称</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => updateConfig({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="输入组件名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">组件类型</label>
            <select
              value={config.type}
              onChange={(e) => updateConfig({ type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="list">列表组件</option>
              <option value="rss">RSS 组件</option>
              <option value="link">链接组件</option>
              <option value="clock">时钟组件</option>
              <option value="water-counter">计数器组件</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">宽度</label>
              <select
                value={config.size.width}
                onChange={(e) => updateConfig({ 
                  size: { ...config.size, width: Number(e.target.value) as any }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="1">1 格</option>
                <option value="2">2 格</option>
                <option value="4">4 格</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">高度</label>
              <select
                value={config.size.height}
                onChange={(e) => updateConfig({ 
                  size: { ...config.size, height: Number(e.target.value) as any }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="1">1 格</option>
                <option value="2">2 格</option>
                <option value="4">4 格</option>
              </select>
            </div>
          </div>
        </div>

        {/* 数据源配置 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">数据源配置</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">数据源类型</label>
            <select
              value={config.dataSource.type}
              onChange={(e) => updateDataSource({ type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="url">URL (JSON API)</option>
              <option value="rss">RSS 订阅</option>
              <option value="notion">Notion 数据库</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {config.dataSource.type === 'url' && 'API URL'}
              {config.dataSource.type === 'rss' && 'RSS URL'}
              {config.dataSource.type === 'notion' && 'Notion 数据库 ID'}
            </label>
            <input
              type="text"
              value={config.dataSource.source}
              onChange={(e) => updateDataSource({ source: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={
                config.dataSource.type === 'url' ? 'https://api.example.com/data' :
                config.dataSource.type === 'rss' ? 'https://example.com/feed.xml' :
                'notion-database-id'
              }
              required
            />
          </div>

          {config.dataSource.type === 'notion' && (
            <div>
              <label className="block text-sm font-medium mb-2">Notion API Token</label>
              <input
                type="password"
                value={config.dataSource.options?.apiKey || ''}
                onChange={(e) => updateDataSource({ 
                  options: { ...config.dataSource.options, apiKey: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="notion-api-token"
              />
            </div>
          )}

          {config.dataSource.type === 'url' && (
            <div>
              <label className="block text-sm font-medium mb-2">请求头 (可选)</label>
              <textarea
                value={JSON.stringify(config.dataSource.options?.headers || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value)
                    updateDataSource({ 
                      options: { ...config.dataSource.options, headers }
                    })
                  } catch {
                    // 忽略 JSON 解析错误，等用户输入完整
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
                placeholder='{"Authorization": "Bearer token"}'
              />
            </div>
          )}
        </div>

        {/* 字段映射配置 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">数据字段映射</h3>
          <p className="text-sm text-gray-600">
            配置数据源字段与组件显示字段的映射关系
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">标题字段</label>
              <input
                type="text"
                value={config.fieldMapping.title || ''}
                onChange={(e) => updateFieldMapping({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">内容字段</label>
              <input
                type="text"
                value={config.fieldMapping.content || ''}
                onChange={(e) => updateFieldMapping({ content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="content"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">链接字段</label>
              <input
                type="text"
                value={config.fieldMapping.link || ''}
                onChange={(e) => updateFieldMapping({ link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="link"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">日期字段</label>
              <input
                type="text"
                value={config.fieldMapping.date || ''}
                onChange={(e) => updateFieldMapping({ date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ID 字段</label>
              <input
                type="text"
                value={config.fieldMapping.id || ''}
                onChange={(e) => updateFieldMapping({ id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="id"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit" className="flex-1">
            保存配置
          </Button>
          <Button type="button" variant="outline" className="flex-1">
            预览
          </Button>
        </div>
      </form>
    </div>
  )
}