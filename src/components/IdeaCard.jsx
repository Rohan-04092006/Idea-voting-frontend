import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ideaApi } from '../services/api'
import VoteButton from './VoteButton'
import toast from 'react-hot-toast'

const STATUS_LABEL = { OPEN: 'Open', CLOSED: 'Closed', IMPLEMENTED: 'Implemented' }

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function IdeaCard({ idea, onDelete, onVoteChange, style = {} }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const canEdit = user && (user.username === idea.authorUsername || user.isAdmin)

  const handleDelete = async () => {
    if (!window.confirm('Delete this idea?')) return
    try {
      await ideaApi.delete(idea.id)
      toast.success('Idea deleted')
      onDelete?.(idea.id)
    } catch {
      toast.error('Could not delete idea')
    }
  }

  return (
    <div className="card idea-card" style={{ animationDelay: style.animationDelay }}>
      <div className="idea-card-header">
        <h3 className="idea-title">{idea.title}</h3>
        <span className={`status-badge status-${idea.status}`}>
          {STATUS_LABEL[idea.status]}
        </span>
      </div>

      <p className="idea-description">{idea.description}</p>

      <div className="idea-meta">
        <span className="idea-author">by <span>{idea.authorUsername}</span></span>
        <span className="idea-date">{timeAgo(idea.createdAt)}</span>
      </div>

      <div className="idea-actions">
        <VoteButton idea={idea} onVoteChange={onVoteChange} />

        {canEdit && (
          <>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(`/edit/${idea.id}`)}
            >
              Edit
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}
