// Import SVG files as raw strings
import aSvg from './a.svg?raw';
import bSvg from './b.svg?raw';

type LetterPaths = {
  path: string;
  width: number;
  height: number;
  fill: string;
};

// Parse SVG from the converter's format
function parseSVG(svgString: string): LetterPaths {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  const path = doc.querySelector('path');
  
  if (!svg || !path) {
    throw new Error('Invalid SVG format');
  }

  // Get the viewBox dimensions
  const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 100, 100];
  const width = viewBox[2];
  const height = viewBox[3];

  // Get the fill color from the path or its parent group
  const fill = path.getAttribute('fill') || 
              path.parentElement?.getAttribute('fill') || 
              '#000000';

  return {
    path: path.getAttribute('d') || '',
    width,
    height,
    fill
  };
}

// Store paths for each letter
const letterPaths: Record<string, LetterPaths> = {
  a: parseSVG(aSvg),
  b: parseSVG(bSvg),
};

// Get the path for a letter
export function getLetterPath(letter: string): LetterPaths {
  const lowerLetter = letter.toLowerCase();
  if (letterPaths[lowerLetter]) {
    return letterPaths[lowerLetter];
  }
  console.warn(`No SVG path found for letter: ${letter}`);
  return { path: '', width: 0, height: 0, fill: '#000000' };
}

// Generate a path for a word
export function generateWordPath(word: string): { path: string; fill: string } {
  let path = '';
  let xOffset = 0;
  const letterSpacing = 30; // Space between letters
  let currentFill = '#000000';

  for (let i = 0; i < word.length; i++) {
    const letter = word[i].toLowerCase();
    const letterData = getLetterPath(letter);
    if (letterData.path) {
      currentFill = letterData.fill;
      
      // Split the path into commands and their parameters
      const commands = letterData.path.split(/(?=[MLHVCSQTAZmlhvcsqtaz])/);
      let letterPathWithOffset = '';
      
      for (const cmd of commands) {
        if (!cmd) continue;
        
        const command = cmd[0];
        const params = cmd.slice(1).trim().split(/[\s,]+/).filter(Boolean);
        
        if (command === 'Z' || command === 'z') {
          letterPathWithOffset += command;
          continue;
        }
        
        let newParams: string[] = [];
        let isX = true;
        
        for (let i = 0; i < params.length; i++) {
          const param = params[i];
          if (!isNaN(parseFloat(param))) {
            if (isX && /[MLHVCSQTA]/.test(command)) {
              newParams.push((parseFloat(param) + xOffset).toString());
            } else {
              newParams.push(param);
            }
            isX = !isX;
          } else {
            newParams.push(param);
          }
        }
        
        letterPathWithOffset += command + newParams.join(' ');
      }
      
      path += letterPathWithOffset;
      
      // Update offset for next letter
      xOffset += letterData.width + letterSpacing;
    }
  }

  return { path, fill: currentFill };
} 