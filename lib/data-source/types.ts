export interface DataModel {
  dataType: 'notion' | 'rss' | 'url' | 'custom'
  items: Record<string, unknown>[]
}

export interface DataSourceAdapter {
  fetchData(): Promise<DataModel>
}
