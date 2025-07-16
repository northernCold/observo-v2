import { WaterCounter } from './water-counter'
import { ResizableContainer } from './resizable-container'

export function WaterCounterBasicDemo() {
  return (
    <div className="w-[280px] h-[320px] border rounded-lg">
      <WaterCounter
        title="每日饮水目标"
        dailyGoal={2000}
        cupSize={200}
        width={280}
        height={320}
        dataSource={{ type: 'custom', url: '', refreshInterval: 60 }}
      />
    </div>
  )
}

export function ResizableDemo() {
  return (
    <ResizableContainer 
      background="accent" 
      shadow="soft" 
      padding="comfortable"
      initialWidth={320}
      initialHeight={360}
      minWidth={250}
      minHeight={300}
    >
      <WaterCounter
        title="每日饮水目标"
        dailyGoal={2000}
        cupSize={200}
        width={320}
        height={360}
        dataSource={{ type: 'custom', url: '', refreshInterval: 60 }}
      />
    </ResizableContainer>
  )
}