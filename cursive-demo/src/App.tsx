import { HandwritingText } from 'react-cursive-handwrite';
import './App.css'

function App() {
  return (
    <div className="app-container">
      <h1>React Cursive Handwriting Demo</h1>
      <HandwritingText 
        fontPath="fonts/google"
        strokeColor="#FFFFFF"
        strokeWidth={2}
        duration={8}
      
      >
        {'hello'}
      </HandwritingText>
    </div>
  )
}

export default App
