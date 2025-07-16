import { Clock } from './clock'
import { ResizableContainer } from './resizable-container'

export function ClockBasicDemo() {
  return (
    <div className="w-[360px] h-[240px] border rounded-lg">
      <Clock
        title="北京时间"
        format="24h"
        showDate={true}
        timezone="Asia/Shanghai"
        width={360}
        height={240}
        dataSource={{ type: 'custom', url: '', refreshInterval: 60 }}
      />
    </div>
  )
}

export function ResizableDemo() {
  return (
    <ResizableContainer 
      background="glass" 
      shadow="medium" 
      padding="comfortable"
      initialWidth={300}
      initialHeight={200}
      minWidth={200}
      minHeight={150}
    >
      <Clock
        title="北京时间"
        format="24h"
        showDate={true}
        timezone="Asia/Shanghai"
        width={300}
        height={200}
        dataSource={{ type: 'custom', url: '', refreshInterval: 60 }}
      />
    </ResizableContainer>
  )
}
