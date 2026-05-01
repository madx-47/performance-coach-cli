#!/usr/bin/env node
import 'dotenv/config';
import { classifyTask } from './ai/classifier.js';
import { generatePlaybook } from './ai/playbook.js';
import { generateGrowthPlugin } from './ai/growth-plugin.js';
import type { ClassifierOutput, PlaybookOutput, GrowthPluginOutput } from './types.js';
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

function displayGrowthPlugin(gp: GrowthPluginOutput) {
  if (!gp.shouldDisplay || gp.growthPlugin.length === 0) {
    return;
  }

  printSection('GROWTH PLUGIN: PERSONALIZED DEVELOPMENT AREAS', MAGENTA);
  
  for (const item of gp.growthPlugin) {
    console.log(`\n${BOLD}${CYAN}▶ ${item.areaName}${RESET}`);
    console.log(`${DIM}${'─'.repeat(60)}${RESET}`);
    
    console.log(`  ${BOLD}Focus:${RESET} ${item.whatNeedsImprovement}`);
    console.log(`  ${BOLD}Why it matters:${RESET} ${item.whyThisMatters}`);
    console.log(`  ${BOLD}How to improve:${RESET}`);
    for (const step of item.howToImprove) {
      printBullet(step, '    ▸');
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

import * as fs from 'fs/promises';
import * as path from 'path';

// ... (keep print functions)

async function savePlaybookAsMarkdown(title: string, description: string, classification: ClassifierOutput, pb: PlaybookOutput, growthPlugin?: GrowthPluginOutput): Promise<string> {
  const folder = 'task-details';
  await fs.mkdir(folder, { recursive: true });
  
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
  const filepath = path.join(folder, filename);
  
  let md = `# Task Playbook: ${title}\n\n`;
  
  if (classification.dimensions.length > 0) {
    md += `> **Task Description**: ${description || '(No description provided)'}\n\n`;
  }

  md += `## 📊 Classification Breakdown\n\n`;
  md += `| Dimension | Confidence | Rationale |\n`;
  md += `| :--- | :--- | :--- |\n`;
  for (const d of classification.dimensions) {
    const isPrimary = d.dimension === classification.primaryDimension;
    md += `| ${isPrimary ? '**' : ''}${d.dimension.toUpperCase().replace(/_/g, ' ')}${isPrimary ? ' (Primary)**' : ''} | ${Math.round(d.confidence * 100)}% | ${d.rationale} |\n`;
  }
  md += `\n`;

  md += `## 🛠 Implementation Strategy\n\n`;

  for (const dim of pb.dimensions) {
    md += `### 🎯 ${dim.dimension.toUpperCase().replace(/_/g, ' ')}\n\n`;
    
    md += `#### ✅ Above Average Behaviors\n`;
    dim.aboveAverage.forEach(item => md += `- ${item}\n`);
    
    md += `\n#### ★ Outstanding Stretch Goals\n`;
    dim.outstanding.forEach(item => md += `- ${item}\n`);
    
    md += `\n#### ⚠ Pitfalls to Avoid\n`;
    dim.pitfalls.forEach(item => md += `- ${item}\n`);
    
    md += `\n#### 💡 Coaching Nudge\n`;
    dim.personalHooks.forEach(item => md += `- ${item}\n`);
    md += `\n---\n\n`;
  }

  md += `## 📋 Checklists\n\n`;
  
  md += `### 1️⃣ Planning (Before Starting)\n`;
  pb.planningChecklist.forEach(item => md += `- [ ] ${item}\n`);
  
  md += `\n### 2️⃣ Execution (While Implementing)\n`;
  pb.executionChecklist.forEach(item => md += `- [ ] ${item}\n`);
  
  md += `\n### 3️⃣ Pre-PR (Before Review)\n`;
  pb.prePRChecklist.forEach(item => md += `- [ ] ${item}\n`);

  md += `\n## 🚀 Growth Nudges\n\n`;
  pb.growthNudges.forEach(n => md += `- **${n.trigger}**: ${n.message}\n`);

  md += `\n## 📖 Mentor Guide\n\n`;
  md += pb.completionGuide;

  // Add Growth Plugin section after Mentor Guide if applicable
  if (growthPlugin && growthPlugin.shouldDisplay && growthPlugin.growthPlugin.length > 0) {
    md += `\n\n## 🌱 Growth Plugin: Personalized Development Areas\n\n`;
    md += `> These growth areas have been identified as particularly relevant to this specific task.\n\n`;
    
    for (const item of growthPlugin.growthPlugin) {
      md += `### ${item.areaName}\n\n`;
      md += `**Focus:** ${item.whatNeedsImprovement}\n\n`;
      md += `**Why this matters:** ${item.whyThisMatters}\n\n`;
      md += `**How to improve:**\n`;
      item.howToImprove.forEach(step => md += `- ${step}\n`);
      md += `\n---\n\n`;
    }
  }

  await fs.writeFile(filepath, md);
  return filepath;
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

  if (playbook && classification) {
    // Display the Mentor Guide
    displayPlaybook(playbook);

    // Step 3: Growth Plugin generation (optional, only when relevant)
    console.log(`${DIM}Evaluating growth opportunities...${RESET}`);
    let growthPlugin: GrowthPluginOutput | undefined;
    try {
      growthPlugin = await generateGrowthPlugin(title, description, classification.dimensions);

      // Display growth plugin if applicable
      if (growthPlugin && growthPlugin.shouldDisplay) {
        displayGrowthPlugin(growthPlugin);
      }
    } catch (err) {
      console.warn(`${YELLOW}⚠ Growth Plugin evaluation skipped:${RESET}`, err instanceof Error ? err.message : err);
      growthPlugin = undefined;
    }

    try {
      const savedPath = await savePlaybookAsMarkdown(title, description, classification, playbook, growthPlugin);
      console.log(`\n${GREEN}✔ Playbook saved to:${RESET} ${BOLD}${savedPath}${RESET}`);
      console.log(`${DIM}Open this file to follow your implementation guide!${RESET}\n`);
    } catch (err) {
      console.error(`\n${RED}✖ Failed to save playbook file:${RESET}`, err instanceof Error ? err.message : err);
      process.exit(1);
    }
  }

  printHeader('READY TO EXECUTE — GO GET IT! 🚀');
}


main().catch(err => {
  console.error(`${RED}Unexpected error:${RESET}`, err);
  process.exit(1);
});
