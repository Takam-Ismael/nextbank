import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';

export default function TransferConfirmScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{
    fromLabel: string;
    fromCode: string;
    toNumber: string;
    recipientName: string;
    amount: string;
    description: string;
  }>();
  const [loading, setLoading] = useState(false);

  const amt = Number(params.amount || 0);
  const fmtAmt = amt.toLocaleString('fr-CM').replace(/,/g, ' ');

  const handleConfirm = async () => {
    setLoading(true);
    // In production: call transactionsApi.transfer(...)
    setTimeout(() => {
      setLoading(false);
      router.replace({
        pathname: '/(app)/money/transfer-success',
        params: { amount: params.amount, recipientName: params.recipientName || params.toNumber },
      });
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
        >
          <Text style={{ fontSize: 22, color: colors.textPrimary }}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Confirm Transfer</Text>
      </View>

      {/* Progress bar — step 2 of 2 */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { backgroundColor: colors.accent, flex: 1 }]} />
        <View style={[styles.progressFill, { backgroundColor: colors.accent, flex: 1 }]} />
      </View>

      <View style={{ paddingHorizontal: 20, flex: 1, paddingTop: 24 }}>
        {/* Summary card */}
        <View style={[styles.summaryCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.sendingLabel, { color: colors.textSecondary }]}>You are sending</Text>
          <Text style={[styles.sendingAmount, { color: colors.textPrimary }]}>
            {fmtAmt} XAF
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {[
            { label: 'From', value: `${params.fromLabel} (${params.fromCode})` },
            { label: 'To', value: params.toNumber },
            { label: 'Recipient', value: params.recipientName || '—' },
            { label: 'Fee', value: 'Free', valueColor: '#22C55E' },
            ...(params.description ? [{ label: 'Note', value: params.description }] : []),
          ].map((row, i, arr) => (
            <View key={i}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{row.label}</Text>
                <Text style={[styles.detailValue, { color: (row as any).valueColor || colors.textPrimary }]}>
                  {row.value}
                </Text>
              </View>
              {i < arr.length - 1 && <View style={[styles.innerDivider, { backgroundColor: colors.borderLight }]} />}
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        {/* Confirm button — dark navy exactly as in design */}
        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: colors.navy, opacity: loading ? 0.7 : 1 }]}
          onPress={handleConfirm}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmBtnText}>
            {loading ? 'Sending...' : 'Confirm & Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14,
  },
  backBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  progressBar: { flexDirection: 'row', height: 3, gap: 4, paddingHorizontal: 20, marginBottom: 4 },
  progressFill: { height: 3, borderRadius: 2 },
  summaryCard: {
    borderRadius: Radius.xl, borderWidth: 1,
    padding: 22, marginBottom: 16,
  },
  sendingLabel: { fontSize: 14, textAlign: 'center', marginBottom: 8 },
  sendingAmount: { fontSize: 32, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5, marginBottom: 20 },
  divider: { height: 1, marginBottom: 16 },
  innerDivider: { height: 1, marginVertical: 4 },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
  },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '700', maxWidth: '60%', textAlign: 'right' },
  confirmBtn: {
    height: 56, borderRadius: Radius.lg,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  confirmBtnText: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
});
