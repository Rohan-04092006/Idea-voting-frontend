import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ideaApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import IdeaCard from '../components/IdeaCard'
import SearchBar from '../components/SearchBar'

const FILTERS = ['ALL', 'OPEN', 'CLOSED', 'IMPLEMENTED']
const PAGE_SIZE = 9

function SkeletonGrid() {
  return (
    <div className="loading-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="skeleton" key={i}>
          <div className="skeleton-line medium" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [ideas, setIdeas]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('ALL')
  const [keyword, setKeyword]   = useState('')
  const [page, setPage]         = useState(0)
  const [totalPages, setTotal]  = useState(0)

  const fetchIdeas = useCallback(async () => {
    setLoading(true)
    try {
      let res
      if (keyword) {
        res = await ideaApi.search(keyword, page, PAGE_SIZE)
      } else if (filter !== 'ALL') {
        res = await ideaApi.getByStatus(filter, page, PAGE_SIZE)
      } else {
        res = await ideaApi.getAll(page, PAGE_SIZE)
      }
      setIdeas(res.data.content)
      setTotal(res.data.totalPages)
    } catch {
      setIdeas([])
    } finally {
      setLoading(false)
    }
  }, [filter, keyword, page])

  useEffect(() => { fetchIdeas() }, [fetchIdeas])

  // Reset page when filter/search changes
  useEffect(() => { setPage(0) }, [filter, keyword])

  const handleSearch = (q) => setKeyword(q)
  const handleDelete = (id) => setIdeas(prev => prev.filter(i => i.id !== id))
  const handleVoteChange = (updated) =>
    setIdeas(prev => prev.map(i => i.id === updated.id ? updated : i))

  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <div className="hero">
          <h1 className="hero-title">
            Share Ideas,<br />
            <span className="accent">Shape the Future</span>
          </h1>
          <p className="hero-sub">
            Submit your ideas, vote on what matters, and help prioritize what gets built next.
          </p>
          {isAuthenticated ? (
            <Link to="/add" className="btn btn-primary btn-lg">
              + Submit an Idea
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started →
            </Link>
          )}
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Grid */}
        {loading ? (
          <SkeletonGrid />
        ) : ideas.length === 0 ? (
          <div className="empty-state">
            <h3>No ideas found</h3>
            <p>{keyword ? `No results for "${keyword}"` : 'Be the first to submit an idea!'}</p>
          </div>
        ) : (
          <div className="ideas-grid">
            {ideas.map((idea, i) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onDelete={handleDelete}
                onVoteChange={handleVoteChange}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>‹</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`page-btn ${i === page ? 'active' : ''}`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>›</button>
          </div>
        )}
      </div>
    </div>
  )
}
