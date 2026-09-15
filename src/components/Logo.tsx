export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-lg font-semibold text-ink ${className}`}>
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="6" fill="#0B0B0C" />
        <path d="M9 22V13.4L16 8l7 5.4V22h-4.6v-5.6a2.4 2.4 0 0 0-4.8 0V22H9Z" fill="#F06B22" />
      </svg>
      RentSet
    </span>
  )
}
