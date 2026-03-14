import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import { appRoutes } from './routes'

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {appRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111118',
            color: '#f0effe',
            border: '1px solid #252532',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: "'DM Sans', sans-serif",
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#111118' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#111118' } },
        }}
      />
    </>
  )
}
