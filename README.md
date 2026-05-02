# 🚀 AI Performance Coach CLI (`ai-coach`)

Transform your daily tasks into high-performance execution plans. `ai-coach` is a globally installable CLI tool that uses NVIDIA NIM (Llama 3, Qwen) to classify your work and generate personalized, actionable playbooks.

Stop guessing and start executing with precision.

## ✨ Features

- **Interactive Shell**: A polished REPL environment for managing tasks and settings.
- **Task Classification**: Automatically identifies the primary and secondary dimensions of your task (e.g., Design, Implementation, Security).
- **Personalized Playbooks**: Generates a detailed `.md` report with:
  - Estimated timelines.
  - Implementation strategies (Above Average vs. Outstanding).
  - Planning, Execution, and Pre-PR checklists.
  - Growth nudges to improve your skills.
- **Persistent Config**: Remembers your API Key, preferred model, and output directory across sessions.
- **Multi-line Input**: Easily describe complex tasks using a simple "Double-Enter" submission flow.

---

## 📦 Installation

To use `ai-coach` globally on your machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/madx-47/performance-coach-cli.git
   cd performance-coach-cli
   ```

2. **Install and Build**:
   ```bash
   npm install
   npm run build
   ```

3. **Link Globally**:
   ```bash
   npm install -g .
   ```

Now you can run the coach from anywhere by simply typing:
```bash
ai-coach
```

---

## 🛠 Setup & Usage

### 1. Connect your API Key
The first time you run `ai-coach`, it will ask for your **NVIDIA NIM API Key**. You can also update it anytime:
- Run `ai-coach`
- Type `/connect` and paste your key.

### 2. Choose your Model
Select the AI brain behind your coach:
- Type `/model` to choose from supported models like `Qwen 2.5` or `Llama 3.1`.

### 3. Set Output Location
Decide where your playbooks should be saved:
- Type `/task-reports` to set a custom directory.

### 4. Create a Task
Ready to work?
- Type `/task` OR just start typing your task title (e.g., `Refactor auth middleware`).
- **Description**: Add as many details as you want. Press **Enter** for a new line, and **Enter on an empty line** to submit.

---

## 📖 How it works

`ai-coach` works in three phases to make you better at your job:

1. **Intake**: You provide a task title and description.
2. **Analysis**: The tool uses NVIDIA NIM to categorize the task against professional dimensions like `impact_efficiency`, `technical_design`, and `operational_excellence`.
3. **Generation**: It creates a **Task Playbook** in Markdown. This playbook isn't just a "how-to"—it's a coaching guide that pushes you to deliver "Outstanding" results rather than just "Above Average" ones.

---

## 📄 Example Playbook Structure

When you complete a task intake, `ai-coach` generates a structured Markdown file. Here is what the result looks like:

### 1. Classification Breakdown
A table showing how your task aligns with professional dimensions.
> **Primary Dimension**: TECHNICAL_DESIGN (95%)

### 2. Implementation Strategy
Actionable advice for each dimension:
- **Above Average**: The standard "good" way to do things.
- **Outstanding**: High-impact stretch goals that get you noticed.
- **Pitfalls**: Common traps to avoid for this specific task.
- **Coaching Nudge**: Personal advice to keep you focused.

### 3. Actionable Checklists
- 1️⃣ **Planning**: Steps to take before writing a single line of code.
- 2️⃣ **Execution**: Best practices to follow while implementing.
- 3️⃣ **Pre-PR**: A final quality check before you submit your work.

### 4. Career Growth Plan
If applicable, the tool identifies long-term growth areas and provides a plan to improve those skills based on the task you just finished.

---

## 🧪 Development

If you want to contribute or run in development mode:

```bash
npm run dev
# or
npm run test  # Run vitest suites
```

## 📄 License
MIT
