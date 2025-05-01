"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandwritingText = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// src/components/HandwritingText.tsx
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const defaultPath_1 = require("../fonts/defaultPath");
const HandwritingText = ({ children, path = defaultPath_1.defaultPath, svgFile, strokeColor = "#000", strokeWidth = 2, duration = 3, strokeDashArray = 2000, as: Component = "div", }) => {
    const controls = (0, framer_motion_1.useAnimation)();
    const [svgContent, setSvgContent] = react_1.default.useState(null);
    const [dimensions, setDimensions] = react_1.default.useState({ width: 0, height: 0 });
    // Load SVG file if provided
    (0, react_1.useEffect)(() => {
        if (svgFile) {
            fetch(svgFile)
                .then(response => response.text())
                .then(text => {
                // Extract path data from SVG
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'image/svg+xml');
                const pathElement = doc.querySelector('path');
                if (pathElement) {
                    setSvgContent(pathElement.getAttribute('d') || null);
                }
            })
                .catch(error => console.error('Error loading SVG:', error));
        }
    }, [svgFile]);
    // Calculate viewBox and dimensions based on path
    (0, react_1.useEffect)(() => {
        const pathToUse = svgContent || path;
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", pathToUse);
        const bbox = pathElement.getBBox();
        setDimensions({
            width: bbox.width,
            height: bbox.height
        });
    }, [path, svgContent]);
    (0, react_1.useEffect)(() => {
        controls.start({
            strokeDashoffset: 0,
            transition: { duration, ease: "easeInOut" },
        });
    }, [controls, duration]);
    const containerStyle = {
        position: 'relative',
        display: 'inline-block',
        width: dimensions.width || 'auto',
        height: dimensions.height || 'auto',
        minWidth: '100px',
        minHeight: '50px'
    };
    const svgStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible'
    };
    return ((0, jsx_runtime_1.jsxs)(Component, { style: containerStyle, children: [(0, jsx_runtime_1.jsx)("svg", { viewBox: `0 0 ${dimensions.width} ${dimensions.height}`, fill: "none", xmlns: "http://www.w3.org/2000/svg", style: svgStyle, children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.path, { d: svgContent || path, stroke: strokeColor, strokeWidth: strokeWidth, fill: "none", strokeDasharray: strokeDashArray, strokeDashoffset: strokeDashArray, animate: controls }) }), (0, jsx_runtime_1.jsx)("span", { style: { visibility: 'hidden', display: 'block', width: dimensions.width, height: dimensions.height }, children: children })] }));
};
exports.HandwritingText = HandwritingText;
