import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';

const ACCOUNTS = [
  { id: 1, name: 'Checking', number: 'NB-2024-0001-CHK', balance: 2847350, status: 'ACTIVE', icon: 'wallet', color: '#F5A623', lightBg: '#FEF3D7' },
  { id: 2, name: 'Savings', number: 'NB-2024-0002-SAV', balance: 5120000, status: 'ACTIVE', icon: 'piggy-bank', color: '#3B82F6', lightBg: '#DBEAFE' },
  { id: 3, name: 'Business', number: 'NB-2024-0003-BIZ', balance: 12500000, status: 'ACTIVE', icon: 'briefcase', color: '#F59E0B', lightBg: '#FEF3C7' },
];

export default function AccountsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const total = ACCOUNTS.reduce((s, a) => s + a.balance, 0);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Accounts</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Total:{' '}
            <Text style={{ fontWeight: '800', color: colors.textPrimary }}>
              {total.toLocaleString('fr-CM').replace(/,/g, ' ')} XAF
            </Text>
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {ACCOUNTS.map((acct) => (
            <TouchableOpacity
              key={acct.id}
              style={[
                styles.acctRow,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: colors.border,
                  shadowColor: acct.color,
                  shadowOpacity: isDark ? 0.2 : 0.1,
                  shadowRadius: 12,
                  elevation: 4,
                },
              ]}
              activeOpacity={0.88}
              onPress={() => router.push({ pathname: '/(app)/accounts/[id]', params: { id: acct.id } })}
            >
              {/* Icon */}
              <View style={[styles.acctIcon, { backgroundColor: acct.lightBg }]}>
                <MaterialCommunityIcons name={acct.icon} size={24} color={acct.color} />
              </View>

              {/* Meta */}
              <View style={styles.acctMeta}>
                <Text style={[styles.acctName, { color: colors.textPrimary }]}>{acct.name}</Text>
                <Text style={[styles.acctNumber, { color: colors.textTertiary }]}>{acct.number}</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
                  <Text style={[styles.statusText, { color: colors.textTertiary }]}>{acct.status}</Text>
                </View>
              </View>

              {/* Balance + arrow */}
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={[styles.acctBalance, { color: colors.textPrimary }]}>
                  {acct.balance.toLocaleString('fr-CM').replace(/,/g, ' ')} XAF
                </Text>
                <Text style={[styles.arrow, { color: colors.textTertiary }]}>›</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Open New Account */}
          <TouchableOpacity
            style={[styles.openBtn, { borderColor: colors.border }]}
            onPress={() => router.push('/(app)/accounts/open')}
            activeOpacity={0.85}
          >
            <Text style={[styles.openBtnText, { color: colors.textSecondary }]}>+ Open New Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  title: { fontSize: 26, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 4 },
  acctRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  acctIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acctMeta: { flex: 1 },
  acctName: { fontSize: 16, fontWeight: '700' },
  acctNumber: { fontSize: 12, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  acctBalance: { fontSize: 16, fontWeight: '800' },
  arrow: { fontSize: 18 },
  openBtn: {
    height: 54,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  openBtnText: { fontSize: 15, fontWeight: '600' },
});
