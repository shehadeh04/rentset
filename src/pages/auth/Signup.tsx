import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Logo } from '@/components/Logo'
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-12">
        <Link to="/" className="mb-8">
          <Logo />
        </Link>
        <div className="card w-full max-w-sm p-8 text-center">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink">Check your email</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            We sent a confirmation link to finish setting up your account. Once
            you confirm, come back and log in.
          </p>
          <Link to="/login" className="btn-primary mt-6 w-full">
            Go to log in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-12">
      <Link to="/" className="mb-8">
        <Logo />
      </Link>
      <div className="card w-full max-w-sm p-8">
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Free to start, no credit card required. Set up your first property in a couple of minutes.
        </p>

        {!supabaseConfigured && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Accounts aren’t connected yet — this form will work once the database is wired up.
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
            {errors.fullName && <p className="field-error">{errors.fullName.message}</p>}
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
            {errors.email && <p className="field-error">{errors.email.message}</p>}
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
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
