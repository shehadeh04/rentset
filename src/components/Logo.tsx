export function LogoMark({ size = 28, light = false }: { size?: number; light?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0">
      <rect width="32" height="32" rx="5" fill={light ? '#FFFFFF' : '#0C0C0C'} />
      <path d="M8 24V12.8L16 7l8 5.8V24h-5.4v-7.2h-5.2V24H8Z" fill={light ? '#0C0C0C' : '#FFFFFF'} />
      <rect x="14.6" y="18.4" width="2.8" height="5.6" fill={light ? '#0C0C0C' : '#FFFFFF'} />
    </svg>
  )
}

export function Logo({
  className = '',
  light = false,
  stacked = true,
}: {
  className?: string
  light?: boolean
  stacked?: boolean
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark light={light} />
      {stacked ? (
        <span
          className={`font-display text-[13px] font-semibold uppercase leading-[1.05] tracking-[0.02em] ${
            light ? 'text-white' : 'text-ink'
          }`}
        >
          Rent
          <br />
          Set
        </span>
      ) : (
        <span
          className={`font-display text-base font-semibold uppercase tracking-[0.04em] ${
            light ? 'text-white' : 'text-ink'
          }`}
        >
          RentSet
        </span>
      )}
    </span>
  )
}
