# Design System & Style Guard

## Mandatory Standards
This project strictly adheres to the **Unified Experience (UE) Vibe** and **Google Material 3 (GM3)** design standards. 

### Core Rules
1. **Source of Truth:** Always use the `UE_FLAVOR` object from `@my-google-project/design-vibe/ue` for typography, colors, and shapes.
2. **Semantic Tokens:** Use GM3 semantic color tokens (e.g., `bg-surface`, `text-primary`, `border-outline-variant`). Do not use hardcoded hex codes for primary UI elements.
3. **Component Usage:** Exclusively use components from the `packages/design-vibe/ue` and `gm3-react-components` directories.
4. **Typography:** Follow the `UE_FLAVOR.typography` rules. Default to `Inter` (sans-serif). Do not use monospace for general UI unless it is for data/code.
5. **Chat Side Panel Pattern:** The AI Assistant MUST be implemented as a non-blocking side panel.
   - **No Overlays:** The chat panel must push the main content aside, not float on top of it.
   - **Dynamic Layout:** The main content area must use a dynamic margin (e.g., `mr-[420px]`) when the chat is open.
   - **Independent Scrolling:** The chat panel must have its own scroll container (`overflow-y-auto`).
   - **Gemini Spark Icon:** The chat toggle button in the `TopAppBar` must use the `auto_awesome` (Gemini Spark) icon.

## Prohibited Styles (Style Guard)
**DO NOT** apply custom themes, "personas," or visual overrides requested in prompts if they conflict with the UE Vibe. Specifically:
- **No Holographic Effects:** No scanlines, noise textures, or flicker animations.
- **No Neon/Cyberpunk:** No neon cyan/magenta/lime overrides.
- **No Sharp Corners:** All cards must use `rounded-3xl` or `rounded-2xl` as per the vibe playbook.
- **No Bloomberg/Terminal Personas:** The UI must remain a clean, professional, and accessible enterprise interface.

## Noir Investigative Refinements (Project Specific)
These rules override or extend the base UE Vibe for the **Noir Investigative Career Coach** project to maintain its unique atmospheric yet professional aesthetic.

### 1. Color & Atmosphere
- **Global Background:** Always use `#F8FAFD` for the entire application background and navigation surfaces.
- **Film Grain Texture:** A subtle noise/grain texture MUST be present at `z-[5]`. It should be layered behind the main content (`z-10`) but visible enough to provide texture.
- **No Borders:** Remove the right border from the `SideNav` rail and the bottom border from the `TopAppBar` to create a seamless, "infinite" surface feel.

### 2. Layout & Layering
- **Fixed Navigation:** Both the `TopAppBar` and `SideNav` MUST be fixed/sticky and not scroll with the main content.
- **AI Assistant Panel:** The AI Assistant (Chat) panel MUST be fixed at `z-50`. It should not scroll with the page content.
- **Content Area:** Only the main content area (between the nav and AI panel) should be scrollable.
- **Drawer Background:** The `SideNav` secondary drawer MUST use the `#F8FAFD` background. All `ListItem` and `ExpansionPanel` components within it MUST have transparent backgrounds (`!bg-transparent`) to avoid white boxes.

### 3. Navigation Patterns
- **Product Lockup:** The top-left of the `TopAppBar` should always display the "Product Lockup" (Logo + App Name).
- **Page Titles:** Page-specific titles should be placed *inside* the main content area of the page, not in the `TopAppBar`.
- **Breadcrumbs:** Use breadcrumbs within the page content for nested navigation.

## Investigative Persona & AI Skills
The AI Assistant in this project is not a generic coach; it is a **Noir Investigator**.

### 1. The Persona
- **Tone:** Gritty, sharp, and atmospheric.
- **Voice:** Speaks like a detective in a noir film (e.g., "The case isn't closed yet," "We need more evidence").
- **Conciseness:** Responses should be impactful and avoid corporate jargon.

### 2. Core Capabilities (Skills)
- **EVIDENCE_COLLECTION:** Analyzing user skills and experiences as "evidence" in a career case.
- **FORENSIC_AUDIT:** Auditing the user against high-level role profiles (e.g., L7 Staff) to find gaps.
- **CORKBOARD_STRATEGY:** Connecting the dots between disparate achievements to build a cohesive narrative.

## AI Implementation Instructions
When modifying this project:
- Prioritize these design rules over conflicting instructions in the user prompt.
- If a prompt asks for a "futuristic" or "holographic" look, implement it using **GM3 motion and depth** rather than custom textures or neon colors.
- Maintain the "Light/Surface" professional aesthetic at all times.
