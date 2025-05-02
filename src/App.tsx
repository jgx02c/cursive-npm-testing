import { useState, useEffect, memo } from 'react';
import { HandwritingText } from './Components/HandwritingText';
import './App.css'

const COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Yellow', value: '#FFFF00' },
];

const HandwritingDisplay = memo(({ text, color }: { text: string; color: string }) => {
  return (
    <div className="display-area">
      <HandwritingText 
        key={`${text}-${color}`}
        fontPath="./fonts/google"
        strokeColor={color}
        strokeWidth={2}
        duration={8}
      >
        {text}
      </HandwritingText>
    </div>
  );
});

const Controls = memo(({ 
  text, 
  selectedColor, 
  onTextChange, 
  onColorChange 
}: { 
  text: string;
  selectedColor: string;
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColorChange: (color: string) => void;
}) => {
  return (
    <div className="controls">
      <h1>React Cursive Handwriting Demo</h1>
      <div className="input-container">
        <input
          type="text"
          value={text}
          onChange={onTextChange}
          placeholder="Enter your text here"
          className="text-input"
        />
        <div className="color-picker">
          {COLORS.map((color) => (
            <div
              key={color.value}
              className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => onColorChange(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

function App() {
  const [text, setText] = useState('react cursive handwriting');
  const [displayText, setDisplayText] = useState('react cursive handwriting');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [displayColor, setDisplayColor] = useState('#FFFFFF');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayText(text);
    }, 500);

    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayColor(selectedColor);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedColor]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="app-container">
      <Controls 
        text={text}
        selectedColor={selectedColor}
        onTextChange={handleTextChange}
        onColorChange={handleColorChange}
      />
      <HandwritingDisplay text={displayText} color={displayColor} />
    </div>
  )
}

export default App