"use client"

import { Tabs } from './tabs'
import { ResizableContainer } from './resizable-container'
import { Scroll } from './scroll'
import type { TabItem } from './tabs'

function TabsDemo() {
  const sampleTabs: TabItem[] = [
    {
      id: 'overview',
      title: '概览',
      component: (
        <div className="p-4 h-full">
          <h3 className="text-lg font-semibold mb-4">系统概览</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-2xl font-bold text-blue-600">1,234</div>
              <div className="text-sm text-gray-600">总用户数</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-2xl font-bold text-green-600">89.5%</div>
              <div className="text-sm text-gray-600">系统正常率</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'metrics',
      title: '指标监控',
      component: (
        <div className="p-4 h-full">
          <h3 className="text-lg font-semibold mb-4">性能指标</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">CPU 使用率</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <span className="text-sm">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">内存使用率</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
              <span className="text-sm">67%</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'logs',
      title: '日志',
      component: (
        <div className="p-4 h-full">
          <h3 className="text-lg font-semibold mb-4">系统日志</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">●</span>
              <span className="text-gray-500">2024-01-15 10:30:15</span>
              <span>用户登录成功</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600">●</span>
              <span className="text-gray-500">2024-01-15 10:28:43</span>
              <span>系统警告：内存使用率偏高</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-600">●</span>
              <span className="text-gray-500">2024-01-15 10:25:12</span>
              <span>数据库连接超时</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      title: '设置',
      component: (
        <div className="p-4 h-full">
          <h3 className="text-lg font-semibold mb-4">系统设置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">自动刷新</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">实时通知</span>
              <input type="checkbox" className="toggle" />
            </div>
            <div>
              <label className="block text-sm mb-1">刷新间隔</label>
              <select className="w-full p-2 border border-gray-300 rounded text-sm">
                <option>5 秒</option>
                <option>10 秒</option>
                <option>30 秒</option>
                <option>1 分钟</option>
              </select>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Tabs 组件演示</h2>
      
      {/* 基础演示 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="text-sm font-medium">基础演示</h3>
        </div>
        <div style={{ height: '400px' }}>
          <Tabs 
            tabs={sampleTabs} 
            title="基础演示"
            width={12}
            height={6}
            dataSource={{ type: 'custom', url: '', refreshInterval: 60 }}
          />
        </div>
      </div>

      {/* 空状态演示 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="text-sm font-medium">空状态演示</h3>
        </div>
        <div style={{ height: '200px' }}>
          <Tabs 
            tabs={[]} 
            title="空状态演示"
            width={12}
            height={4}
            dataSource={{ type: 'custom', url: '', refreshInterval: 60 }}
          />
        </div>
      </div>

      {/* 单个标签演示 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="text-sm font-medium">单个标签演示</h3>
        </div>
        <div style={{ height: '200px' }}>
          <Tabs 
            tabs={[sampleTabs[0]]} 
            title="单个标签演示"
            width={12}
            height={4}
            dataSource={{ type: 'custom', url: '', refreshInterval: 60 }}
          />
        </div>
      </div>
    </div>
  )
}
export function ResizableDemo() {
  const sampleTabs: TabItem[] = [
    {
      id: 'overview',
      title: '概览',
      component: (
        <div className="p-4 h-full">
          <h3 className="text-lg font-semibold mb-4">系统概览</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-2xl font-bold text-blue-600">1,234</div>
              <div className="text-sm text-gray-600">总用户数</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-2xl font-bold text-green-600">89.5%</div>
              <div className="text-sm text-gray-600">系统正常率</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'metrics',
      title: '指标监控',
      component: (
        <div className="p-4 h-full">
          <h3 className="text-lg font-semibold mb-4">性能指标</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">CPU 使用率</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <span className="text-sm">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">内存使用率</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
              <span className="text-sm">67%</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'alerts',
      title: '告警信息',
      component: (
        <div className="p-4 h-full">
          <h3 className="text-lg font-semibold mb-4">最新告警</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm">高 CPU 使用率警告</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">磁盘空间不足</span>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <ResizableContainer 
      background="primary" 
      shadow="soft" 
      initialWidth={500}
      initialHeight={350}
      minWidth={400}
      minHeight={280}
    >
      <Scroll>
        <Tabs 
          tabs={sampleTabs} 
          title="可调整大小的标签组件"
          width={500}
          height={350}
          dataSource={{ type: 'custom', url: '', refreshInterval: 60 }}
        />
      </Scroll>
    </ResizableContainer>
  )
}

export { TabsDemo }
