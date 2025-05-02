// src/components/HandwritingText.tsx
import React, { useEffect, ElementType } from "react";
import { motion, useAnimation } from "framer-motion";
import { initializeFont, LetterPaths } from "./Loader";
import { assembleText } from "./Assembler";
import { measurePath, PositionedPath } from "./PathCreator";

interface HandwritingTextProps {
  /** The text to be displayed */
  children: React.ReactNode;
  /** SVG path data for the text. If not provided, uses the SVG loader */
  path?: string;
  /** Imported SVG file path */
  svgFile?: string;
  /** Color of the stroke */
  strokeColor?: string;
  /** Width of the stroke */
  strokeWidth?: number;
  /** Duration of the animation in seconds */
  duration?: number;
  /** HTML element type to wrap the text (defaults to 'div') */
  as?: ElementType;
  /** Path to the font folder containing letter SVGs */
  fontPath?: string;
  /** Whether to show debug logging */
  debug?: boolean;
}

export const HandwritingText: React.FC<HandwritingTextProps> = ({
  children,
  path,
  svgFile,
  strokeColor = "#000",
  strokeWidth = 2,
  duration = 3,
  as: Component = "div",
  fontPath = "google",
  debug = false,
}) => {
  const log = (...args: any[]) => {
    if (debug) {
      console.log('[HandwritingText]', ...args);
    }
  };

  log('Rendering with children:', children, 'fontPath:', fontPath);
  
  const controls = useAnimation();
  const [svgContent, setSvgContent] = React.useState<string | null>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [letterPaths, setLetterPaths] = React.useState<LetterPaths>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pathLength, setPathLength] = React.useState(0);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [individualPaths, setIndividualPaths] = React.useState<PositionedPath[]>([]);

  // Initialize font
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);
    
    const loadFont = async () => {
      try {
        log(`Loading font from path: ${fontPath}`);
        const paths = await initializeFont(fontPath);
        
        if (!mounted) return;
        
        if (Object.keys(paths).length === 0) {
          log('Warning: No letter paths were loaded');
        } else {
          log(`Loaded ${Object.keys(paths).length} letter paths`);
        }
        
        setLetterPaths(paths);
        setIsLoading(false);
        setIsInitialized(true);
      } catch (error) {
        log('Error loading font:', error);
        if (mounted) {
          setError(`Failed to load font: ${error instanceof Error ? error.message : String(error)}`);
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    loadFont();
    return () => {
      mounted = false;
    };
  }, [fontPath, debug]);

  // Load SVG file if provided
  useEffect(() => {
    if (!svgFile) return;
    
    setIsLoading(true);
    fetch(svgFile)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load SVG file: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(text => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const pathElement = doc.querySelector('path');
        if (pathElement) {
          setSvgContent(pathElement.getAttribute('d') || null);
        } else {
          throw new Error('SVG file does not contain a path element');
        }
        setIsLoading(false);
      })
      .catch(error => {
        log('Error loading SVG file:', error);
        setError(`Failed to load SVG file: ${error instanceof Error ? error.message : String(error)}`);
        setIsLoading(false);
      });
  }, [svgFile, debug]);

  // Calculate viewBox and dimensions based on path
  useEffect(() => {
    if (isLoading || !isInitialized) return;
    
    if (path) {
      // Direct path provided, use it without word generation
      try {
        const measurements = measurePath(path);
        log('Direct path measurements:', measurements);

        setPathLength(measurements.length);
        setDimensions({
          width: measurements.width + 40,
          height: measurements.height + 40
        });
        setSvgContent(path);
      } catch (error) {
        log('Error using provided path:', error);
        setError(`Error with provided path: ${error instanceof Error ? error.message : String(error)}`);
      }
      return;
    }

    // Get text content from children
    const text = typeof children === 'string' ? children : '';
    log('Raw text content:', text);
    if (!text) {
      setError('No text content provided');
      return;
    }
    
    log('Processing text:', text);
    log('Available letter paths:', Object.keys(letterPaths).join(', '));
    
    if (Object.keys(letterPaths).length === 0) {
      setError('No letter paths available');
      return;
    }
    
    try {
      const assembled = assembleText(text, letterPaths);
      log('Assembled text details:', {
        paths: assembled.paths.length,
        totalLength: assembled.totalLength,
        totalWidth: assembled.totalWidth,
        maxHeight: assembled.maxHeight
      });
      
      setIndividualPaths(assembled.paths);
      setPathLength(assembled.totalLength);
      setDimensions({
        width: assembled.totalWidth + 40,
        height: assembled.maxHeight + 40
      });
    } catch (error) {
      log('Error generating text path:', error);
      setError(`Error generating path: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [path, children, letterPaths, isLoading, isInitialized, debug]);

  // Animate the paths
  useEffect(() => {
    if (individualPaths.length > 0) {
      log('Starting animation with', individualPaths.length, 'paths');
      
      // Reset all paths
      controls.set({ strokeDashoffset: pathLength });
      
      // Start the animation
      controls.start({
        strokeDashoffset: 0,
        transition: {
          duration,
          ease: [0.4, 0, 0.2, 1],
        },
      }).catch(error => {
        log('Animation error:', error);
      });
    }
  }, [controls, duration, individualPaths, pathLength]);

  const containerStyle = {
    position: 'relative' as const,
    display: 'inline-block',
    width: dimensions.width || 'auto',
    height: dimensions.height || 'auto',
    minWidth: '100px',
    minHeight: '50px'
  };

  const svgStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'visible' as const
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <Component style={containerStyle}>
      {error ? (
        <div style={{ fontSize: '14px', color: 'red', padding: '10px' }}>
          {debug ? error : 'Error loading content'}
        </div>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={svgStyle}
          >
            {individualPaths.map((positionedPath, index) => {
              const pathLength = measurePath(positionedPath.path).length;
              return (
                <motion.path
                  key={`path-${index}`}
                  d={positionedPath.path}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={pathLength}
                  strokeDashoffset={pathLength}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={controls}
                />
              );
            })}
          </svg>
          <span style={{ visibility: 'hidden', display: 'block', width: dimensions.width, height: dimensions.height }}>
            {children}
          </span>
        </>
      )}
    </Component>
  );
};