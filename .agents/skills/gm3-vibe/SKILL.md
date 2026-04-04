---
name: gm3-vibe
description: Guides the agent on building UI using GM3 components, preventing direct modification and advising proper creation strategies, adapted for the packages folder structure.
version: 1.0.0
tags:
  - ui-library
  - gm3
  - design-system
---

# `gm3-vibe` Skill Instructions

## Overview

This skill guides the AI agent (Antigravity/Jetski or within Google AI Studio) on how to build user interfaces safely and efficiently using the `gm3-vibe` library or GM3 components in target packages.

## When to Use

- Building any user interface or frontend view where GM3 components are available in `packages/design-vibe/` or `@my-google-project/gm3-react-components`.
- Adding components, wrappers, or sections that rely on design tokens.

## Critical Rules for the Agent

### 1. Always Use GM3 Components

When building any UI and GM3 components are available, you **must** prioritize using components from the `packages` folder before creating any new UI from scratch.

### 2. NEVER Modify Source Files

You must **never** update, edit, or modify the source files of `gm3-vibe` or GM3 components inside `packages/` directly. They are treated as strictly read-only by the agent to prevent breaking upgrades.

### 3. Recommend As-Is

Always advise the user to use the components as they are, configuring their props loaded by default, without modifying the underlying layout.

### 4. Persistent Modification Requests

If the user insists on modifying a component:

- **Do NOT** edit the package source inside `packages/`.
- **Ask for Confirmation FIRST**: First, you **must** warn the user that making a local copy means they will **lose the ability to receive automatic updates** for that component. **Proceed only if the user explicitly confirms.**
- **DO** create a copy of the component style from `packages/` to the local project root under `creatives/[project-name]/components/<Component>.tsx`.
- Perform your modifications on that **local copy** and **carefully update the import reference** yourself inside any calling files to point to this new local copy.
