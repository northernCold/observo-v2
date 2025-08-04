'use client'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { WidgetConfig } from '@/components/widget-config-form'
import { ReactNode } from 'react'

interface WidgetContextMenuProps {
  children: ReactNode
  widget?: WidgetConfig
  onEdit?: (widget: WidgetConfig) => void
  onDelete?: (widget: WidgetConfig) => void
  onDuplicate?: (widget: WidgetConfig) => void
  onAdd?: () => void
  onQuickAdd?: (type: string) => void
}

export function WidgetContextMenu({
  children,
  widget,
  onEdit,
  onDelete,
  onDuplicate,
  onAdd,
  onQuickAdd
}: WidgetContextMenuProps) {
  const handleEdit = () => {
    if (widget && onEdit) {
      onEdit(widget)
    }
  }

  const handleDelete = () => {
    if (widget && onDelete) {
      if (confirm(`确定要删除 "${widget.name}" 吗？`)) {
        onDelete(widget)
      }
    }
  }

  const handleDuplicate = () => {
    if (widget && onDuplicate) {
      onDuplicate(widget)
    }
  }

  const handleAdd = () => {
    if (onAdd) {
      onAdd()
    }
  }

  const handleQuickAdd = (type: string) => {
    if (onQuickAdd) {
      onQuickAdd(type)
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-64">
        {widget ? (
          // Widget 存在时的菜单项
          <>
            <ContextMenuItem onClick={handleEdit}>
              编辑组件
            </ContextMenuItem>
            
            <ContextMenuItem onClick={handleDuplicate}>
              复制组件
            </ContextMenuItem>
            
            <ContextMenuSeparator />
            
            <ContextMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
              删除组件
            </ContextMenuItem>
          </>
        ) : (
          // 空白区域时的菜单项
          <>
            <ContextMenuItem onClick={handleAdd}>
              新增组件
            </ContextMenuItem>
            
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                快捷添加
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem onClick={() => handleQuickAdd('clock')}>
                  时钟组件
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleQuickAdd('list')}>
                  列表组件
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleQuickAdd('rss')}>
                  RSS组件
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleQuickAdd('water-counter')}>
                  饮水计数器
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleQuickAdd('link')}>
                  链接组件
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleQuickAdd('tabs')}>
                  标签页组件
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}