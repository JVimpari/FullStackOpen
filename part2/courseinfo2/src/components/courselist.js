const Total = ( {parts} ) => {
    const sum = parts.reduce((prevValue, curValue) => {return prevValue + curValue.exercises}, 0);
    return(
        <b>Total of exercises {sum}</b>
    )
  }
  
  const Part = ( {part} ) => {
    return(
      <li>{part.name} {part.exercises}</li>
    )
  }
  
  const Content = ( {parts} ) => {
    return (
      <ul style={{ listStyleType: "none" , paddingLeft: 0 }}>
        {parts.map(content =>
          <Part key={content.id} part={content}/>
        )}
      </ul>  
    ) 
  }
  
  const Course = ( {course} ) => { 
    return (
      <div>
        <li>
          <h2>{course.name}</h2>
          <Content parts={course.parts} />
          <Total parts={course.parts}/>
        </li>
      </div>
    )
  }
  
  const CourseList = ( {courses} ) => {
    return(
    <div>
      <ul style={{ listStyleType: "none" , paddingLeft: 0 }}>
        {courses.map(course =>
          <Course key={course.id} course={course} />
        )}
      </ul>
    </div>
    )
  }
export default CourseList