"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ScrollProps {
  children: ReactNode
  direction?: 'horizontal' | 'vertical'
  className?: string
  showScrollbar?: boolean
}

function Scroll(props: ScrollProps) {
  const {
    children,
    direction = 'horizontal',
    className,
    showScrollbar = false
  } = props

  return (
    <ScrollArea 
      className={cn(
        "h-full w-full",
        !showScrollbar && "[&>[data-slot=scroll-area-scrollbar]]:hidden",
        className
      )}
    >
      <div
        className={cn(
          direction === 'horizontal' 
            ? "flex items-center space-x-4 whitespace-nowrap" 
            : "flex flex-col space-y-2"
        )}
      >
        {children}
      </div>
    </ScrollArea>
  )
}
export { Scroll }
export type { ScrollProps }
