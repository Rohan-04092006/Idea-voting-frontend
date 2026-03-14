import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ideaApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import IdeaForm from '../components/IdeaForm'
import toast from 'react-hot-toast'

export default function AddIdea() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handleSubmit = async (data) => {
    setLoading(true); setError('')
    try {
      await ideaApi.create(data)
      toast.success('Idea submitted!')
      navigate('/')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to submit idea'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 64 }}>
      <div className="container">
        <div className="card form-card" style={{ maxWidth: 600 }}>
          <h1 className="form-title">Submit an Idea</h1>
          <p className="form-subtitle">Share something you'd like to see built or improved</p>

          {error && <div className="alert alert-error">{error}</div>}

          <IdeaForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}
