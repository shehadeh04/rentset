import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { WarningCircle } from '@phosphor-icons/react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { useAuth } from '@/lib/auth-context'
import { supabaseConfigured } from '@/lib/supabase'

const schema = z.object({
  email: z.string().min(1, 'Enter your email').email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
})

type FormValues = z.infer<typeof schema>

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setFormError(null)
    setSubmitting(true)
    const { error } = await signIn(values.email, values.password)
    setSubmitting(false)
    if (error) {
      setFormError(error)
      return
    }
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/app'
    navigate(from, { replace: true })
  }

  return (
    <AuthLayout title="Log in" intro="Welcome back.">
      {!supabaseConfigured && (
        <p className="mt-4 rounded-sm bg-caution-50 px-3 py-2.5 text-sm text-caution-700">
          Accounts are not connected yet. This form will work once the database is wired up.
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
            autoComplete="current-password"
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
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Do not have an account?{' '}
        <Link to="/signup" className="font-semibold text-positive-600 hover:text-ink">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
