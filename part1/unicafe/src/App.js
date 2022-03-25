import React, { useState } from 'react'

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all === 0){
    return(
    <div>
      <h1>Statistics</h1>
      No feedback given
    </div>
    )
  } 

  return(
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticsLine text="good" value ={good} />
          <StatisticsLine text="neutral" value ={neutral} />
          <StatisticsLine text="bad" value ={bad} />
          <StatisticsLine text="all" value ={all} />
          <StatisticsLine text="average" value ={average} />
          <StatisticsLine text="positive" value ={positive} />
        </tbody>
      </table>
    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const StatisticsLine = ({ text, value }) => (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good +1)
  const increaseNeutral = () => setNeutral(neutral +1)
  const increaseBad = () => setBad(bad + 1)
  
  const all = good + neutral + bad
  const average = (good - bad)/all
  const positive = (good/all)*100 + "%"

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={increaseGood} text="good"/>
      <Button handleClick={increaseNeutral} text="neutral"/>
      <Button handleClick={increaseBad} text="bad"/>
      {Statistics({ good, neutral, bad, all, average, positive })}
    </div>
  )
}

export default App
