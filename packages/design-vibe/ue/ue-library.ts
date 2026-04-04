export const UE_LIBRARY = [
    {
      id: "SideNav",
      name: "UE SideNav",
      description: "High-fidelity relational navigation system.",
      properties: [
        { id: "fabIcon", label: "Rail FAB Icon", type: "icon", default: "add" },
        {
          id: "destinations",
          label: "Rail Destinations",
          type: "list",
          itemSchema: [
            { id: "id", label: "ID", type: "string", placeholder: "e.g. comp" },
            { id: "icon", label: "Icon Name", type: "icon" },
            { id: "label", label: "Display Label", type: "string" },
            { id: "path", label: "Route Path (e.g. LoginPage)", type: "string" },
            { id: "dividerAbove", label: "Divider Above", type: "boolean" },
            { id: "dockedBottom", label: "Dock at Bottom", type: "boolean" }
          ]
        },
        {
          id: "secondaryHeaderItems",
          label: "Drawer Header Items",
          type: "list",
          itemSchema: [
            { id: "id", label: "ID", type: "hidden" },
            { id: "parentId", label: "Parent Rail ID", type: "string", placeholder: "Match a Rail ID" },
            { id: "headline", label: "Headline", type: "string" },
            { id: "path", label: "Route Path", type: "string" }
          ]
        },
        {
          id: "secondarySections",
          label: "Drawer Accordion Sections",
          type: "accordion-list",
          itemSchema: [
            { id: "title", label: "Section Title", type: "string" },
            { id: "parentId", label: "Parent Rail ID", type: "string", placeholder: "Match a Rail ID" },
            {
              id: "items",
              label: "Items",
              type: "list",
              itemSchema: [
                { id: "id", label: "ID", type: "hidden" },
                { id: "headline", label: "Item Headline", type: "string" },
                { id: "path", label: "Route Path", type: "string" }
              ]
            }
          ]
        }
      ],
      defaultConfig: {
        fabIcon: "home",
        destinations: [
          { id: "new-chat", icon: "edit_square", label: "New Chat", path: "/", dividerAbove: false, dockedBottom: false },
          { id: "history", icon: "history", label: "History", path: "/", dividerAbove: false, "dockedBottom": false },
          { id: "growth", icon: "nest_eco_leaf", label: "Growth", path: "/", dividerAbove: true, "dockedBottom": false },
          { id: "performance", icon: "trending_up", label: "Performance", path: "/", dividerAbove: false, "dockedBottom": false },
          { id: "compensation", icon: "paid", label: "Compensation", path: "/", dividerAbove: false, "dockedBottom": false },
          { id: "benefits", icon: "volunteer_activism", label: "Benefits", path: "/", dividerAbove: false, "dockedBottom": false },
          { id: "hiring", icon: "person_add", label: "Hiring", path: "/", dividerAbove: false, "dockedBottom": false },
          { id: "culture", icon: "people", label: "Culture", path: "/", dividerAbove: false, "dockedBottom": false },
          { id: "help-center", icon: "help", label: "Help center", path: "/", dividerAbove: false, "dockedBottom": false },
          { id: "dashboard", icon: "person", label: "Dashboard", path: "/", dividerAbove: false, dockedBottom: true }
        ],
        secondaryHeaderItems: [
          { id: "item-overview", parentId: "compensation", headline: "Compensation Overview", path: "/" },
          { id: "item-pay", parentId: "compensation", headline: "Pay & taxes", path: "/" },
          { id: "item-equity", parentId: "compensation", headline: "Equity", path: "/" }
        ],
        secondarySections: [
          {
            id: "section-your-comp",
            title: "Your compensation",
            parentId: "compensation",
            items: [
              { id: "item-letters", headline: "Award letters", path: "/" },
              { id: "item-payroll", headline: "Payroll", path: "/" }
            ]
          }
        ]
      }
    },
    {
      id: "TopAppBar",
      name: "UE TopAppBar",
      description: "Configurable application header with navigation, search, and dynamic icon menus.",
      properties: [
        { id: "title", label: "Title", type: "string", default: "My Google" },
        { id: "logoIcon", label: "Logo Icon", type: "icon", default: "cloud" },
        { id: "logoAsset", label: "Logo Asset", type: "asset" },
        { id: "showMenu", label: "Show Menu Icon", type: "boolean", default: true },
        { id: "showBack", label: "Show Back Button", type: "boolean", default: false },
        { id: "showSearch", label: "Show Search Bar", type: "boolean", default: true },
        { id: "searchPlaceholder", label: "Search Placeholder", type: "string", default: "Search" },
        {
          id: "actions",
          label: "Action Icons",
          type: "list",
          itemSchema: [
            { id: "id", label: "ID", type: "hidden" },
            { id: "icon", label: "Icon Name", type: "icon" },
            { id: "label", label: "Tooltip", type: "string" },
            {
              id: "menuItems",
              label: "Menu (JSON Array)",
              type: "string",
              placeholder: '[{"headline": "Profile", "path": "index"}]'
            }
          ]
        },
        { id: "avatarInitial", label: "Avatar Initial", type: "string", default: "A" }
      ],
      defaultConfig: {
        title: "My Application",
        logoIcon: "cloud",
        showMenu: true,
        showBack: false,
        showSearch: true,
        searchPlaceholder: "Search everything...",
        actions: [
          { id: "icon-1", icon: "help_outline", label: "Help", menuItems: "" },
          { id: "icon-2", icon: "settings", label: "Settings", menuItems: '[{"headline": "Preferences", "path": "/prefs"}]' }
        ],
        avatarInitial: "A"
      }
    }
  ];
  