import { List } from './list'

export function ListBasicDemo() {
  return (
    <div className="w-[360px] h-[240px] border rounded-lg">
      <List
        dataSource="https://jsonplaceholder.typicode.com/posts"
        title="示例列表"
      />
    </div>
  )
}
