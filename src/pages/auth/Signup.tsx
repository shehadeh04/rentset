import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { EnvelopeSimple, WarningCircle } from '@phosphor-icons/react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { useAuth } from '@/lib/auth-context'
import { supabaseConfigured } from '@/lib/supabase'

const schema = z.object({
  fullName: z.string().min(1, 'Enter your name'),
  email: z.string().min(1, 'Enter your email').email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export default function Signup() {
  const { signUp } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setFormError(null)
    setSubmitting(true)
    const { error } = await signUp(values.email, values.password, values.fullName)
    setSubmitting(false)
    if (error) {
      setFormError(error)
      return
    }
    setAwaitingConfirmation(true)
  }

  if (awaitingConfirmation) {
    return (
      <AuthLayout>
        <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-positive-50 text-positive-700">
          <EnvelopeSimple size={20} weight="light" />
        </div>
        <h1 className="mt-4 text-3xl font-medium tracking-tight text-ink">Check your email</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          We sent a confirmation link to finish setting up your account. Once you confirm, come back and log in.
        </p>
        <Link to="/login" className="btn-primary mt-6 w-full">
          Go to log in
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-medium tracking-tight text-ink">Create your account</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Free to start, no credit card required.
      </p>

      {!supabaseConfigured && (
        <p className="mt-4 rounded-sm bg-caution-50 px-3 py-2.5 text-sm text-caution-700">
          Accounts are not connected yet. This form will work once the database is wired up.
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="field-label" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            className="field-input"
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="field-error">
              <WarningCircle size={14} weight="fill" /> {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="field-input"
            {...register('email')}
          />
          {errors.email && (
            <p className="field-error">
              <WarningCircle size={14} weight="fill" /> {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="field-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="field-input"
            {...register('password')}
          />
          {errors.password && (
            <p className="field-error">
              <WarningCircle size={14} weight="fill" /> {errors.password.message}
            </p>
          )}
        </div>

        {formError && (
          <p className="flex items-center gap-1.5 rounded-sm bg-critical-50 px-3 py-2.5 text-sm text-critical-700">
            <WarningCircle size={15} weight="fill" className="shrink-0" /> {formError}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-positive-600 hover:text-ink">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
