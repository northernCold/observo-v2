import { ClockBasicDemo } from '@/components/widget/clock.demo'
import { LinkBasicDemo } from '@/components/widget/link.demo'
import { ListBasicDemo } from '@/components/widget/list.demo'
import { RssBasicDemo } from '@/components/widget/rss.demo'
import { TabsDemo } from '@/components/widget/tabs-demo'
import { WaterCounterBasicDemo } from '@/components/widget/water-counter.demo'

export default function () {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <LinkBasicDemo />
        <RssBasicDemo />
        <ListBasicDemo />
        <ClockBasicDemo />
        <WaterCounterBasicDemo />
        <TabsDemo />
      </main>
    </div>
  )
}
