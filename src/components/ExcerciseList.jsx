import { useEffect, useState } from 'react'
import axios from 'axios'

const ExerciseList = ({ renderLoadingScreen }) => {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios
      .get('https://mongodb.simplycodingcourses.com/simply/exercise', {
        headers: {
          Authorization:
            'Bearer 9714d10e58b2aa6c9ecd5d1849a7320a7ff0e6b2406f1bb503b66f337bef5b35',
        },
      })
      .then((response) => {
        setExercises(response.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to load exercises. Check your connection and try again.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return renderLoadingScreen(
      'Loading exercise library',
      'Scanning the movement database for your next training block.',
    )
  }

  if (error) {
    return <p className="empty-state">{error}</p>
  }

  return (
    <div className="exercise-grid">
      {exercises.map((exercise) => {
        const name = exercise.name || `Exercise #${exercise._id || exercise.id}`
        const muscleGroup = exercise.muscleGroup || ''

        return (
          <div key={exercise._id || exercise.id} className="exercise-card card">
            <h3 className="exercise-name">{name}</h3>
            {muscleGroup && <span className="exercise-tag">{muscleGroup}</span>}
          </div>
        )
      })}
    </div>
  )
}

export default ExerciseList
