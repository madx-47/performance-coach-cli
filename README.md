# Performance Coach CLI 🚀

A terminal-based AI coach that leverages **NVIDIA NIM (Llama 3.1 70B)** to analyze software engineering tasks and generate high-impact, personalized completion playbooks. 

The tool maps your tasks against a specialized 9-dimension engineering rubric and provides persistent, markdown-based guidance to help you hit "Above Average" performance consistently.

## 🌟 Key Features

- **Intelligent Classification**: Automatically maps tasks to dimensions like Planning, Design, Troubleshooting, and Leadership.
- **Rubric-Grounded Guidance**: Every recommendation is based on a professional engineering rubric, focusing on *Above Average* behaviors vs. *Below Average* pitfalls.
- **Persistent Playbooks**: Generates detailed Markdown playbooks in the `task-details/` folder, complete with interactive checklists.
- **Growth Nudges**: Provides contextual coaching nudges and "stretch" goals for outstanding performance.
- **Mentor Guide**: Includes a narrative guide written from the perspective of a senior engineering mentor.

## 🛠 Tech Stack

- **Runtime**: Node.js (TypeScript)
- **AI Engine**: NVIDIA NIM (Llama 3.1 70B Instruct)
- **Tooling**: Vitest (Testing), ESLint (Linting), tsx (Execution)

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+ 
- An NVIDIA NIM API Key ([Get one here](https://build.nvidia.com/explore/discover))

### 2. Installation
```bash
git clone <your-repo-url>
cd performance-coach-cli
npm install
```

### 3. Configuration
Copy the example environment file and add your API key:
```bash
cp .env.example .env
# Edit .env and set NVIDIA_NIM_API_KEY=your_key_here
```

### 4. Run the Coach
```bash
# Analyze a task and generate a playbook
npm run dev -- "Implement rate limiting" "Add Redis-backed rate limiting to the API gateway to prevent abuse."
```

## 📂 Architecture

```
src/
├── index.ts              # CLI entry point & Markdown generator
├── types.ts              # Shared TypeScript interfaces
├── ai/
│   ├── nim-client.ts     # NVIDIA NIM API gateway (with retries & logging)
│   ├── classifier.ts     # Task dimension classification logic
│   ├── playbook.ts       # Playbook generation logic
│   └── utils.ts          # Shared AI utilities (JSON parsing, etc.)
└── prompts/
    ├── rubric.ts         # Structured engineering performance standards
    ├── classifier-prompt.ts
    └── playbook-prompt.ts
```

## 🧪 Development

### Running Tests
We use Vitest for unit testing core logic and prompt integrity:
```bash
npm test
```

### Linting
To keep the codebase clean and consistent:
```bash
npm run lint      # Check for issues
npm run lint:fix  # Fix issues automatically
```

### Building
```bash
npm run build
```

## 📜 License
MIT
