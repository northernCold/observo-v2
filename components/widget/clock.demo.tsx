import { Clock } from './clock'

export function ClockBasicDemo() {
  return (
    <div className="w-[360px] h-[240px] border rounded-lg">
      <Clock
        title="北京时间"
        format="24h"
        showDate={true}
        timezone="Asia/Shanghai"
      />
    </div>
  )
}
