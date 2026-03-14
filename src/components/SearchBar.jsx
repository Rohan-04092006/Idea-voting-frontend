import { useState, useEffect, useRef } from 'react'

export default function SearchBar({ onSearch, placeholder = 'Search ideas…' }) {
  const [value, setValue] = useState('')
  const debounceRef = useRef(null)

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(value.trim())
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [value])

  return (
    <div className="search-wrapper">
      <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        className="search-input"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
}
