---
name: UE Page Building
description: Instructions for AI Studio on how to build pages within the Unified Experience layout.
---

# UE Page Building Skill

Use this skill when generating new pages or components for the project in AI Studio to ensure they integrate correctly with the site's navigation and layout framework.

## Core Rules

1. **Target Directory**: 
   - All new component assets must be created inside the \`creatives/\` folder hierarchy.
   - Do **NOT** modify or add files directly to the \`packages/ue/\` folder because that serves strictly as your component library.

2. **Unified Layout Integration**: 
   - Every generated page component *must* import and call the \`UnifiedLayout\` handler from \`../../packages/ue/UnifiedLayout\`.
   - You must pass the target navigation anchors (\`activeId\` and \`activeDrawerItemId\`) directly into that layout tag parameters.
   - All custom visual content must be passed as the pure \`children\` of that layout wrapper.

3. **Component Usage Priorities**:
   - **Priority 1 (UE Components)**: Check \`packages/ue/\` first. If a block exists (like \`ChatView\` or \`HomePage\`), import and use it. Do not attempt to clone or write alternate versions.
   - **Priority 2 (GM3 Components)**: If specialized bindings aren't present in the UE deck, utilize base elements located in \`packages/gm3-react-components/\`.
   - **Priority 3 (Custom)**: Generate targeted pure TSX children if missing from both references!

4. **Reference Samples**:
   - Go to \`packages/ue/\` to understand the construction parameters.
   - Check \`packages/ue-demo/\` to analyze running implementations and see how the page routing hooks execute on the browser display.

## Golden Example

\`\`\`tsx
import React from 'react';
import { UnifiedLayout } from '../../packages/ue/UnifiedLayout';

export const MyNewPage: React.FC = () => {
  return (
    <UnifiedLayout activeId="compensation" activeDrawerItemId="overview">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-[#1F1F1F]">Compensation Overview</h1>
        {/* Page Content goes here */}
      </div>
    </UnifiedLayout>
  );
};
\`\`\`
