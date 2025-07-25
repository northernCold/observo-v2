import { DataSourceService } from '@/lib/data-source/service'

// export default async function () {
//   const data = await DataSourceService.fetch({
//     type: 'rss',
//     source: 'https://cprss.s3.amazonaws.com/javascriptweekly.com.xml'
//   })
//   return (
//     <div>
//       {data.items.map((item, index) => (
//         <div>{item.title}</div>
//       ))}
//     </div>
//   )
// }

export default async function DataSourcePage() {
  const data = await DataSourceService.fetch({
    type: 'notion',
    source: '13352a64313b45b78c73df7ce12707ae',
    options: {
      // apiKey: ''
    }
  })

  return (
    <div>
      {data.items.map((item, index) => (
        <div key={index}>{item.title}</div>
      ))}
    </div>
  )
}
