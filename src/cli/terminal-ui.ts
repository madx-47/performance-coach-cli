import process from 'node:process';

const colorEnabled = Boolean(
  process.stdout.isTTY && !process.env.NO_COLOR
);

const RESET = colorEnabled ? '\x1b[0m' : '';
const BOLD = colorEnabled ? '\x1b[1m' : '';
const DIM = colorEnabled ? '\x1b[2m' : '';
const CYAN = colorEnabled ? '\x1b[36m' : '';
const BLUE = colorEnabled ? '\x1b[34m' : '';
const GREEN = colorEnabled ? '\x1b[32m' : '';
const YELLOW = colorEnabled ? '\x1b[33m' : '';
const RED = colorEnabled ? '\x1b[31m' : '';

function line(width = 70): string {
  return '-'.repeat(width);
}

export function renderBanner(title: string, subtitle?: string): void {
  console.log(`\n${BOLD}${BLUE}${line()}${RESET}`);
  console.log(`${BOLD}${BLUE}${title}${RESET}`);
  if (subtitle) {
    console.log(`${DIM}${subtitle}${RESET}`);
  }
  console.log(`${BOLD}${BLUE}${line()}${RESET}\n`);
}

export function renderSection(title: string): void {
  console.log(`\n${BOLD}${CYAN}${title}${RESET}`);
  console.log(`${DIM}${line(56)}${RESET}`);
}

export function renderInfo(label: string, value: string): void {
  console.log(`${BOLD}${label}:${RESET} ${value}`);
}

export function renderHint(text: string): void {
  console.log(`${DIM}${text}${RESET}`);
}

export function renderOk(text: string): void {
  console.log(`${GREEN}[ok]${RESET} ${text}`);
}

export function renderWarn(text: string): void {
  console.log(`${YELLOW}[warn]${RESET} ${text}`);
}

export function renderError(text: string): void {
  console.error(`${RED}[error]${RESET} ${text}`);
}

export function formatDimensionBadge(name: string, confidence: number): string {
  const pct = Math.round(confidence * 100);
  const color = confidence >= 0.8 ? GREEN : confidence >= 0.5 ? YELLOW : RED;
  return `${color}${name.toUpperCase()}${RESET} ${DIM}${pct}%${RESET}`;
}

export function renderDimensionBadge(name: string, confidence: number): void {
  console.log(formatDimensionBadge(name, confidence));
}

export function supportsColor(): boolean {
  return colorEnabled;
}
