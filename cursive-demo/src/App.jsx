import { HandwritingText } from 'react-cursive-handwrite'
import './App.css'

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <HandwritingText 
        strokeColor="#000000" 
        strokeWidth={3}
        duration={2}
      >
        Hello World
      </HandwritingText>
    </div>
  )
}

export default App
