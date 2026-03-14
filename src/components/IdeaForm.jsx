import { useState } from 'react'

const STATUS_OPTIONS = ['OPEN', 'CLOSED', 'IMPLEMENTED']

export default function IdeaForm({ initialValues = {}, onSubmit, loading, isEdit = false }) {
  const [title, setTitle]             = useState(initialValues.title || '')
  const [description, setDescription] = useState(initialValues.description || '')
  const [status, setStatus]           = useState(initialValues.status || 'OPEN')
  const [errors, setErrors]           = useState({})

  const validate = () => {
    const e = {}
    if (title.trim().length < 5)         e.title = 'Title must be at least 5 characters'
    if (description.trim().length < 10)  e.description = 'Description must be at least 10 characters'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    const payload = { title: title.trim(), description: description.trim() }
    if (isEdit) payload.status = status
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          className="form-input"
          placeholder="A clear, concise idea title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={200}
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          placeholder="Describe your idea in detail..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={5}
          maxLength={2000}
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
        <span style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>
          {description.length}/2000
        </span>
      </div>

      {isEdit && (
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Submit Idea →'}
      </button>
    </form>
  )
}
