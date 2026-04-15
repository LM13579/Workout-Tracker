import { useState, useEffect } from 'react'

const EMPTY = { title: '', reps: '', load: '', notes: '' }

const WorkoutForm = ({ onSave, editWorkout, onCancel }) => {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editWorkout) {
      setForm({
        title: editWorkout.title,
        reps: editWorkout.reps,
        load: editWorkout.load,
        notes: editWorkout.notes || '',
      })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
  }, [editWorkout])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const validationErrors = {}
    if (!form.title.trim()) validationErrors.title = 'Exercise name is required'
    if (!form.reps || Number(form.reps) <= 0) validationErrors.reps = 'Enter a valid number of reps'
    if (form.load === '' || Number(form.load) < 0) validationErrors.load = 'Enter a valid weight (0 for bodyweight)'
    return validationErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    onSave({
      title: form.title.trim(),
      reps: Number(form.reps),
      load: Number(form.load),
      notes: form.notes.trim(),
    })
    setForm(EMPTY)
  }

  return (
    <div className="card workout-form-card">
      <h2 className="form-title">{editWorkout ? 'Edit Workout' : 'Log a Workout'}</h2>
      <div className="divider" />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Exercise Name</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Bench Press"
          />
          {errors.title && <span className="error-msg">{errors.title}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="reps">Reps</label>
            <input
              id="reps"
              name="reps"
              type="number"
              value={form.reps}
              onChange={handleChange}
              placeholder="e.g. 10"
              min="1"
            />
            {errors.reps && <span className="error-msg">{errors.reps}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="load">Weight (lbs)</label>
            <input
              id="load"
              name="load"
              type="number"
              value={form.load}
              onChange={handleChange}
              placeholder="0 = bodyweight"
              min="0"
              step="2.5"
            />
            {errors.load && <span className="error-msg">{errors.load}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional notes, tempo, or mood"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className={`btn ${editWorkout ? 'btn-secondary' : 'btn-primary'}`}>
            {editWorkout ? 'Update' : 'Log Workout'}
          </button>
          {editWorkout && (
            <button type="button" className="btn btn-danger" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default WorkoutForm
