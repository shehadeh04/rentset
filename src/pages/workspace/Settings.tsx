import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SignOut, User, IdentificationCard, ShieldCheck } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Skeleton } from '@/components/Skeleton'
import { useToast } from '@/components/ui/Toast'

interface ProfileRow {
  full_name: string
  company_name: string
  phone: string
}

type Section = 'profile' | 'account' | 'session'

const sections: { id: Section; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: IdentificationCard },
  { id: 'session', label: 'Security', icon: ShieldCheck },
]

export default function Settings() {
  const { user, signOut } = useAuth()
  const qc = useQueryClient()
  const toast = useToast()
  const [section, setSection] = useState<Section>('profile')

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user!.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, company_name, phone')
        .eq('id', user!.id)
        .single()
      if (error) throw error
      return data as ProfileRow
    },
  })

  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name)
      setCompanyName(profile.company_name)
      setPhone(profile.phone)
    }
  }, [profile])

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, company_name: companyName, phone })
        .eq('id', user!.id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile', user!.id] })
      toast('Profile saved')
    },
    onError: () => toast('Could not save your profile', 'error'),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="ws-title">Settings</h1>
        <p className="mt-1 text-[13px] text-ink-soft">Your profile, account and session.</p>
      </div>

      <div className="grid items-start gap-8 md:grid-cols-[180px_1fr]">
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {sections.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded px-3 py-2 text-left text-[13px] transition-colors ${
                section === item.id ? 'bg-ink font-medium text-white' : 'text-ink-soft hover:bg-sunken hover:text-ink'
              }`}
            >
              <item.icon size={15} weight={section === item.id ? 'fill' : 'regular'} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 max-w-xl">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-32" />
            </div>
          ) : section === 'profile' ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                mutation.mutate()
              }}
            >
              <div>
                <h2 className="ws-section">Profile</h2>
                <p className="ws-meta mt-0.5">How you appear inside RentSet.</p>
              </div>
              <div>
                <label className="input-label">Full name</label>
                <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <label className="input-label">Company</label>
                <input className="input" placeholder="Optional" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div>
                <label className="input-label">Phone</label>
                <input className="input" placeholder="Optional" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary btn-sm" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          ) : section === 'account' ? (
            <div className="space-y-4">
              <div>
                <h2 className="ws-section">Account</h2>
                <p className="ws-meta mt-0.5">The email you sign in with.</p>
              </div>
              <div>
                <label className="input-label">Email</label>
                <input className="input" value={user?.email ?? ''} disabled />
              </div>
              <dl className="divide-y divide-line border-y border-line">
                <div className="flex items-center justify-between py-3">
                  <dt className="text-[13px] text-ink-soft">Plan</dt>
                  <dd className="text-[13px] font-medium text-ink">Free</dd>
                </div>
                <div className="flex items-center justify-between py-3">
                  <dt className="text-[13px] text-ink-soft">Account created</dt>
                  <dd className="text-[13px] tabular-nums text-ink">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="ws-section">Security</h2>
                <p className="ws-meta mt-0.5">End your session on this device.</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-line bg-surface p-4">
                <div>
                  <p className="text-[13px] font-medium text-ink">Log out</p>
                  <p className="text-[12px] text-ink-faint">You will need your password to sign back in.</p>
                </div>
                <button className="btn-secondary btn-sm" onClick={() => signOut()}>
                  <SignOut size={14} weight="bold" /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
