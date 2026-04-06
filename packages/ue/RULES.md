# Unified Experience (UE) Component Rules

This document serves as the source of truth for AI agents generating or modifying components in the `@my-google-project/ue` package.

## Global Rules

1.  **Zero Assumption Imports**: Do not assume external packages are available. If a component needs a primitive (like a Button or Icon), and it is not in `@my-google-project/gm3-react-components`, implement it locally or use standard HTML styled with Tailwind.
2.  **Aesthetics**: Follow the high-fidelity GM3 design system. Use specific colors like `#F8FAFD` for app backgrounds.
3.  **Layout Hierarchy**:
    *   `TopAppBar` must always sit at the very top.
    *   The lower area is split horizontally: `SideNav` on the left, and a `<main>` container on the right.
    *   The `<main>` container must be scrollable if content overflows.

---

## Component Catalog & Rules

### 1. DefaultTopAppBar
A high-fidelity application header based on the CEE Basic App Bar spec (size 1440x64).

*   **Rules**:
    *   **Layout**: `Product lockup` (left, width 256), `Search container` (center, width up to 968), and `Right-side Actions` (right, width 216).
    *   **Branding**: Must include the standard Google-style SVG logo and "My Google" title.

    *   **Actions**: Supports a dynamic array of actions. Default actions include Help (question mark), Settings (gear), and Spark (star).
    *   **Profile**: Renders avatar with circular background `#0B57D0` and white initials.

### 2. SideNav
A dual-tier relational navigation system consisting of a narrow `NavigationRail` and an expandable overlay drawer.

*   **Rules**:
    *   Rail destinations must map to rail IDs.
    *   Dynamic filtering of drawer items based on the active rail selection must be handled gracefully.
    *   Support bottom-docked items.

### 3. Basic Primitives
These are the foundational components used across all application views.

*   **Button**: Simple clickable element. Must use standard Tailwind colors or specified overrides.
*   **Icon**: Renders material symbols. Always text-based (e.g., `<span>search</span>`).
*   **IconButton**: Renders a circular button containing an icon. Hover states must dim by 5% dark.
*   **Chip**: Renders a rounded filter or tag with an optional leading icon.
*   **Snackbar**: Floating bottom-left message that auto-dismisses after 3 seconds.
*   **TextField**: Text input supporting both single line and textarea behavior. Container should be styled.

---

## AI Generation Directives

When creating a new application using this boilerplate:
1.  Read this `RULES.md` file first to understand constraints.
2.  Generate a standard wrapper layout containing `TopAppBar`, `SideNav`, and a central main content section.
3.  Use background `#F8FAFD` for content cards or primary surfaces where available.
