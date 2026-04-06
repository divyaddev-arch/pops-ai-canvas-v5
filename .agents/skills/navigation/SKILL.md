---
name: navigation
description: Guides the agent on how to manage and place pages within the unified navigation system.
---

# Navigation Structure Skill

This skill documents the available navigation categories (Rail IDs) and their corresponding drawer items (Drawer Item IDs) in the `NavigationRail` component.

## Architecture

The navigation system uses a two-tier structure:
1.  **Navigation Rail**: The left-most vertical bar containing top-level destinations.
2.  **Contextual Drawer**: A sliding drawer that opens when a rail item is active, containing sub-destinations.

To target a specific page, you must provide both the `activeId` (Rail ID) and `activeDrawerItemId` (Drawer Item ID) to the `UnifiedLayout` component.

## Available Navigation IDs

### Growth (`activeId: 'growth'`)
*   `overview`: Overview
*   `career`: Career development
*   `profiles`: Role profiles
*   `learning`: Learning
*   `location`: Location transfer
*   `role`: Role transfer
*   `immigration`: Immigration
*   `mobility`: Mobility support
*   `school`: The Google School

### Performance (`activeId: 'performance'`)
*   `overview`: Overview
*   `timeline`: Timeline
*   `expectations`: Expectations
*   `feedback`: Feedback
*   `discussions`: Discussions
*   `reviews`: Annual reviews

### Compensation (`activeId: 'compensation'`)
*   `overview`: Overview
*   `policy`: Policy
*   `pay`: Pay
*   `equity`: Equity
*   `gtime`: gTime

### Hiring (`activeId: 'hiring'`)
*   `overview`: Overview

### Benefits (`activeId: 'benefits'`)
*   `overview`: Overview
*   `internet`: Internet
*   `timeoff`: Time off
*   `healthcare`: Healthcare
*   `financial`: Financial
*   `wellbeing`: Wellbeing
*   `additional`: Additional

### Culture (`activeId: 'culture'`)
*   `culture`: Culture
*   `engage`: Engage
*   `recognition`: Recognition

### Help Center (`activeId: 'help-center'`)
*   `support`: Get support
*   `requests`: Requests
*   `employment`: Employment info
*   `managers`: Managers

## Guidelines for AI Assistant

When creating a new page or feature:
1.  **Identify the Category**: Determine which main category (Growth, Performance, etc.) it belongs to.
2.  **Select Drawer Item**: Choose an existing drawer item ID.
3.  **Use UnifiedLayout**: Wrap the page content in the `UnifiedLayout` component.
4.  **Link the Component**: Pass the `activeId` and `activeDrawerItemId` props to `UnifiedLayout` to highlight the correct location.

### Golden Example (Page Wrapper Pattern)

```tsx
import React from 'react';
import { UnifiedLayout } from '../ue/UnifiedLayout';

export const MyNewPage = () => {
  return (
    <UnifiedLayout activeId="compensation" activeDrawerItemId="overview">
      <div className="space-y-6">
        <h1 className="text-2xl font-medium text-[#1F1F1F]">Page Title</h1>
        {/* Page content goes here */}
      </div>
    </UnifiedLayout>
  );
};
```
