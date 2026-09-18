import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { marketingImages } from '@/lib/images'

export function AuthLayout({ children, title, intro }: { children: ReactNode; title: string; intro?: string }) {
  return (
    <div className="min-h-[100dvh] bg-paper p-3 sm:p-5">
      <div className="grid min-h-[calc(100dvh-1.5rem)] gap-3 sm:min-h-[calc(100dvh-2.5rem)] sm:gap-5 lg:grid-cols-2">
        <div className="flex flex-col justify-between rounded-lg bg-surface p-6 sm:p-10">
          <Link to="/" aria-label="RentSet home">
            <Logo size={46} />
          </Link>

          <div className="py-12">
            <h1 className="display-2">{title}</h1>
            {intro && <p className="lede mt-4 max-w-[36ch] text-ink-soft">{intro}</p>}
            <div className="mt-10 max-w-sm">{children}</div>
          </div>

          <p className="text-[12px] text-ink-faint">&copy; {new Date().getFullYear()} RentSet</p>
        </div>

        <div className="scene relative hidden min-h-[400px] lg:block">
          <img
            src={marketingImages.townscape.src}
            alt={marketingImages.townscape.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <p className="display-3 max-w-[18ch] text-white">Every inspection, repair, clean and listing in one place.</p>
            <p className="mt-5 max-w-[38ch] text-[14px] text-white/70">
              From the day notice is given to the day the next tenant moves in.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
