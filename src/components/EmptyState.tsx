import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

export function EmptyState({
  icon: IconComponent,
  title,
  body,
  action,
}: {
  icon: Icon
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="panel flex flex-col items-start gap-3 p-10">
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-sunken text-ink-faint">
        <IconComponent size={20} weight="regular" />
      </div>
      <div>
        <p className="text-lg font-medium text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink-soft">{body}</p>
      </div>
      {action}
    </div>
  )
}
