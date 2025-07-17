import { Client } from '@notionhq/client'
import { DataSourceAdapter, DataModel } from './DataSourceAdapter'

export class NotionApiAdapter implements DataSourceAdapter {
  private notion: Client

  constructor(private databaseId: string, private apiKey: string) {
    this.notion = new Client({ auth: apiKey })
  }

  async fetchData(): Promise<DataModel[]> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId
      })

      return response.results.map((item: any) => ({
        id: item.id,
        title: item.properties.Title.title[0]?.plain_text || 'Untitled',
        content: item.properties.Content?.rich_text[0]?.plain_text || '',
        createdAt: item.created_time ? new Date(item.created_time) : new Date()
      }))
    } catch (error) {
      console.error('Failed to fetch data from Notion:', error)
      return []
    }
  }
}
