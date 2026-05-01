# Performance Coach CLI

A terminal-based AI coach that classifies software engineering tasks against 9 performance dimensions and generates a personalized completion playbook using **NVIDIA NIM API**.

## What It Does

1. **Dimension Classifier** — Analyzes your task title + description and maps it to performance dimensions (Planning, Design, Troubleshooting, etc.)
2. **Playbook Generator** — Creates a detailed guide with:
   - Above Average behaviors to demonstrate
   - Pitfalls to avoid
   - Planning, execution, and pre-PR checklists
   - Growth nudges
   - A mentor-style narrative guide

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and add your NVIDIA NIM API key:
# NVIDIA_NIM_API_KEY=nvapi-xxxxxxxx
```

### 3. Run it
```bash
# Using tsx (no build needed)
npm run dev -- "Fix memory leak in parser" "Users report high memory usage after parsing large files"

# Or build first, then run
npm run build
npm start -- "Design auth middleware" "Create JWT-based auth middleware for API gateway"
```

## Example Output

```
══════════════════════════════════════════════════════════════
  PERFORMANCE COACH — TASK INTAKE
══════════════════════════════════════════════════════════════

Task: Fix memory leak in parser
Description: Users report high memory usage after parsing large files

Analyzing task dimensions via NVIDIA NIM...

▶ DIMENSION CLASSIFICATION
────────────────────────────────────────────────────────────

Primary Dimension:
  ▸ TROUBLESHOOTING_FIX

Secondary Dimensions:
  ▸ commitment_ownership
  ▸ design_implementation

Detailed Breakdown:
  [troubleshooting_fix] (92%)
    Task involves identifying root cause of a performance issue and implementing a targeted fix.
    Sub-skills: root cause analysis, debugging, memory profiling

  [commitment_ownership] (85%)
    Cross-cutting dimension for all tasks requiring delivery accountability.

  [design_implementation] (78%)
    Fix may require redesigning parser memory handling patterns.
    Sub-skills: code quality, pattern reuse, edge case handling

▶ YOUR COMPLETION PLAYBOOK
────────────────────────────────────────────────────────────

...
```

## Architecture

```
src/
├── index.ts              # CLI entry point
├── types.ts              # Shared TypeScript types
├── ai/
│   ├── nim-client.ts     # NVIDIA NIM gateway (retries, errors, logging)
│   ├── classifier.ts     # Dimension classifier
│   └── playbook.ts       # Playbook generator
└── prompts/
    ├── rubric.ts         # Structured performance rubric data
    ├── classifier-prompt.ts
    └── playbook-prompt.ts
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NVIDIA_NIM_API_KEY` | ✅ | — | Your NVIDIA NIM API key |
| `NVIDIA_NIM_BASE_URL` | ❌ | `https://integrate.api.nvidia.com/v1` | NIM endpoint |
| `NVIDIA_NIM_MODEL` | ❌ | `meta/llama-3.1-70b-instruct` | Model ID |
| `LOG_LEVEL` | ❌ | `info` | Set to `debug` for verbose logs |

## Performance Dimensions

The classifier maps tasks against these 9 dimensions from your company's rubric:

1. **Planning** — Breaking down work, estimating, dependency mapping
2. **Requirement Analysis** — Understanding what needs to be built
3. **Design & Implementation** — Architecture choices, code quality
4. **Build, Test & Deployment** — CI/CD, testing, safe releases
5. **Troubleshooting & Fix** — Debugging, root cause analysis
6. **Commitment & Ownership** — Accountability, follow-through
7. **Leadership** — Mentoring, driving decisions, elevating team
8. **Continuous Learning** — Research, skill improvement
9. **Interpersonal Skills** — Communication, collaboration

## Next Steps (For the Full Project)

This CLI is the **Phase 1 foundation**. Future phases add:
- Task tracking with status lifecycle
- Evidence factory (auto-generate B1/B2 review evidence)
- Growth plugin engine (15 personalized coaching triggers)
- Agent service with scheduled jobs
- Angular frontend + dashboard
- RAG pipeline over your company's criteria document

## Development

### Run Tests
```bash
npm test
```

### Linting
```bash
# Check for issues
npm run lint

# Fix issues automatically
npm run lint:fix
```

## License

MIT
