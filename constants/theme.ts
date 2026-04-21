// NextBank Design System — Navy · Amber · Light Gray · White
export const Colors = {
  light: {
    // Backgrounds
    bg: '#EBEBEB',
    bgCard: '#FFFFFF',
    bgCardAlt: '#F5F5F5',
    bgInput: '#EBEBEB',

    // Text
    textPrimary: '#0D1117',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textMuted: '#9CA3AF',

    // Accent — amber/orange from palette
    accent: '#F5A623',
    accentLight: '#FEF3D7',
    accentDark: '#D4891A',

    // Dark navy — balance card, buttons, avatar
    navy: '#12203A',
    navyLight: '#1C2F4F',

    // Semantic — kept minimal, no extra colors
    success: '#22C55E',
    successLight: '#DCFCE7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',

    // Border
    border: '#E5E7EB',
    borderLight: '#F3F4F6',

    // Nav
    navBg: '#FFFFFF',
    navBorder: '#E5E7EB',
    navActive: '#F5A623',
    navInactive: '#9CA3AF',

    // Balance card
    balanceCardBg: '#12203A',
    balanceCardText: '#FFFFFF',
    balancePill: 'rgba(255,255,255,0.12)',

    // Icons on action buttons
    actionBg: '#FFFFFF',
    actionBorder: '#E5E7EB',
  },
  dark: {
    // Backgrounds
    bg: '#0A0E16',
    bgCard: '#121823',
    bgCardAlt: '#1A212E',
    bgInput: '#1A212E',

    // Text
    textPrimary: '#F9FAFB',
    textSecondary: '#B0BAC9',
    textTertiary: '#8A94A6',
    textMuted: '#6B7280',

    // Accent
    accent: '#F5A623',
    accentLight: '#2D2010',
    accentDark: '#D4891A',

    // Dark navy
    navy: '#0F1B33',
    navyLight: '#1C2F4F',

    // Semantic
    success: '#22C55E',
    successLight: '#052E16',
    danger: '#EF4444',
    dangerLight: '#450A0A',

    // Border
    border: '#232D3E',
    borderLight: '#1A212E',

    // Nav
    navBg: '#121823',
    navBorder: '#232D3E',
    navActive: '#F5A623',
    navInactive: '#6B7280',

    // Balance card
    balanceCardBg: '#152847',
    balanceCardText: '#FFFFFF',
    balancePill: 'rgba(255,255,255,0.1)',

    // Icons on action buttons
    actionBg: '#1A212E',
    actionBorder: '#232D3E',
  },
};

export const Typography = {
  // From design: bold heavy headings, clean body
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 22,
    '2xl': 26,
    '3xl': 32,
    '4xl': 40,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
};
