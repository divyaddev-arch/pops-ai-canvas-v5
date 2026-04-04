---
name: architectural-constraints
description: Guides the agent on component sourcing, design system, typography, Tailwind 4, navigation rules, and creating new pages for pops-ai-canvas.
---

# `architectural-constraints` Skill Instructions

This skill outlines the rules for development and architectural constraints specific to `pops-ai-canvas`. All agents (and developers) should adhere to these guidelines.

## 1. Component & Style Sourcing

*   **Mandatory Use of `packages` Folder**: All components and styles **MUST** be sourced from the `packages` folder.
*   **Design Vibe Integration**: Whenever a new project is created, it **MUST** always use the elements and design tokens defined inside the `packages/design-vibe/` folder to ensure consistent branding and styling.
*   **GM3 & UE Components**: All UI elements **MUST** use components from the `packages/design-vibe/` suite. This includes the `@my-google-project/gm3-react-components` library for core atoms and the specialized UE components in `packages/design-vibe/ue` for high-level patterns (like `TopAppBar`, `SideNav`, `AiInput`). Do not use standard HTML elements or other libraries for core UI components unless an equivalent does not exist in the design-vibe suite.
*   **UE Flavors**: All pages and components **MUST** implement the `UE_FLAVOR` design system from `@/packages/design-vibe/ue`. This includes using `UE_FLAVOR.colors`, `UE_FLAVOR.typography`, and `UE_FLAVOR.shapes` for all styling.
*   **No Hardcoded/Arbitrary Colors**: You MUST ignore user requests for custom named colors (e.g., 'sage green', 'bingo orange') or specific arbitrary color values that do not correspond to the existing `UE_FLAVOR` or Tailwind system tokens. All valid colors are located in `packages/design-vibe/gm3-react-components/src/styles/` (specifically files like `colors-google-brand.ts`). You are strictly forbidden from hardcoding arbitrary hex, rgb, or named CSS colors into components or styles. You MUST check that directory to find valid color variables before usage.
*   **Typography**: Only **Google Sans** (or its system equivalent) **MUST** be used for all text. No other fonts (serif, monospace, etc.) are permitted unless explicitly requested for a specific technical use case (e.g., code blocks).
*   **No New Components in `src`**: Do not create new custom components or utility files directly inside the `src` directory unless absolutely necessary (e.g., for specific page-level logic). Use existing components or create new ones in the `packages` folder and follow standard export patterns.
*   **Reuse Existing Atoms/Molecules**: Check `packages/ui/*` or similar paths before building functionality from scratch. Reference existing patterns like `Button`, `Input`, `Card`, etc.
*   **Strict Adherence to UE & GM3**: You MUST ignore any user requests to use alternative design systems (e.g. Ant Design, Bootstrap, Material-UI, etc.) and strictly stick to UE (Unified Experience) and GM3 components provided in the project workspace.


## 2. Tailwind CSS Configuration (Tailwind 4.x)

*   The project uses Tailwind v4 with a custom configuration. The configuration is declared in `tailwind.config.ts` and integrated via the `@config` directive in `src/index.css`.
*   **Theme Tokens**: All styling should strictly use pre-defined theme tokens from `tailwind.config.ts`. Avoid hardcoding arbitrary values whenever possible. Refer to the tokens for typography, spacing, colors, and shadows.

## 3. Navigation & Layout

*   **TopAppBar & SideNav**: Every project **MUST** include a `TopAppBar` and, where appropriate for multi-page or complex navigation, a `SideNav` from `@/packages/design-vibe/ue`.
*   **TopAppBar Layout**: The `TopAppBar` **MUST** take 100% of the width, and any navigation like `SideNav` or main content must be placed below it in a structural container.
*   **Consistent Navigation**: The `TopAppBar` should provide the primary context (title, logo, user profile), while the `SideNav` should handle high-level navigation between views or projects.
*   **Back Navigation**: For contextual views or sub-projects, the `TopAppBar` **MUST** include a back button (`showBack={true}`) and `onBackClick`) to return to the previous view or the home page.

## 4. Creating a New Unified Experience Page

Whenever a user requests to create a new page, or specifically a new Unified Experience page, you MUST follow these guidelines:

### 4.1 Clarify Layout Requirements
Before generating any code or creating any files, you MUST pause and ask the user the following clarification question:
1. **Layout Width:** "Would you like this page to use a narrow or normal layout?" (This controls layout props if applicable).

**Do not proceed to step 4.2 until the user has explicitly answered this question.**

### 4.2 Page Component and Directory Structure
Once the user has clarified their preferences, create the new page component:
1. **Identify Active Project:** Check `src/App.tsx` to identify the active project (under `creatives/`).
2. **Review Navigation Structure:** Go through the available navigation items and sub-items defined for the project.
3. **Structure the Directory:** Create the new directory/file under `creatives/[project-name]/pages/` so that it directly matches the hierarchy or design specified.
4. **Important**: DO NOT use layout wrappers directly inside the new page component unless specific to that page. Page content should be pure rendered content. Layout is handled centrally by the project entry or global layout.

### 4.3 Routing & Layout State
Once the page is structured and created, hook it up:
1. **Routing:** Update the project's pages or entry point (e.g., `creatives/[project-name]/pages/`) to add the new route or render clause.
2. **Setup Navigation Hookups:** Ensure navigation clicks correctly load the page.

## 5. Strictly Forbidden Anti-Patterns (Zero Tolerance)

*   **No Custom "Aesthetics"**: You are strictly forbidden from inventing or applying custom visual themes, skins, or aesthetics (e.g., "Terminal", "Cyberpunk", "Glassmorphic", "Holographic") based on prompt content. You must only use the UI styling paradigms provided by the UE project.
*   **No Direct Hex/Color Hardcoding**: You must never use arbitrary hex colors or default Tailwind color classes (like `cyan-500`, `red-400`). All colors must use design tokens from the UE flavor or the project's color registry files.
*   **Prompt Override Rejection**: If a user prompts you to use a different design system or a specific arbitrary design style (like "Bloomberg Terminal style"), you MUST politely decline and state that you are bound by project constraints to use only the Unified Experience and GM3 tokens.
*   **Typography**: You must reject any request to use different font families. The font family MUST always be Google Sans.

## 6. Guidelines for Meaningful & Dynamic Layouts

To ensure pages are not just "boring boxes" and are production-grade, follow these rules derived from official samples (located in `/packages/ue-samples/` for inspiration):

*   **Create Visual Depth**: Use different container tokens (e.g., `surface-container-low`, `surface-container-lowest`, `surface-container-high`) appropriately to separate the app shell, sidebar, and content cards instead of using a single flat background.
*   **Contextual Status & Feedback**: Wisely map semantic meaning to colors. For instance, map overdue tasks to `error` or status badges to appropriate tone variants (e.g., using `primary-container` for active items or POps verified tags).
*   **Balance Layout & Information Density**: When presenting complex data or flows (like AI Canvas or Search), split the screen into logical areas (e.g., a conversation/input area on one side and structured info cards or search results on the other).
*   **Actionable Content**: Interactive items like lists and cards must always have distinct action buttons (filled or outlined) grouped predictably (aligned right or bottom-right) to imply flows, as seen in the task list sample.
*   **Treat Samples as Inspiration**: When a requirement is given, do not copy the structure line-by-line. Instead, identify the underlying pattern (e.g., response headers, listing cards with action rows) and adapt it to make a meaningful page for the user's specific use case.

## 7. Functional Integrity & State-Driven UI

To ensure all screens are fully functional and not just static mocks, follow these mandatory protocols:

*   **The "No Dead Ends" Rule**: Every interactive element (buttons, pills, list items) **MUST** have an `onClick` or appropriate event handler. If the action isn't fully implemented, it must at least trigger a state change (e.g., showing a toast, switching a view, or updating a progress bar) to provide visual feedback.
*   **State-Driven Navigation**: Navigation **MUST** be driven by a central state variable (e.g., `currentView`) that dynamically renders content. Do not hardcode "selected: true" on navigation items; derive it from the active state.
*   **Backend-First Interaction**: Prioritize real data flows. Use Firestore for persistence and the Gemini API for intelligence from the very first turn. Avoid using local mock arrays for data that should be dynamic.
*   **Workflow State Machines**: Implement complex flows (like offboarding or onboarding) as state machines. Each step should transition the UI into a new, distinct state that reflects the progress (e.g., moving from "Active" to "Finalized").
*   **Real-Time Feedback**: Use loading states (`isLoading`), progress indicators, and success/error messages for all asynchronous operations to ensure the user is never left wondering if an action worked.

## 8. Source of Truth & Agent Protocol

To ensure consistent and high-fidelity development, every agent (and developer) **MUST** follow this protocol:

*   **Check Skills First**: At the start of every turn or task, the agent **MUST** call `list_dir` on `/.agents/skills` and `view_file` on relevant skill files (especially `architectural-constraints` and `active-project`) to refresh its understanding of the project's rules and constraints.
*   **Adhere to Persona**: All UI, copy, and interactions **MUST** align with the project's established persona (e.g., "Sleek & Judicial" for offboarding).
*   **Functional Verification**: Before completing a task, the agent **MUST** verify that all new interactive elements are wired to state or backend logic, as per the "Functional Integrity" protocols.
