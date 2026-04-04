
import React from 'react';

/**
 * @fileOverview Defines the "flavor" and design rules for the Unified Experience (UE).
 * This file extracts the "feel" of the UE pages to ensure consistency across the application.
 */

export const UE_FLAVOR = {
  /**
   * Typography rules for a friendly, modern feel.
   */
  typography: {
    heading: "text-4xl font-medium tracking-tight text-on-surface",
    subheading: "text-xl font-normal text-on-surface-variant",
    body: "text-base font-normal text-on-surface",
    caption: "text-sm font-normal text-on-surface-variant",
    label: "text-xs font-medium uppercase tracking-wider text-on-surface-variant",
  },

  /**
   * Color palette based on Material Design 3 (GM3).
   */
  colors: {
    background: "bg-[#F8FAFD]", // Global background color
    surface: "bg-white",    // Surface background for nav elements
    primary: "text-primary",
    secondary: "bg-secondary-container text-on-secondary-container",
    accent: "bg-tertiary-container text-on-tertiary-container",
    error: "text-error",
    ai: "bg-blue-50 text-blue-700 border-blue-100", // Soft blue for AI-related elements
  },

  /**
   * Layout and Layering rules.
   */
  layout: {
    appBarHeight: "h-[64px]",
    sideNavWidth: "w-[96px]",
    drawerWidth: "w-[256px]",
    zIndex: {
      grain: "z-[5]",      // Film grain texture
      content: "z-10",     // Main page content
      appBar: "z-30",      // Top app bar (solid)
      sideNav: "z-40",     // Side navigation rail/drawer
      aiPanel: "z-50",     // Fixed AI Assistant panel
    },
    borders: {
      none: "border-none",
      subtle: "border-outline-variant/10",
    }
  },

  /**
   * Shape and spacing rules.
   */
  shapes: {
    pill: "rounded-full",
    card: "rounded-3xl shadow-sm border border-outline-variant",
    input: "rounded-full px-6 py-3 border border-outline focus:border-primary",
    badge: "rounded-lg px-2 py-0.5 text-xs font-medium",
  },

  /**
   * Component-specific "flavor" rules.
   */
  components: {
    /**
     * AI-first search/input bar.
     */
    searchBar: "w-full max-w-3xl mx-auto rounded-full bg-surface-container-high px-6 py-4 flex items-center gap-3 shadow-md",
    
    /**
     * Suggested action pills.
     */
    suggestedAction: "flex items-center gap-2 px-4 py-2 rounded-full border border-outline hover:bg-surface-container-low transition-colors text-sm font-medium",
    
    /**
     * Task list item.
     */
    taskItem: "flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container transition-colors border-b border-outline-variant last:border-0",
    
    /**
     * Status badge colors.
     */
    status: {
      active: "bg-blue-100 text-blue-700",
      pending: "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
      error: "bg-red-100 text-red-700",
    },
  },

  /**
   * Animation and transition rules.
   */
  animations: {
    fade: "transition-opacity duration-300 ease-in-out",
    slide: "transition-transform duration-300 ease-in-out",
    hover: "transition-all duration-200 ease-in-out hover:scale-[1.02]",
  },
};

/**
 * Utility component to document the UE Flavor.
 */
export const UeFlavorGuide: React.FC = () => {
  return (
    <div className="p-8 space-y-12 bg-surface text-on-surface">
      <section>
        <h2 className={UE_FLAVOR.typography.heading}>UE Flavor Guide</h2>
        <p className={UE_FLAVOR.typography.subheading}>Extracting the feel of the Unified Experience.</p>
      </section>

      <section className="space-y-4">
        <h3 className={UE_FLAVOR.typography.label}>Typography</h3>
        <div className="space-y-4">
          <p className={UE_FLAVOR.typography.heading}>Heading: The quick brown fox</p>
          <p className={UE_FLAVOR.typography.subheading}>Subheading: The quick brown fox jumps over the lazy dog</p>
          <p className={UE_FLAVOR.typography.body}>Body: The quick brown fox jumps over the lazy dog</p>
          <p className={UE_FLAVOR.typography.caption}>Caption: The quick brown fox jumps over the lazy dog</p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className={UE_FLAVOR.typography.label}>Shapes & Components</h3>
        <div className="flex flex-wrap gap-4">
          <div className={UE_FLAVOR.components.suggestedAction}>
            <span>Suggested Action</span>
          </div>
          <div className={`${UE_FLAVOR.shapes.badge} ${UE_FLAVOR.components.status.active}`}>
            Active
          </div>
          <div className={`${UE_FLAVOR.shapes.badge} ${UE_FLAVOR.components.status.pending}`}>
            Pending
          </div>
          <div className={`${UE_FLAVOR.shapes.badge} ${UE_FLAVOR.components.status.completed}`}>
            Completed
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className={UE_FLAVOR.typography.label}>Search Bar (AI-First)</h3>
        <div className={UE_FLAVOR.components.searchBar}>
          <span className="text-on-surface-variant">Search or ask a question...</span>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className={UE_FLAVOR.typography.label}>Card Style</h3>
        <div className={`p-6 ${UE_FLAVOR.shapes.card} bg-surface-container-low max-w-md`}>
          <h4 className="text-xl font-medium mb-2">Announcement</h4>
          <p className="text-on-surface-variant">This is how cards should look in the Unified Experience.</p>
        </div>
      </section>
    </div>
  );
};
