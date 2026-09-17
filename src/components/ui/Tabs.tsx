interface TabsProps<T extends string> {
  tabs: { id: T; label: string; count?: number }[]
  active: T
  onChange: (id: T) => void
}

export function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div role="tablist" className="flex gap-6 overflow-x-auto border-b border-line">
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 pb-2.5 pt-1 text-[13px] font-medium transition-colors ${
              isActive ? 'border-ink text-ink' : 'border-transparent text-ink-faint hover:text-ink-soft'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`rounded-sm px-1.5 py-0.5 text-[11px] tabular-nums ${
                  isActive ? 'bg-ink text-white' : 'bg-sunken text-ink-faint'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
