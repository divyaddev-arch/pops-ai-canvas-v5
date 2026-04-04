---
name: active-project
description: Guides the agent on how to manage active project focus, standard project structure, and automation scripts for pops-ai-canvas.
---

# `active-project` Skill Instructions

This skill outlines the rules for project management, isolation, and automation specific to `pops-ai-canvas`.

## 1. Active Project Focus

*   **Identify Active Project**: The "Active Project" is determined by the `Homepage` import statement in `src/App.tsx`. Always check this file first to understand which project is currently being served.
*   **Strict Scoping**: Once an active project is identified (e.g., `creatives/demo-01`), all subsequent development, file creations, and modifications **MUST** be confined to that project's specific directory.
*   **Forget Other Projects**: Do not modify, reference, or create files in other project directories under `creatives/` unless explicitly instructed to perform a cross-project task. Focus exclusively on the active one.

## 2. Standard Project Structure

Every project within the `creatives/` directory **MUST** adhere to the following structure to maintain consistency:
*   `[project-name]/index.tsx`: The primary entry point for the project. It should typically import and render the main page from the `pages/` directory.
*   `[project-name]/components/`: Contains reusable UI components specific to this project.
*   `[project-name]/pages/`: Contains page-level components and routing logic for the project.

## 3. Global File Modifications

*   Modifications to global files (e.g., `src/App.tsx`, `server.ts`, `package.json`, `tailwind.config.ts`, `creatives/projects.json`) are permitted **ONLY** for system-level updates, such as switching the active project, adding global dependencies, or updating shared configurations.
*   Avoid adding project-specific logic to these global files.

## 4. Automation Scripts

*   **Project Switching**: Use `npx tsx scripts/switch-project.ts [project-id]` to change the active project in `src/App.tsx`.
*   **Project Creation**: Use `npx tsx scripts/create-project.ts [project-name]` to generate a new project with the standard structure and register it in `projects.json`.

## 5. Noir Investigative Design Rules (Active Project)

To maintain the "Noir Investigative" aesthetic while adhering to UE standards, the following rules MUST be followed for all pages in this project:

*   **Backgrounds**: Use `#F8FAFD` for all global backgrounds and navigation surfaces.
*   **Borders**: Remove borders between the App Bar, Side Nav, and Content area.
*   **Layering (Z-Index)**:
    *   Film Grain: `z-[5]`
    *   Main Content: `z-10`
    *   App Bar: `z-30`
    *   Side Nav: `z-40`
    *   AI Assistant Panel: `z-50` (Fixed)
*   **Navigation**:
    *   The `TopAppBar` top-left must always show the Product Lockup.
    *   Page titles live inside the content area.
    *   Drawer items MUST have transparent backgrounds (`!bg-transparent`).

## 6. Investigative Persona & AI Capabilities (Active Project)

The AI Assistant (The Investigator) MUST follow these persona and capability guidelines:

*   **Persona**: Noir Investigator. Gritty, sharp, and atmospheric.
*   **Voice**: Use detective metaphors. Avoid corporate jargon.
*   **Core Capabilities**:
    *   **EVIDENCE_COLLECTION**: Analyze user skills/experiences as "evidence".
    *   **FORENSIC_AUDIT**: Audit users against high-level role profiles (e.g., L7 Staff).
    *   **CORKBOARD_STRATEGY**: Connect dots between achievements to build a narrative.
