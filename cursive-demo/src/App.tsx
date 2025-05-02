import { HandwritingText } from 'react-cursive-handwrite';
import './App.css'

function App() {
  return (
    <div className="app-container">
      <h1>React Cursive Handwriting Demo</h1>
      <HandwritingText 
        fontPath="fonts/google"
        strokeColor="#FF0000"
        strokeWidth={3}
        duration={5}
      >
        A
      </HandwritingText>
    </div>
  )
}

export default App
