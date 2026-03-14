import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi, ideaApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers]   = useState([])
  const [ideas, setIdeas]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/')
      return
    }
    Promise.all([
      userApi.getAll(),
      ideaApi.getAll(0, 50),
    ]).then(([u, i]) => {
      setUsers(u.data)
      setIdeas(i.data.content)
    }).catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false))
  }, [])

  const handleDeleteUser = async (id, username) => {
    if (username === user.username) { toast.error("Can't delete yourself"); return }
    if (!window.confirm(`Delete user "${username}"?`)) return
    try {
      await userApi.deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success('User deleted')
    } catch { toast.error('Failed to delete user') }
  }

  const handleDeleteIdea = async (id) => {
    if (!window.confirm('Delete this idea?')) return
    try {
      await ideaApi.delete(id)
      setIdeas(prev => prev.filter(i => i.id !== id))
      toast.success('Idea deleted')
    } catch { toast.error('Failed to delete idea') }
  }

  const stats = {
    users: users.length,
    ideas: ideas.length,
    open:  ideas.filter(i => i.status === 'OPEN').length,
    totalVotes: ideas.reduce((sum, i) => sum + i.upvotes + i.downvotes, 0),
  }

  if (loading) return (
    <div className="page"><div className="container">
      <div className="skeleton" style={{ height: 120, borderRadius: 20 }} />
    </div></div>
  )

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-header-title">Admin Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {[
            { label: 'Total Users',  value: stats.users,      color: 'var(--accent)' },
            { label: 'Total Ideas',  value: stats.ideas,      color: 'var(--accent-2)' },
            { label: 'Open Ideas',   value: stats.open,       color: 'var(--up)' },
            { label: 'Total Votes',  value: stats.totalVotes, color: 'var(--text)' },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="card" style={{ marginBottom: 32, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Users</h2>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{users.length} total</span>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>#{u.id}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(u.id, u.username)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ideas Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Ideas</h2>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{ideas.length} total</span>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map(idea => (
                <tr key={idea.id}>
                  <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {idea.title}
                  </td>
                  <td>{idea.authorUsername}</td>
                  <td>
                    <span className={`status-badge status-${idea.status}`}>{idea.status}</span>
                  </td>
                  <td style={{ color: idea.totalVotes >= 0 ? 'var(--up)' : 'var(--down)', fontWeight: 600 }}>
                    {idea.totalVotes > 0 ? '+' : ''}{idea.totalVotes}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteIdea(idea.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
