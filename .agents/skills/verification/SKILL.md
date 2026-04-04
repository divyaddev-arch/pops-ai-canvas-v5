---
name: verification
description: Guides the agent on zero-assumption imports, prop validation, directory inspection, and early error detection for pops-ai-canvas.
---

# `verification` Skill Instructions

This skill outlines the rules for verification, context discovery, and error detection specific to `pops-ai-canvas`.

## 1. Zero-Assumption Imports

*   **Verify Before Import**: Before importing from any local package (e.g., `@/packages/*`, `creatives/*`, or shared utilities), you **MUST** `view_file` the `index.ts` or the specific component file to verify the exact export names.
*   **No Casing Assumptions**: Do not assume export names based on directory names (e.g., a directory `aipills` might export `AiPill` instead of `AiPills`).

## 2. Prop & Type Validation

*   **Inspect Definitions**: You **MUST** `view_file` the component definition to verify the `interface` or `type` of the props before usage.
*   **Check Event Handlers**: Pay special attention to event handler names (e.g., `onPillClick` vs `onClick`) to ensure the API matches the implementation.

## 3. Directory & Structure Inspection

*   **List Before Act**: Use `list_dir` to understand the structure of a package or project directory before assuming its contents or creating new files.

## 4. Early Error Detection

*   **Iterative Linting**: Run `lint_applet` after the first set of imports or significant usage of a new component to catch naming or type errors immediately. Do not wait until the end of the task to verify.
