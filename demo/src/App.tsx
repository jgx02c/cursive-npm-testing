import React from 'react';
import HandwritingText from './HandwritingText';
import './App.css';

const App: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Cursive Handwriting Demo</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2>Single Word Test</h2>
        <HandwritingText 
          text="Hello" 
          strokeColor="#FF0000" 
          strokeWidth={3} 
          duration={3} 
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Multiple Words Test</h2>
        <HandwritingText 
          text="Cursive Writing" 
          strokeColor="#0000FF" 
          strokeWidth={2} 
          duration={4} 
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Alphabet Test</h2>
        <HandwritingText 
          text="abcdefghijklmnopqrstuvwxyz" 
          strokeColor="#00AA00" 
          strokeWidth={2} 
          duration={6} 
        />
      </div>
    </div>
  );
};

export default App;
