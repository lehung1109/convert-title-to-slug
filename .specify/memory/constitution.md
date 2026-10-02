<!--
Sync Impact Report:
- Version change: Unversioned draft → 1.0.0
- List of modified principles:
  - PRINCIPLE_1 → I. Phase-Level Specification Quality
  - PRINCIPLE_2 → II. Worktree Isolation (Phase 1 Worktree Creation)
  - PRINCIPLE_3 → III. Dedicated Subagent Execution per Phase
  - PRINCIPLE_4 → IV. Mandatory Test-Driven Development (TDD)
  - PRINCIPLE_5 → V. Iterative Review & Bug Hunt Subagent Loop
  - [Added] → VI. Phase-End Conventional Commits
  - [Added] → VII. Final Feature-Level Holistic Review
- Added sections:
  - Task Generation & Phase Decomposition Standards (replaces SECTION_2_NAME)
  - Quality Gates & Verification Protocol (replaces SECTION_3_NAME)
- Removed sections:
  - None
- Follow-up TODOs:
  - None
-->

# convert-title-to-slug Constitution

## Core Principles

### I. Phase-Level Specification Quality
- **Context completeness**: The feature specification (`spec.md`) and implementation plan (`plan.md`) MUST both be read and analyzed before generating tasks; partial-context task generation is strictly prohibited.
- **Dependency ordering**: Phases within the task breakdown MUST be ordered strictly by dependency; referencing or assuming unbuilt upstream dependencies without declaring them as prior phases is prohibited.
- **Phase-level granularity**: Specification quality requirements MUST apply at the phase level within tasks rather than being fragmented across micro-tasks.
- **Exact file paths**: Every phase MUST specify exact repository-relative file paths for all files to be created, modified, or tested (vague or placeholder references are prohibited).
- **Technical concreteness**: Every phase MUST provide complete code, detailed pseudocode, or explicit technical guidance, avoiding vague high-level summaries.
- **Explicit verification criteria**: Every phase MUST define explicit verification steps, including exact test execution commands, expected outputs, and objective acceptance criteria.
- **Actionable checklist items**: All phase workflow requirements (Phase 1 worktree creation, subagent execution boundaries, TDD steps, iterative review subagent loop, phase-end commit, and the final feature-level review phase) MUST be explicitly listed as actionable checklist items in `tasks.md`.
*Rationale*: Guarantees that every phase is self-contained, unambiguous, dependency-safe, and executable by autonomous agents without missing context or guesswork.

### II. Worktree Isolation (Phase 1 Worktree Creation)
- **Isolation priority**: Phase 1 MUST prioritize creating a new git worktree for workspace isolation before any implementation tasks commence.
- **User confirmation**: Phase 1 MUST ask the user to confirm the creation of the new worktree, defaulting to creating a new one.
*Rationale*: Prevents cross-branch pollution in the main workspace, protects unstaged work, and guarantees clean, reproducible development environments for every feature.

### III. Dedicated Subagent Execution per Phase
- **Isolated execution context**: Each phase MUST be executed within a dedicated subagent session to maintain clean context boundaries and isolated task execution.
- **Boundary enforcement**: Phases MUST NOT share or pollute active context windows; each phase starts fresh with the artifacts produced by preceding phases.
*Rationale*: Prevents LLM context degradation, hallucination, and instruction drift over long implementation sequences by isolating phase execution into fresh sessions.

### IV. Mandatory Test-Driven Development (TDD)
- **Red-Green-Refactor cycle**: Implementation tasks within each phase MUST strictly follow TDD (Red-Green-Refactor).
- **Execution sequence**: Developers and subagents MUST write a failing test first, run the test suite to verify failure, implement the minimal code required to make it pass, and refactor while maintaining green tests.
- **No untested code**: Writing implementation code before automated tests exist and fail is strictly prohibited.
*Rationale*: Ensures high code coverage, validates edge cases before implementation begins, prevents regressions, and enforces clean modular design.

### V. Iterative Review & Bug Hunt Subagent Loop
- **Phase review subagent**: At the end of each phase, a dedicated subagent MUST be spawned to conduct thorough code review, spec compliance verification, ESLint verification, and bug hunting.
- **Immediate remediation**: If any bugs, lint errors, or specification discrepancies are found, they MUST be resolved immediately within the phase.
- **Iterative re-review**: After resolving identified issues, another review subagent MUST be spawned to re-evaluate the phase and hunt for remaining bugs.
- **Zero-bug exit criteria**: This cycle (Review Subagent → Fix Bugs → Re-review Subagent) MUST repeat iteratively until zero bugs remain.
*Rationale*: Eliminates compounding defects early at phase boundaries before downstream phases depend on flawed implementations.

### VI. Phase-End Conventional Commits
- **Clean phase closure**: Once all tasks in the phase are verified and the iterative review loop confirms zero bugs, all phase changes MUST be committed.
- **Conventional commit format**: Commits MUST adhere to descriptive conventional commit conventions (e.g., `feat:`, `fix:`, `test:`, `refactor:`, `docs:`) describing the specific outcomes of the phase.
*Rationale*: Produces a clean, bisectable git history and provides reliable checkpoints for rollback or auditing.

### VII. Final Feature-Level Holistic Review
- **Dedicated final phase**: The final phase in `tasks.md` MUST be dedicated entirely to a holistic, feature-level review encompassing all previous phases.
- **Holistic bug hunt subagent**: A subagent MUST be spawned to conduct a comprehensive bug hunt, edge-case audit, and integration review across the entire implemented feature.
- **Iterative remediation loop**: Any bugs or integration flaws found MUST be fixed immediately, followed by another review subagent execution, repeating this cycle until zero bugs remain across the entire feature.
- **Final comprehensive commit**: Once the final review loop confirms zero bugs, a final comprehensive commit MUST be made to finalize the feature implementation.
*Rationale*: Validates end-to-end user journeys, cross-phase contracts, and system integration that cannot be observed within individual phase boundaries.

## Task Generation & Phase Decomposition Standards

### Phase Breakdown Structure
When `speckit-tasks` generates `tasks.md`, the task breakdown must follow this exact phase hierarchy:
1. **Phase 1 — Workspace Setup & Worktree Isolation**:
   - Prompt user to confirm new git worktree creation (default: yes).
   - Create and switch to the dedicated git worktree for the feature.
   - Establish baseline project infrastructure and configuration.
2. **Phase 2 — Foundational Infrastructure & Blocking Prerequisites**:
   - Establish core models, interfaces, shared types, or configurations required across user stories.
   - Enforce dependency declarations: no downstream phase may begin until foundational dependencies are complete.
3. **Phase 3+ — User Story Implementation (Ordered by Priority P1, P2, ...)**:
   - Each story phase contains:
     - Dedicated subagent invocation task.
     - TDD test creation (failing tests verified).
     - Minimal implementation tasks with exact file paths and concrete guidance.
     - Refactoring and passing test verification.
     - Iterative Review & Bug Hunt Subagent Loop (code review, spec compliance, ESLint verification, bug hunt until 0 bugs remain).
     - Phase-end conventional commit.
4. **Final Phase — Holistic Feature-Level Review & Completion**:
   - End-to-end integration and system test verification.
   - Holistic review & bug hunt subagent loop (Review Subagent → Fix Bugs → Re-review Subagent until 0 bugs).
   - Final feature completion conventional commit.

### Actionable Checklist Requirement
Every phase workflow step (worktree creation, subagent invocation, TDD test authoring, test verification, implementation, ESLint check, review subagent, bug fixing, re-review, and phase commit) MUST be an explicit checklist item (`- [ ]`) in `tasks.md`.

## Quality Gates & Verification Protocol

### Mandatory Quality Gates
1. **Linting & Formatting**:
   - ESLint and formatting checks MUST run cleanly with zero errors or warnings before phase sign-off.
2. **Automated Testing**:
   - 100% of automated unit, integration, and contract tests MUST pass.
   - Test suites MUST execute the exact test commands specified in the phase description.
3. **Spec & Plan Conformance**:
   - Implementation MUST satisfy every requirement and edge case specified in `spec.md` and `plan.md`.
4. **Zero-Bug Verification**:
   - No phase may conclude while bugs, defects, or skipped review steps remain.
   - The review subagent loop is mandatory and non-optional for every single phase.

## Governance

1. **Supremacy**: This constitution supersedes all other informal practices, ad-hoc workflows, or agent conventions within `convert-title-to-slug`.
2. **Compliance Verification**: All task generation commands (`speckit-tasks`) and execution commands (`speckit-implement`) MUST strictly comply with the principles and standards defined herein.
3. **Amendment Procedure**: Amendments to this constitution MUST:
   - Be proposed via `/speckit-constitution`.
   - Update `.specify/memory/constitution.md` with updated content.
   - Increment `CONSTITUTION_VERSION` per semantic versioning rules (MAJOR for breaking changes/removals, MINOR for additions/expansions, PATCH for wording clarifications).
   - Update `LAST_AMENDED_DATE` to the ISO date of change.
   - Include a temporary Sync Impact Report as an HTML comment at the top of the file for review.
4. **Runtime Guidance**: Refer to `AGENTS.md` for retrieval-first rules and system boundary constraints during active agent workflows.

**Version**: 1.0.0 | **Ratified**: 2026-10-02 | **Last Amended**: 2026-10-02
