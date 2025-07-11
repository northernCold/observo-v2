import type { WidgetLayout } from '@/types/widget'

interface LinkProps extends WidgetLayout {
  logo: string
  url: string
}

function Link(props: LinkProps) {
  const { logo, title, height, width, url } = props

  return (
    <a target="_blank" href={url} title={title}>
      <img src={logo} height={height} width={width} alt={title} />
    </a>
  )
}

export { Link }
