const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy CJS files
fs.copyFileSync('dist/cjs/index.js', 'dist/index.js');
fs.copyFileSync('dist/cjs/index.d.ts', 'dist/index.d.ts');

// Copy ESM files and rename
fs.copyFileSync('dist/esm/index.js', 'dist/index.mjs');

// Ensure components directory exists
if (!fs.existsSync('dist/components')) {
  fs.mkdirSync('dist/components', { recursive: true });
}

// Copy component files
fs.cpSync('dist/cjs/components', 'dist/components', { recursive: true });
fs.cpSync('dist/cjs/fonts', 'dist/fonts', { recursive: true });

// Copy SVG files
if (!fs.existsSync('dist/fonts/svg')) {
  fs.mkdirSync('dist/fonts/svg', { recursive: true });
}
fs.cpSync('src/fonts/svg/*.svg', 'dist/fonts/svg', { recursive: true });

// Create package.json for proper ESM exports
const packageJson = {
  "type": "module",
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.js",
      "types": "./index.d.ts"
    }
  }
};

fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));

// Clean up intermediate directories
fs.rmSync('dist/cjs', { recursive: true });
fs.rmSync('dist/esm', { recursive: true }); 