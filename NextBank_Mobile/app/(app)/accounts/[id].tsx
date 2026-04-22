import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';

const ACCOUNTS: Record<string, any> = {
  '1': { id: 1, name: 'Checking', number: 'NB-2024-0001-CHK', fullNumber: 'NB-2024-0001-CHK', balance: 2847350, status: 'ACTIVE', icon: 'wallet', color: '#F5A623', lightBg: '#FEF3D7', opened: 'Jan 15, 2024' },
  '2': { id: 2, name: 'Savings', number: 'NB-2024-0002-SAV', fullNumber: 'NB-2024-0002-SAV', balance: 5120000, status: 'ACTIVE', icon: 'piggy-bank', color: '#3B82F6', lightBg: '#DBEAFE', opened: 'Jan 15, 2024' },
  '3': { id: 3, name: 'Business', number: 'NB-2024-0003-BIZ', fullNumber: 'NB-2024-0003-BIZ', balance: 12500000, status: 'ACTIVE', icon: 'briefcase', color: '#F59E0B', lightBg: '#FEF3C7', opened: 'Feb 1, 2024' },
};

const TX = [
  { id: 1, name: 'Payment from Alice Mbeki', date: 'Apr 11', amount: 150000, type: 'in' },
  { id: 2, name: 'Orange Money Withdrawal', date: 'Apr 11', amount: -50000, type: 'out' },
  { id: 3, name: 'Stripe Deposit', date: 'Apr 10', amount: 500000, type: 'in' },
  { id: 4, name: 'Transfer to Bob Njoh', date: 'Apr 10', amount: -75000, type: 'out' },
];

export default function AccountDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const acct = ACCOUNTS[id || '1'];

  if (!acct) return null;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
          >
            <Text style={[styles.backIcon, { color: colors.textPrimary }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{acct.name} Account</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Balance card */}
          <View style={[styles.balCard, { backgroundColor: '#12203A' }]}>
            <Text style={styles.balLabel}>Available Balance</Text>
            <Text style={styles.balAmount}>
              {acct.balance.toLocaleString('fr-CM').replace(/,/g, ' ')} XAF
            </Text>
            <View style={styles.balMeta}>
              <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.balStatus}>{acct.status}</Text>
            </View>
          </View>

          {/* Details */}
          <View style={[styles.detailCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            {[
              { label: 'Account Number', value: acct.fullNumber },
              { label: 'Account Type', value: acct.name.toUpperCase() },
              { label: 'Status', value: acct.status },
              { label: 'Opened', value: acct.opened },
            ].map((row, i, arr) => (
              <View key={i}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>{row.label}</Text>
                  <Text style={[styles.detailValue, { color: row.label === 'Status' ? '#22C55E' : colors.textPrimary }]}>
                    {row.value}
                  </Text>
                </View>
                {i < arr.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              </View>
            ))}
          </View>

          {/* Quick actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.navy }]}
              onPress={() => router.push('/(app)/money/transfer')}
            >
              <Text style={styles.actionBtnText}>Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.bgCard, borderColor: colors.border, borderWidth: 1 }]}
              onPress={() => router.push('/(app)/money/deposit')}
            >
              <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>Deposit</Text>
            </TouchableOpacity>
          </View>

          {/* Transactions */}
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Transactions</Text>
          <View style={[styles.txList, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            {TX.map((tx, i) => (
              <View key={tx.id} style={[styles.txRow, i < TX.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <View style={[styles.txIcon, { backgroundColor: tx.type === 'in' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
                  <MaterialCommunityIcons
                    name={tx.type === 'in' ? 'arrow-bottom-left' : 'arrow-top-right'}
                    size={18}
                    color={tx.type === 'in' ? '#22C55E' : '#EF4444'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.txName, { color: colors.textPrimary }]}>{tx.name}</Text>
                  <Text style={[styles.txDate, { color: colors.textTertiary }]}>{tx.date}</Text>
                </View>
                <Text style={[styles.txAmt, { color: tx.type === 'in' ? '#22C55E' : colors.textPrimary }]}>
                  {tx.type === 'in' ? '+' : '-'}{Math.abs(tx.amount).toLocaleString('fr-CM').replace(/,/g, ' ')} XAF
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  backBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 22 },
  title: { fontSize: 20, fontWeight: '800' },
  balCard: { borderRadius: Radius.xl, padding: 22, marginBottom: 16 },
  balLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginBottom: 8 },
  balAmount: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 12 },
  balMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  balStatus: { fontSize: 13, color: '#22C55E', fontWeight: '600' },
  detailCard: { borderRadius: Radius.lg, borderWidth: 1, padding: 16, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 13, fontWeight: '700' },
  divider: { height: 1 },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionBtn: { flex: 1, height: 48, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  txList: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  txIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  txName: { fontSize: 13, fontWeight: '600' },
  txDate: { fontSize: 11, marginTop: 2 },
  txAmt: { fontSize: 13, fontWeight: '700' },
});
