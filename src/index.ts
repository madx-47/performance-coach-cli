#!/usr/bin/env node
import 'dotenv/config';
import { classifyTask } from './ai/classifier.js';
import { generatePlaybook } from './ai/playbook.js';
import type { ClassifierOutput, PlaybookOutput } from './types.js';
import process from 'node:process';

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';

function printHeader(text: string) {
  console.log(`\n${BOLD}${BLUE}══════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${BLUE}  ${text}${RESET}`);
  console.log(`${BOLD}${BLUE}══════════════════════════════════════════════════════════════${RESET}\n`);
}

function printSection(title: string, color: string = CYAN) {
  console.log(`\n${BOLD}${color}▶ ${title}${RESET}`);
  console.log(`${DIM}${'─'.repeat(60)}${RESET}`);
}

function printBullet(text: string, prefix: string = '  •') {
  console.log(`${prefix} ${text}`);
}

function printCheck(text: string) {
  console.log(`  ${GREEN}✓${RESET} ${text}`);
}

function printWarn(text: string) {
  console.log(`  ${YELLOW}⚠${RESET} ${text}`);
}

function printNudge(text: string) {
  console.log(`  ${MAGENTA}💡${RESET} ${text}`);
}

function printDimensionBadge(dim: string, confidence: number) {
  const color = confidence > 0.8 ? GREEN : confidence > 0.5 ? YELLOW : RED;
  const pct = Math.round(confidence * 100);
  process.stdout.write(`  [${color}${dim}${RESET}] ${DIM}(${pct}%)${RESET}  `);
}

function displayClassification(result: ClassifierOutput) {
  printSection('DIMENSION CLASSIFICATION', GREEN);

  console.log(`${BOLD}Primary Dimension:${RESET}`);
  printBullet(result.primaryDimension.toUpperCase(), '  ▸');

  console.log(`\n${BOLD}Secondary Dimensions:${RESET}`);
  for (const dim of result.secondaryDimensions) {
    printBullet(dim, '  ▸');
  }

  console.log(`\n${BOLD}Detailed Breakdown:${RESET}`);
  for (const d of result.dimensions) {
    printDimensionBadge(d.dimension, d.confidence);
    console.log(`\n    ${DIM}${d.rationale}${RESET}`);
    if (d.subSkills.length) {
      console.log(`    ${DIM}Sub-skills: ${d.subSkills.join(', ')}${RESET}`);
    }
    console.log();
  }
}

function displayPlaybook(pb: PlaybookOutput) {
  printSection('YOUR COMPLETION PLAYBOOK', BLUE);

  // Dimension-specific guidance
  for (const dim of pb.dimensions) {
    printSection(dim.dimension.toUpperCase().replace(/_/g, ' '), CYAN);

    if (dim.aboveAverage.length) {
      console.log(`  ${BOLD}${GREEN}Above Average Behaviors:${RESET}`);
      for (const item of dim.aboveAverage) printCheck(item);
    }

    if (dim.outstanding.length) {
      console.log(`\n  ${BOLD}Outstanding Stretch:${RESET}`);
      for (const item of dim.outstanding) printBullet(item, '    ★');
    }

    if (dim.pitfalls.length) {
      console.log(`\n  ${BOLD}${RED}Pitfalls to Avoid:${RESET}`);
      for (const item of dim.pitfalls) printWarn(item);
    }

    if (dim.personalHooks.length) {
      console.log(`\n  ${BOLD}${MAGENTA}Coaching Nudge:${RESET}`);
      for (const item of dim.personalHooks) printNudge(item);
    }
  }

  // Checklists
  if (pb.planningChecklist.length) {
    printSection('PLANNING CHECKLIST (Before You Start)', YELLOW);
    for (const item of pb.planningChecklist) printCheck(item);
  }

  if (pb.executionChecklist.length) {
    printSection('EXECUTION CHECKLIST (While Coding)', GREEN);
    for (const item of pb.executionChecklist) printCheck(item);
  }

  if (pb.prePRChecklist.length) {
    printSection('PRE-PR CHECKLIST (Before Review)', CYAN);
    for (const item of pb.prePRChecklist) printCheck(item);
  }

  // Growth nudges
  if (pb.growthNudges.length) {
    printSection('GROWTH NUDGES', MAGENTA);
    for (const n of pb.growthNudges) {
      printNudge(`${n.trigger}: ${n.message}`);
    }
  }

  // Completion guide
  if (pb.completionGuide) {
    printSection('MENTOR GUIDE: HOW TO COMPLETE THIS TASK', BLUE);
    const paragraphs = pb.completionGuide.split('\n').filter(p => p.trim());
    for (const para of paragraphs) {
      console.log(`  ${para.trim()}`);
      console.log();
    }
  }
}

function showUsage() {
  console.log(`
${BOLD}Performance Coach CLI${RESET}

Usage:
  npm run dev -- "<task title>" "<task description>"

Examples:
  npm run dev -- "Fix memory leak in parser" "Users report high memory usage after parsing large files. Need to identify root cause and implement fix."
  npm run dev -- "Design auth middleware" "Create JWT-based auth middleware for the API gateway. Must handle refresh tokens and role-based access."

Environment:
  Create a .env file with NVIDIA_NIM_API_KEY=your_key_here
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showUsage();
    process.exit(0);
  }

  if (!process.env.NVIDIA_NIM_API_KEY) {
    console.error(`\n${RED}✖ Missing NVIDIA_NIM_API_KEY${RESET}`);
    console.log(`Please create a ${BOLD}.env${RESET} file with:`);
    console.log(`${CYAN}NVIDIA_NIM_API_KEY=your_key_here${RESET}`);
    console.log(`\nYou can get a key at: ${BLUE}https://build.nvidia.com/explore/discover${RESET}`);
    process.exit(1);
  }

  const title = args[0];
  const description = args[1] || '';

  printHeader('PERFORMANCE COACH — TASK INTAKE');
  console.log(`${BOLD}Task:${RESET} ${title}`);
  if (description) {
    console.log(`${BOLD}Description:${RESET} ${description}`);
  }

  // Step 1: Classification
  console.log(`\n${DIM}Analyzing task dimensions via NVIDIA NIM...${RESET}`);
  let classification: ClassifierOutput | undefined;
  try {
    classification = await classifyTask(title, description);
  } catch (err) {
    console.error(`\n${RED}✖ Classification failed:${RESET}`, err instanceof Error ? err.message : err);
    process.exit(1);
  }
  if (classification) {
    displayClassification(classification);
  }

  // Step 2: Playbook generation
  console.log(`\n${DIM}Generating your personalized playbook...${RESET}`);
  let playbook: PlaybookOutput | undefined;
  try {
    if (classification) {
      playbook = await generatePlaybook(title, description, classification.dimensions);
    }
  } catch (err) {
    console.error(`\n${RED}✖ Playbook generation failed:${RESET}`, err instanceof Error ? err.message : err);
    process.exit(1);
  }
  if (playbook) {
    displayPlaybook(playbook);
  }

  printHeader('READY TO EXECUTE — GO GET IT! 🚀');
}

main().catch(err => {
  console.error(`${RED}Unexpected error:${RESET}`, err);
  process.exit(1);
});
