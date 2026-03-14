import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Signed out')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          ✦ IdeaVote
        </NavLink>

        <div className="navbar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
            Browse
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/add" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              + Submit Idea
            </NavLink>
          )}

          {user?.isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Admin
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="nav-user">
              <span className="nav-username">@{user.username}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          ) : (
            <div className="nav-user">
              <NavLink to="/login" className="btn btn-ghost btn-sm">Sign in</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">Register</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
