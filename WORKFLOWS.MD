# Development Workflows

This file defines explicit workflows that may be invoked by the user.

Workflows MUST NEVER be executed unless the user intentionally invokes them.

A workflow is only considered invoked if the user's message STARTS WITH one of the commands defined below.

Normal conversation must NEVER trigger a workflow.

If there is any uncertainty, ask for clarification instead of executing a workflow.

---

# Supported workflow commands

workflow:new <ProjectName>

Creates a new project from the latest project template.

workflow:review

Performs a complete review of the current project.

workflow:release

Prepares the current project for release.

workflow:feature <FeatureName>

Plans and implements a new feature.

workflow:plan

Creates a development plan only.

---

# Workflow: New Project

Trigger

workflow:new <ProjectName>

<ProjectName> must be a single folder name.

It must not contain spaces, path separators or special characters that could create nested folders or invalid paths.

Purpose

Create a brand new project using the latest AI App Template.

This workflow is ONLY intended to scaffold a project.

It must NOT begin implementing features or writing application code.

Steps

## 1. Copy the template

Always copy

Templates/AI App Template

Never recreate the template from memory.

Always use the latest version that exists in Templates.

## 2. Create the project

Rename the copied folder to

<ProjectName>

Move it into

Projects/

## 3. Update project metadata

Update

PROJECTS.md

README.md

using the new project name.

Populate PROJECTS.md with:

- Project name
- Status = Planning
- Any technologies explicitly specified by the user

Do not invent technologies, frameworks or architecture that have not yet been decided.

## 4. Verify

Verify that the project contains

- assets/
- docs/
- planning/
- src/

and every file from the template.

## 5. Git

Automatically initialize a local Git repository.

Create an initial commit describing the project scaffold.

Use the globally configured Git identity.

Never ask to initialize local Git.

Never assume my Git identity is missing.

If Git appears to be misconfigured, verify the global Git configuration before asking me any questions.

Never create a GitHub repository.

Never add a remote.

Never push commits.

Never communicate with GitHub unless I explicitly request it.

## 6. GitHub

GitHub is optional.

Suggest creating a GitHub repository only when the project has reached a stage where version sharing or backup would be beneficial.

Never create it automatically.

## 7. Codex

Do NOT invoke Codex automatically.

If the implementation becomes large, spans multiple files, introduces significant architectural decisions, affects security, or is approaching production quality, recommend an independent Codex review.

Explain why.

Always ask for approval first.

## 8. Finish

Summarize

- project location
- files created
- Git status
- remaining manual steps
- recommended next action

Then stop and wait for further instructions.

---

# Workflow: Review

Trigger

workflow:review

Purpose

Perform a complete review of the current project.

Evaluate

- architecture
- readability
- maintainability
- security
- performance
- bugs
- technical debt

Do not modify code unless explicitly requested.

Recommend a Codex review if appropriate.

---

# Workflow: Feature

Trigger

workflow:feature <FeatureName>

Purpose

Plan and implement a feature.

Process

1. Understand the request.
2. Produce an implementation plan.
3. Explain important design decisions.
4. Wait for approval if the change is significant.
5. Implement.
6. Perform a self-review.
7. Recommend a Codex review if appropriate.
8. Summarize the work completed.

---

# Workflow: Release

Trigger

workflow:release

Purpose

Prepare the current project for release.

Verify

- build
- tests
- documentation
- README
- version information

Recommend a final Codex review before release.

Never create releases or GitHub tags automatically.

---

# Workflow: Plan

Trigger

workflow:plan

Purpose

Produce a detailed implementation plan only.

Do not write code.

Wait for approval before implementation.