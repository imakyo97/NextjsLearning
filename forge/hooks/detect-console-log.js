#!/usr/bin/env node

/**
 * PostToolUse hook for Write tool.
 * Warns when console.log is found in .ts/.tsx files.
 * console.error and console.warn are allowed.
 */

const fs = require('fs');
const input = process.argv[2];

try {
  const toolInput = JSON.parse(input);
  const filePath = toolInput.file_path || '';

  // Only check .ts and .tsx files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    process.exit(0);
  }

  // Read the file content
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const consoleLogLines = [];
  lines.forEach((line, index) => {
    // Match console.log but not console.error or console.warn
    if (/console\.log\s*\(/.test(line) && !line.trim().startsWith('//')) {
      consoleLogLines.push(index + 1);
    }
  });

  if (consoleLogLines.length > 0) {
    console.error(`WARNING: console.log detected in ${filePath}`);
    console.error(`Lines: ${consoleLogLines.join(', ')}`);
    console.error('Consider using console.error or console.warn for intentional logging,');
    console.error('or remove console.log before committing.');
  }

  // Always exit 0 (warning only, not blocking)
  process.exit(0);
} catch (e) {
  process.exit(0);
}
