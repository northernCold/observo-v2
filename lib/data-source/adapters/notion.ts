import type { DataSourceAdapter, DataModel } from '../types'
import { Client } from '@notionhq/client'

export class NotionAdapter implements DataSourceAdapter {
  private notion: Client
  private databaseId: string
  constructor({ apiKey, databaseId }: Record<string, string>) {
    this.notion = new Client({ auth: apiKey })
    this.databaseId = databaseId
  }

  async fetchData(): Promise<DataModel> {
    const response = await this.notion.databases.query({
      database_id: this.databaseId
    })

    console.log(response);
   return {
    dataType: 'notion',
    items: [],
   };
  }
}
