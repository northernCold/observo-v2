import { calculateGridStyles, type GridItem, type GridConfig } from '@/lib/grid-layout-utils'

const items: GridItem[] = [
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

const gridConfig: GridConfig = {
  unitSize: 58,
  unitGap: 20,
  gridCols: 8,
  maxRows: 20
}

function renderer() {
  const styles = calculateGridStyles(items, gridConfig)

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
