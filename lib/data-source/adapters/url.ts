import type { DataSourceAdapter, DataModel } from '../types'

export interface UrlAdapterOptions {
  headers?: Record<string, string>
  timeout?: number
}

export class UrlAdapter implements DataSourceAdapter {
  constructor(
    private url: string,
    private options: UrlAdapterOptions = {}
  ) {}

  async fetchData(): Promise<DataModel> {
    try {
      const {
        headers = {},
        timeout = 10000
      } = this.options

      // 创建 AbortController 用于超时控制
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(this.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      return {
        dataType: 'url',
        items: Array.isArray(data) ? data : [data]
      }

    } catch (error) {
      console.error('Failed to fetch data from URL:', error)
      return { 
        dataType: 'url', 
        items: [{
          id: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          url: this.url,
          timestamp: new Date().toISOString()
        }]
      }
    }
  }
}