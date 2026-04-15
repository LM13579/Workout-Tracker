const WorkoutList = ({ workouts, onEdit, onDelete }) => {
  if (workouts.length === 0) {
    return (
      <p className="empty-state">
        No workouts logged yet. Your performance archive is ready for its first session.
      </p>
    )
  }

  return (
    <div className="workout-list">
      {workouts.map((workout) => (
        <div key={workout._id} className="workout-card card">
          <div className="workout-card-top">
            <h3 className="workout-name">{workout.title}</h3>
            <div className="workout-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => onEdit(workout)}>
                Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(workout._id)}>
                Delete
              </button>
            </div>
          </div>

          <div className="workout-stats">
            <span className="stat">
              <strong>{workout.reps}</strong> reps
            </span>
            <span className="stat-sep">/</span>
            <span className="stat">
              <strong>{workout.load > 0 ? `${workout.load} lbs` : 'Bodyweight'}</strong>
            </span>
          </div>

          {workout.notes && <p className="workout-notes">Session notes: {workout.notes}</p>}

          <p className="workout-date">
            {new Date(workout.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      ))}
    </div>
  )
}

export default WorkoutList
