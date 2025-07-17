export interface DataModel {
  dataType: 'notion' | 'rss' | 'custom'
  data: Record<string, unknown>[]
}

export interface DataSourceAdapter {
  fetchData(): Promise<DataModel>
}
