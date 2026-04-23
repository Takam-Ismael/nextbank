import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';

import { accountsApi } from '@/constants/api';

const TX: any[] = [];

export default function AccountDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // id is accountNumber
  const { colors } = useTheme();
  const [acct, setAcct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchAccount();
  }, [id]);

  const fetchAccount = async () => {
    try {
      const res = await accountsApi.getAccount(id!);
      setAcct(res.data);
    } catch (err) {
      console.error('Failed to fetch account:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
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
              {(acct.balance || 0).toLocaleString('fr-CM').replace(/,/g, ' ')} XAF
            </Text>
            <View style={styles.balMeta}>
              <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.balStatus}>{acct.status}</Text>
            </View>
          </View>

          {/* Details */}
          <View style={[styles.detailCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            {[
              { label: 'Account Number', value: acct.accountNumber },
              { label: 'Account Type', value: acct.type },
              { label: 'Status', value: acct.status },
              { label: 'Opened', value: new Date(acct.createdAt).toLocaleDateString() },
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
                {/* ... existing tx item ... */}
              </View>
            ))}
            {TX.length === 0 && (
              <View style={{ padding: 30, alignItems: 'center' }}>
                <Text style={{ color: colors.textTertiary, fontSize: 13 }}>No recent transactions</Text>
              </View>
            )}
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
