import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Home           from './pages/Home'
import Login          from './pages/Login'
import Register       from './pages/Register'
import AddIdea        from './pages/AddIdea'
import EditIdea       from './pages/EditIdea'
import AdminDashboard from './pages/AdminDashboard'

// Wrapper: redirects to /login if not authenticated
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

// Wrapper: redirects to / if not admin
export function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (!user?.isAdmin) return <Navigate to="/" replace />
  return children
}

// Route definitions consumed by App.jsx
export const appRoutes = [
  { path: '/',        element: <Home /> },
  { path: '/login',   element: <Login /> },
  { path: '/register',element: <Register /> },
  {
    path: '/add',
    element: (
      <ProtectedRoute>
        <AddIdea />
      </ProtectedRoute>
    ),
  },
  {
    path: '/edit/:id',
    element: (
      <ProtectedRoute>
        <EditIdea />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  // Catch-all
  { path: '*', element: <Navigate to="/" replace /> },
]
