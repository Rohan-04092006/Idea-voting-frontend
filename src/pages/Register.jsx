import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]     = useState({ username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (form.username.trim().length < 3) e.username = 'Minimum 3 characters'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setLoading(true)
    try {
      await register(form.username, form.email, form.password)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed'
      setErrors({ global: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="card form-card">
          <h1 className="form-title">Create account</h1>
          <p className="form-subtitle">Join the community and start voting</p>

          {errors.global && <div className="alert alert-error">{errors.global}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" placeholder="coolname123" value={form.username} onChange={set('username')} />
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} />
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p className="form-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
