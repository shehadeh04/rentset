import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface ProfileRow {
  full_name: string
  company_name: string
  phone: string
}

export default function Settings() {
  const { user, signOut } = useAuth()
  const qc = useQueryClient()

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
  const [saved, setSaved] = useState(false)

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
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
  })

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-medium text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink-soft">Your profile and account details.</p>

      {isLoading ? (
        <p className="mt-8 text-sm text-ink-faint">Loading…</p>
      ) : (
        <form
          className="card mt-8 space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate()
          }}
        >
          <div>
            <label className="field-label">Full name</label>
            <input
              className="field-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Company</label>
            <input
              className="field-input"
              placeholder="Optional"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Phone</label>
            <input
              className="field-input"
              placeholder="Optional"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input className="field-input bg-black/[0.02] text-ink-faint" value={user?.email ?? ''} disabled />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save changes'}
            </button>
            {saved && <span className="text-sm text-brand-700">Saved.</span>}
          </div>
        </form>
      )}

      <div className="card mt-6 flex items-center justify-between p-6">
        <div>
          <p className="font-medium text-ink">Log out</p>
          <p className="text-sm text-ink-soft">End your session on this device.</p>
        </div>
        <button className="btn-secondary" onClick={() => signOut()}>
          Log out
        </button>
      </div>
    </div>
  )
}
