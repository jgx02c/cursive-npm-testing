import { LetterPath } from './Loader';

export interface PositionedPath {
  path: string;
  xOffset: number;
  width: number;
  height: number;
}

export function createPositionedPath(letterPath: LetterPath, xOffset: number): PositionedPath {
  // Just add a move command at the start to position the letter
  const positionedPath = `M${xOffset} 0 ${letterPath.path}`;
  
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