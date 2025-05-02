import { useState, useEffect } from 'react';
import { HandwritingText } from './Components/HandwritingText';
import './App.css'

const COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Yellow', value: '#FFFF00' },
];

function App() {
  const [text, setText] = useState('react cursive handwriting');
  const [displayText, setDisplayText] = useState('react cursive handwriting');
  const [key, setKey] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayText(text);
      setKey(prevKey => prevKey + 1);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setKey(prevKey => prevKey + 1);
  };

  return (
    <div className="app-container">
      <h1>React Cursive Handwriting Demo</h1>
      <div className="input-container">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter your text here"
          className="text-input"
        />
        <div className="color-picker">
          {COLORS.map((color) => (
            <div
              key={color.value}
              className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorChange(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>
      <HandwritingText 
        key={key}
        fontPath="./fonts/google"
        strokeColor={selectedColor}
        strokeWidth={2}
        duration={8}
      >
        {displayText}
      </HandwritingText>
    </div>
  )
}

export default App