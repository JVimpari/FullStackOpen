import React from 'react'
import courses from './components/courses'
import CourseList from './components/courselist'

const App = () => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      <CourseList courses={courses} />
    </div>
  )
}

export default App
