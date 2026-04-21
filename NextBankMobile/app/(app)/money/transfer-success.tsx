import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';

export default function TransferSuccessScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { amount, recipientName } = useLocalSearchParams<{ amount: string; recipientName: string }>();

  const amt = Number(amount || 0);
  const fmtAmt = amt.toLocaleString('fr-CM').replace(/,/g, ' ');

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Green circle check — exactly from screenshot */}
        <View style={styles.iconWrap}>
          <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
            <Text style={styles.iconCheck}>✓</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>Transfer Sent!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {fmtAmt} XAF has been sent successfully
        </Text>
        <Text style={[styles.toText, { color: colors.textTertiary }]}>
          To {recipientName || '—'}
        </Text>

        <View style={styles.buttons}>
          {/* New Transfer — dark button */}
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.navy }]}
            onPress={() => router.replace('/(app)/money/transfer')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>New Transfer</Text>
          </TouchableOpacity>

          {/* Back to Home — light button */}
          <TouchableOpacity
            style={[styles.secondaryBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
            onPress={() => router.replace('/(app)/dashboard')}
            activeOpacity={0.85}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.textPrimary }]}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconWrap: { marginBottom: 28 },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCheck: { fontSize: 40, color: '#22C55E' },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  toText: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  buttons: { width: '100%', marginTop: 48, gap: 12 },
  primaryBtn: {
    height: 56, borderRadius: Radius.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  secondaryBtn: {
    height: 56, borderRadius: Radius.lg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '600' },
});
