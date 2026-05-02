import type { ClassifierOutput, PlaybookOutput } from '../types.js';

/**
 * Builds markdown content from classification and playbook data.
 * Uses array-based concatenation for better performance with large outputs.
 */
export function buildPlaybookMarkdown(
  title: string,
  description: string,
  classification: ClassifierOutput,
  playbook: PlaybookOutput
): string {
  const sections: string[] = [];

  // Header
  sections.push(`# Task Playbook: ${title}\n\n`);

  // Task description
  if (classification.dimensions.length > 0) {
    sections.push(`> **Task Description**: ${description || '(No description provided)'}\n\n`);
  }

  // Classification breakdown
  sections.push(buildClassificationSection(classification));

  // Implementation strategy
  sections.push(buildImplementationStrategy(playbook));

  // Checklists
  sections.push(buildChecklistsSection(playbook));

  // Growth nudges
  sections.push(buildGrowthNudgesSection(playbook));

  // Mentor guide
  sections.push(buildMentorGuideSection(playbook));

  return sections.join('');
}

function buildClassificationSection(classification: ClassifierOutput): string {
  const lines: string[] = [
    '## 📊 Classification Breakdown\n\n',
    '| Dimension | Confidence | Rationale |\n',
    '| :--- | :--- | :--- |\n'
  ];

  for (const d of classification.dimensions) {
    const isPrimary = d.dimension === classification.primaryDimension;
    const dimensionName = isPrimary
      ? `**${d.dimension.toUpperCase().replace(/_/g, ' ')} (Primary)**`
      : d.dimension.toUpperCase().replace(/_/g, ' ');
    
    lines.push(`| ${dimensionName} | ${Math.round(d.confidence * 100)}% | ${d.rationale} |\n`);
  }

  lines.push('\n');
  return lines.join('');
}

function buildImplementationStrategy(playbook: PlaybookOutput): string {
  const lines: string[] = ['## 🛠 Implementation Strategy\n\n'];

  for (const dim of playbook.dimensions) {
    lines.push(`### 🎯 ${dim.dimension.toUpperCase().replace(/_/g, ' ')}\n\n`);

    lines.push('#### ✅ Above Average Behaviors\n');
    for (const item of dim.aboveAverage) {
      lines.push(`- ${item}\n`);
    }

    lines.push('\n#### ★ Outstanding Stretch Goals\n');
    for (const item of dim.outstanding) {
      lines.push(`- ${item}\n`);
    }

    lines.push('\n#### ⚠ Pitfalls to Avoid\n');
    for (const item of dim.pitfalls) {
      lines.push(`- ${item}\n`);
    }

    lines.push('\n#### 💡 Coaching Nudge\n');
    for (const item of dim.personalHooks) {
      lines.push(`- ${item}\n`);
    }

    lines.push('\n---\n\n');
  }

  return lines.join('');
}

function buildChecklistsSection(playbook: PlaybookOutput): string {
  const lines: string[] = ['## 📋 Checklists\n\n'];

  lines.push('### 1️⃣ Planning (Before Starting)\n');
  for (const item of playbook.planningChecklist) {
    lines.push(`- [ ] ${item}\n`);
  }

  lines.push('\n### 2️⃣ Execution (While Implementing)\n');
  for (const item of playbook.executionChecklist) {
    lines.push(`- [ ] ${item}\n`);
  }

  lines.push('\n### 3️⃣ Pre-PR (Before Review)\n');
  for (const item of playbook.prePRChecklist) {
    lines.push(`- [ ] ${item}\n`);
  }

  lines.push('\n');
  return lines.join('');
}

function buildGrowthNudgesSection(playbook: PlaybookOutput): string {
  const lines: string[] = ['## 🚀 Growth Nudges\n\n'];

  for (const nudge of playbook.growthNudges) {
    lines.push(`- **${nudge.trigger}**: ${nudge.message}\n`);
  }

  lines.push('\n');
  return lines.join('');
}

function buildMentorGuideSection(playbook: PlaybookOutput): string {
  return '## 📖 Mentor Guide\n\n' + playbook.completionGuide;
}

/**
 * Generates a safe filename from a task title.
 * Handles edge cases like empty titles, special characters, and collisions.
 */
export function generateFilename(title: string, existingFiles: string[] = []): string {
  // Convert to lowercase and replace non-alphanumeric chars with hyphens
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens

  // Fallback if slug is empty or too short
  if (!slug || slug.length < 3) {
    const timestamp = Date.now().toString(36);
    slug = `task-${timestamp}`;
  }

  // Ensure .md extension
  const baseName = slug.replace(/\.md$/, '');
  let filename = `${baseName}.md`;

  // Handle collisions by appending counter
  let counter = 1;
  while (existingFiles.includes(filename)) {
    filename = `${baseName}-${counter}.md`;
    counter++;
  }

  return filename;
}
