import axios from "axios"

const BASE_URL = "https://idea-voting-backend.onrender.com/api"

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// ─── Attach Basic Auth token automatically ──────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")

    if (token) {
      config.headers.Authorization = `Basic ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ─── Auth helper ────────────────────────────────────────────────
export const makeBasicToken = (username, password) =>
  btoa(`${username}:${password}`)

// ─── Ideas API ──────────────────────────────────────────────────
export const ideaApi = {
  getAll: (page = 0, size = 10, sort = "createdAt") =>
    api.get(`/ideas?page=${page}&size=${size}&sort=${sort}`),

  getById: (id) =>
    api.get(`/ideas/${id}`),

  getByStatus: (status, page = 0, size = 10) =>
    api.get(`/ideas/status/${status}?page=${page}&size=${size}`),

  search: (keyword, page = 0, size = 10) =>
    api.get(
      `/ideas/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
    ),

  getTop: (limit = 5) =>
    api.get(`/ideas/top?limit=${limit}`),

  create: (data) =>
    api.post("/ideas", data),

  update: (id, data) =>
    api.put(`/ideas/${id}`, data),

  delete: (id) =>
    api.delete(`/ideas/${id}`),
}

// ─── Votes API ──────────────────────────────────────────────────
export const voteApi = {
  upvote: (ideaId) =>
    api.post(`/votes/ideas/${ideaId}/upvote`),

  downvote: (ideaId) =>
    api.post(`/votes/ideas/${ideaId}/downvote`),

  getCounts: (ideaId) =>
    api.get(`/votes/ideas/${ideaId}/counts`),

  getMyVote: (ideaId) =>
    api.get(`/votes/ideas/${ideaId}/my-vote`),
}

// ─── Users API ──────────────────────────────────────────────────
export const userApi = {
  register: (data) =>
    api.post("/users/register", data),

  // Login using Basic Authentication
  login: async (username, password) => {
    const token = makeBasicToken(username, password)

    const response = await axios.get(`${BASE_URL}/ideas?page=0&size=1`, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    })

    // Save token for future API calls
    localStorage.setItem("authToken", token)

    return response
  },

  getAll: () =>
    api.get("/users"),

  deleteUser: (id) =>
    api.delete(`/users/${id}`),
}

export default api