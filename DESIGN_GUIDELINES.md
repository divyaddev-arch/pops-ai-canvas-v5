# AI Canvas Design Guidelines

To ensure visual consistency and prevent layout issues like "white space" or "unexpected drawer behavior," follow these standards for all future designs.

## 1. Layout & Backgrounds
*   **Main Background:** Always use `#F8FAFD` for the root background.
*   **Sidebar Container:** Use the `MainLayout` component. Never wrap the `SideNav` in an `aside` with its own background or borders.
*   **Content Area:** Use `surface-container` (`#F0F4F9`) for the main workspace cards.
*   **Chat Bubbles:** Use `surface-container-high` (`#E9EEF6`) for user messages.

## 2. Navigation Rail (SideNav)
*   **Width:** Fixed at `96px`.
*   **Background:** Always transparent (`!bg-transparent`).
*   **Interactions:** No hover-expansion effects. The secondary drawer should only appear on explicit clicks.

## 3. Borders & Outlines
*   **Redundancy:** Avoid "double-bordering." If a component (like `SideNav`) has its own border, its parent container must not.
*   **Color:** Use `rgba(0, 0, 0, 0.1)` for subtle outlines.

## 4. Spacing & Corners
*   **Padding:** Use `24px` for main container padding.
*   **Radius:** Use `24px` for the main workspace cards and chat containers.

## 5. Implementation Pattern
*   **Theme Constants:** Always import from `/src/constants/theme.ts`.
*   **Shared Layout:** Always use `/src/components/layout/MainLayout.tsx`.
