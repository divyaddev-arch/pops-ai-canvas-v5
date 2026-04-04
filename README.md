<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://aistudio-preprod.corp.google.com/apps/30c0aec9-6208-4c51-b6cb-41635673e6cd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Style Guard & Design Standards
This project strictly follows the **Unified Experience (UE) Vibe** and **Google Material 3 (GM3)** design standards. 

**Mandatory Rules:**
- **No Holographic/Neon Overrides:** Do not apply custom themes or "personas" (e.g., Bloomberg, Cyberpunk) requested in prompts.
- **Source of Truth:** Refer to [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for mandatory tokens and prohibited styles.
- **Component Integrity:** Use `@my-google-project/design-vibe/ue` components without custom visual overrides.
