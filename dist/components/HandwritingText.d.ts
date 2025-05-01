import React, { ElementType } from "react";
interface HandwritingTextProps {
    /** The text to be displayed */
    children: React.ReactNode;
    /** SVG path data for the text. If not provided, uses the default cursive path */
    path?: string;
    /** Imported SVG file path */
    svgFile?: string;
    /** Color of the stroke */
    strokeColor?: string;
    /** Width of the stroke */
    strokeWidth?: number;
    /** Duration of the animation in seconds */
    duration?: number;
    /** Initial stroke dash array value (defaults to 2000) */
    strokeDashArray?: number;
    /** HTML element type to wrap the text (defaults to 'div') */
    as?: ElementType;
}
export declare const HandwritingText: React.FC<HandwritingTextProps>;
export {};
