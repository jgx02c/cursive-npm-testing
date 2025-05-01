import React from 'react';
import HandwritingText from './HandwritingText';
import './App.css';

const App: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Cursive Handwriting Demo
      </h1>
      
      <div style={{ 
        marginBottom: '40px', 
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fff'
      }}>
        <HandwritingText 
          text="a" 
          strokeColor="#FF0000" 
          strokeWidth={4} 
          duration={3} 
        />
      </div>

      <div style={{ 
        marginBottom: '40px', 
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fff'
      }}>
        <HandwritingText 
          text="b" 
          strokeColor="#0000FF" 
          strokeWidth={4} 
          duration={3} 
        />
      </div>

      <div style={{ 
        marginBottom: '40px', 
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fff'
      }}>
        <HandwritingText 
          text="ab" 
          strokeColor="#00AA00" 
          strokeWidth={4} 
          duration={5} 
        />
      </div>

      <div style={{ 
        marginBottom: '40px', 
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fff'
      }}>
        <HandwritingText 
          text="c" 
          strokeColor="#FF00FF" 
          strokeWidth={3} 
          duration={2} 
        />
      </div>
    </div>
  );
};

export default App;
