'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DashboardToolbarProps {
  widgetCount: number
  isDefault: boolean
}

export function DashboardToolbar({ widgetCount, isDefault }: DashboardToolbarProps) {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Observo Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            {isDefault 
              ? '展示示例组件效果' 
              : `显示 ${widgetCount} 个已配置的组件`}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/widgets">
            <Button variant="outline">
              管理组件
            </Button>
          </Link>
          <Button onClick={handleRefresh}>
            刷新数据
          </Button>
        </div>
      </div>
    </div>
  )
}