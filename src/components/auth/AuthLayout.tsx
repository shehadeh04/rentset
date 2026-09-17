import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { marketingImages } from '@/lib/images'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[100dvh] bg-canvas lg:grid-cols-2">
      <div className="flex flex-col px-6 py-10 sm:px-10 lg:px-16">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-xs text-ink-faint">&copy; {new Date().getFullYear()} RentSet</p>
      </div>

      <div className="relative hidden lg:block">
        <img
          src={marketingImages.townscape.src}
          alt={marketingImages.townscape.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-sm text-2xl font-medium leading-snug text-white">
            Every inspection, repair, clean, and listing in one place.
          </p>
          <p className="mt-3 max-w-sm text-sm text-white/75">
            From the day notice is given to the day the next tenant moves in.
          </p>
        </div>
      </div>
    </div>
  )
}
