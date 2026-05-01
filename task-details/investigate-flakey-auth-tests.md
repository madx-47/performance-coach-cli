# Task Playbook: Investigate flakey auth tests

## 📊 Classification Breakdown

| Dimension | Confidence | Rationale |
| :--- | :--- | :--- |
| **TROUBLESHOOTING FIX (Primary)** | 95% | The task explicitly requires finding the root cause of a random failure and fixing it, which directly matches the trigger keywords 'debug', 'fix', and 'root cause'. |
| BUILD TEST DEPLOYMENT | 90% | The issue occurs within the CI pipeline and involves testing automation, triggering the keywords 'CI', 'testing', and 'pipeline'. |
| COMMITMENT OWNERSHIP | 100% | As per the classification rules, this dimension is automatically assigned as a cross-cutting requirement for all tasks. |

## 🛠 Implementation Strategy

### 🎯 TROUBLESHOOTING FIX

#### ✅ Above Average Behaviors
- Reproduces the flaky test locally using deterministic seed values or mocked time to isolate the race condition before writing code.
- Documents the full investigation timeline in the PR, including failed hypotheses and the specific log evidence that led to the root cause.
- Implements a targeted fix (e.g., adding a specific lock or retry logic for a known race) without refactoring unrelated auth modules.

#### ★ Outstanding Stretch Goals
- Builds a custom CI job that runs the specific test 1,000 times in parallel to statistically validate the fix before merging.
- Adds a 'flakiness detector' comment or lint rule to the codebase to prevent similar patterns in future auth implementations.

#### ⚠ Pitfalls to Avoid
- Increasing test timeouts or adding generic retries without identifying the underlying race condition or timing issue.
- Modifying the test logic to 'force' a pass rather than fixing the code under test.
- Failing to explain the 'why' in the PR description, leaving future maintainers confused about the fix.

#### 💡 Coaching Nudge
- Ask yourself: 'If I remove my fix, can I make the test fail again within 10 runs?'

---

### 🎯 BUILD TEST DEPLOYMENT

#### ✅ Above Average Behaviors
- Validates the fix by running the full CI pipeline locally or in a feature branch 10+ consecutive times to ensure stability.
- Deploys the fix to a staging environment and verifies that the auth flow functions correctly under realistic load conditions.
- Analyzes CI metrics to ensure the fix does not increase pipeline duration or introduce new noise in other test suites.

#### ★ Outstanding Stretch Goals
- Proposes a change to the CI configuration to automatically quarantine future flaky tests rather than blocking the build immediately.
- Creates a dashboard or alert that tracks the specific auth test's pass rate over time post-merge.

#### ⚠ Pitfalls to Avoid
- Merging the fix immediately after a single successful CI run without statistical confidence.
- Ignoring potential side effects on other authentication flows (e.g., OAuth, SSO) when fixing the local test.
- Skipping the staging validation step and relying solely on unit tests.

#### 💡 Coaching Nudge
- Verify: 'Have I run this test suite 20 times in a row successfully on my branch?'

---

### 🎯 COMMITMENT OWNERSHIP

#### ✅ Above Average Behaviors
- Proactively notifies the team and stakeholders if the investigation reveals a complex architectural issue requiring more time.
- Monitors the specific test in production logs for 48 hours post-deployment to confirm the issue is resolved in the real world.
- Takes full responsibility for the fix, including updating documentation or runbooks if the failure was due to an undocumented edge case.

#### ★ Outstanding Stretch Goals
- Conducts a brief 'blameless post-mortem' with the team to share lessons learned about the flakiness pattern.
- Follows up with the original reporter or ticket owner to confirm the issue is fully resolved in their context.

#### ⚠ Pitfalls to Avoid
- Dismissing the issue as 'just a CI glitch' and pushing it to the backlog without a concrete fix plan.
- Blaming the test framework or environment instability instead of investigating the code logic.
- Marking the task as 'done' immediately after the PR is merged, ignoring the need for production verification.

#### 💡 Coaching Nudge
- Commit: 'I will not close this ticket until I have verified the fix in production logs for 24 hours.'

---

## 📋 Checklists

### 1️⃣ Planning (Before Starting)
- [ ] Gather all historical CI logs for the failing test to identify patterns in failure timing or environment.
- [ ] Set up a local environment capable of reproducing the race condition (e.g., using concurrency tools or time mocking).
- [ ] Define the hypothesis for the root cause (e.g., shared state, network latency, token expiration timing) before writing code.
- [ ] Identify all dependent services or authentication providers that might be affected by the proposed fix.
- [ ] Draft a temporary test script to run the specific test 50 times locally to establish a baseline failure rate.

### 2️⃣ Execution (While Implementing)
- [ ] Implement the minimal code change required to resolve the root cause (avoid refactoring unrelated logic).
- [ ] Add a specific regression test case that targets the identified race condition or edge case.
- [ ] Run the full CI pipeline locally 20+ times to statistically confirm the flakiness is eliminated.
- [ ] Update the PR description with a clear explanation of the root cause, the fix, and the evidence gathered.
- [ ] Verify that the fix does not introduce new linting errors, security vulnerabilities, or performance regressions.

### 3️⃣ Pre-PR (Before Review)
- [ ] Confirm the test passes 50 consecutive times in the CI pipeline on the feature branch.
- [ ] Ensure the staging environment has been validated with the new code and no side effects were observed.
- [ ] Review the PR description to ensure it clearly explains the 'why' and 'how' of the root cause analysis.
- [ ] Check that the regression test is included in the commit and covers the specific failure scenario.
- [ ] Verify that no other tests in the suite have become flaky as a side effect of the changes.
- [ ] Confirm that all CI checks (lint, type check, build) are green before requesting review.

## 🚀 Growth Nudges

- **When you find a potential fix but aren't 100% sure it's the root cause**: Don't guess; run a stress test with 100 iterations to see if the issue persists. If it does, your hypothesis is wrong.
- **When the CI passes once but you are about to request review**: Stop. Flaky tests require statistical significance. Run the pipeline 20 more times to ensure the fix is robust.
- **When you are about to merge the PR**: Set a reminder to check the production logs for this specific test case 24 hours after deployment to ensure the fix holds up in the wild.

## 📖 Mentor Guide

To handle this flaky auth test at an Above Average level, you must treat the investigation as a scientific experiment rather than a quick code fix. Start by aggressively gathering evidence: scrape CI logs, identify the specific failure patterns, and attempt to reproduce the race condition locally using controlled concurrency or time-mocking. Do not write any code until you have a solid hypothesis about the root cause, such as a shared state issue or a timing dependency on an external token service. Once you implement a targeted fix, your validation must be rigorous; run the test suite locally and in CI dozens of times to achieve statistical confidence that the flakiness is gone, rather than relying on a single green build. Finally, ensure your PR tells the story of the investigation, explaining exactly why the test was flaky and how the code change resolves it, while adding a specific regression test to prevent this exact scenario from returning. Your ownership extends beyond the merge; verify the fix holds up in staging and production logs to close the loop completely.