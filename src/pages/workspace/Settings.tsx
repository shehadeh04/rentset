import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, SignOut } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Skeleton } from '@/components/Skeleton'

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
      <h1 className="text-3xl font-medium tracking-tight text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink-soft">Your profile and account details.</p>

      {isLoading ? (
        <div className="panel mt-8 space-y-4 p-6">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-32" />
        </div>
      ) : (
        <form
          className="panel mt-8 space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate()
          }}
        >
          <div>
            <label className="field-label">Full name</label>
            <input className="field-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
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
            <input className="field-input" value={user?.email ?? ''} disabled />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save changes'}
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-sm font-medium text-positive-600">
                <Check size={15} weight="bold" /> Saved
              </span>
            )}
          </div>
        </form>
      )}

      <div className="panel mt-6 flex flex-wrap items-center justify-between gap-3 p-6">
        <div>
          <p className="font-medium text-ink">Log out</p>
          <p className="text-sm text-ink-soft">End your session on this device.</p>
        </div>
        <button className="btn-secondary" onClick={() => signOut()}>
          <SignOut size={16} weight="bold" />
          Log out
        </button>
      </div>
    </div>
  )
}
