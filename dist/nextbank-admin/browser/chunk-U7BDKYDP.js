import {
  effect,
  signal,
  ɵɵdefineInjectable
} from "./chunk-YOPZAQ25.js";

// src/app/core/services/theme.service.ts
var ThemeService = class _ThemeService {
  constructor() {
    this.isDark = signal(false);
    const saved = localStorage.getItem("nb_admin_theme");
    if (saved === "dark")
      this.isDark.set(true);
    effect(() => {
      const dark = this.isDark();
      document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
      localStorage.setItem("nb_admin_theme", dark ? "dark" : "light");
    });
  }
  toggle() {
    this.isDark.update((v) => !v);
  }
  static {
    this.\u0275fac = function ThemeService_Factory(t) {
      return new (t || _ThemeService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
  }
};

export {
  ThemeService
};
//# sourceMappingURL=chunk-U7BDKYDP.js.map
