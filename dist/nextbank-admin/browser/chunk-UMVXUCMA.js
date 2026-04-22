import {
  ThemeService
} from "./chunk-U7BDKYDP.js";
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from "./chunk-YZXHJXLV.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-AVNAD6G5.js";
import {
  CommonModule,
  NgForOf,
  NgIf,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵsanitizeHtml,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-YOPZAQ25.js";

// src/app/features/layout/shell.component.ts
function ShellComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "div", 33);
    \u0275\u0275text(2, "NextBank");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 34);
    \u0275\u0275text(4, "ADMIN");
    \u0275\u0275elementEnd()();
  }
}
function ShellComponent_a_10_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r1.label);
  }
}
function ShellComponent_a_10_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 40);
  }
}
function ShellComponent_a_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 35);
    \u0275\u0275element(1, "span", 36);
    \u0275\u0275template(2, ShellComponent_a_10_span_2_Template, 2, 1, "span", 37)(3, ShellComponent_a_10_span_3_Template, 1, 0, "span", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLink", item_r1.path);
    \u0275\u0275advance();
    \u0275\u0275property("innerHTML", item_r1.icon, \u0275\u0275sanitizeHtml);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.sidebarCollapsed());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.sidebarCollapsed());
  }
}
function ShellComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "div", 42);
    \u0275\u0275text(2, "A");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 43)(4, "div", 44);
    \u0275\u0275text(5, "Admin User");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 45);
    \u0275\u0275text(7, "admin@nextbank.cm");
    \u0275\u0275elementEnd()()();
  }
}
function ShellComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46);
    \u0275\u0275text(1, "A");
    \u0275\u0275elementEnd();
  }
}
function ShellComponent_button_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 48);
    \u0275\u0275element(2, "path", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Log out ");
    \u0275\u0275elementEnd();
  }
}
function ShellComponent__svg_svg_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 26);
    \u0275\u0275element(1, "circle", 50)(2, "path", 51);
    \u0275\u0275elementEnd();
  }
}
function ShellComponent__svg_svg_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 26);
    \u0275\u0275element(1, "path", 52);
    \u0275\u0275elementEnd();
  }
}
var ShellComponent = class _ShellComponent {
  constructor() {
    this.theme = inject(ThemeService);
    this.sidebarCollapsed = signal(false);
    this.searchQuery = "";
    this.navItems = [
      {
        path: "/overview",
        label: "Overview",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
      },
      {
        path: "/customers",
        label: "Customers",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
      },
      {
        path: "/transactions",
        label: "Transactions",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4m0 0L3 8m4-4 4 4"/><path d="M17 8v12m0 0 4-4m-4 4-4-4"/></svg>`
      },
      {
        path: "/cards",
        label: "Cards",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
      },
      {
        path: "/analytics",
        label: "Analytics",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`
      },
      {
        path: "/compliance",
        label: "Compliance",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
      },
      {
        path: "/notifications",
        label: "Notifications",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`
      },
      {
        path: "/settings",
        label: "Settings",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
      }
    ];
  }
  toggleSidebarCollapsed() {
    this.sidebarCollapsed.update((v) => !v);
  }
  static {
    this.\u0275fac = function ShellComponent_Factory(t) {
      return new (t || _ShellComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ShellComponent, selectors: [["nb-shell"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 36, vars: 12, consts: [[1, "shell"], [1, "sidebar"], [1, "sidebar-logo"], [1, "logo-icon"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "stroke", "#1e3a6e", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["x", "3", "y", "9", "width", "18", "height", "13", "rx", "1"], ["d", "M3 9l9-6 9 6"], ["x", "9", "y", "13", "width", "6", "height", "9"], ["class", "logo-text", 4, "ngIf"], [1, "sidebar-nav"], ["routerLinkActive", "active", "class", "nav-item", 3, "routerLink", 4, "ngFor", "ngForOf"], [1, "collapse-btn", 3, "click"], ["width", "13", "height", "13", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2.5", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "sidebar-footer"], ["class", "admin-profile", 4, "ngIf"], ["class", "admin-avatar-only", 4, "ngIf"], ["class", "logout-btn", 4, "ngIf"], [1, "main-area"], [1, "topbar"], [1, "search-wrap"], ["width", "14", "height", "14", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", 1, "search-icon"], ["cx", "11", "cy", "11", "r", "8"], ["d", "m21 21-4.35-4.35"], ["type", "text", "placeholder", "Search customers, transactions...", 1, "search-input", 3, "ngModelChange", "ngModel"], [1, "topbar-actions"], ["title", "Notifications", 1, "icon-btn"], ["width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"], [1, "notif-badge"], [1, "icon-btn", "theme-toggle", 3, "click", "title"], ["width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", 4, "ngIf"], [1, "page-content"], [1, "logo-text"], [1, "logo-name"], [1, "logo-role"], ["routerLinkActive", "active", 1, "nav-item", 3, "routerLink"], [1, "nav-icon", 3, "innerHTML"], ["class", "nav-label", 4, "ngIf"], ["class", "active-dot", 4, "ngIf"], [1, "nav-label"], [1, "active-dot"], [1, "admin-profile"], [1, "admin-avatar"], [1, "admin-info"], [1, "admin-name"], [1, "admin-email"], [1, "admin-avatar-only"], [1, "logout-btn"], ["width", "15", "height", "15", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"], ["cx", "12", "cy", "12", "r", "5"], ["d", "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"], ["d", "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"]], template: function ShellComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "aside", 1)(2, "div", 2)(3, "div", 3);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(4, "svg", 4);
        \u0275\u0275element(5, "rect", 5)(6, "path", 6)(7, "rect", 7);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(8, ShellComponent_div_8_Template, 5, 0, "div", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(9, "nav", 9);
        \u0275\u0275template(10, ShellComponent_a_10_Template, 4, 4, "a", 10);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "button", 11);
        \u0275\u0275listener("click", function ShellComponent_Template_button_click_11_listener() {
          return ctx.toggleSidebarCollapsed();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(12, "svg", 12);
        \u0275\u0275element(13, "path");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(14, "div", 13);
        \u0275\u0275template(15, ShellComponent_div_15_Template, 8, 0, "div", 14)(16, ShellComponent_div_16_Template, 2, 0, "div", 15)(17, ShellComponent_button_17_Template, 4, 0, "button", 16);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(18, "div", 17)(19, "header", 18)(20, "div", 19);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(21, "svg", 20);
        \u0275\u0275element(22, "circle", 21)(23, "path", 22);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(24, "input", 23);
        \u0275\u0275twoWayListener("ngModelChange", function ShellComponent_Template_input_ngModelChange_24_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(25, "div", 24)(26, "button", 25);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(27, "svg", 26);
        \u0275\u0275element(28, "path", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(29, "span", 28);
        \u0275\u0275text(30, "5");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(31, "button", 29);
        \u0275\u0275listener("click", function ShellComponent_Template_button_click_31_listener() {
          return ctx.theme.toggle();
        });
        \u0275\u0275template(32, ShellComponent__svg_svg_32_Template, 3, 0, "svg", 30)(33, ShellComponent__svg_svg_33_Template, 2, 0, "svg", 30);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(34, "main", 31);
        \u0275\u0275element(35, "router-outlet");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275classProp("collapsed", ctx.sidebarCollapsed());
        \u0275\u0275advance(8);
        \u0275\u0275property("ngIf", !ctx.sidebarCollapsed());
        \u0275\u0275advance(2);
        \u0275\u0275property("ngForOf", ctx.navItems);
        \u0275\u0275advance(3);
        \u0275\u0275attribute("d", ctx.sidebarCollapsed() ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", !ctx.sidebarCollapsed());
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.sidebarCollapsed());
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.sidebarCollapsed());
        \u0275\u0275advance(7);
        \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
        \u0275\u0275advance(7);
        \u0275\u0275property("title", ctx.theme.isDark() ? "Light mode" : "Dark mode");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.theme.isDark());
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.theme.isDark());
      }
    }, dependencies: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NgForOf, NgIf, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel], styles: ['\n\n.shell[_ngcontent-%COMP%] {\n  display: flex;\n  height: 100vh;\n  overflow: hidden;\n  background: var(--bg-page);\n}\n.sidebar[_ngcontent-%COMP%] {\n  width: 230px;\n  background: #ffffff;\n  border-right: 1px solid #e5e7eb;\n  display: flex;\n  flex-direction: column;\n  flex-shrink: 0;\n  position: relative;\n  transition:\n    width 0.25s ease,\n    background 0.25s,\n    border-color 0.25s;\n  z-index: 100;\n}\n.shell.collapsed[_ngcontent-%COMP%]   .sidebar[_ngcontent-%COMP%] {\n  width: 64px;\n}\n[data-theme="dark"][_nghost-%COMP%]   .sidebar[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .sidebar[_ngcontent-%COMP%] {\n  background: #161b27;\n  border-right-color: #2a3241;\n}\n[data-theme="dark"][_nghost-%COMP%]   .sidebar-logo[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .sidebar-logo[_ngcontent-%COMP%] {\n  border-bottom-color: #2a3241;\n}\n[data-theme="dark"][_nghost-%COMP%]   .logo-name[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .logo-name[_ngcontent-%COMP%] {\n  color: #f9fafb;\n}\n[data-theme="dark"][_nghost-%COMP%]   .logo-role[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .logo-role[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.35);\n}\n[data-theme="dark"][_nghost-%COMP%]   .nav-item[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .nav-item[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.55);\n}\n[data-theme="dark"][_nghost-%COMP%]   .nav-item[_ngcontent-%COMP%]:hover, [data-theme="dark"]   [_nghost-%COMP%]   .nav-item[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.06);\n  color: #fff;\n}\n[data-theme="dark"][_nghost-%COMP%]   .nav-item.active[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .nav-item.active[_ngcontent-%COMP%] {\n  background: #1e40af;\n  color: #fff;\n}\n[data-theme="dark"][_nghost-%COMP%]   .collapse-btn[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .collapse-btn[_ngcontent-%COMP%] {\n  background: #161b27;\n  border-color: rgba(255, 255, 255, 0.12);\n  color: rgba(255, 255, 255, 0.5);\n}\n[data-theme="dark"][_nghost-%COMP%]   .collapse-btn[_ngcontent-%COMP%]:hover, [data-theme="dark"]   [_nghost-%COMP%]   .collapse-btn[_ngcontent-%COMP%]:hover {\n  background: #1e2d4a;\n  color: #fff;\n}\n[data-theme="dark"][_nghost-%COMP%]   .sidebar-footer[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .sidebar-footer[_ngcontent-%COMP%] {\n  border-top-color: #2a3241;\n}\n[data-theme="dark"][_nghost-%COMP%]   .admin-name[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .admin-name[_ngcontent-%COMP%] {\n  color: #f9fafb;\n}\n[data-theme="dark"][_nghost-%COMP%]   .admin-email[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .admin-email[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.35);\n}\n[data-theme="dark"][_nghost-%COMP%]   .logout-btn[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .logout-btn[_ngcontent-%COMP%] {\n  color: #f87171;\n}\n[data-theme="dark"][_nghost-%COMP%]   .logout-btn[_ngcontent-%COMP%]:hover, [data-theme="dark"]   [_nghost-%COMP%]   .logout-btn[_ngcontent-%COMP%]:hover {\n  background: rgba(239, 68, 68, 0.12);\n}\n.sidebar-logo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 22px 18px 18px;\n  border-bottom: 1px solid #f0f0f0;\n}\n.logo-icon[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border-radius: 10px;\n  background: #e8edf5;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.logo-name[_ngcontent-%COMP%] {\n  font-size: 15px;\n  font-weight: 800;\n  color: #0d1117;\n  line-height: 1.2;\n}\n.logo-role[_ngcontent-%COMP%] {\n  font-size: 9px;\n  font-weight: 700;\n  color: #9ca3af;\n  letter-spacing: 1.5px;\n}\n.sidebar-nav[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 16px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.nav-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 11px 14px;\n  border-radius: 10px;\n  color: #6b7280;\n  text-decoration: none;\n  font-size: 14px;\n  font-weight: 500;\n  transition: all 0.15s;\n  position: relative;\n  white-space: nowrap;\n  overflow: hidden;\n  &:hover {\n    background: #f3f4f6;\n    color: #0d1117;\n  }\n  &.active {\n    background: #1e3a6e;\n    color: #ffffff;\n    font-weight: 600;\n  }\n  .active-dot {\n    display: none;\n    width: 7px;\n    height: 7px;\n    border-radius: 50%;\n    background: #ffffff;\n    margin-left: auto;\n    flex-shrink: 0;\n  }\n  &.active .active-dot {\n    display: block;\n  }\n}\n.nav-icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: 20px;\n  height: 20px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.nav-label[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.collapse-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 24px;\n  right: -13px;\n  width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  background: #ffffff;\n  border: 1.5px solid #e5e7eb;\n  color: #6b7280;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: all 0.15s;\n  z-index: 10;\n  &:hover {\n    background: #f3f4f6;\n    color: #0d1117;\n  }\n}\n.sidebar-footer[_ngcontent-%COMP%] {\n  padding: 16px;\n  border-top: 1px solid #f0f0f0;\n}\n.admin-profile[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 12px;\n}\n.admin-avatar[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  background: #f59e0b;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n  font-weight: 700;\n  color: #fff;\n  flex-shrink: 0;\n}\n.admin-avatar-only[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  background: #f59e0b;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n  font-weight: 700;\n  color: #fff;\n  margin: 0 auto 12px;\n}\n.admin-name[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 700;\n  color: #0d1117;\n}\n.admin-email[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: #9ca3af;\n}\n.logout-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  padding: 8px 10px;\n  border-radius: 8px;\n  background: transparent;\n  color: #ef4444;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background 0.15s;\n  &:hover {\n    background: rgba(239, 68, 68, 0.08);\n  }\n}\n.main-area[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.topbar[_ngcontent-%COMP%] {\n  height: 56px;\n  background: var(--topbar-bg);\n  border-bottom: 1px solid var(--topbar-border);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 24px;\n  gap: 20px;\n  flex-shrink: 0;\n}\n.search-wrap[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex: 1;\n  max-width: 420px;\n  background: var(--bg-input);\n  border-radius: 20px;\n  padding: 0 16px;\n  height: 36px;\n  border: 1px solid var(--border);\n  transition: border-color 0.15s;\n  &:focus-within {\n    border-color: var(--accent);\n  }\n}\n.search-icon[_ngcontent-%COMP%] {\n  color: var(--text-tertiary);\n  flex-shrink: 0;\n}\n.search-input[_ngcontent-%COMP%] {\n  flex: 1;\n  background: transparent;\n  border: none;\n  font-size: 13px;\n  color: var(--text-primary);\n  &::placeholder {\n    color: var(--text-tertiary);\n  }\n}\n.topbar-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.icon-btn[_ngcontent-%COMP%] {\n  position: relative;\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  background: transparent;\n  border: none;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--text-secondary);\n  cursor: pointer;\n  transition: background 0.15s;\n  &:hover {\n    background: var(--bg-input);\n  }\n}\n.notif-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 2px;\n  right: 2px;\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  background: #ef4444;\n  color: #fff;\n  font-size: 8px;\n  font-weight: 800;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n[data-theme="dark"][_nghost-%COMP%]   .logo-icon[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .logo-icon[_ngcontent-%COMP%] {\n  background: #1e2d4a;\n}\n[data-theme="dark"][_nghost-%COMP%]   .logo-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .logo-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  stroke: #60a5fa;\n}\n.page-content[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 24px;\n}\n/*# sourceMappingURL=shell.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ShellComponent, { className: "ShellComponent", filePath: "src\\app\\features\\layout\\shell.component.ts", lineNumber: 336 });
})();
export {
  ShellComponent
};
//# sourceMappingURL=chunk-UMVXUCMA.js.map
