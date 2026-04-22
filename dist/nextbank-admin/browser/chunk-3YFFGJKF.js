import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-AVNAD6G5.js";
import {
  DataService
} from "./chunk-RZUBWETX.js";
import {
  CommonModule,
  NgClass,
  NgForOf,
  NgIf,
  computed,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-YOPZAQ25.js";

// src/app/features/customers/customers.component.ts
function CustomersComponent_tr_48_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 27)(3, "div", 28);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 29)(6, "div", 30);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 31);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(10, "td")(11, "span", 32);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td")(14, "span", 33);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 34);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td", 35);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 36);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td")(23, "button", 37);
    \u0275\u0275listener("click", function CustomersComponent_tr_48_Template_button_click_23_listener() {
      const c_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.viewCustomer(c_r2));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(24, "svg", 38);
    \u0275\u0275element(25, "circle", 39)(26, "circle", 40)(27, "circle", 41);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const c_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("background", ctx_r2.avatarBg(c_r2.initials));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r2.initials);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r2.email);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r2.statusClass(c_r2.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r2.status);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r2.kycClass(c_r2.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.kycLabel(c_r2.status));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r2.accounts);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.fmtBalance(c_r2.balance));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r2.joined);
  }
}
function CustomersComponent_div_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 43);
    \u0275\u0275element(2, "path", 6)(3, "circle", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "No customers match your search.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 44);
    \u0275\u0275listener("click", function CustomersComponent_div_49_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.searchQuery = "");
    });
    \u0275\u0275text(7, "Clear search");
    \u0275\u0275elementEnd()();
  }
}
function CustomersComponent_div_50_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 50);
    \u0275\u0275listener("click", function CustomersComponent_div_50_button_6_Template_button_click_0_listener() {
      const p_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.currentPage.set(p_r7));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r7 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", p_r7 === ctx_r2.currentPage());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r7);
  }
}
function CustomersComponent_div_50_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 45)(1, "span", 46);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 47)(4, "button", 48);
    \u0275\u0275listener("click", function CustomersComponent_div_50_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.prevPage());
    });
    \u0275\u0275text(5, "\u2039");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, CustomersComponent_div_50_button_6_Template, 2, 3, "button", 49);
    \u0275\u0275elementStart(7, "button", 48);
    \u0275\u0275listener("click", function CustomersComponent_div_50_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.nextPage());
    });
    \u0275\u0275text(8, "\u203A");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("Showing ", ctx_r2.pageStart(), "\u2013", ctx_r2.pageEnd(), " of ", ctx_r2.filtered().length, "");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.currentPage() === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r2.pageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.currentPage() === ctx_r2.totalPages());
  }
}
function CustomersComponent_div_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 51);
    \u0275\u0275listener("click", function CustomersComponent_div_51_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeRegister());
    });
    \u0275\u0275elementStart(1, "div", 52);
    \u0275\u0275listener("click", function CustomersComponent_div_51_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 53)(3, "div")(4, "h2", 54);
    \u0275\u0275text(5, "Add Customer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 55);
    \u0275\u0275text(7, "Register a new customer account");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 56);
    \u0275\u0275listener("click", function CustomersComponent_div_51_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeRegister());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(9, "svg", 57);
    \u0275\u0275element(10, "path", 58);
    \u0275\u0275elementEnd()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(11, "form", 59);
    \u0275\u0275listener("ngSubmit", function CustomersComponent_div_51_Template_form_ngSubmit_11_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.submitRegister());
    });
    \u0275\u0275elementStart(12, "div", 60)(13, "div", 61)(14, "label");
    \u0275\u0275text(15, "Full Name *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 62);
    \u0275\u0275twoWayListener("ngModelChange", function CustomersComponent_div_51_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.reg.fullName, $event) || (ctx_r2.reg.fullName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 61)(18, "label");
    \u0275\u0275text(19, "Email Address *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "input", 63);
    \u0275\u0275twoWayListener("ngModelChange", function CustomersComponent_div_51_Template_input_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.reg.email, $event) || (ctx_r2.reg.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 61)(22, "label");
    \u0275\u0275text(23, "Phone Number *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "input", 64);
    \u0275\u0275twoWayListener("ngModelChange", function CustomersComponent_div_51_Template_input_ngModelChange_24_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.reg.phone, $event) || (ctx_r2.reg.phone = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 61)(26, "label");
    \u0275\u0275text(27, "National ID *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "input", 65);
    \u0275\u0275twoWayListener("ngModelChange", function CustomersComponent_div_51_Template_input_ngModelChange_28_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.reg.nationalId, $event) || (ctx_r2.reg.nationalId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "div", 66)(30, "button", 67);
    \u0275\u0275listener("click", function CustomersComponent_div_51_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeRegister());
    });
    \u0275\u0275text(31, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "button", 68);
    \u0275\u0275text(33);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(16);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.reg.fullName);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.reg.email);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.reg.phone);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.reg.nationalId);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r2.registerLoading());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.registerLoading() ? "Registering..." : "Register Customer", " ");
  }
}
function CustomersComponent_div_52_div_15_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r10 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r2.statusClass(d_r10.value));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r10.value);
  }
}
function CustomersComponent_div_52_div_15_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r10.value);
  }
}
function CustomersComponent_div_52_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74)(1, "span", 75);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 76);
    \u0275\u0275template(4, CustomersComponent_div_52_div_15_span_4_Template, 2, 2, "span", 77)(5, CustomersComponent_div_52_div_15_span_5_Template, 2, 1, "span", 78);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r10 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r10.label);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", d_r10.isStatus);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !d_r10.isStatus);
  }
}
function CustomersComponent_div_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 51);
    \u0275\u0275listener("click", function CustomersComponent_div_52_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.selectedCustomer.set(null));
    });
    \u0275\u0275elementStart(1, "div", 52);
    \u0275\u0275listener("click", function CustomersComponent_div_52_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 53)(3, "div", 27)(4, "div", 69);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div")(7, "h2", 54);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 55);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "button", 56);
    \u0275\u0275listener("click", function CustomersComponent_div_52_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.selectedCustomer.set(null));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(12, "svg", 57);
    \u0275\u0275element(13, "path", 58);
    \u0275\u0275elementEnd()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(14, "div", 70);
    \u0275\u0275template(15, CustomersComponent_div_52_div_15_Template, 6, 3, "div", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 66)(17, "button", 72);
    \u0275\u0275listener("click", function CustomersComponent_div_52_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.toggleFreeze(ctx_r2.selectedCustomer());
      return \u0275\u0275resetView(ctx_r2.selectedCustomer.set(null));
    });
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 73);
    \u0275\u0275listener("click", function CustomersComponent_div_52_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.selectedCustomer.set(null));
    });
    \u0275\u0275text(20, "Close");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("background", ctx_r2.avatarBg(ctx_r2.selectedCustomer().initials));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.selectedCustomer().initials);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.selectedCustomer().name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.selectedCustomer().email);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngForOf", ctx_r2.customerDetails(ctx_r2.selectedCustomer()));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r2.selectedCustomer().status === "Frozen" ? "Unfreeze Account" : "Freeze Account", " ");
  }
}
var CustomersComponent = class _CustomersComponent {
  constructor() {
    this.data = inject(DataService);
    this.allCustomers = [];
    this.searchQuery = "";
    this.currentPage = signal(1);
    this.pageSize = 8;
    this.showRegister = signal(false);
    this.registerLoading = signal(false);
    this.selectedCustomer = signal(null);
    this.reg = { fullName: "", email: "", phone: "", nationalId: "" };
    this.avatarColors = ["#1e3a6e", "#16a34a", "#d97706", "#7c3aed", "#dc2626", "#0891b2", "#be185d", "#059669"];
    this.filtered = computed(() => {
      const q = this.searchQuery.toLowerCase();
      return this.allCustomers.filter((c) => !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    });
    this.paginated = computed(() => {
      const start = (this.currentPage() - 1) * this.pageSize;
      return this.filtered().slice(start, start + this.pageSize);
    });
    this.totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
    this.pageStart = computed(() => Math.min((this.currentPage() - 1) * this.pageSize + 1, this.filtered().length));
    this.pageEnd = computed(() => Math.min(this.currentPage() * this.pageSize, this.filtered().length));
    this.pageNumbers = computed(() => {
      const total = this.totalPages(), cur = this.currentPage();
      const start = Math.max(1, cur - 2), end = Math.min(total, start + 4);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });
  }
  ngOnInit() {
    this.allCustomers = this.data.getRecentCustomers();
  }
  prevPage() {
    if (this.currentPage() > 1)
      this.currentPage.update((p) => p - 1);
  }
  nextPage() {
    if (this.currentPage() < this.totalPages())
      this.currentPage.update((p) => p + 1);
  }
  trackById(_, c) {
    return c.id;
  }
  statusClass(s) {
    return { "Active": "badge-success", "Pending": "badge-warning", "Frozen": "badge-danger", "Under Review": "badge-review" }[s] || "";
  }
  kycLabel(s) {
    return s === "Active" ? "Verified" : s === "Pending" ? "Pending" : "Under Review";
  }
  kycClass(s) {
    return s === "Active" ? "kyc-verified" : s === "Pending" ? "kyc-pending" : "kyc-review";
  }
  avatarBg(initials) {
    const i = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % this.avatarColors.length;
    return this.avatarColors[i];
  }
  fmtBalance(n) {
    return n.toLocaleString("fr-FR").replace(/\s/g, "\xA0") + " XAF";
  }
  viewCustomer(c) {
    this.selectedCustomer.set(c);
  }
  toggleFreeze(c) {
    c.status = c.status === "Frozen" ? "Active" : "Frozen";
  }
  closeRegister() {
    this.showRegister.set(false);
    this.reg = { fullName: "", email: "", phone: "", nationalId: "" };
  }
  submitRegister() {
    if (!this.reg.fullName || !this.reg.email)
      return;
    this.registerLoading.set(true);
    setTimeout(() => {
      const initials = this.reg.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      this.allCustomers = [{
        id: this.allCustomers.length + 1,
        initials,
        name: this.reg.fullName,
        email: this.reg.email,
        phone: this.reg.phone,
        nationalId: this.reg.nationalId,
        status: "Active",
        balance: 0,
        accounts: 1,
        cards: 0,
        joined: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        joinedAgo: "Just now"
      }, ...this.allCustomers];
      this.registerLoading.set(false);
      this.closeRegister();
    }, 1200);
  }
  customerDetails(c) {
    return [
      { label: "Full Name", value: c.name },
      { label: "Email", value: c.email },
      { label: "Phone", value: c.phone },
      { label: "National ID", value: c.nationalId },
      { label: "Status", value: c.status, isStatus: true },
      { label: "Balance", value: this.fmtBalance(c.balance) },
      { label: "Accounts", value: String(c.accounts) },
      { label: "Cards", value: String(c.cards) },
      { label: "Joined", value: c.joined }
    ];
  }
  static {
    this.\u0275fac = function CustomersComponent_Factory(t) {
      return new (t || _CustomersComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CustomersComponent, selectors: [["nb-customers"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 53, vars: 8, consts: [[1, "customers-page"], [1, "page-header"], [1, "page-title"], [1, "page-sub"], [1, "btn-add", 3, "click"], ["width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2.5", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"], ["cx", "9", "cy", "7", "r", "4"], ["x1", "19", "y1", "8", "x2", "19", "y2", "14"], ["x1", "16", "y1", "11", "x2", "22", "y2", "11"], [1, "filters-bar"], [1, "search-wrap"], ["width", "14", "height", "14", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["cx", "11", "cy", "11", "r", "8"], ["d", "m21 21-4.35-4.35"], ["type", "text", "placeholder", "Search by name or email...", 1, "search-input", 3, "ngModelChange", "ngModel"], [1, "filter-btn"], ["points", "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"], ["d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"], ["points", "7 10 12 15 17 10"], ["x1", "12", "y1", "15", "x2", "12", "y2", "3"], [1, "table-card"], [1, "data-table"], [4, "ngFor", "ngForOf", "ngForTrackBy"], ["class", "empty-state", 4, "ngIf"], ["class", "pagination", 4, "ngIf"], ["class", "modal-backdrop", 3, "click", 4, "ngIf"], [1, "cust-cell"], [1, "cust-avatar"], [1, "cust-info"], [1, "cust-name"], [1, "cust-email"], [1, "status-badge", 3, "ngClass"], [1, "kyc-badge", 3, "ngClass"], [1, "center-cell"], [1, "balance-cell"], [1, "date-cell"], [1, "more-btn", 3, "click"], ["width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "currentColor"], ["cx", "5", "cy", "12", "r", "1.5"], ["cx", "12", "cy", "12", "r", "1.5"], ["cx", "19", "cy", "12", "r", "1.5"], [1, "empty-state"], ["width", "40", "height", "40", "viewBox", "0 0 24 24", "fill", "none", "stroke", "#9ca3af", "stroke-width", "1.5", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "btn-ghost", 3, "click"], [1, "pagination"], [1, "page-info"], [1, "page-btns"], [1, "page-btn", 3, "click", "disabled"], ["class", "page-btn", 3, "active", "click", 4, "ngFor", "ngForOf"], [1, "page-btn", 3, "click"], [1, "modal-backdrop", 3, "click"], [1, "modal", 3, "click"], [1, "modal-header"], [1, "modal-title"], [1, "modal-sub"], [1, "modal-close", 3, "click"], ["width", "14", "height", "14", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2.5", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M18 6 6 18M6 6l12 12"], [1, "modal-form", 3, "ngSubmit"], [1, "form-grid"], [1, "form-group"], ["type", "text", "name", "fullName", "required", "", "placeholder", "e.g. John Doe", 3, "ngModelChange", "ngModel"], ["type", "email", "name", "email", "required", "", "placeholder", "john@nextbank.cm", 3, "ngModelChange", "ngModel"], ["type", "tel", "name", "phone", "required", "", "placeholder", "+237 699 123 456", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "nationalId", "required", "", "placeholder", "CMR-XXXXXXXXX", 3, "ngModelChange", "ngModel"], [1, "modal-footer"], ["type", "button", 1, "btn-secondary", 3, "click"], ["type", "submit", 1, "btn-add", 3, "disabled"], [1, "cust-avatar", "lg"], [1, "detail-grid"], ["class", "detail-item", 4, "ngFor", "ngForOf"], [1, "btn-danger", 3, "click"], [1, "btn-secondary", 3, "click"], [1, "detail-item"], [1, "detail-label"], [1, "detail-value"], ["class", "status-badge", 3, "ngClass", 4, "ngIf"], [4, "ngIf"]], template: function CustomersComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        \u0275\u0275text(4, "Customers");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 3);
        \u0275\u0275text(6);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "button", 4);
        \u0275\u0275listener("click", function CustomersComponent_Template_button_click_7_listener() {
          return ctx.showRegister.set(true);
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(8, "svg", 5);
        \u0275\u0275element(9, "path", 6)(10, "circle", 7)(11, "line", 8)(12, "line", 9);
        \u0275\u0275elementEnd();
        \u0275\u0275text(13, " Add Customer ");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(14, "div", 10)(15, "div", 11);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(16, "svg", 12);
        \u0275\u0275element(17, "circle", 13)(18, "path", 14);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(19, "input", 15);
        \u0275\u0275twoWayListener("ngModelChange", function CustomersComponent_Template_input_ngModelChange_19_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(20, "button", 16);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(21, "svg", 12);
        \u0275\u0275element(22, "polygon", 17);
        \u0275\u0275elementEnd();
        \u0275\u0275text(23, " Filter ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(24, "button", 16);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(25, "svg", 12);
        \u0275\u0275element(26, "path", 18)(27, "polyline", 19)(28, "line", 20);
        \u0275\u0275elementEnd();
        \u0275\u0275text(29, " Export ");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(30, "div", 21)(31, "table", 22)(32, "thead")(33, "tr")(34, "th");
        \u0275\u0275text(35, "CUSTOMER");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(36, "th");
        \u0275\u0275text(37, "STATUS");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(38, "th");
        \u0275\u0275text(39, "KYC");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(40, "th");
        \u0275\u0275text(41, "ACCOUNTS");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(42, "th");
        \u0275\u0275text(43, "BALANCE");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(44, "th");
        \u0275\u0275text(45, "JOINED");
        \u0275\u0275elementEnd();
        \u0275\u0275element(46, "th");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(47, "tbody");
        \u0275\u0275template(48, CustomersComponent_tr_48_Template, 28, 12, "tr", 23);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(49, CustomersComponent_div_49_Template, 8, 0, "div", 24)(50, CustomersComponent_div_50_Template, 9, 6, "div", 25);
        \u0275\u0275elementEnd();
        \u0275\u0275template(51, CustomersComponent_div_51_Template, 34, 6, "div", 26)(52, CustomersComponent_div_52_Template, 21, 7, "div", 26);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate1("", ctx.filtered().length, " registered customers");
        \u0275\u0275advance(13);
        \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
        \u0275\u0275advance(29);
        \u0275\u0275property("ngForOf", ctx.paginated())("ngForTrackBy", ctx.trackById);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.filtered().length === 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.filtered().length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showRegister());
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.selectedCustomer());
      }
    }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm], styles: ["\n\n.customers-page[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.page-title[_ngcontent-%COMP%] {\n  font-size: 26px;\n  font-weight: 800;\n  color: var(--text-primary);\n}\n.page-sub[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--text-secondary);\n  margin-top: 3px;\n}\n.btn-add[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 20px;\n  border-radius: 10px;\n  background: #1e3a6e;\n  color: #fff;\n  font-size: 14px;\n  font-weight: 600;\n  cursor: pointer;\n  border: none;\n  transition: background 0.15s;\n  &:hover {\n    background: #162d56;\n  }\n  &:disabled {\n    opacity: 0.6;\n    cursor: not-allowed;\n  }\n}\n.filters-bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  background: #fff;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  padding: 12px 16px;\n}\n.search-wrap[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex: 1;\n  max-width: 320px;\n  background: #f9fafb;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n  padding: 0 12px;\n  height: 36px;\n  color: #9ca3af;\n  &:focus-within {\n    border-color: #3b82f6;\n  }\n}\n.search-input[_ngcontent-%COMP%] {\n  flex: 1;\n  border: none;\n  background: transparent;\n  font-size: 13px;\n  color: #0d1117;\n  &::placeholder {\n    color: #9ca3af;\n  }\n}\n.filter-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 7px 14px;\n  border-radius: 8px;\n  background: transparent;\n  border: 1px solid #e5e7eb;\n  font-size: 13px;\n  font-weight: 500;\n  color: #6b7280;\n  cursor: pointer;\n  transition: all 0.15s;\n  &:hover {\n    background: #f3f4f6;\n    color: #0d1117;\n  }\n}\n.table-card[_ngcontent-%COMP%] {\n  background: #fff;\n  border: 1px solid #e5e7eb;\n  border-radius: 14px;\n  overflow: hidden;\n}\n.data-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  th {\n    padding: 12px 20px;\n    text-align: left;\n    font-size: 11px;\n    font-weight: 700;\n    color: #9ca3af;\n    text-transform: uppercase;\n    letter-spacing: 0.8px;\n    border-bottom: 1px solid #f0f0f0;\n    background: #fff;\n  }\n  td {\n    padding: 14px 20px;\n    border-bottom: 1px solid #f9fafb;\n    font-size: 13px;\n    color: #0d1117;\n    vertical-align: middle;\n  }\n  tr:last-child td {\n    border-bottom: none;\n  }\n  tr:hover td {\n    background: #fafafa;\n  }\n}\n.cust-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.cust-avatar[_ngcontent-%COMP%] {\n  width: 38px;\n  height: 38px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 12px;\n  font-weight: 700;\n  color: #fff;\n  flex-shrink: 0;\n  &.lg {\n    width: 48px;\n    height: 48px;\n    font-size: 16px;\n  }\n}\n.cust-name[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n  color: #0d1117;\n}\n.cust-email[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #9ca3af;\n}\n.status-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 3px 12px;\n  border-radius: 20px;\n  font-size: 12px;\n  font-weight: 600;\n  &.badge-success {\n    background: #dcfce7;\n    color: #16a34a;\n  }\n  &.badge-warning {\n    background: #fef3c7;\n    color: #d97706;\n  }\n  &.badge-danger {\n    background: #fee2e2;\n    color: #dc2626;\n  }\n  &.badge-review {\n    background: #dbeafe;\n    color: #2563eb;\n  }\n}\n.kyc-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 3px 12px;\n  border-radius: 20px;\n  font-size: 12px;\n  font-weight: 600;\n  &.kyc-verified {\n    background: transparent;\n    color: #16a34a;\n  }\n  &.kyc-pending {\n    background: transparent;\n    color: #d97706;\n  }\n  &.kyc-review {\n    background: transparent;\n    color: #2563eb;\n  }\n}\n.balance-cell[_ngcontent-%COMP%] {\n  font-weight: 700;\n  white-space: nowrap;\n}\n.center-cell[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #6b7280;\n}\n.date-cell[_ngcontent-%COMP%] {\n  color: #9ca3af;\n  white-space: nowrap;\n}\n.more-btn[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  border: none;\n  background: transparent;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #9ca3af;\n  cursor: pointer;\n  transition: all 0.15s;\n  &:hover {\n    background: #f3f4f6;\n    color: #6b7280;\n  }\n}\n.empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 12px;\n  padding: 60px 20px;\n  color: #9ca3af;\n  font-size: 14px;\n}\n.btn-ghost[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  color: #3b82f6;\n  font-size: 14px;\n  font-weight: 600;\n  cursor: pointer;\n  padding: 8px 16px;\n  border-radius: 8px;\n  &:hover {\n    background: #dbeafe;\n  }\n}\n.pagination[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 14px 20px;\n  border-top: 1px solid #f0f0f0;\n}\n.page-info[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #6b7280;\n}\n.page-btns[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 4px;\n}\n.page-btn[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 8px;\n  background: transparent;\n  border: 1px solid #e5e7eb;\n  color: #6b7280;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.15s;\n  &:hover:not(:disabled) {\n    background: #f3f4f6;\n    color: #0d1117;\n  }\n  &.active {\n    background: #1e3a6e;\n    border-color: #1e3a6e;\n    color: #fff;\n  }\n  &:disabled {\n    opacity: 0.4;\n    cursor: not-allowed;\n  }\n}\n.modal-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 1000;\n  background: rgba(0, 0, 0, 0.45);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n}\n.modal[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 16px;\n  border: 1px solid #e5e7eb;\n  width: 100%;\n  max-width: 560px;\n  max-height: 90vh;\n  overflow-y: auto;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);\n}\n.modal-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  padding: 22px 22px 16px;\n  border-bottom: 1px solid #f0f0f0;\n  gap: 16px;\n}\n.modal-title[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 800;\n  color: #0d1117;\n}\n.modal-sub[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #9ca3af;\n  margin-top: 3px;\n}\n.modal-close[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  border-radius: 8px;\n  background: #f3f4f6;\n  border: none;\n  color: #6b7280;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  &:hover {\n    background: #e5e7eb;\n  }\n}\n.modal-form[_ngcontent-%COMP%] {\n  padding: 18px 22px;\n}\n.form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 14px;\n  margin-bottom: 14px;\n}\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n  label {\n    font-size: 12px;\n    font-weight: 700;\n    color: #6b7280;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n  }\n  input {\n    height: 40px;\n    padding: 0 12px;\n    background: #f9fafb;\n    border: 1px solid #e5e7eb;\n    border-radius: 8px;\n    color: #0d1117;\n    font-size: 13px;\n    transition: border-color 0.15s;\n    &:focus {\n      border-color: #3b82f6;\n      outline: none;\n      background: #fff;\n    }\n    &::placeholder {\n      color: #9ca3af;\n    }\n  }\n}\n.modal-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 10px;\n  padding: 14px 22px;\n  border-top: 1px solid #f0f0f0;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  padding: 9px 18px;\n  border-radius: 8px;\n  background: #fff;\n  color: #0d1117;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  border: 1px solid #e5e7eb;\n  transition: background 0.15s;\n  &:hover {\n    background: #f3f4f6;\n  }\n}\n.btn-danger[_ngcontent-%COMP%] {\n  padding: 9px 18px;\n  border-radius: 8px;\n  background: #fee2e2;\n  color: #dc2626;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  border: none;\n  transition: all 0.15s;\n  &:hover {\n    background: #dc2626;\n    color: #fff;\n  }\n}\n.detail-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  padding: 8px 0;\n}\n.detail-item[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 12px 22px;\n  border-bottom: 1px solid #f9fafb;\n}\n.detail-label[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 700;\n  color: #9ca3af;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.detail-value[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n  color: #0d1117;\n}\n/*# sourceMappingURL=customers.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CustomersComponent, { className: "CustomersComponent", filePath: "src\\app\\features\\customers\\customers.component.ts", lineNumber: 381 });
})();
export {
  CustomersComponent
};
//# sourceMappingURL=chunk-3YFFGJKF.js.map
