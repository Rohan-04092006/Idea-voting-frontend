import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) { setError('All fields are required'); return }
    setLoading(true); setError('')
    try {
      await login(username, password)
      toast.success(`Welcome back, ${username}!`)
      navigate(from, { replace: true })
    } catch (err) {
      const status = err?.response?.status
      setError(status === 401 ? 'Invalid username or password' : 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="card form-card">
          <h1 className="form-title">Welcome back</h1>
          <p className="form-subtitle">Sign in to vote and share ideas</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p className="form-footer">
            No account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
