# Task Playbook: Design auth middleware

> **Task Description**: Create JWT-based auth middleware for the API gateway. Must handle refresh tokens and role-based access.

## 📊 Classification Breakdown

| Dimension | Confidence | Rationale |
| :--- | :--- | :--- |
| **DESIGN IMPLEMENTATION (Primary)** | 95% | The task explicitly requires designing and implementing a JWT-based auth middleware with specific architectural components like refresh tokens and role-based access. |
| REQUIREMENT ANALYSIS | 80% | The task involves interpreting high-level requirements for token handling and access control to ensure the solution meets the API gateway's specific security needs. |
| COMMITMENT OWNERSHIP | 90% | As per the classification rules, every task automatically includes this dimension as a cross-cutting responsibility for the outcome of the work. |

## 🛠 Implementation Strategy

### 🎯 DESIGN IMPLEMENTATION

#### ✅ Above Average Behaviors
- Draft a brief design doc comparing a centralized gateway strategy vs. sidecar patterns for token validation before writing code, selecting the one that minimizes latency.
- Implement a modular middleware structure where token validation, refresh logic, and RBAC checks are decoupled functions, allowing independent unit testing.
- Pre-define error response schemas for specific failure modes (e.g., 'TokenExpired', 'RefreshTokenInvalid', 'InsufficientRole') to ensure consistent client handling.

#### ★ Outstanding Stretch Goals
- Design the middleware to support a 'grace period' for refresh tokens, automatically rotating them to mitigate replay attacks without breaking client sessions.
- Integrate a simulated load test into the PR to demonstrate that the JWT verification overhead remains under 5ms per request under high concurrency.

#### ⚠ Pitfalls to Avoid
- Hardcoding role names or token expiration logic directly inside the middleware handler instead of using configuration or constants.
- Creating a single monolithic 'auth' function that attempts to validate, decode, refresh, and check permissions, making it impossible to test edge cases in isolation.
- Failing to handle the specific case where a refresh token is valid but the associated access token is revoked or expired in a way that leaks user data.

#### 💡 Coaching Nudge
- Before typing the first line, write a 5-minute 'Architecture Decision Record' explaining why you chose this specific JWT library and refresh strategy.

---

### 🎯 REQUIREMENT ANALYSIS

#### ✅ Above Average Behaviors
- Proactively clarify the exact role hierarchy (e.g., are roles hierarchical or flat?) and the expected behavior when a user's role changes mid-session.
- Document assumptions about the refresh token storage mechanism (e.g., HTTP-only cookie vs. local storage) and get explicit sign-off from the security lead.
- Identify and ask about the required behavior for 'graceful degradation' if the identity provider is temporarily unreachable.

#### ★ Outstanding Stretch Goals
- Propose a fallback mechanism for the API gateway (e.g., caching recent valid tokens) in case the central auth service experiences latency spikes, and validate this with the product owner.
- Map the new auth flow against existing legacy endpoints to identify potential breaking changes for current API consumers before implementation starts.

#### ⚠ Pitfalls to Avoid
- Implementing a rigid role check that assumes 'admin' is the only high-privilege role, ignoring the need for granular permissions (e.g., 'admin:read' vs 'admin:write').
- Assuming the client will always send the refresh token in the header without verifying the agreed-upon transmission method (e.g., secure cookie).
- Ignoring the requirement for token revocation, assuming that expiration is the only way to invalidate access.

#### 💡 Coaching Nudge
- Schedule a 15-minute 'Assumption Validation' call with the security architect to review your mental model of the refresh token rotation flow.

---

### 🎯 COMMITMENT OWNERSHIP

#### ✅ Above Average Behaviors
- Monitor the middleware in staging immediately after deployment to verify that error logs are correctly formatted and no 500s are occurring during token refresh.
- Proactively update the API documentation (OpenAPI/Swagger) to reflect the new authentication headers and error codes before merging the code.
- Create a runbook for on-call engineers detailing how to rotate keys or debug token issues specific to this new middleware.

#### ★ Outstanding Stretch Goals
- Implement a canary deployment strategy for the middleware, routing 5% of traffic to the new version to catch edge cases before full rollout.
- Follow up with the frontend team 24 hours after deployment to confirm their integration with the new refresh token flow is seamless.

#### ⚠ Pitfalls to Avoid
- Marking the task as 'done' immediately after the code merges, ignoring the need to verify it works correctly in the production environment.
- Leaving a TODO comment in the code regarding a known edge case (e.g., 'handle clock skew') without creating a ticket to track it.
- Blaming the frontend team for 401 errors without first verifying if the gateway is correctly rejecting the specific token format they are sending.

#### 💡 Coaching Nudge
- Set a calendar reminder for 24 hours post-merge to personally review the first 100 error logs generated by this specific middleware.

---

## 📋 Checklists

### 1️⃣ Planning (Before Starting)
- [ ] Confirm the JWT signing algorithm (e.g., RS256 vs HS256) and key management strategy with the security team.
- [ ] Define the exact JSON structure for the access token payload, specifically the `roles` or `permissions` claim format.
- [ ] Determine the storage and rotation strategy for refresh tokens (stateful database vs. stateless signed token).
- [ ] Identify all existing API endpoints that will be protected by this middleware and verify backward compatibility requirements.
- [ ] Draft a test matrix covering valid tokens, expired tokens, invalid signatures, and missing roles.

### 2️⃣ Execution (While Implementing)
- [ ] Verify that the middleware correctly extracts tokens from both the `Authorization` header and `Cookie` (if applicable).
- [ ] Ensure the refresh token flow handles race conditions where multiple refresh requests might occur simultaneously.
- [ ] Confirm that error responses are standardized (e.g., specific error codes and messages) to prevent information leakage.
- [ ] Check that logging is sanitized to ensure no PII or secret tokens are written to application logs.
- [ ] Validate that the middleware does not block requests for health check or public endpoints.

### 3️⃣ Pre-PR (Before Review)
- [ ] Run a full security scan (SAST) on the new code to detect hardcoded secrets or weak crypto implementations.
- [ ] Ensure all unit tests for the refresh token rotation logic pass, including time-based edge cases.
- [ ] Verify that the code is modular: the JWT validation logic is separate from the RBAC logic.
- [ ] Update the local development `docker-compose` or environment setup to include the necessary mock auth services for testing.
- [ ] Write a concise summary in the PR description explaining the design choices made during the planning phase.
- [ ] Confirm that the middleware handles graceful degradation (e.g., logging a warning) if the key service is unavailable, rather than crashing.

## 🚀 Growth Nudges

- **When you realize the refresh token logic is becoming complex with nested try/catch blocks.**: Stop and refactor: extract the refresh logic into a dedicated service class. Complexity here is a security risk; keep the flow linear and testable.
- **When you are about to hardcode the 'admin' role name in an if-statement.**: Pause and check: is the role hierarchy defined in a config file or database? Hardcoding roles violates the principle of least privilege and makes future changes painful.
- **When the PR review comments ask for clarification on error handling.**: Don't just fix the specific comment; update the documentation and add a test case for that specific error scenario to prevent recurrence.

## 📖 Mentor Guide

To execute this task at an Above Average level, you must shift your mindset from simply 'writing code that works' to 'designing a resilient security component.' Start by treating the requirements as a hypothesis; your first step is to validate the assumptions about token storage and role hierarchies with the security architect. Do not write a single line of code until you have a clear, agreed-upon mental model of how the refresh token rotation interacts with the API gateway's request lifecycle. When designing, explicitly choose between patterns (e.g., centralized validation vs. distributed) and document why you chose the one you did. This shows architectural maturity and prevents the 'reinventing the wheel' pitfall. During implementation, prioritize modularity. The middleware should be a thin orchestrator that delegates specific concerns—decoding, signature verification, role checking—to dedicated, testable units. This makes the code self-documenting and significantly easier to audit. Finally, own the outcome beyond the merge. Your definition of 'done' includes verifying that the middleware behaves correctly under load, that error logs are safe, and that the documentation is updated for the next engineer. By anticipating edge cases like clock skew or concurrent refresh requests during the design phase, you will deliver a solution that requires zero revisions and instills confidence in the team.