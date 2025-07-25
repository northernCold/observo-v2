import type { DataModel, DataSourceAdapter } from './types'
import type { DataSourceConfig } from './factory'
import { DataSourceFactory } from './factory'

// 同步数据服务类
export class DataSourceService {
  currentAdapter: DataSourceAdapter | null = null
  data: DataModel = { dataType: 'custom', data: [] }

  static async fetch(config: DataSourceConfig) {
    debugger;
    const adapter = DataSourceFactory.createAdapter(config)
    const data = await adapter.fetchData()

    return data
  }
}
