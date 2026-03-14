import { useState, useEffect } from 'react'
import { voteApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function VoteButton({ idea, onVoteChange }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [upvotes, setUpvotes]     = useState(idea.upvotes ?? 0)
  const [downvotes, setDownvotes] = useState(idea.downvotes ?? 0)
  const [myVote, setMyVote]       = useState(null) // 'UPVOTE' | 'DOWNVOTE' | null
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (isAuthenticated && idea.status === 'OPEN') {
      voteApi.getMyVote(idea.id)
        .then(r => setMyVote(r.data.vote === 'NONE' ? null : r.data.vote))
        .catch(() => {})
    }
  }, [idea.id, isAuthenticated, idea.status])

  const handleVote = async (type) => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (idea.status !== 'OPEN') { toast.error('Voting is closed for this idea'); return }

    setLoading(true)
    try {
      const fn = type === 'UPVOTE' ? voteApi.upvote : voteApi.downvote
      const { data } = await fn(idea.id)
      setUpvotes(data.upvotes)
      setDownvotes(data.downvotes)
      setMyVote(data.action === 'removed' ? null : type)
      onVoteChange?.({ ...idea, upvotes: data.upvotes, downvotes: data.downvotes })
    } catch {
      toast.error('Failed to vote')
    } finally {
      setLoading(false)
    }
  }

  const score = upvotes - downvotes

  return (
    <div className="vote-group">
      <button
        className={`vote-btn ${myVote === 'UPVOTE' ? 'active-up' : ''}`}
        onClick={() => handleVote('UPVOTE')}
        disabled={loading}
        title="Upvote"
      >
        ▲ {upvotes}
      </button>

      <span className="vote-score" style={{ color: score > 0 ? 'var(--up)' : score < 0 ? 'var(--down)' : 'var(--text-muted)' }}>
        {score > 0 ? '+' : ''}{score}
      </span>

      <button
        className={`vote-btn ${myVote === 'DOWNVOTE' ? 'active-down' : ''}`}
        onClick={() => handleVote('DOWNVOTE')}
        disabled={loading}
        title="Downvote"
      >
        ▼ {downvotes}
      </button>
    </div>
  )
}
