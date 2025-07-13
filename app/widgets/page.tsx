import { ListBasicDemo } from '@/components/widget/list.demo'
import { ScrollDemo } from '@/components/widget/scroll.demo'
import { ContainerDemo } from '@/components/widget/container.demo'

const demoComponents = [
  {
    name: 'List Basic Demo',
    description: 'Basic list component demonstration',
    component: <ListBasicDemo />
  },
  {
    name: 'Scroll Demo',
    description: 'Scroll widget with List component combinations',
    component: <ScrollDemo />
  },
  {
    name: 'Container Demo',
    description: 'Layout container for organizing widgets',
    component: <ContainerDemo />
  },
  
  // Add more demo components here
]

export default function () {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center sm:text-left">Widget Demos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {demoComponents.map((demo, index) => (
            <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{demo.name}</h2>
              <p className="text-gray-600 mb-4">{demo.description}</p>
              <div className="border-t pt-4">
                {demo.component}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
