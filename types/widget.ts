export interface Widget {
  title: string
  sizeX: 1 | 2 | 4 | 'full'
  sizeY: 1 | 2 | 4
  dataSource: string
}

export interface WidgetLayout extends Omit<Widget, 'sizeX' | 'sizeY'> {
  width: number
  height: number
  transformX?: string
  transformY?: string
  gridX?: number
  gridY?: number
}

export interface LinkWidget extends WidgetLayout {
  logo: string
}

export type Feed = {
  title: string
  link: string
  content: string
  contentSnippet: string
  guid: string
}

export interface rssWidget extends WidgetLayout {
  feeds: Feed[]
}
