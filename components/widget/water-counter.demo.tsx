
import { WaterCounter } from './water-counter'

export function WaterCounterBasicDemo() {
  return (
    <div className="w-[280px] h-[320px] border rounded-lg">
      <WaterCounter
        title="每日饮水目标"
        dailyGoal={2000}
        cupSize={200}
      />
    </div>
  )
}