import { createInterface, type Interface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export interface TaskInput {
  title: string;
  details: string;
  interactive: boolean;
}

export interface PromptControls {
  doneToken: string;
  cancelToken: string;
}

export const DEFAULT_CONTROLS: PromptControls = {
  doneToken: '/done',
  cancelToken: '/cancel',
};

export class InputCancelledError extends Error {
  constructor() {
    super('Input collection cancelled by user');
    this.name = 'InputCancelledError';
  }
}

function normalize(text: string): string {
  return text.replace(/\r\n/g, '\n').trim();
}

function makeRl(): Interface {
  return createInterface({ input, output });
}

function fromArgs(args: string[]): TaskInput | null {
  if (args.length === 0) {
    return null;
  }

  const title = normalize(args[0] ?? '');
  const details = normalize(args.slice(1).join(' '));
  if (!title) {
    return null;
  }

  return { title, details, interactive: false };
}

export async function collectTaskInput(args: string[]): Promise<TaskInput> {
  const argInput = fromArgs(args);
  if (argInput) {
    return argInput;
  }

  if (!input.isTTY) {
    throw new Error(
      'Interactive mode requires TTY. Provide args: npm run dev -- "<title>" "<details>"',
    );
  }

  const rl = makeRl();
  try {
    const title = await promptTitle(rl);
    const details = await promptMultilineDetails(rl, DEFAULT_CONTROLS);
    return { title, details, interactive: true };
  } finally {
    rl.close();
  }
}

async function promptTitle(rl: Interface): Promise<string> {
  while (true) {
    const title = normalize(await rl.question('Task title: '));
    if (title === DEFAULT_CONTROLS.cancelToken) {
      throw new InputCancelledError();
    }
    if (title.length > 0) {
      return title;
    }
    output.write('Title is required. Enter a task title or /cancel.\n');
  }
}

export async function promptMultilineDetails(
  rl: Interface,
  controls: PromptControls,
): Promise<string> {
  output.write(
    `Task details (multi-line). Enter ${controls.doneToken} on a new line to finish.\n`,
  );
  output.write(`Enter ${controls.cancelToken} to abort.\n\n`);

  const lines: string[] = [];
  while (true) {
    const line = await rl.question('');
    const trimmed = line.trim();
    if (trimmed === controls.cancelToken) {
      throw new InputCancelledError();
    }
    if (trimmed === controls.doneToken) {
      const details = normalize(lines.join('\n'));
      if (!details) {
        output.write('Details are required before finishing.\n');
        continue;
      }
      return details;
    }
    lines.push(line);
  }
}
