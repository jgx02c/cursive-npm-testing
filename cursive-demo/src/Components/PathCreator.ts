import { LetterPath } from './Loader';

export interface PositionedPath {
  path: string;
  xOffset: number;
  width: number;
  height: number;
}

export function createPositionedPath(letterPath: LetterPath, xOffset: number): PositionedPath {
  const commands = letterPath.path.split(/(?=[MLHVCSQTAZmlhvcsqtaz])/);
  let positionedPath = '';
  let currentX = xOffset;
  
  for (const cmd of commands) {
    if (!cmd) continue;
    
    const command = cmd[0];
    const params = cmd.slice(1).trim().split(/[\s,]+/).filter(Boolean);
    
    if (command === 'Z' || command === 'z') {
      positionedPath += command;
      continue;
    }
    
    let newParams: string[] = [];
    let isX = true;
    
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      if (!isNaN(parseFloat(param))) {
        if (isX) {
          if (/[MLHVCSQTA]/.test(command)) {
            // Absolute command - add xOffset
            const newX = parseFloat(param) + xOffset;
            newParams.push(newX.toString());
            currentX = newX;
          } else if (/[mlhvcsqta]/.test(command)) {
            // Relative command - only add xOffset to first x coordinate
            if (i === 0) {
              const newX = parseFloat(param) + xOffset;
              newParams.push(newX.toString());
              currentX = newX;
            } else {
              newParams.push(param);
              currentX += parseFloat(param);
            }
          }
        } else {
          newParams.push(param);
        }
        isX = !isX;
      } else {
        newParams.push(param);
      }
    }
    
    positionedPath += command + newParams.join(' ');
  }
  
  return {
    path: positionedPath,
    xOffset,
    width: letterPath.width,
    height: letterPath.height
  };
}

export function measurePath(path: string): { length: number; width: number; height: number } {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathElement.setAttribute("d", path);
  svg.appendChild(pathElement);
  document.body.appendChild(svg);

  const length = pathElement.getTotalLength();
  const bbox = pathElement.getBBox();

  document.body.removeChild(svg);

  return {
    length,
    width: bbox.width,
    height: bbox.height
  };
} 