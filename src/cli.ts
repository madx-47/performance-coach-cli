#!/usr/bin/env node
import { Command } from 'commander';
import { startRepl, handleConnect } from './repl.js';

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
    await handleConnect();
  });

program.parse(process.argv);
