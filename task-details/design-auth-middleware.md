# Task Playbook: Design auth middleware

## 📊 Classification Breakdown

| Dimension | Confidence | Rationale |
| :--- | :--- | :--- |
| **DESIGN IMPLEMENTATION (Primary)** | 95% | The task explicitly requires designing and implementing a specific technical component (JWT auth middleware) with defined architectural constraints like refresh tokens and RBAC. |
| REQUIREMENT ANALYSIS | 80% | The task involves interpreting high-level requirements (JWT, refresh tokens, RBAC) to determine the specific scope and acceptance criteria for the middleware. |
| BUILD TEST DEPLOYMENT | 75% | Creating a functional middleware for an API gateway inherently requires writing tests to validate authentication flows and ensuring it integrates correctly into the deployment pipeline. |
| COMMITMENT OWNERSHIP | 100% | As per the classification rules, every task automatically includes this dimension to ensure reliability and accountability for the delivered feature. |

## 🛠 Implementation Strategy

### 🎯 DESIGN IMPLEMENTATION

#### ✅ Above Average Behaviors
- Evaluates token storage strategies (Redis vs. DB) for refresh token revocation before implementation to balance latency and security.
- Implements a modular middleware pattern where token verification, RBAC logic, and error handling are separated into distinct, reusable functions.
- Defines a comprehensive error response schema for specific failure modes (e.g., 401 vs 403, expired vs invalid signature) rather than generic 500 errors.

#### ★ Outstanding Stretch Goals
- Designs a 'grace period' mechanism for refresh tokens that allows a short window of overlap during rotation to prevent race conditions in high-concurrency environments.
- Creates a self-documenting OpenAPI/Swagger schema extension that automatically visualizes the auth requirements and RBAC roles for API consumers.

#### ⚠ Pitfalls to Avoid
- Hardcoding role names or token expiration times directly in the middleware logic instead of using configuration constants.
- Implementing a monolithic `authenticate` function that mixes token parsing, signature validation, and permission checking, making it hard to test.
- Ignoring the 'clock skew' issue when validating token expiration, leading to legitimate users being rejected.

#### 💡 Coaching Nudge
- Sketch the token lifecycle flow (Access + Refresh rotation) on a whiteboard before writing a single line of code to identify race conditions.

---

### 🎯 REQUIREMENT ANALYSIS

#### ✅ Above Average Behaviors
- Clarifies the specific RBAC granularity required (e.g., resource-level vs. action-level) and documents the default fallback behavior for undefined roles.
- Proactively identifies and documents the assumption regarding where refresh tokens are stored client-side (httpOnly cookie vs. local storage) and its security implications.
- Validates the token revocation strategy with the security team, ensuring the solution aligns with compliance requirements (e.g., GDPR, SOC2).

#### ★ Outstanding Stretch Goals
- Proposes a 'break-glass' administrative endpoint to forcibly revoke all tokens for a specific user in case of a security breach.
- Drafts a security threat model for the auth flow specifically addressing replay attacks and token theft scenarios before implementation.

#### ⚠ Pitfalls to Avoid
- Assuming the existing JWT library handles refresh token rotation automatically without verifying its configuration.
- Implementing RBAC based on a hardcoded list of roles that doesn't match the actual business hierarchy.
- Failing to ask how the system should handle a user whose permissions change mid-session.

#### 💡 Coaching Nudge
- Draft a one-paragraph 'Security Assumptions' document and request a quick 10-minute validation from the lead architect.

---

### 🎯 BUILD TEST DEPLOYMENT

#### ✅ Above Average Behaviors
- Writes unit tests that specifically mock edge cases like 'expired refresh token', 'revoked token', and 'malformed JWT headers'.
- Sets up an integration test suite that spins up a temporary API Gateway instance to verify the full auth flow end-to-end.
- Configures the CI pipeline to fail the build if code coverage for the auth module drops below 90%.

#### ★ Outstanding Stretch Goals
- Creates a local 'security sandbox' script that simulates various attack vectors (e.g., token tampering) to verify the middleware's defensive posture.
- Implements a canary deployment strategy for the middleware to monitor error rates on auth requests before full rollout.

#### ⚠ Pitfalls to Avoid
- Testing only the 'happy path' where tokens are valid and roles match, ignoring invalid token scenarios.
- Relying solely on manual testing in a local environment without automated regression tests for the auth flow.
- Deploying the middleware without verifying that existing non-authenticated public endpoints remain unaffected.

#### 💡 Coaching Nudge
- Run the full test suite locally with a 'chaos' flag enabled (if available) to simulate network latency during token validation.

---

### 🎯 COMMITMENT OWNERSHIP

#### ✅ Above Average Behaviors
- Monitors the logs in the staging environment immediately after deployment to detect any unexpected 401/403 spikes.
- Proactively updates the team's onboarding documentation with the new auth flow details and role definitions.
- Stays available during the first production deployment window to troubleshoot any immediate authentication failures.

#### ★ Outstanding Stretch Goals
- Conducts a post-implementation retrospective specifically on the auth flow to identify improvements for the next iteration.
- Sets up a custom dashboard alert for 'failed authentication due to policy mismatch' to proactively catch permission configuration errors.

#### ⚠ Pitfalls to Avoid
- Marking the ticket as 'Done' immediately after the PR merge without verifying it in the staging environment.
- Blaming the frontend team for auth errors without checking the middleware logs first.
- Leaving 'TODO' comments in the code regarding edge cases that were not addressed.

#### 💡 Coaching Nudge
- Schedule a 15-minute 'handoff' call with the frontend team lead to review the new auth headers and error codes.

---

## 📋 Checklists

### 1️⃣ Planning (Before Starting)
- [ ] Confirm the JWT library version and verify its support for refresh token rotation and custom claims.
- [ ] Define the exact RBAC matrix (Roles vs. Permissions) and get sign-off from the product owner.
- [ ] Decide on the refresh token storage mechanism (stateless vs. stateful) and document the trade-offs.
- [ ] Identify the specific error codes and messages required for the API Gateway response schema.
- [ ] Review existing security policies to ensure the new middleware aligns with current encryption standards.

### 2️⃣ Execution (While Implementing)
- [ ] Implement the middleware using a dependency injection pattern to allow easy mocking in tests.
- [ ] Write unit tests for token parsing, signature verification, and role extraction logic.
- [ ] Create integration tests that simulate the full lifecycle: Login -> Access Token Use -> Refresh -> Token Rotation.
- [ ] Verify that the middleware correctly passes through public endpoints without triggering auth checks.
- [ ] Ensure all sensitive data (tokens, secrets) are handled via environment variables and never hardcoded.

### 3️⃣ Pre-PR (Before Review)
- [ ] All unit and integration tests pass locally with 100% coverage on critical auth paths.
- [ ] Code has been linted and formatted according to the team's style guide.
- [ ] A security review request has been drafted or attached to the PR description.
- [ ] Documentation (README or inline comments) explains the token rotation flow and error handling.
- [ ] The PR is split into logical commits (e.g., 'Setup', 'Core Logic', 'Tests', 'Docs') for easier review.
- [ ] Verified that no sensitive secrets or keys are committed to the repository.

## 🚀 Growth Nudges

- **Before writing the first line of code**: Pause and ask: 'What is the worst-case security breach if this middleware fails?' to guide your defensive coding strategy.
- **When you encounter a complex token rotation edge case**: Don't guess the solution; write a failing test first to define the expected behavior before implementing the fix.
- **Immediately after merging the PR**: Check the production logs for the first hour to ensure no unexpected 401s are affecting real users.

## 📖 Mentor Guide

To deliver this auth middleware at an Above Average level, you must treat security not as a feature but as the foundation of the system. Start by rigorously defining the requirements; do not assume how refresh tokens should be stored or how roles are structured. Engage with the security team and product owners to clarify the RBAC matrix and token revocation strategy before writing code. This upfront investment prevents costly refactoring later. When designing the implementation, prioritize modularity. Separate the concerns of token validation, role extraction, and error handling into distinct, testable units. This approach ensures that your code is readable, maintainable, and easy to audit. Avoid monolithic functions that try to do everything at once, as these are prone to bugs and difficult to secure. Your testing strategy must be equally robust. Do not just test the happy path where everything works. You must write tests that simulate attack vectors: expired tokens, revoked refresh tokens, malformed signatures, and role mismatches. Your CI pipeline should treat these security tests as gatekeepers; if they fail, the build fails. Finally, own the outcome. Your job isn't done when the code is merged. Monitor the staging and production environments closely after deployment. Watch for spikes in authentication errors and be ready to pivot if a configuration issue arises. Proactively communicate with the frontend team to ensure they understand the new error codes and token handling requirements. By combining rigorous upfront planning, modular design, exhaustive testing, and post-deployment vigilance, you will deliver a secure, reliable auth middleware that sets a high standard for the team.