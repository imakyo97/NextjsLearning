#!/usr/bin/env node

/**
 * PreToolUse hook for Bash tool.
 * Blocks long-running server processes from running outside tmux.
 */

const input = process.argv[2];

try {
  const toolInput = JSON.parse(input);
  const command = toolInput.command || '';

  // Patterns for long-running server processes
  const serverPatterns = [
    /\bnpx\s+next\s+dev\b/,
    /\bnext\s+dev\b/,
    /\bnext\s+start\b/,
    /\bnode\s+server\b/,
    /\bnpm\s+run\s+dev\b/,
    /\bnpm\s+start\b/,
  ];

  const isServerCommand = serverPatterns.some(pattern => pattern.test(command));

  if (!isServerCommand) {
    process.exit(0);
  }

  // Check if already running in tmux or the command uses tmux
  const isTmux = process.env.TMUX !== undefined;
  const usesTmux = /\btmux\b/.test(command);

  if (isTmux || usesTmux) {
    process.exit(0);
  }

  console.error('BLOCKED: Long-running server process detected outside tmux.');
  console.error(`Command: ${command}`);
  console.error('');
  console.error('Please run server processes inside tmux:');
  console.error('  tmux new-session -d -s dev "npm run dev"');
  console.error('');
  console.error('Or use background execution:');
  console.error('  Run with run_in_background: true');
  process.exit(2);
} catch (e) {
  process.exit(0);
}
