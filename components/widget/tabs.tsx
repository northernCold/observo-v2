"use client"

import type { WidgetLayout } from '@/types/widget'
import { useState } from 'react'

interface TabItem {
  id: string
  title: string
  component: React.ReactNode
}

interface TabsProps extends WidgetLayout {
  tabs: TabItem[]
}

function Tabs(props: TabsProps) {
  const { tabs, title = 'Tabs' } = props
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || '')

  if (!tabs || tabs.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-xs">请配置标签页内容</p>
        </div>
      </div>
    )
  }

  const currentTab = tabs.find(tab => tab.id === activeTab)

  return (
    <div className="h-full w-full flex flex-col">
      {/* Tab Headers */}
      <div className="flex-shrink-0 border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-shrink-0 px-3 py-2 text-xs font-medium transition-colors
                ${activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {currentTab?.component || (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-xs">标签页内容为空</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { Tabs }
export type { TabItem, TabsProps }
