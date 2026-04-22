import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';

const ACCOUNTS = [
  { id: 1, label: 'CHECKING', code: '0001-CHK', balance: 2847350 },
  { id: 2, label: 'SAVINGS', code: '0002-SAV', balance: 5120000 },
];

const PRESETS = [10000, 25000, 50000, 100000];

export default function DepositScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNTS[0]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Deposit Initiated', `Your deposit of ${Number(amount).toLocaleString('fr-CM').replace(/,/g, ' ')} XAF is being processed via Stripe.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1400);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.backBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
            >
              <Text style={{ fontSize: 22, color: colors.textPrimary }}>‹</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Add Money</Text>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>SELECT ACCOUNT</Text>
            <View style={styles.accountRow}>
              {ACCOUNTS.map((acct) => (
                <TouchableOpacity
                  key={acct.id}
                  style={[
                    styles.accountTab,
                    {
                      backgroundColor: selectedAccount.id === acct.id ? colors.bgCard : colors.bgCardAlt,
                      borderColor: selectedAccount.id === acct.id ? colors.accent : colors.border,
                      borderWidth: selectedAccount.id === acct.id ? 1.5 : 1,
                    },
                  ]}
                  onPress={() => setSelectedAccount(acct)}
                >
                  <Text style={[styles.tabLabel, { color: colors.textSecondary }]}>{acct.label}</Text>
                  <Text style={[styles.tabBalance, { color: colors.textPrimary }]}>
                    {acct.balance.toLocaleString('fr-CM').replace(/,/g, ' ')} XAF
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>AMOUNT (XAF)</Text>
            <View style={[styles.amountBox, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
              <TextInput
                style={[styles.amountInput, { color: colors.textPrimary }]}
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                textAlign="center"
              />
            </View>

            {/* Preset amounts */}
            <View style={styles.presetRow}>
              {PRESETS.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.presetBtn, { backgroundColor: colors.bgCardAlt, borderColor: colors.border }]}
                  onPress={() => setAmount(String(p))}
                >
                  <Text style={[styles.presetText, { color: colors.textSecondary }]}>
                    {p.toLocaleString('fr-CM').replace(/,/g, ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Payment info */}
            <View style={[styles.infoBox, { backgroundColor: colors.bgCardAlt, borderColor: colors.border }]}>
              <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>Payment via Stripe</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                You'll be redirected to a secure Stripe payment sheet to complete your deposit.
                Use test card 4242 4242 4242 4242 for testing.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.depositBtn, { backgroundColor: colors.navy, opacity: amount && Number(amount) > 0 ? 1 : 0.5 }]}
              onPress={handleDeposit}
              disabled={!amount || Number(amount) <= 0 || loading}
              activeOpacity={0.85}
            >
              <Text style={styles.depositBtnText}>
                {loading ? 'Processing...' : `Deposit${amount ? ` ${Number(amount).toLocaleString('fr-CM').replace(/,/g, ' ')} XAF` : ''}`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  backBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800' },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginTop: 16 },
  accountRow: { flexDirection: 'row', gap: 10 },
  accountTab: { flex: 1, borderRadius: Radius.md, padding: 14 },
  tabLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  tabBalance: { fontSize: 14, fontWeight: '800', marginTop: 4 },
  amountBox: { height: 72, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  amountInput: { fontSize: 32, fontWeight: '800', width: '100%', textAlign: 'center' },
  presetRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 4 },
  presetBtn: { flex: 1, height: 38, borderRadius: Radius.sm, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  presetText: { fontSize: 12, fontWeight: '600' },
  infoBox: { borderRadius: Radius.md, borderWidth: 1, padding: 16, marginTop: 16, marginBottom: 4 },
  infoTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  infoText: { fontSize: 13, lineHeight: 20 },
  depositBtn: { height: 54, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 32 },
  depositBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
