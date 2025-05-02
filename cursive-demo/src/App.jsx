import { useState } from 'react'
import { HandwritingText } from 'react-cursive-handwrite'
import './App.css'

function App() {
  const [text, setText] = useState('Hello World')

  return (
    <div className="app">
      <h1>Cursive Handwriting Demo</h1>
      <div className="demo-container">
        <HandwritingText
          fontPath="fonts/google"
          strokeColor="#FF0000"
          strokeWidth={2}
          duration={3}
          width={500}
          height={100}
          replay={false}
          replayDelay={2000}
        >
          {"c"}
        </HandwritingText>
        <div className="preview">
          <h3>Preview:</h3>
          <p>{text}</p>
        </div>
      </div>
    </div>
  )
}

export default App
