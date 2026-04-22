import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Radius } from '@/constants/theme';

interface MenuItemProps {
  icon: string;
  label: string;
  sub: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}

function MenuItem({ icon, label, sub, onPress, right, danger }: MenuItemProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.menuIcon, { backgroundColor: colors.bgCardAlt }]}>
        <MaterialCommunityIcons name={icon} size={20} color={danger ? '#EF4444' : colors.textPrimary} />
      </View>
      <View style={styles.menuText}>
        <Text style={[styles.menuLabel, { color: danger ? '#EF4444' : colors.textPrimary }]}>{label}</Text>
        <Text style={[styles.menuSub, { color: colors.textTertiary }]}>{sub}</Text>
      </View>
      {right || (
        <Text style={[styles.menuArrow, { color: colors.textTertiary }]}>›</Text>
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();

  const initials = (user?.fullName || 'JD')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Profile card */}
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
          <View style={[styles.profileCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.navy }]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                {user?.fullName || 'John Doe'}
              </Text>
              <View style={styles.profileMeta}>
                <Text style={{ fontSize: 13, color: colors.textTertiary }}>✉ </Text>
                <Text style={[styles.profileMetaText, { color: colors.textSecondary }]}>
                  {user?.email || 'john.doe@nextbank.cm'}
                </Text>
              </View>
              <View style={styles.profileMeta}>
                <Text style={{ fontSize: 13, color: colors.textTertiary }}>📞 </Text>
                <Text style={[styles.profileMetaText, { color: colors.textSecondary }]}>
                  {user?.phone || '+237 699 123 456'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ACCOUNT section */}
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>ACCOUNT</Text>
        <View style={[styles.menuGroup, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <MenuItem
            icon="account"
            label="Personal Information"
            sub="Name, email, phone"
            onPress={() => {}}
          />
          <MenuItem
            icon="credit-card"
            label="My Cards"
            sub="Manage your cards"
            onPress={() => router.push('/(app)/cards')}
          />
          <MenuItem
            icon="shield"
            label="Security"
            sub="QR code, login settings"
            onPress={() => {}}
          />
        </View>

        {/* PREFERENCES section */}
        <Text style={[styles.sectionTitle, { color: colors.textTertiary, marginTop: 20 }]}>PREFERENCES</Text>
        <View style={[styles.menuGroup, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <MenuItem
            icon="bell"
            label="Notifications"
            sub="Push & SMS alerts"
            onPress={() => router.push('/(app)/notifications')}
          />
          <MenuItem
            icon={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'}
            label={isDark ? 'Light Mode' : 'Dark Mode'}
            sub={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#E5E7EB', true: colors.accent }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        {/* SUPPORT section */}
        <Text style={[styles.sectionTitle, { color: colors.textTertiary, marginTop: 20 }]}>SUPPORT</Text>
        <View style={[styles.menuGroup, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <MenuItem
            icon="help-circle"
            label="Help Center"
            sub="FAQs and support"
            onPress={() => {}}
          />
          <MenuItem
            icon="file-document"
            label="Terms & Privacy"
            sub="Legal documents"
            onPress={() => {}}
          />
        </View>

        {/* Log Out */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: '#FEE2E2' }]}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="logout" size={18} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          NextBank v3.0 • Member since November 2024
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    borderRadius: Radius.lg, borderWidth: 1, padding: 16,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  profileMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  profileMetaText: { fontSize: 13 },
  sectionTitle: {
    fontSize: 12, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 1, paddingHorizontal: 20, marginBottom: 8,
  },
  menuGroup: { borderRadius: Radius.lg, borderWidth: 1, marginHorizontal: 20, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, borderBottomWidth: 1,
  },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600' },
  menuSub: { fontSize: 12, marginTop: 2 },
  menuArrow: { fontSize: 20, fontWeight: '300' },
  logoutBtn: {
    height: 54, borderRadius: Radius.lg, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#EF4444' },
  footer: { fontSize: 12, textAlign: 'center', marginTop: 24 },
});
