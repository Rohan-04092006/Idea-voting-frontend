import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ideaApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import IdeaForm from '../components/IdeaForm'
import toast from 'react-hot-toast'

export default function EditIdea() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [idea, setIdea]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    ideaApi.getById(id)
      .then(r => {
        const data = r.data
        const canEdit = user.username === data.authorUsername || user.isAdmin
        if (!canEdit) { toast.error('Not authorized'); navigate('/'); return }
        setIdea(data)
      })
      .catch(() => { toast.error('Idea not found'); navigate('/') })
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (data) => {
    setLoading(true); setError('')
    try {
      await ideaApi.update(id, data)
      toast.success('Idea updated!')
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="page">
      <div className="container">
        <div className="skeleton" style={{ maxWidth: 600, margin: '0 auto', padding: 40, gap: 16 }}>
          <div className="skeleton-line medium" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 64 }}>
      <div className="container">
        <div className="card form-card" style={{ maxWidth: 600 }}>
          <h1 className="form-title">Edit Idea</h1>
          <p className="form-subtitle">Update your idea details or change its status</p>

          {error && <div className="alert alert-error">{error}</div>}

          {idea && (
            <IdeaForm
              initialValues={idea}
              onSubmit={handleSubmit}
              loading={loading}
              isEdit
            />
          )}
        </div>
      </div>
    </div>
  )
}
