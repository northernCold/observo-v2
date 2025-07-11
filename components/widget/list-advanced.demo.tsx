"use client"

import { useProcessedListData } from './processed-widget-wrapper'
import { List } from './list'
import { withWidgetState, useWidgetStateProps } from '@/components/ui/with-widget-state'

// 使用高阶组件包装的 List 组件
const ListWithState = withWidgetState(List, '暂无列表数据')

export function ListAdvancedDemo() {
  const hookResult = useProcessedListData(
    'https://jsonplaceholder.typicode.com/posts',
    {
      autoRefresh: true,
      refreshInterval: 15,
    }
  )

  const stateProps = useWidgetStateProps(hookResult)

  return (
    <div className="w-[360px] h-[240px] border rounded-lg">
      <ListWithState
        {...stateProps}
        title="高级列表示例"
        items={hookResult.data}
        width={360}
        height={240}
      />
    </div>
  )
}