import { createContext, useContext, useState, useEffect } from "react"
import { makeBasicToken, userApi } from "../services/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("user")

    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        logout()
      }
    }

    setLoading(false)
  }, [])

  const login = async (username, password) => {

    await userApi.login(username, password)

    const token = makeBasicToken(username, password)

    localStorage.setItem("authToken", token)

    const userData = {
      username,
      token,
      isAdmin: username === "admin"
    }

    localStorage.setItem("user", JSON.stringify(userData))

    setUser(userData)

    return userData
  }

  const logout = () => {

    localStorage.removeItem("authToken")
    localStorage.removeItem("user")

    setUser(null)
  }

  const register = async (username, email, password) => {

    await userApi.register(username, email, password)

  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}