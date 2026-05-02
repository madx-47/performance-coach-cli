#!/usr/bin/env node
import 'dotenv/config';
import { classifyTask } from './ai/classifier.js';
import { generatePlaybook } from './ai/playbook.js';
import { generateGrowthPlugin } from './ai/growth-plugin.js';
import type { ClassifierOutput, PlaybookOutput, GrowthPluginOutput } from './types.js';
import process from 'node:process';
import * as fs from 'fs/promises';
import * as path from 'path';

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';

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

async function savePlaybookAsMarkdown(
  title: string, 
  description: string, 
  classification: ClassifierOutput, 
  pb: PlaybookOutput,
  growth: GrowthPluginOutput
): Promise<string> {
  const folder = 'task-reports';
  await fs.mkdir(folder, { recursive: true });
  
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
  const filepath = path.join(folder, filename);
  
  let md = `# Task Playbook: ${title}\n\n`;
  
  md += `> **Task Description**: ${description || '(No description provided)'}\n`;
  md += `> **Estimated Timeline**: ${pb.estimatedTimeline}\n\n`;

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
  md += `\n\n`;

  // Growth Plugin Section
  if (growth.shouldDisplay && growth.growthPlugin.length > 0) {
    md += `---\n\n`;
    md += `## Performance Review – Areas for Improvement & Growth Plan\n\n`;
    
    for (const item of growth.growthPlugin) {
      md += `### ${item.areaName}\n\n`;
      md += `#### 🔴 What needs improvement:\n`;
      md += `${item.whatNeedsImprovement}\n\n`;
      
      md += `#### ❓ Why this matters:\n`;
      md += `${item.whyThisMatters}\n\n`;
      
      md += `#### 📈 How to improve:\n`;
      item.howToImprove.forEach(h => md += `- ${h}\n`);
      md += `\n`;
    }
  }

  await fs.writeFile(filepath, md);
  return filepath;
}

function showUsage() {
  console.log(`
${BOLD}Performance Coach CLI${RESET}

Usage:
  npm run dev -- "<task title>" "<task description>"

Examples:
  npm run dev -- "Fix memory leak in parser" "Users report high memory usage after parsing large files."
  npm run dev -- "Design auth middleware" "Create JWT-based auth middleware for the API gateway."

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

  // Step 3: Growth Plugin
  console.log(`\n${DIM}Analyzing career growth opportunities...${RESET}`);
  let growth: GrowthPluginOutput | undefined;
  try {
    if (classification) {
      growth = await generateGrowthPlugin(title, description, classification.dimensions);
    }
  } catch (err) {
    console.warn(`\n${YELLOW}⚠ Growth Plugin failed (skipping):${RESET}`, err instanceof Error ? err.message : err);
    growth = { growthPlugin: [], shouldDisplay: false };
  }

  if (playbook && classification && growth) {
    console.log(`\n${BOLD}Estimated Timeline:${RESET} ${playbook.estimatedTimeline}`);
    try {
      const savedPath = await savePlaybookAsMarkdown(title, description, classification, playbook, growth);
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
