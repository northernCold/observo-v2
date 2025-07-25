import { WidgetConfig } from '@/components/widget-config-form'
import { cookies } from 'next/headers'

export class ServerWidgetConfigService {
  private static COOKIE_KEY = 'widget-configs'

  // 从 cookies 加载配置（服务端）
  static async loadConfigs(): Promise<WidgetConfig[]> {
    try {
      const cookieStore = await cookies()
      const saved = cookieStore.get(this.COOKIE_KEY)
      return saved?.value ? JSON.parse(saved.value) : []
    } catch (error) {
      console.error('Failed to load widget configs from cookies:', error)
      return []
    }
  }

  // 获取默认示例配置
  static getDefaultConfigs(): WidgetConfig[] {
    return [
      {
        id: 'demo-clock',
        name: '时钟组件',
        type: 'clock',
        dataSource: { type: 'url', source: '' },
        fieldMapping: {},
        size: { width: 2, height: 2 }
      },
      {
        id: 'demo-list',
        name: '列表组件',
        type: 'list',
        dataSource: { type: 'url', source: 'https://jsonplaceholder.typicode.com/posts' },
        fieldMapping: { title: 'title', content: 'body', id: 'id' },
        size: { width: 4, height: 2 }
      },
      {
        id: 'demo-water',
        name: '饮水计数器',
        type: 'water-counter',
        dataSource: { type: 'url', source: '' },
        fieldMapping: {},
        size: { width: 2, height: 2 }
      }
    ]
  }
}