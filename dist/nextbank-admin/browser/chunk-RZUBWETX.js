import {
  ɵɵdefineInjectable
} from "./chunk-YOPZAQ25.js";

// src/app/core/services/data.service.ts
var DataService = class _DataService {
  getStats() {
    return [
      { icon: "\u{1F4B3}", iconBg: "#22c55e", label: "Total Revenue", value: "142 800 000 XAF", change: "\u2191 12.5%", changeUp: true },
      { icon: "\u{1F465}", iconBg: "#3b82f6", label: "Active Users", value: "24,521", change: "\u2191 8.2%", changeUp: true },
      { icon: "\u2194", iconBg: "#8b5cf6", label: "Transactions", value: "3,420", change: "\u2191 3.1%", changeUp: true },
      { icon: "\u{1F4B3}", iconBg: "#f59e0b", label: "Active Cards", value: "18,342", change: "\u2193 1.2%", changeUp: false }
    ];
  }
  getRecentCustomers() {
    return [
      { id: 1, initials: "MF", name: "Marie Fon", email: "marie@email.cm", phone: "+237 677 111 001", nationalId: "CMR-001", status: "Active", balance: 25e5, accounts: 2, cards: 1, joined: "Apr 21, 2024", joinedAgo: "2 min ago" },
      { id: 2, initials: "PN", name: "Paul Ndongo", email: "paul@email.cm", phone: "+237 677 111 002", nationalId: "CMR-002", status: "Pending", balance: 85e4, accounts: 1, cards: 0, joined: "Apr 21, 2024", joinedAgo: "15 min ago" },
      { id: 3, initials: "GT", name: "Grace Tabi", email: "grace@email.cm", phone: "+237 677 111 003", nationalId: "CMR-003", status: "Active", balance: 42e5, accounts: 3, cards: 2, joined: "Apr 21, 2024", joinedAgo: "1h ago" },
      { id: 4, initials: "EB", name: "Emmanuel Biya", email: "emmanuel@email.cm", phone: "+237 677 111 004", nationalId: "CMR-004", status: "Active", balance: 12e5, accounts: 2, cards: 1, joined: "Apr 21, 2024", joinedAgo: "2h ago" },
      { id: 5, initials: "CA", name: "Celine Atanga", email: "celine@email.cm", phone: "+237 677 111 005", nationalId: "CMR-005", status: "Under Review", balance: 78e5, accounts: 2, cards: 1, joined: "Apr 21, 2024", joinedAgo: "3h ago" },
      { id: 6, initials: "JD", name: "John Doe", email: "john@email.cm", phone: "+237 699 123 456", nationalId: "CMR-006", status: "Active", balance: 20467350, accounts: 3, cards: 2, joined: "Nov 15, 2023", joinedAgo: "Nov 2023" },
      { id: 7, initials: "AM", name: "Alice Mbeki", email: "alice@email.cm", phone: "+237 677 111 007", nationalId: "CMR-007", status: "Active", balance: 31e5, accounts: 2, cards: 1, joined: "Mar 10, 2024", joinedAgo: "Mar 2024" },
      { id: 8, initials: "BN", name: "Bob Njoh", email: "bob@email.cm", phone: "+237 677 111 008", nationalId: "CMR-008", status: "Active", balance: 98e4, accounts: 1, cards: 1, joined: "Feb 28, 2024", joinedAgo: "Feb 2024" },
      { id: 9, initials: "SK", name: "Sophie Kamga", email: "sophie@email.cm", phone: "+237 677 111 009", nationalId: "CMR-009", status: "Frozen", balance: 45e4, accounts: 1, cards: 0, joined: "Jan 5, 2024", joinedAgo: "Jan 2024" },
      { id: 10, initials: "DM", name: "David Manga", email: "david@email.cm", phone: "+237 677 111 010", nationalId: "CMR-010", status: "Active", balance: 56e5, accounts: 2, cards: 2, joined: "Dec 12, 2023", joinedAgo: "Dec 2023" },
      { id: 11, initials: "LT", name: "Lucie Takam", email: "lucie@email.cm", phone: "+237 677 111 011", nationalId: "CMR-011", status: "Active", balance: 22e5, accounts: 2, cards: 1, joined: "Nov 30, 2023", joinedAgo: "Nov 2023" },
      { id: 12, initials: "RN", name: "Roger Nkeng", email: "roger@email.cm", phone: "+237 677 111 012", nationalId: "CMR-012", status: "Pending", balance: 1e5, accounts: 1, cards: 0, joined: "Apr 20, 2024", joinedAgo: "Yesterday" }
    ];
  }
  getRevenueData() {
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      values: [4.1, 4.8, 4.6, 5.8, 7.2, 8.1, 8.5, 9.2, 10.1, 11.4, 12.8, 14.2]
    };
  }
  getWeeklyActivity() {
    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      deposits: [4.2, 5.1, 5.8, 4.9, 6.2, 3.1, 2.4],
      withdrawals: [2.1, 2.8, 3.2, 2.4, 3.8, 1.8, 1.2],
      transfers: [1.8, 2.2, 2.6, 2.1, 2.9, 1.4, 0.9]
    };
  }
  getAccountTypes() {
    return [
      { label: "Checking", value: 45, color: "#3b82f6" },
      { label: "Savings", value: 35, color: "#10b981" },
      { label: "Business", value: 20, color: "#f59e0b" }
    ];
  }
  getSecurityAlerts() {
    return [
      { id: 4829, type: "warning", title: "Unusual login pattern", time: "5 min ago", severity: "high" },
      { id: 3271, type: "alert", title: "Large withdrawal flagged", time: "22 min ago", severity: "medium" },
      { id: 1893, type: "info", title: "KYC document expired", time: "1h ago", severity: "low" }
    ];
  }
  static {
    this.\u0275fac = function DataService_Factory(t) {
      return new (t || _DataService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DataService, factory: _DataService.\u0275fac, providedIn: "root" });
  }
};

export {
  DataService
};
//# sourceMappingURL=chunk-RZUBWETX.js.map
