import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Radius, Typography } from '@/constants/theme';

// ─── NBButton ────────────────────────────────────────────
interface NBButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function NBButton({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
  icon,
}: NBButtonProps) {
  const { colors, isDark } = useTheme();

  const variants = {
    primary: {
      bg: colors.navy,
      text: '#FFFFFF',
      border: colors.navy,
    },
    secondary: {
      bg: colors.bgCard,
      text: colors.textPrimary,
      border: colors.border,
    },
    ghost: {
      bg: 'transparent',
      text: colors.accent,
      border: 'transparent',
    },
    danger: {
      bg: 'transparent',
      text: colors.danger,
      border: 'transparent',
    },
  };

  const v = variants[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon}
          <Text style={[styles.buttonText, { color: v.text }]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── NBInput ─────────────────────────────────────────────
import { TextInput, TextInputProps } from 'react-native';

interface NBInputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export function NBInput({ label, icon, error, style, ...props }: NBInputProps) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text
          style={{
            fontSize: Typography.sizes.xs,
            fontWeight: Typography.weights.bold,
            color: colors.textSecondary,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.bgInput,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
      >
        {icon && <View style={{ marginRight: 10 }}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            { color: colors.textPrimary, flex: 1 },
          ]}
          placeholderTextColor={colors.textTertiary}
          {...props}
        />
      </View>
      {error && (
        <Text style={{ fontSize: 12, color: colors.danger, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
}

// ─── NBCard ──────────────────────────────────────────────
interface NBCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function NBCard({ children, style, onPress }: NBCardProps) {
  const { colors } = useTheme();
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.card,
        {
          backgroundColor: colors.bgCard,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </Wrapper>
  );
}

// ─── NBBadge ─────────────────────────────────────────────
interface NBBadgeProps {
  label: string;
  color?: 'success' | 'danger' | 'accent';
}

export function NBBadge({ label, color = 'success' }: NBBadgeProps) {
  const { colors } = useTheme();
  const map = {
    success: { bg: colors.successLight, text: colors.success },
    danger: { bg: colors.dangerLight, text: colors.danger },
    accent: { bg: colors.accentLight, text: colors.accent },
  };
  const c = map[color];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: c.text }]} />
      <Text style={[styles.badgeText, { color: c.text }]}>{label}</Text>
    </View>
  );
}

// ─── SectionHeader ───────────────────────────────────────
export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={[styles.sectionAction, { color: colors.accent }]}>
            {action} ›
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── PageHeader ──────────────────────────────────────────
export function PageHeader({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.pageHeader}>
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backBtn, { backgroundColor: colors.bgCardAlt, borderColor: colors.border }]}
        >
          <Text style={{ fontSize: 16, color: colors.textPrimary }}>‹</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.regular,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  sectionAction: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  pageTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
