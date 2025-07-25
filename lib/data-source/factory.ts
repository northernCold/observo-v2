import type { DataSourceAdapter } from './types';
import { RssAdapter } from './adapters/rss';
import { NotionAdapter } from './adapters/notion';
import { UrlAdapter, UrlAdapterOptions } from './adapters/url';

// 数据源配置接口
export interface DataSourceConfig {
  type: 'rss' | 'notion' | 'url' | 'userInput' | 'csv';
  source: string;
  options?: any;
}

// 数据源选择器
export class DataSourceFactory {
  static createAdapter(config: DataSourceConfig): DataSourceAdapter {
    switch (config.type) {
      case 'rss':
        return new RssAdapter(config.source);
      
      case 'notion':
        return new NotionAdapter(
          {
            databaseId: config.source, // 数据库ID
            apiKey: config.options?.apiKey // API密钥
          }
        );
      
      case 'url':
        return new UrlAdapter(config.source, config.options as UrlAdapterOptions);
      
      // case 'userInput':
      //   return new UserInputAdapter(config.source);
      
      default:
        throw new Error(`Unsupported data source type: ${config.type}`);
    }
  }
}