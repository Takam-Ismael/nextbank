import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';

const ACCOUNTS = [
  { id: 1, label: 'CHECKING', code: '0001-CHK', balance: 2847350 },
  { id: 2, label: 'SAVINGS', code: '0002-SAV', balance: 5120000 },
];

type Provider = 'ORANGE_MONEY' | 'MTN_MOMO';

export default function WithdrawScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [provider, setProvider] = useState<Provider>('ORANGE_MONEY');
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNTS[0]);
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = () => {
    if (!mobileNumber || !amount || Number(amount) <= 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Withdrawal Processed',
        `${Number(amount).toLocaleString('fr-CM').replace(/,/g, ' ')} XAF sent to ${provider === 'ORANGE_MONEY' ? 'Orange Money' : 'MTN MoMo'} ${mobileNumber}`,
        [{ text: 'OK', onPress: () => router.replace('/(app)/dashboard') }],
      );
    }, 1400);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[
                styles.backBtn,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: colors.border,
                  shadowColor: '#3B82F6',
                  shadowOpacity: isDark ? 0.15 : 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                },
              ]}
            >
              <Feather name="chevron-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Withdraw</Text>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {/* Provider */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>SELECT PROVIDER</Text>
            <View style={styles.providerRow}>
              {([
                { id: 'ORANGE_MONEY', label: 'Orange Money', icon: 'circle', color: '#F97316' },
                { id: 'MTN_MOMO', label: 'MTN MoMo', icon: 'circle', color: '#EAB308' },
              ] as { id: Provider; label: string; icon: string; color: string }[]).map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.providerBtn,
                    {
                      backgroundColor: provider === p.id ? colors.bgCard : colors.bgCardAlt,
                      borderColor: provider === p.id ? colors.accent : colors.border,
                      borderWidth: provider === p.id ? 1.5 : 1,
                    },
                  ]}
                  onPress={() => setProvider(p.id)}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons name={p.icon} size={28} color={p.color} />
                  <Text style={[styles.providerLabel, { color: colors.textPrimary }]}>{p.label}</Text>
                  {provider === p.id && (
                    <View style={[styles.checkmark, { backgroundColor: colors.accent }]}>
                      <MaterialCommunityIcons name="check" size={12} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Account */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>FROM ACCOUNT</Text>
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

            {/* Mobile Number */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>MOBILE NUMBER</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
              <MaterialCommunityIcons name="phone" size={20} color={colors.textTertiary} />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="+237 6XX XXX XXX"
                placeholderTextColor={colors.textTertiary}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
              />
            </View>

            {/* Amount */}
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

            {amount && Number(amount) > 0 && (
              <View style={[styles.summaryBox, { backgroundColor: colors.bgCardAlt, borderColor: colors.border }]}>
                <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                  Sending to {provider === 'ORANGE_MONEY' ? 'Orange Money' : 'MTN MoMo'}{' '}
                  <Text style={{ fontWeight: '700', color: colors.textPrimary }}>
                    {Number(amount).toLocaleString('fr-CM').replace(/,/g, ' ')} XAF
                  </Text>
                  {' '}· Fee: <Text style={{ color: '#22C55E', fontWeight: '700' }}>Free</Text>
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.withdrawBtn,
                {
                  backgroundColor: colors.navy,
                  opacity: mobileNumber && amount && Number(amount) > 0 ? 1 : 0.5,
                },
              ]}
              onPress={handleWithdraw}
              disabled={!mobileNumber || !amount || Number(amount) <= 0 || loading}
              activeOpacity={0.85}
            >
              <Text style={styles.withdrawBtnText}>
                {loading ? 'Processing...' : 'Withdraw'}
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
  providerRow: { flexDirection: 'row', gap: 12 },
  providerBtn: {
    flex: 1, borderRadius: Radius.lg, padding: 16,
    alignItems: 'center', gap: 8, position: 'relative',
  },
  providerLabel: { fontSize: 13, fontWeight: '700' },
  checkmark: { position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  accountRow: { flexDirection: 'row', gap: 10 },
  accountTab: { flex: 1, borderRadius: Radius.md, padding: 14 },
  tabLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  tabBalance: { fontSize: 14, fontWeight: '800', marginTop: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 52, borderRadius: Radius.md, borderWidth: 1, paddingHorizontal: 16 },
  inputIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: 15 },
  amountBox: { height: 72, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  amountInput: { fontSize: 32, fontWeight: '800', width: '100%', textAlign: 'center' },
  summaryBox: { borderRadius: Radius.md, borderWidth: 1, padding: 14, marginTop: 12 },
  summaryText: { fontSize: 13, lineHeight: 20 },
  withdrawBtn: { height: 54, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 32 },
  withdrawBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
