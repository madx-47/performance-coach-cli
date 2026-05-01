# Task Playbook: Implement rate limiting

## 📊 Classification Breakdown

| Dimension | Confidence | Rationale |
| :--- | :--- | :--- |
| **DESIGN IMPLEMENTATION (Primary)** | 95% | The task requires implementing a specific technical solution (Redis-backed rate limiting) within the API gateway architecture, directly matching the 'implementation' and 'architecture' triggers. |
| BUILD TEST DEPLOYMENT | 80% | Integrating a new feature into an API gateway inherently involves writing tests, validating the logic, and ensuring safe deployment via the CI/CD pipeline. |
| REQUIREMENT ANALYSIS | 70% | Defining 'prevent abuse' requires clarifying specific thresholds, algorithms, and scope to ensure the feature meets actual needs beyond the brief description. |
| COMMITMENT OWNERSHIP | 100% | As per the classification rules, this dimension is automatically assigned as a cross-cutting requirement for all tasks. |

## 🛠 Implementation Strategy

### 🎯 DESIGN IMPLEMENTATION

#### ✅ Above Average Behaviors
- Evaluates and documents a comparison between sliding window vs. token bucket algorithms for the specific abuse patterns expected, selecting the optimal one rather than defaulting to a tutorial example.
- Refactors existing gateway middleware patterns to inject the rate limiter, ensuring the new code shares error handling and logging interfaces with the rest of the system.
- Implements a robust fallback mechanism where the API continues to function (possibly with degraded performance) if Redis is unreachable, rather than failing open or crashing.

#### ★ Outstanding Stretch Goals
- Designs a dynamic configuration system allowing rate limit thresholds to be adjusted via a config store without requiring a gateway restart.
- Creates a visual diagram in the PR description showing how the rate limiter interacts with the existing authentication and routing layers.

#### ⚠ Pitfalls to Avoid
- Hardcoding Redis connection strings or rate limit values directly in the code without environment variable abstraction.
- Implementing a blocking synchronous Redis call that halts the entire gateway thread, causing latency spikes during high load.
- Using generic variable names like 'data' or 'limit' instead of context-specific names like 'apiKey' or 'requestsPerMinute'.

#### 💡 Coaching Nudge
- Before writing code, sketch the interaction flow between the request, the gateway, and Redis to identify potential race conditions.

---

### 🎯 BUILD TEST DEPLOYMENT

#### ✅ Above Average Behaviors
- Writes integration tests that spin up a local Redis instance (e.g., via Testcontainers) to verify actual rate limit enforcement and edge cases like burst traffic.
- Adds a specific CI stage that simulates a Redis timeout to verify the fallback behavior and ensure no requests are dropped unexpectedly.
- Validates the feature in a staging environment by running a load test that triggers the rate limits and confirms the correct HTTP 429 responses are returned.

#### ★ Outstanding Stretch Goals
- Develops a 'canary' deployment strategy script that gradually increases the rate limit scope to a small percentage of traffic to monitor real-world impact.
- Creates a synthetic monitoring alert specifically for rate limit hit rates to detect abuse patterns early in production.

#### ⚠ Pitfalls to Avoid
- Relying solely on unit tests with mocked Redis responses, missing integration issues like network latency or connection pool exhaustion.
- Deploying without verifying that the CI pipeline includes the new Redis dependency or configuration steps.
- Ignoring the impact on the deployment pipeline, such as failing to update the Dockerfile or Helm chart with new environment variables.

#### 💡 Coaching Nudge
- Run the full test suite locally with a real Redis container before pushing code to ensure the environment matches CI.

---

### 🎯 REQUIREMENT ANALYSIS

#### ✅ Above Average Behaviors
- Proactively schedules a brief sync with the product owner to define specific thresholds (e.g., '100 req/min per IP' vs 'per API key') and abuse scenarios.
- Documents assumptions about traffic patterns (e.g., 'We assume mobile clients behave differently than bots') and validates them with the team before implementation.
- Clarifies the scope of 'abuse' to determine if the rate limiter should apply to health check endpoints or internal service-to-service traffic.

#### ★ Outstanding Stretch Goals
- Proposes a tiered rate limiting strategy (e.g., free vs. premium users) based on business value, exceeding the initial 'prevent abuse' request.
- Creates a decision log explaining why certain endpoints were excluded from rate limiting and gets it signed off by the architect.

#### ⚠ Pitfalls to Avoid
- Implementing a blanket rate limit on all endpoints, accidentally blocking legitimate internal microservice calls.
- Assuming a fixed limit (e.g., 60 req/min) is sufficient for all users without checking historical traffic data or business requirements.
- Ignoring the 'scope' of the key (IP vs. User ID) and implementing the wrong granularity, rendering the protection ineffective.

#### 💡 Coaching Nudge
- Draft a one-paragraph 'Requirement Clarification' email to the stakeholder asking for specific threshold numbers and scope boundaries before starting.

---

### 🎯 COMMITMENT OWNERSHIP

#### ✅ Above Average Behaviors
- Monitors the rate limiter metrics in production for the first 48 hours post-deployment and proactively adjusts thresholds if false positives occur.
- Proactively communicates if the Redis cluster maintenance window conflicts with the deployment timeline and proposes a mitigation plan.
- Takes responsibility for any bugs found in the rate limiting logic post-merge, prioritizing the fix over other planned work.

#### ★ Outstanding Stretch Goals
- Conducts a brief retrospective on the implementation process to identify what could be improved for future infrastructure features.
- Creates a runbook for on-call engineers detailing how to temporarily disable or tune the rate limiter during emergencies.

#### ⚠ Pitfalls to Avoid
- Considering the task 'done' once the PR is merged, ignoring the need to verify the feature is actually working in production.
- Blaming the DevOps team or Redis latency for failures without investigating the application logic first.
- Leaving open questions about edge cases (e.g., 'What happens during a Redis failover?') unresolved and uncommunicated.

#### 💡 Coaching Nudge
- Set a calendar reminder for 24 hours post-deployment to review the rate limit hit logs and confirm stability.

---

## 📋 Checklists

### 1️⃣ Planning (Before Starting)
- [ ] Confirm specific rate limit thresholds (requests/time window) and scope (IP, User ID, API Key) with stakeholders.
- [ ] Verify Redis cluster availability, connection limits, and network access policies for the API gateway pods.
- [ ] Review existing gateway middleware architecture to identify the best injection point for the rate limiter.
- [ ] Select the specific rate limiting algorithm (e.g., sliding window log vs. token bucket) based on traffic analysis.
- [ ] Define the fallback behavior strategy if Redis is unreachable (e.g., fail open, fail closed, or cached limits).

### 2️⃣ Execution (While Implementing)
- [ ] Implement the rate limiter using the selected algorithm with clear, self-documenting variable names and comments.
- [ ] Add comprehensive error handling for Redis connection failures, timeouts, and serialization errors.
- [ ] Write unit tests for the logic and integration tests using a local Redis instance to verify real-world behavior.
- [ ] Update the CI/CD pipeline configuration to include Redis dependencies or environment variables if required.
- [ ] Ensure the code adheres to existing project patterns for logging, metrics, and configuration management.

### 3️⃣ Pre-PR (Before Review)
- [ ] Confirm all unit and integration tests pass locally and in the CI pipeline.
- [ ] Validate the implementation in a staging environment with a simulated load test that triggers the rate limits.
- [ ] Verify that the PR description includes a design overview, algorithm choice rationale, and fallback behavior explanation.
- [ ] Check that no sensitive configuration (like Redis passwords) is hardcoded or leaked in the commit history.
- [ ] Ensure the code review checklist is updated to include specific checks for the rate limiter logic.
- [ ] Confirm that the deployment plan includes a rollback strategy in case the rate limiter causes unexpected outages.

## 🚀 Growth Nudges

- **Before writing the first line of code**: Have you explicitly defined what 'abuse' looks like for this specific API, or are you guessing the thresholds?
- **When designing the Redis interaction**: What happens to the user experience if Redis goes down? Have you tested the fallback path?
- **Before merging the PR**: Do you have a plan to monitor the actual hit rates in production for the next 48 hours?

## 📖 Mentor Guide

To execute this task at an Above Average level, you must treat the rate limiter not just as a code snippet, but as a critical infrastructure component that balances security with availability. Start by deeply engaging with the business requirements; 'prevent abuse' is vague, so you must define specific thresholds, time windows, and scope (e.g., per IP vs. per API key) with your stakeholders before writing code. This prevents the common pitfall of building a solution that is technically correct but operationally useless. When designing the implementation, evaluate multiple algorithms like sliding window vs. token bucket and document your choice based on the specific traffic patterns of your API. Crucially, design for failure: if Redis becomes unavailable, your gateway must have a clear, tested fallback strategy that prevents a total outage, ensuring high availability even during infrastructure glitches. Finally, your definition of 'done' must extend beyond the merge. You are responsible for validating the feature in staging with load tests, deploying it safely, and actively monitoring the metrics in production to tune thresholds and handle any edge cases that arise. This holistic ownership from requirement clarification to production monitoring is what distinguishes a senior engineer from a junior coder.