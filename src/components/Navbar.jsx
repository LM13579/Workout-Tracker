const Navbar = ({ view, setView }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Workout Tracker<img src="https://i.pinimg.com/originals/c3/97/7d/c3977d7be06576701fd39950123b13d6.gif" height={50}/></div>
      <img src="https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUycGg3bThtcTVpeHZteGpjbzJjamk0a3ZoMXhzdWFjZWtqMzg2eXl6MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/XDk6ERO38rNdO5rPx2/giphy.gif" height={125} alt="" />
      <div className="navbar-links">
        <button
          className={`nav-btn ${view === 'workouts' ? 'active' : ''}`}
          onClick={() => setView('workouts')}
        >
          My Workouts
        </button>
        <button
          className={`nav-btn ${view === 'exercises' ? 'active' : ''}`}
          onClick={() => setView('exercises')}
        >
          Browse Exercises
        </button>
      </div>
    </nav>
  )
}

export default Navbar
