const items = [
  {
    sizeX: 2,
    sizeY: 3
  },
  {
    sizeX: 2,
    sizeY: 2
  },
  {
    sizeX: 4,
    sizeY: 2
  },
  {
    sizeX: 4,
    sizeY: 2
  },
  {
    sizeX: 2,
    sizeY: 2
  },
  {
    sizeX: 2,
    sizeY: 2
  },
  {
    sizeX: 2,
    sizeY: 1
  },
  {
    sizeX: 2,
    sizeY: 1
  },
  {
    sizeX: 2,
    sizeY: 1
  }
]

const UNIT_SIZE = 58

const UNIT_GAP = 20
const GRID_COLS = 8
function renderer() {
  const styles = items.reduce((acc: Array<{
    width: number;
    height: number;
    transformX: number;
    transformY: number;
    gridX: number;
    gridY: number;
  }>, item) => {
    const { sizeX, sizeY } = item
    const width = sizeX * UNIT_SIZE + (sizeX - 1) * UNIT_GAP
    const height = sizeY * UNIT_SIZE + (sizeY - 1) * UNIT_GAP

    // 创建网格占用状态矩阵
    const gridOccupied = Array(20)
      .fill(null)
      .map(() => Array(GRID_COLS).fill(false))

    // 标记之前项目占用的位置
    acc.forEach((prevItem, prevIndex) => {
      const prevSizeX = items[prevIndex].sizeX
      const prevSizeY = items[prevIndex].sizeY
      for (let y = prevItem.gridY; y < prevItem.gridY + prevSizeY; y++) {
        for (let x = prevItem.gridX; x < prevItem.gridX + prevSizeX; x++) {
          if (gridOccupied[y]) {
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
      for (let x = 0; x <= GRID_COLS - sizeX && !found; x++) {
        // 检查这个位置是否可以放置当前项目
        let canPlace = true
        for (let dy = 0; dy < sizeY && canPlace; dy++) {
          for (let dx = 0; dx < sizeX && canPlace; dx++) {
            if (gridOccupied[y + dy] && gridOccupied[y + dy][x + dx]) {
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

    const transformX = currentX * (UNIT_SIZE + UNIT_GAP)
    const transformY = currentY * (UNIT_SIZE + UNIT_GAP)

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

  console.log('styles', styles)

  return (
    <div>
      {styles.map(({ width, height, transformX, transformY }, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            willChange: 'transform',
            width: width,
            height: height,
            transform: `translate(${transformX}px, ${transformY}px)`,
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}></div>
      ))}
    </div>
  )
}

export default renderer
