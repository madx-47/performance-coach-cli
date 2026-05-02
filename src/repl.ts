import * as p from '@clack/prompts';
import color from 'picocolors';
import config, { SUPPORTED_MODELS } from './config.js';
import { processTask } from './index.js';
import path from 'path';

export async function startRepl() {
  p.intro(`${color.bgCyan(color.black(' AI PERFORMANCE COACH '))}`);

  // Initial check for API Key (also check environment)
  if (!config.get('nimApiKey') && !process.env.NVIDIA_NIM_API_KEY) {
    p.note(color.yellow('No NVIDIA NIM API Key found. Let\'s set it up!'));
    await handleConnect();
  }

  while (true) {
    const command = await p.text({
      message: `Enter a command (${color.cyan('/task')}, ${color.cyan('/connect')}, ${color.cyan('/model')}, ${color.cyan('/task-reports')}) or a task title:`,
      placeholder: 'e.g., /task or "Refactor auth logic"',
      validate: (value) => {
        if (!value) return 'Please enter something';
      }
    });

    if (p.isCancel(command)) {
      p.outro('See you next time! 👋');
      process.exit(0);
    }

    const cmd = command.trim();

    if (cmd === '/connect') {
      await handleConnect();
    } else if (cmd === '/model') {
      await handleModel();
    } else if (cmd === '/task-reports') {
      await handleReportsDir();
    } else if (cmd === '/task' || !cmd.startsWith('/')) {
      const title = cmd === '/task' ? '' : cmd;
      await handleTask(title);
    } else {
      p.log.error(color.red(`Unknown command: ${cmd}`));
    }
  }
}

export async function handleConnect() {
  const apiKey = await p.password({
    message: 'Enter your NVIDIA NIM API Key:',
    validate: (value) => {
      if (!value) return 'API Key is required';
    }
  });

  if (p.isCancel(apiKey)) return;

  config.set('nimApiKey', apiKey);
  p.log.success(color.green('API Key saved successfully!'));
}

async function handleModel() {
  const selectedModel = await p.select({
    message: 'Select an AI model to use:',
    options: SUPPORTED_MODELS.map(m => ({ value: m, label: m })),
    initialValue: config.get('model')
  });

  if (p.isCancel(selectedModel)) return;

  config.set('model', selectedModel as string);
  p.log.success(color.green(`Model updated to: ${selectedModel}`));
}

async function handleReportsDir() {
  const currentDir = config.get('reportsDir');
  const newDir = await p.text({
    message: 'Enter the output folder location for reports:',
    placeholder: currentDir,
    defaultValue: currentDir
  });

  if (p.isCancel(newDir)) return;

  const absolutePath = path.isAbsolute(newDir) ? newDir : path.join(process.cwd(), newDir);
  config.set('reportsDir', absolutePath);
  p.log.success(color.green(`Reports will be saved to: ${absolutePath}`));
}

async function handleTask(initialTitle: string) {
  let title = initialTitle;
  if (!title) {
    const t = await p.text({
      message: 'Enter task title:',
      validate: (value) => {
        if (!value) return 'Title is required';
      }
    });
    if (p.isCancel(t)) return;
    title = t;
  }

  p.log.step(color.cyan('Entering task description. Press Enter for newline, press Enter on an empty line to submit.'));
  
  const lines: string[] = [];
  while (true) {
    const line = await p.text({
      message: lines.length === 0 ? 'Description:' : '',
      placeholder: lines.length === 0 ? 'Add details (Double-Enter to finish)' : '',
    });

    if (p.isCancel(line)) return;
    if (line.trim() === '' && lines.length > 0) break;
    if (line.trim() === '' && lines.length === 0) {
      // Allow empty description if they double-enter immediately
      break;
    }
    lines.push(line);
  }

  const description = lines.join('\n');

  const s = p.spinner();
  s.start('Generating playbook...');
  
  try {
    const savedPath = await processTask(title, description);
    s.stop(color.green('Playbook generated!'));
    if (savedPath) {
      p.note(`${color.dim('File Location:')}\n${color.cyan(savedPath)}`, 'Success');
    }
  } catch (err) {
    s.stop(color.red('Generation failed'));
    p.log.error(err instanceof Error ? err.message : String(err));
  }
}
