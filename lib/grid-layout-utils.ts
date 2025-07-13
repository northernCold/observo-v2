/**
 * 网格布局计算工具函数
 * 用于计算 widget 在网格中的位置和尺寸
 */

export interface GridItem {
  sizeX: number
  sizeY: number
}

export interface GridStyle {
  width: number
  height: number
  transformX: number
  transformY: number
  gridX: number
  gridY: number
}

export interface GridConfig {
  unitSize: number
  unitGap: number
  gridCols: number
  maxRows?: number
}

/**
 * 计算网格项目的布局样式
 * @param items 网格项目数组
 * @param config 网格配置
 * @returns 计算后的样式数组
 */
export function calculateGridStyles(
  items: GridItem[],
  config: GridConfig
): GridStyle[] {
  const { unitSize, unitGap, gridCols, maxRows = 20 } = config

  const styles = items.reduce((acc: GridStyle[], item, currentIndex) => {
    const { sizeX, sizeY } = item
    const width = sizeX * unitSize + (sizeX - 1) * unitGap
    const height = sizeY * unitSize + (sizeY - 1) * unitGap

    // 创建网格占用状态矩阵
    const gridOccupied = Array(maxRows)
      .fill(null)
      .map(() => Array(gridCols).fill(false))

    // 标记之前项目占用的位置
    acc.forEach((prevItem, prevIndex) => {
      const prevSizeX = items[prevIndex].sizeX
      const prevSizeY = items[prevIndex].sizeY
      for (let y = prevItem.gridY; y < prevItem.gridY + prevSizeY; y++) {
        for (let x = prevItem.gridX; x < prevItem.gridX + prevSizeX; x++) {
          if (gridOccupied[y] && x < gridCols) {
            gridOccupied[y][x] = true
          }
        }
      }
    })

    // 找到第一个可以放置当前项目的位置
    let currentX = 0
    let currentY = 0
    let found = false

    for (let y = 0; y < gridOccupied.length && !found; y++) {
      for (let x = 0; x <= gridCols - sizeX && !found; x++) {
        // 检查这个位置是否可以放置当前项目
        let canPlace = true
        for (let dy = 0; dy < sizeY && canPlace; dy++) {
          for (let dx = 0; dx < sizeX && canPlace; dx++) {
            const checkY = y + dy
            const checkX = x + dx
            if (
              checkY >= maxRows || 
              checkX >= gridCols ||
              (gridOccupied[checkY] && gridOccupied[checkY][checkX])
            ) {
              canPlace = false
            }
          }
        }

        if (canPlace) {
          currentX = x
          currentY = y
          found = true
        }
      }
    }

    const transformX = currentX * (unitSize + unitGap)
    const transformY = currentY * (unitSize + unitGap)

    acc.push({
      width,
      height,
      transformX,
      transformY,
      gridX: currentX,
      gridY: currentY
    })

    return acc
  }, [])

  return styles
}

/**
 * 预设的网格配置
 */
export const GRID_PRESETS = {
  // 默认配置
  default: {
    unitSize: 58,
    unitGap: 20,
    gridCols: 8,
    maxRows: 20
  },
  // 紧凑配置
  compact: {
    unitSize: 48,
    unitGap: 12,
    gridCols: 10,
    maxRows: 25
  },
  // 宽松配置
  spacious: {
    unitSize: 68,
    unitGap: 28,
    gridCols: 6,
    maxRows: 15
  },
  // 移动端配置
  mobile: {
    unitSize: 42,
    unitGap: 8,
    gridCols: 4,
    maxRows: 30
  }
} as const

/**
 * 使用预设配置计算网格样式
 * @param items 网格项目数组
 * @param preset 预设名称
 * @returns 计算后的样式数组
 */
export function calculateGridStylesWithPreset(
  items: GridItem[],
  preset: keyof typeof GRID_PRESETS = 'default'
): GridStyle[] {
  return calculateGridStyles(items, GRID_PRESETS[preset])
}
