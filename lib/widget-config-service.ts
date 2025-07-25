import { WidgetConfig } from '@/components/widget-config-form'
import { DataSourceFactory, DataSourceConfig } from '@/lib/data-source/factory'

export class WidgetConfigService {
  private static STORAGE_KEY = 'widget-configs'

  // 客户端加载配置（从 cookies 或 localStorage）
  static loadConfigs(): WidgetConfig[] {
    if (typeof window === 'undefined') return []
    
    try {
      // 优先从 localStorage 读取
      const localStorage = window.localStorage.getItem(this.STORAGE_KEY)
      if (localStorage) {
        return JSON.parse(localStorage)
      }
      
      // 如果 localStorage 没有，尝试从 cookies 读取
      const cookies = document.cookie
        .split(';')
        .find(row => row.trim().startsWith(`${this.STORAGE_KEY}=`))
      
      if (cookies) {
        const value = cookies.split('=')[1]
        const configs = JSON.parse(decodeURIComponent(value))
        // 同步到 localStorage
        this.saveConfigs(configs)
        return configs
      }
      
      return []
    } catch (error) {
      console.error('Failed to load widget configs:', error)
      return []
    }
  }

  // 保存配置（同时更新 localStorage 和服务端）
  static saveConfigs(configs: WidgetConfig[]): void {
    if (typeof window === 'undefined') return
    
    // 保存到 localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configs))
    
    // 异步同步到服务端
    this.syncToServer(configs).catch(error => {
      console.warn('Failed to sync configs to server:', error)
    })
  }

  // 同步到服务端
  static async syncToServer(configs: WidgetConfig[]): Promise<void> {
    try {
      await fetch('/api/widgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configs),
      })
    } catch (error) {
      console.error('Failed to sync to server:', error)
      throw error
    }
  }

  // 添加配置
  static addConfig(config: WidgetConfig): WidgetConfig[] {
    const configs = this.loadConfigs()
    const newConfigs = [...configs, config]
    this.saveConfigs(newConfigs)
    return newConfigs
  }

  // 更新配置
  static updateConfig(id: string, updates: Partial<WidgetConfig>): WidgetConfig[] {
    const configs = this.loadConfigs()
    const newConfigs = configs.map(config => 
      config.id === id ? { ...config, ...updates } : config
    )
    this.saveConfigs(newConfigs)
    return newConfigs
  }

  // 删除配置
  static deleteConfig(id: string): WidgetConfig[] {
    const configs = this.loadConfigs()
    const newConfigs = configs.filter(config => config.id !== id)
    this.saveConfigs(newConfigs)
    return newConfigs
  }

  // 获取单个配置
  static getConfig(id: string): WidgetConfig | undefined {
    const configs = this.loadConfigs()
    return configs.find(config => config.id === id)
  }

  // 转换为数据源配置
  static toDataSourceConfig(widgetConfig: WidgetConfig): DataSourceConfig {
    return {
      type: widgetConfig.dataSource.type,
      source: widgetConfig.dataSource.source,
      options: widgetConfig.dataSource.options
    }
  }

  // 测试数据源连接
  static async testDataSource(widgetConfig: WidgetConfig): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      const dataSourceConfig = this.toDataSourceConfig(widgetConfig)
      const adapter = DataSourceFactory.createAdapter(dataSourceConfig)
      const result = await adapter.fetchData()
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 应用字段映射
  static applyFieldMapping(data: any[], fieldMapping: WidgetConfig['fieldMapping']): any[] {
    if (!fieldMapping || Object.keys(fieldMapping).length === 0) {
      return data
    }

    return data.map(item => {
      const mappedItem: any = { ...item }

      // 应用字段映射
      if (fieldMapping.title && item[fieldMapping.title]) {
        mappedItem.title = item[fieldMapping.title]
      }
      if (fieldMapping.content && item[fieldMapping.content]) {
        mappedItem.content = item[fieldMapping.content]
      }
      if (fieldMapping.link && item[fieldMapping.link]) {
        mappedItem.link = item[fieldMapping.link]
      }
      if (fieldMapping.date && item[fieldMapping.date]) {
        mappedItem.date = item[fieldMapping.date]
      }
      if (fieldMapping.id && item[fieldMapping.id]) {
        mappedItem.id = item[fieldMapping.id]
      }

      return mappedItem
    })
  }

  // 获取配置的数据并应用字段映射
  static async getConfigData(widgetConfig: WidgetConfig): Promise<any[]> {
    try {
      const dataSourceConfig = this.toDataSourceConfig(widgetConfig)
      const adapter = DataSourceFactory.createAdapter(dataSourceConfig)
      const result = await adapter.fetchData()
      
      // 应用字段映射
      return this.applyFieldMapping(result.items, widgetConfig.fieldMapping)
    } catch (error) {
      console.error('Failed to get config data:', error)
      return []
    }
  }
}