import type { LinkWidget } from '@/types/widget'

function Link(props: LinkWidget) {
  const { logo, title, height, width, dataSource } = props

  return (
    <a target="_blank" href={dataSource} title={title}>
      <img src={logo} height={height} width={width} alt={title} />
    </a>
  )
}

export { Link }
