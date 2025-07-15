// app/widgets/[widget]/page.jsx
import fs from 'fs'
import path from 'path'

// 注意：App Router 中推荐使用 fetch 或其他数据获取方式
// 这里为了演示，仍然使用 fs 模块（仅适用于服务器组件）
const widgetsDir = path.join(process.cwd(), 'components/widgets')

export default async function WidgetPage({ params }: { params: Promise<{ widget: string }> }) {
  const { widget } = await params

  try {
    console.log(`Loading widget: ${widget}`)
    // 动态导入组件
    const { ListResizableDemo} = (await import(`@/components/widget/${widget}.demo.tsx`))

    console.log(ListResizableDemo)
    return (
      <div className='w-[500px] m-auto p-4'>
        <h1>Widget: {widget}</h1>
        <ListResizableDemo />
      </div>
    )
  } catch (error) {
    return <div>Widget not found</div>
  }
}
