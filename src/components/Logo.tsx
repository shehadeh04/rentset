export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-lg font-medium text-ink ${className}`}>
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#152F22" />
        <path d="M9 22V13.4L16 8l7 5.4V22h-4.6v-5.6a2.4 2.4 0 0 0-4.8 0V22H9Z" fill="#F2F8F4" />
      </svg>
      RentSet
    </span>
  )
}
