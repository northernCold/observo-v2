import { DataServiceProvider } from '@/lib/data-source/service'

export default function () {
  const [dataService] = useState(() => {
    const rss = new RssAdapter('https://example.com/rss-feed-url')
    return new DateService(rss)
  })

  return <DataServiceProvider dataService={}></DataServiceProvider>
}
