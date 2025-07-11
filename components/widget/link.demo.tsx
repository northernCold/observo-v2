import { ProcessedLinkWrapper } from './processed-widget-wrapper'
import { Link } from './link'

export function LinkDemo() {
  return (
    <div className="w-[120px] h-[40px] border rounded-lg">
      <ProcessedLinkWrapper dataSource="https://example.com">
        {(url) => (
          <Link
            logo="https://via.placeholder.com/120x40/007bff/ffffff?text=Example"
            title="Example Link"
            url={url}
            width={120}
            height={40}
            dataSource={{ type: 'custom', url: '', refreshInterval: 60 }}
          />
        )}
      </ProcessedLinkWrapper>
    </div>
  )
}
