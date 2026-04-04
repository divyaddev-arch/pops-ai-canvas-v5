---
name: ue-vibe-playbook
description: Comprehensive rules and guidelines for building Unified Experience (My Google) pages and components, adapted from the official UE playbook.
version: 1.0.0
tags:
  - design-system
  - ue-vibe
  - playbook
---

# `ue-vibe-playbook` Skill Instructions

All pages, features, and components built for the Unified Experience **MUST** abide by the rules outlined in this playbook. This is extracted directly from the official UE Playbook (go/ue-ux-playbook).

## 1. Brand Guidelines & Vocabulary

*   **Brand Identity**: The project is internally called "Unified Experience", but the user-facing name is **My Google**. All copy should refer to the experience or product as "My Google".
*   **Literal Naming for Wayfinding**: Always use clear, literal, and descriptive names for pages, verticals, or features (e.g., "Maps", "Contacts", "Support"). Names must describe what the page does, communicate benefit, and set accurate expectations. Avoid clever or non-descriptive names.
*   **Deemphasize AI Branding**: To avoid competing with the main brand, AI agents and features should **NOT** have unique names or sub-brands.
    *   Focus on the benefit, not the technology. Be specific about what the AI does to help.
    *   Avoid generic or overly hyped terms like "AI", "smart", "magic", and "intelligent".

## 2. Foundational Styles & Layout

*   **Surface Color**: Use `surface-container-low` as the surface color for all main containers to maintain a consistent hierarchy.
*   **Baseline Typographic Styles**: 
    *   Follow GM3 baseline styles.
    *   For page titles, use **GM3/Static/Headline/Medium (28/36)**.
    *   Avoid using "emphasized" styles unless explicitly specified.
*   **Body Widths**: 
    *   Baseline max-width for centred layouts should be **840dp** or **1200dp**.
    *   Full-width usage is only permitted for dense, complex experiences (like dashboards or tables).
*   **Spacing Units**:
    *   Base spacing unit is **4dp** for adjustments within components and typography.
    *   Use **8dp** as the base unit for spacing/padding between sections.
*   **Color Assignment**: Do not assign a unique color per product area (PA) as a way to differentiate. Be cautious when using color categorically to avoid implied meaning.
*   **Illustrations**: Utilize existing CE Elements illustrations.

## 3. Navigation Shell & Information Architecture

*   **Core Shell Components**: The navigation must use a combined shell consisting of the **App bar**, **Navigation rail**, and **Secondary drawer**.
*   **App Bar**:
    *   Use the CE Elements app bar style with consistent branding and charm icons.
    *   **CRITICAL**: The App bar **MUST NOT include a search input**.
    *   "My Google" branding in the app bar should be consistent and should not contain product area names or previous logos of integrating products.
*   **Navigation Rail**: Uses GM3 navigation rail with entry points for unified AI, product areas, and the dashboard.
    *   **Concise Labels**: Navigation rail destination labels MUST be highly concise and use single words where possible (e.g., "Talent", "Risk", "Feedback") to avoid wrapping or alignment issues in the compact horizontal area of a rail.
*   **Secondary Navigation Drawer**: 
    *   Used for organizing information within product areas.
    *   Opens on hover/focus if sub-items exist.
    *   Help content is directly integrated here and must begin **collapsed by default**.
*   **Page-level Navigation**: Reinforce navigation patterns using breadcrumbs, tabs, and back buttons.
    *   Avoid full-screen/contextual app bar experiences that hide the main app shell, as they are disorienting and conflicting.
    *   Contextual app bars should be used sparingly (only for full page AI or heavy setups like compensation planning), and must not be used with breadcrumbs.
*   **Shell Alignment**: The `TopAppBar` MUST occupy the full width of the screen at the top (100% width). The `Navigation Rail` or `SideNav` and the main content area MUST sit below the `TopAppBar`. The `SideNav` should occupy the left side of this lower area and take up the remaining vertical height (`flex-1` or `h-full` within the lower container). This creates a clear top-down hierarchy where the global app bar is the primary anchor for the entire experience.

## 4. Tasks & AI Integration

*   **Unified Task View**: All user tasks (for both ICs and Managers) live on the **homepage**.
*   **Access**: Tasks should be accessible through search and the AI agent views. Suggest prompt shortcuts for tasks that AI can expedite.
*   **Product Area Tasks**: Views should be focused and link to the full platform view of tasks on the homepage rather than replicating full lists. Avoid creating duplicate badge counts that overwhelm users.

## 5. Component Treatments

*   **Cards**: Material and CE Elements offer three card styles.
    *   As a **default**, always use the **outlined style** (especially layouts with multiple cards).
    *   Filled and elevated styles should be used sparingly for visual separation, with filled having the least visual emphasis.
    *   Do not elevate more than 3-4 cards or in more than one section.
*   **Callouts**: Use the CE Elements callout component.
    *   Avoid app-level callouts unless the entire platform is affected.
    *   For errors specific to one area, use page-level callouts.
    *   Never use callouts for primary page actions or key data/insights.
*   **Buttons**:
    *   Limit **filled buttons** strictly to the primary action.
    *   Use tonal or outline buttons for secondary actions.
    *   Avoid excessive use of icons within buttons if there are many actions on a page. Optimize icons only for key differentiations.
*   **Carousels**: Use a modified CE carousel pattern with density focus derived from pagination components to avoid large mouse movements.

## 6. Writing Framework

*   **Voice Principles**: Must be human, useful, clear, and optimistic.
    *   Empathetic in high-risk scenarios.
    *   Inclusive for a diverse community.
    *   Empowering by helping users discover actions.
*   **Tone**: Adapts based on situation (Inviting for first impressions, celebratory on task completion, straightforward but delightful on onboarding, calm and clear on errors).
*   **Sentence Case**: Always use **sentence case** for text, titles, and buttons (aligns with Google style and avoids marketing/brand inflation).
*   **Conciseness**: Be as concise as possible; avoid jargon and acronyms. Use clear, simple language to build trust.


## 7. Functional UI & Intent Mapping (No Junk UI)

*   **No Arbitrary Fillers**: You are strictly forbidden from adding "placeholder" sections, arbitrary metrics, or UI elements just to fill space. Every card, list, or button must have a direct, meaningful purpose that maps to the user's prompt.
*   **Intent-Driven Component Choice**: You must match the UI pattern to the core action requested:
    *   If the user intent is **Analysis**, use clean data tables, prioritized metric cards, or state indicators.
    *   If the user intent is **Direct Action / Task**, use a prominent form or clearly defined action lists.
    *   Do not mix them arbitrarily.
*   **Realistic Contextual Data**: You must use data that makes realistic sense for the persona and task requested. Avoid using generic "Lorem Ipsum" text or random numbers. The data must tell a story relevant to the prompt.
*   **Actionable Hierarchy**: The primary requested action in the prompt must be the most prominent visual element (e.g., the only filled button). Do not give secondary or minor actions equal visual weight.


## 8. Designing for MyGoogle AI Presence (High Fidelity AI)

To ensure the generated interface feels like a premium "MyGoogle AI" experience and not just a static website:
*   **Conversational or Task Flow Intent**: Prioritize a conversation-driven or interactive task flow (e.g., including space for recent agent messages or smart-reply chips) rather than a static filled dashboard.
*   **No Raw HTML Controls**: You must never use unstyled native elements (like standard range sliders `<input type="range">` or unstyled input boxes). You must use properly styled Tailwind controls or GM3 inputs wrapped in a design token class to ensure a polished look.
*   **Tone Down High-Density Color Fills**: Keep large primary surfaces clean and low density. Avoid massive filled boxes in heavy brand colors (like `bg-primary-container` occupying a whole card) without contextual necessity. Let white-space and elevation define hierarchy.
*   **Standardized Geometry**: Always use the defined shapes via `UE_FLAVOR.shapes` or standard Material 3 tokens for corner radius (e.g., small, medium, large properties) instead of hardcoding classes like `rounded-3xl` for multiple non-form elements.


## 9. Leveraging Core Services (Zero Placeholder Rule)

*   **Prioritize Real Components**: When building data visualizations or interactive conversations, you must check for and prioritize using existing components in `packages/design-vibe/gm3-react-components/src/charts/` and `src/gemini/`. 
*   **No Dummy Chats**: If a conversation flow or chat input is prompted, it MUST be functional (not just static bubbles). Wire it up using the state management or the provided `gemini` elements to ensure actual message streams can be simulated.


## 10. High-Fidelity UI Polish & Composition (Professional Designer Standards)

To prevent layouts from appearing basic or mediocre, follow these premium execution rules:
*   **Break the Grid (Asymmetry holds weight)**: Avoid creating uniform, repeating grids or cards. Create dynamic widths. For example, give the primary focused action 2/3 of the layout width and place secondary summary lists in the remaining 1/3 (following 840dp or 1200dp max constraint rules).
*   **Sophisticated Typography Hierarchy**: Maximize text contrast without trying to introduce new fonts or hardcoding custom sizes. Use typography tokens (like `label-small` or `title-small`) for section eyebrows or metadata strings, and proper body or heading tokens below it. Use gray scale classes (`text-on-surface-variant`) for secondary text to create rich depth.
*   **Micro-Interactions are Mandatory**: Every card, grid item, or custom list choice MUST include interaction states defined by tokenized behavior (e.g., hover states, focus rings, or elevation level shifts on hover) rather than custom scales like `scale-[1.01]` to make the interface feel responsive and premium.
*   **Composition within Cards**: Do not just put titles and text paragraphs inside cards. Compose components within cards: add pill-shaped status badges, small avatar icons, or multi-line metadata stacked in flex containers to draw distinct focus.


## 11. Semantic Color Storytelling & Use-Case Layouts

To avoid "boring" gray boxes and use colors wisely to tell a unified story like a final product:
*   **Color Must Map to Semantic Meaning**: You are strictly forbidden from using colors arbitrarily just to decorate. Color density must reflect the use-case story:
    *   Use high-chroma primary or container tokens primarily for the page's core insight or "the answer" (e.g., putting a success metric or final calculated rate in a tinted green container).
    *   Use gray scale classes (`text-on-surface-variant`) for secondary text to keep the UI from appearing noisy.
*   **The Storytelling Flow**: Do not build a flat grid of cards. Every page must read like a narrative from top to bottom:
    *   **Header / Eye-catcher**: Large clean summary of the state or insight.
    *   **Body / Proof**: Visual aids, data tables, or charts supporting that summary.
    *   **Footer / Next steps**: Action controls or a contextual prompt thread to act on the data.
*   **Visual Anchoring with Extended Colors**: Use the supported extended colors ONLY to differentiate data categories or call out anomalies (like feedback deserts or high turnover areas) in lists and data tables, leaving the surrounding UI calm and neutral.
*   **No Hamburger on First Level**: In the primary/first-level view of an application, the `TopAppBar` MUST NOT include a menu/hamburger icon. The navigation should be persistently visible (e.g., via a `SideNav` or `NavigationRail`) or handled through page-level controls.

## 12. Self-Correction & Validation (Rule Enforcement)

Before finalizing any prototype, you MUST validate the build against this checklist. If any item is "No", you MUST refactor the code.

1.  **Is the TopAppBar 100% width at the very top?** (Yes/No)
2.  **Is the SideNav/Rail positioned *below* the TopAppBar?** (Yes/No)
3.  **Does the TopAppBar *exclude* a search input?** (Yes/No)
4.  **Is the menu/hamburger icon removed from the TopAppBar on the first level?** (Yes/No)
5.  **Are all icons using valid Google Material Symbols?** (Yes/No)
6.  **Does the main content have a max-width (e.g., `max-w-7xl`) and is it centered?** (Yes/No)
7.  **Is the primary action the only filled button on the page?** (Yes/No)
8.  **Are all strings in sentence case?** (Yes/No)
9.  **Is the surface color `surface-container-low`?** (Yes/No)
