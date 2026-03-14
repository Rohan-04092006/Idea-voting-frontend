import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ideaApi } from "../api/api"   // adjust path if needed
import toast from "react-hot-toast"

export default function AddIdea() {

  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description) {
      setError("All fields are required")
      return
    }

    try {
      setLoading(true)
      setError("")

      await ideaApi.create({
        title: title,
        description: description
      })

      toast.success("Idea submitted successfully!")

      navigate("/")

    } catch (err) {

      console.error("Submit error:", err)

      const message =
        err?.response?.data?.message ||
        "Failed to submit idea"

      setError(message)

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="card form-card">

          <h1 className="form-title">Submit an Idea</h1>
          <p className="form-subtitle">
            Share something you'd like to see built or improved
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label">Title</label>

              <input
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Idea title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>

              <textarea
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your idea"
                rows="5"
              />
            </div>

            <button
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Submitting..." : "Submit Idea →"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}