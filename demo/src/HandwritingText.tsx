import React, { useState, useEffect } from 'react';
import { generateWordPath } from './fonts/svg/loader';
import './HandwritingText.css';

interface HandwritingTextProps {
  text?: string;
  strokeColor?: string;
  strokeWidth?: number;
  duration?: number;
  fill?: boolean;
}

const HandwritingText: React.FC<HandwritingTextProps> = ({
  text = 'Hello',
  strokeColor = '#000000',
  strokeWidth = 2,
  duration = 3,
  fill = true
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [key, setKey] = useState<number>(0);
  const svgWidth = 800;
  const svgHeight = 200;

  useEffect(() => {
    try {
      const result = generateWordPath(text);
      setSvgContent(result.path);
      setKey(prev => prev + 1);
    } catch (error) {
      console.error('Error generating word path:', error);
      setSvgContent('');
    }
  }, [text]);

  if (!svgContent) {
    return (
      <div style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        color: 'red'
      }}>
        Some letters in "{text}" are not available in the current font set.
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <svg
        key={key}
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ overflow: 'visible' }}
        className="handwriting-svg"
      >
        <path
          d={svgContent}
          className="handwriting-path"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill={fill ? strokeColor : "none"}
          style={{
            animationDuration: `${duration}s`
          }}
        />
      </svg>
    </div>
  );
};

export default HandwritingText; 