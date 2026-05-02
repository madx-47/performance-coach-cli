#!/usr/bin/env node
import { Command } from 'commander';
import { startRepl } from './repl.js';
import config from './config.js';

const program = new Command();

program
  .name('ai-coach')
  .description('AI-powered performance coach for developers')
  .version('1.0.0');

program
  .command('interactive', { isDefault: true })
  .description('Start the interactive coach session')
  .action(async () => {
    await startRepl();
  });

program
  .command('connect')
  .description('Set NVIDIA NIM API Key')
  .action(async () => {
    // We can just start the repl and it will handle it, 
    // or we can implement a direct command if needed.
    // For now, let's just start the REPL as it's the main flow.
    await startRepl();
  });

program.parse(process.argv);
