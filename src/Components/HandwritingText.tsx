// src/components/HandwritingText.tsx
import React, { useEffect, ElementType, useRef, useState } from "react";
import { initializeFont, LetterPaths } from "./Loader";
import { QueueManager, QueuedLetter } from "./QueueManager";

interface HandwritingTextProps {
  /** The text to be displayed */
  children: React.ReactNode;
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
  /** Callback function to be called when animation completes */
  onAnimationComplete?: () => void;
}

export const HandwritingText: React.FC<HandwritingTextProps> = ({
  children,
  strokeColor = "#000",
  strokeWidth = 2,
  duration = 3,
  as: Component = "div",
  fontPath = "google",
  debug = false,
  onAnimationComplete,
}) => {
  const log = (...args: any[]) => {
    if (debug) {
      console.log('[HandwritingText]', ...args);
    }
  };

  const [letterPaths, setLetterPaths] = React.useState<LetterPaths>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [renderedLetters, setRenderedLetters] = useState<QueuedLetter[]>([]);
  const [currentLetter, setCurrentLetter] = React.useState<QueuedLetter | null>(null);
  const queueManagerRef = useRef<QueueManager | null>(null);
  const currentPathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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
          throw new Error('No letter paths were loaded');
        }
        
        log(`Loaded ${Object.keys(paths).length} letter paths`);
        setLetterPaths(paths);
        queueManagerRef.current = new QueueManager(paths);
        setIsLoading(false);
      } catch (error) {
        log('Error loading font:', error);
        if (mounted) {
          setError(`Failed to load font: ${error instanceof Error ? error.message : String(error)}`);
          setIsLoading(false);
        }
      }
    };

    loadFont();
    return () => {
      mounted = false;
    };
  }, [fontPath, debug]);

  // Process text and update dimensions
  useEffect(() => {
    if (isLoading || !queueManagerRef.current) return;
    
    const text = typeof children === 'string' ? children : '';
    if (!text) {
      setError('No text content provided');
      return;
    }
    
    queueManagerRef.current.reset();
    queueManagerRef.current.addText(text);
    setRenderedLetters([]); // Clear previous letters
    
    // Add padding to dimensions
    const padding = 20;
    setDimensions({
      width: queueManagerRef.current.getTotalLength() + (padding * 2),
      height: queueManagerRef.current.getMaxHeight() + (padding * 2)
    });
    
    // Start with first letter
    setCurrentLetter(queueManagerRef.current.getNextLetter());
  }, [children, letterPaths, isLoading]);

  // Calculate baseline Y position - use 75% of max height as baseline
  const baselineY = Math.floor(dimensions.height * 0.75);

  // Animate current letter
  useEffect(() => {
    if (!currentLetter || !currentPathRef.current) return;
    
    try {
      const path = currentPathRef.current;
      const pathLength = path.getTotalLength();
      
      if (isNaN(pathLength)) {
        throw new Error('Invalid path length');
      }
      
      log(`Animating letter "${currentLetter.letter}" with length ${pathLength}`);

      const text = typeof children === 'string' ? children : '';
      const letterDuration = (duration / text.length) * 1.25; // Slightly longer duration for overlap
      
      // Set initial state
      path.style.strokeDasharray = `${pathLength}`;
      path.style.strokeDashoffset = `${pathLength}`;
      path.style.opacity = '1';
      
      // Animate using CSS
      path.style.transition = `stroke-dashoffset ${letterDuration}s cubic-bezier(0.33, 1, 0.68, 1)`;
      path.style.strokeDashoffset = '0';
      
      // Handle completion
      const timer = setTimeout(() => {
        if (queueManagerRef.current) {
          setRenderedLetters(prev => [...prev, currentLetter]);
          queueManagerRef.current.markAsRendered(currentLetter.order);
          
          // Start next letter
          const nextLetter = queueManagerRef.current.getNextLetter();
          if (nextLetter) {
            setCurrentLetter(nextLetter);
          } else {
            onAnimationComplete?.();
          }
        }
      }, letterDuration * 1000);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error in letter animation:', error);
      setError(`Error animating letter: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [currentLetter, duration, children, onAnimationComplete]);

  const containerStyle = {
    position: 'relative' as const,
    display: 'inline-block',
    width: dimensions.width || 'auto',
    height: dimensions.height || 'auto',
    minWidth: '100px',
    minHeight: '50px',
    opacity: isLoading ? 0 : 1,
    transition: 'opacity 0.3s ease-in'
  };

  const svgStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'visible' as const
  };

  if (isLoading) {
    return <Component style={containerStyle} />;
  }

  return (
    <Component style={containerStyle}>
      {error ? (
        <div style={{ fontSize: '14px', color: 'red', padding: '10px' }}>
          {debug ? error : 'Error loading content'}
        </div>
      ) : (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={svgStyle}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Render completed letters */}
          {renderedLetters.map((letter, index) => (
            <path
              key={`rendered-${index}`}
              d={letter.path.path}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: `translate(${letter.path.xOffset}px, ${baselineY - letter.path.height}px)`
              }}
            />
          ))}
          {/* Render current letter */}
          {currentLetter && (
            <g
              style={{
                transform: `translate(${currentLetter.path.xOffset}px, ${baselineY - currentLetter.path.height}px)`
              }}
            >
              <path
                ref={currentPathRef}
                d={currentLetter.path.path}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: 0
                }}
              />
            </g>
          )}
        </svg>
      )}
    </Component>
  );
};

export default HandwritingText;