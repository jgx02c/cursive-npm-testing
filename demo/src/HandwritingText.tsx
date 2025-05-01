import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateWordPath } from './fonts/cursivePath';

interface HandwritingTextProps {
  text?: string;
  strokeColor?: string;
  strokeWidth?: number;
  duration?: number;
}

const HandwritingText: React.FC<HandwritingTextProps> = ({
  text = 'Hello',
  strokeColor = '#000000',
  strokeWidth = 2,
  duration = 3
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const svgWidth = 800;
  const svgHeight = 100;

  useEffect(() => {
    const path = generateWordPath(text);
    setSvgContent(path);
  }, [text]);

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
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ overflow: 'visible' }}
      >
        <motion.path
          d={svgContent}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration }}
        />
      </svg>
    </div>
  );
};

export default HandwritingText; 