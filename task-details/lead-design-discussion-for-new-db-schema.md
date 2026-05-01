# Task Playbook: Lead design discussion for new DB schema

## 📊 Classification Breakdown

| Dimension | Confidence | Rationale |
| :--- | :--- | :--- |
| **DESIGN IMPLEMENTATION (Primary)** | 95% | The task explicitly involves designing a new Postgres schema, which directly triggers the 'schema' and 'design' keywords in the rubric. |
| INTERPERSONAL SKILLS | 90% | The requirement to 'sync with the team' and 'align' on the schema triggers the interpersonal skills dimension regarding communication and collaboration. |
| LEADERSHIP | 85% | The instruction to 'Lead design discussion' indicates taking initiative and driving a technical decision, which aligns with the leadership triggers. |
| COMMITMENT OWNERSHIP | 100% | As per the classification rules, this dimension is automatically applied as a cross-cutting secondary dimension for all tasks. |

## 🛠 Implementation Strategy

### 🎯 DESIGN IMPLEMENTATION

#### ✅ Above Average Behaviors
- Present 2-3 distinct schema options (e.g., normalized vs. denormalized for billing queries) with a trade-off analysis before settling on the final design.
- Leverage existing Postgres patterns (like JSONB for flexible metadata or partitioning for high-volume transaction logs) instead of building custom logic for every edge case.
- Design the schema with explicit constraints and triggers that handle billing-specific error cases (e.g., preventing negative balances) directly in the database layer.

#### ★ Outstanding Stretch Goals
- Create a migration strategy that supports zero-downtime deployment for the billing system, including backward-compatible data backfill scripts.
- Produce a visual data flow diagram showing how the new schema interacts with existing payment gateways and reporting tools to validate the design holistically.

#### ⚠ Pitfalls to Avoid
- Designing a monolithic 'billing_table' that mixes transactional data with metadata, making it hard to query or migrate later.
- Using ambiguous column names (e.g., 'amount', 'status') without specifying currency context or state machine definitions.
- Ignoring the impact of schema changes on historical data reporting or failing to account for data retention policies.

#### 💡 Coaching Nudge
- Ask yourself: 'If this schema needs to scale 10x in volume, where will the first bottleneck occur, and have I designed around it?'

---

### 🎯 INTERPERSONAL SKILLS

#### ✅ Above Average Behaviors
- Facilitate a focused design review meeting where the agenda explicitly includes 'risk identification' and 'dependency mapping' rather than just presenting the schema.
- Send async summaries after discussions that clearly state 'Decisions Made', 'Open Questions', and 'Action Owners' to prevent meeting fatigue and clarify next steps.
- Proactively schedule 1:1s with backend and frontend leads to validate how the new billing schema impacts their specific integration points before the group sync.

#### ★ Outstanding Stretch Goals
- Identify a potential blocker in a dependent team's roadmap during the initial sync and immediately propose a mitigation plan to unblock them.
- Create a living 'Billing Schema Decision Log' document that tracks the 'Why' behind every major design choice for future onboarding and audits.

#### ⚠ Pitfalls to Avoid
- Presenting the schema as a 'final' decision without inviting critique, leading to rework when others spot edge cases.
- Using vague language like 'we should probably handle errors' instead of defining specific error codes or states in the schema.
- Scheduling a synchronous meeting to discuss details that could have been resolved via a well-structured RFC document.

#### 💡 Coaching Nudge
- Before the meeting, ask: 'Who is most likely to be impacted negatively by this change, and have I listened to their concerns?'

---

### 🎯 LEADERSHIP

#### ✅ Above Average Behaviors
- Draft and drive a formal RFC (Request for Comments) document that outlines the problem, proposed solution, and alternatives to structure the design discussion.
- Proactively identify technical debt in the current billing data structure and propose a phased migration plan alongside the new schema implementation.
- Take ownership of the decision timeline, setting clear milestones for the design phase, implementation, and rollout to keep the team aligned.

#### ★ Outstanding Stretch Goals
- Mentor a junior engineer through the schema design process by having them draft the initial ERD and providing constructive feedback on their trade-off analysis.
- Anticipate future billing requirements (e.g., multi-currency support) and design the schema extensibility now, preventing immediate future refactors.

#### ⚠ Pitfalls to Avoid
- Waiting for the team to point out risks or flaws in the design rather than surfacing them first.
- Focusing only on the immediate feature delivery and ignoring the long-term maintainability of the billing data model.
- Letting the design discussion drag on without making a call to action or final decision.

#### 💡 Coaching Nudge
- Challenge yourself: 'Am I driving this discussion to reach a decision, or am I just gathering opinions without a clear path forward?'

---

### 🎯 COMMITMENT OWNERSHIP

#### ✅ Above Average Behaviors
- Own the end-to-end lifecycle: from the initial design discussion through code review, migration execution, and verifying data integrity in production.
- Proactively monitor the deployment of the new schema and be the first to respond to any alerts or data anomalies post-launch.
- Follow up on all open questions from the design meeting within 24 hours, ensuring no ambiguity remains before coding starts.

#### ★ Outstanding Stretch Goals
- Implement a 'rollback' plan and test it rigorously before the first deployment, demonstrating full accountability for system stability.
- Conduct a post-implementation retrospective specifically on the schema design to capture lessons learned for the team's future database work.

#### ⚠ Pitfalls to Avoid
- Considering the task 'done' once the schema is merged, ignoring the need to verify data migration success in production.
- Blaming the data team for migration issues without taking ownership of the schema design's complexity.
- Leaving open questions about edge cases unresolved, assuming they will be fixed later.

#### 💡 Coaching Nudge
- Ask: 'If this migration fails at 2 AM, do I have the plan and knowledge to fix it immediately?'

---

## 📋 Checklists

### 1️⃣ Planning (Before Starting)
- [ ] Draft an RFC document outlining at least two schema design options with trade-offs (performance vs. complexity).
- [ ] Map all downstream dependencies (reporting tools, frontend dashboards, external payment APIs) that will be affected by the schema change.
- [ ] Identify historical data migration requirements and estimate the time/complexity for backfilling the new schema.
- [ ] Schedule a dedicated 'Design Sync' meeting with key stakeholders, ensuring the agenda includes 'Risk Review' and 'Decision Criteria'.
- [ ] Define clear success criteria for the schema design (e.g., query latency targets, data integrity constraints).

### 2️⃣ Execution (While Implementing)
- [ ] Ensure all table and column names follow a consistent, self-documenting naming convention specific to billing domains.
- [ ] Implement database-level constraints (check constraints, foreign keys) to enforce business logic and prevent invalid data entry.
- [ ] Write migration scripts that are idempotent and include rollback mechanisms for safety.
- [ ] Add comments and documentation directly in the schema definition files explaining the 'Why' behind complex structures.
- [ ] Validate the design against edge cases (e.g., refunds, partial payments, currency conversion) during the implementation phase.

### 3️⃣ Pre-PR (Before Review)
- [ ] Verify that the PR description explicitly states the business problem being solved and the trade-offs considered.
- [ ] Ensure the migration script has been tested in a staging environment with a realistic dataset size.
- [ ] Confirm that all open questions from the design discussion have been addressed or documented as future work.
- [ ] Check that the schema design aligns with existing team patterns and does not introduce unnecessary complexity.
- [ ] Attach a visual ERD or data flow diagram to the PR to aid reviewer understanding.
- [ ] Run a final linting and schema validation check to ensure no syntax errors or missing indexes.

## 🚀 Growth Nudges

- **Before drafting the initial schema proposal**: Have you explicitly listed the top 3 risks of this design and how you plan to mitigate them?
- **During the team sync discussion**: Am I actively listening to concerns about edge cases, or am I just defending my initial idea?
- **After the code is merged but before production release**: Do I have a verified plan to monitor data integrity and performance immediately after the migration runs?

## 📖 Mentor Guide

To lead this design discussion at an Above Average level, you must shift from being a passive contributor to the primary architect and facilitator. Start by doing the heavy lifting before the meeting: draft a concise RFC that presents not just your preferred schema, but at least one alternative with a clear trade-off analysis. This demonstrates that you've evaluated multiple approaches and aren't forcing a solution. When you sync with the team, focus the conversation on 'Why' this schema matters for the billing system's future scalability and data integrity, not just 'What' the columns are. Actively solicit feedback on edge cases like refunds or partial payments, and document these decisions clearly to avoid future ambiguity. 

As you move into implementation, treat the schema as a product. Your migrations should be robust, tested, and reversible. Ensure your code and SQL scripts are self-documenting, using clear naming conventions that reflect the billing domain. Don't just merge the PR and walk away; own the deployment process. Proactively monitor the migration in staging and production, ready to address any data anomalies immediately. Finally, close the loop by sharing what you learned about the billing domain and the design process with the team, turning a single task into a learning opportunity that elevates the entire group's architectural maturity.