import { ScrollArea as RScrollArea } from '@radix-ui/themes'

function ScrollArea({ children }: { children: React.ReactNode }) {
  return (
    <RScrollArea scrollbars="vertical" className="h-full w-full [&_.rt-ScrollAreaViewport_>_*]:!w-full">
      {children}
    </RScrollArea>
  )
}

export { ScrollArea }
