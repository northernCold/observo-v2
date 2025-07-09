import { Rss } from './rss'

function RssBasicDemo() {
  return <Rss title="RSS" width={256} height={128} dataSource="http://www.ruanyifeng.com/blog/atom.xml" />
}

export { RssBasicDemo }
