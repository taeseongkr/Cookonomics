#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findJSFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && item !== 'node_modules' && item !== 'build') {
      findJSFiles(fullPath, files);
    } else if (item.endsWith('.js') && !item.endsWith('.test.js')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function removeConsoleLogs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remove console.log statements (but keep console.error and console.warn)
  const lines = content.split('\n');
  const cleanedLines = lines.filter(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('console.log(') && !trimmed.includes('console.error') && !trimmed.includes('console.warn')) {
      modified = true;
      return false;
    }
    return true;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, cleanedLines.join('\n'));
    console.log(`Cleaned: ${filePath}`);
  }
}

// Find all JS files in src directory
const srcDir = path.join(__dirname, 'src');
const jsFiles = findJSFiles(srcDir);

console.log(`Found ${jsFiles.length} JS files to check...`);

// Clean each file
jsFiles.forEach(removeConsoleLogs);

console.log('Cleanup complete!');
