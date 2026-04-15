import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import WorkoutForm from './components/WorkoutForm'
import WorkoutList from './components/WorkoutList'
import ExerciseList from './components/ExcerciseList'
import Toast from './components/Toast'
import './App.css'

const API_BASE = 'https://mongodb.simplycodingcourses.com/simply'
const AUTH_HEADERS = {
  Authorization:
    'Bearer 9714d10e58b2aa6c9ecd5d1849a7320a7ff0e6b2406f1bb503b66f337bef5b35',
}

function App() {
  const [view, setView] = useState('workouts')
  const [workouts, setWorkouts] = useState([])
  const [editWorkout, setEditWorkout] = useState(null)
  const [toasts, setToasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
    visible: false,
    active: false,
  })

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/workout/john123/get`, {
          headers: AUTH_HEADERS,
        })
        setWorkouts(response.data)
        setError('')
      } catch {
        setError('Unable to load workouts. Check your connection and try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)')

    if (!mediaQuery.matches) {
      return undefined
    }

    const interactiveSelector =
      'button, a, input, textarea, select, .card, .exercise-tag, .nav-btn'

    const updateCursorPosition = (event) => {
      const target = event.target.closest?.(interactiveSelector)
      setCursor({
        x: event.clientX,
        y: event.clientY,
        visible: true,
        active: Boolean(target),
      })
    }

    const showCursor = () => {
      setCursor((prev) => ({ ...prev, visible: true }))
    }

    const hideCursor = () => {
      setCursor((prev) => ({ ...prev, visible: false, active: false }))
    }

    const handleMouseDown = () => {
      setCursor((prev) => ({ ...prev, active: true }))
    }

    const handleMouseUp = (event) => {
      const target = event.target.closest?.(interactiveSelector)
      setCursor((prev) => ({ ...prev, active: Boolean(target) }))
    }

    window.addEventListener('mousemove', updateCursorPosition)
    window.addEventListener('mouseenter', showCursor)
    window.addEventListener('mouseleave', hideCursor)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition)
      window.removeEventListener('mouseenter', showCursor)
      window.removeEventListener('mouseleave', hideCursor)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }

  const refreshWorkouts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/workout/john123/get`, {
        headers: AUTH_HEADERS,
      })
      setWorkouts(response.data)
      setError('')
    } catch {
      setError('Unable to refresh workouts right now. Please try again soon.')
    }
  }

  const handleSave = async (data) => {
    try {
      if (editWorkout) {
        await axios.put(
          `${API_BASE}/workout/john123/put/${editWorkout._id}`,
          data,
          { headers: AUTH_HEADERS },
        )
        setEditWorkout(null)
        await refreshWorkouts()
        showToast('Workout updated successfully.', 'info')
      } else {
        await axios.post(`${API_BASE}/workout/john123/post`, data, {
          headers: AUTH_HEADERS,
        })
        await refreshWorkouts()
        showToast('Workout logged. Powering up the streak.', 'success')
      }
    } catch {
      showToast(`Failed to ${editWorkout ? 'update' : 'save'} workout.`, 'error')
    }
  }

  const handleEdit = (workout) => {
    setEditWorkout(workout)
  }

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${API_BASE}/workout/john123/delete/${_id}`, {
        headers: AUTH_HEADERS,
      })
      setWorkouts((prev) => prev.filter((workout) => workout._id !== _id))
      showToast('Workout removed from the archive.', 'info')
    } catch {
      showToast('Failed to delete workout.', 'error')
    }
  }

  const handleCancel = () => setEditWorkout(null)

  const renderLoadingScreen = (title, subtitle) => (
    <section className="loading-screen card" aria-live="polite">
      <div className="loading-orb" aria-hidden="true">
        <span className="loading-ring loading-ring-a" />
        <span className="loading-ring loading-ring-b" />
        <span className="loading-core" />
      </div>
      <p className="loading-kicker">Syncing Training Data</p>
      <h2 className="loading-title">{title}</h2>
      <p className="loading-subtitle">{subtitle}</p>
      <div className="loading-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
  )

  return (
    <div className="app">
      <div
        className={`cursor-glow ${cursor.visible ? 'is-visible' : ''} ${cursor.active ? 'is-active' : ''}`}
        style={{ left: cursor.x, top: cursor.y }}
        aria-hidden="true"
      />
      <div
        className={`cursor-dot ${cursor.visible ? 'is-visible' : ''} ${cursor.active ? 'is-active' : ''}`}
        style={{ left: cursor.x, top: cursor.y }}
        aria-hidden="true"
      />
      <Navbar view={view} setView={setView} />
      <main className="main">
        {view === 'workouts' && (
          <>
            <WorkoutForm
              onSave={handleSave}
              editWorkout={editWorkout}
              onCancel={handleCancel}
            />
            <h2 className="page-title">My Workouts</h2>
            {loading &&
              renderLoadingScreen(
                'Loading workout archive',
                'Pulling your latest sessions into the command deck.',
              )}
            {error && !loading && <p className="empty-state">{error}</p>}
            {!loading && !error && (
              <WorkoutList
                workouts={workouts}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </>
        )}

        {view === 'exercises' && (
          <>
            <h2 className="page-title">Browse Exercises</h2>
            <ExerciseList renderLoadingScreen={renderLoadingScreen} />
          </>
        )}
      </main>
      <Toast toasts={toasts} />
    </div>
  )
}

export default App
