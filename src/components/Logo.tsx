export function LogoMark({ size = 40, light = false }: { size?: number; light?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center ${light ? 'bg-white text-ink' : 'bg-ink text-white'}`}
      style={{ width: size, height: size }}
    >
      <span
        className="text-center font-medium uppercase leading-[0.95] tracking-tight2"
        style={{ fontSize: size * 0.3 }}
      >
        Rent
        <br />
        Set
      </span>
    </span>
  )
}

export function Logo({
  className = '',
  light = false,
  size = 40,
}: {
  className?: string
  light?: boolean
  size?: number
  /** Kept for callers that still pass it; the mark is always stacked now. */
  stacked?: boolean
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <LogoMark light={light} size={size} />
    </span>
  )
}
