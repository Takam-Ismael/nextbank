import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';

const ACCOUNTS = [
  { id: 1, label: 'CHECKING', balance: 2847350 },
  { id: 2, label: 'SAVINGS', balance: 5120000 },
  { id: 3, label: 'BUSINESS', balance: 12500000 },
];

function fmt(n: number) {
  return n.toLocaleString('fr-CM').replace(/,/g, ' ');
}

export default function TransferScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [fromAccount, setFromAccount] = useState(ACCOUNTS[0]);
  const [toNumber, setToNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleNext = () => {
    if (!toNumber || !amount) return;
    router.push({
      pathname: '/(app)/money/transfer-confirm',
      params: {
        fromLabel: fromAccount.label,
        fromCode: `000${fromAccount.id}-${fromAccount.label.slice(0, 3)}`,
        toNumber,
        recipientName,
        amount,
        description,
      },
    });
  };

  const { isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
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
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Transfer Money</Text>
          </View>

          {/* Progress bar — step 1 of 2 */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { backgroundColor: colors.accent, width: '50%' }]} />
            <View style={[styles.progressTrack, { backgroundColor: colors.border, flex: 1 }]} />
          </View>

          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            {/* FROM ACCOUNT selector */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>FROM ACCOUNT</Text>
            <View style={styles.accountTabs}>
              {ACCOUNTS.map((acct) => (
                <TouchableOpacity
                  key={acct.id}
                  style={[
                    styles.accountTab,
                    {
                      backgroundColor: fromAccount.id === acct.id ? colors.bgCard : colors.bgCardAlt,
                      borderColor: fromAccount.id === acct.id ? colors.accent : colors.border,
                      borderWidth: fromAccount.id === acct.id ? 1.5 : 1,
                    },
                  ]}
                  onPress={() => setFromAccount(acct)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.tabLabel, { color: colors.textSecondary }]}>{acct.label}</Text>
                  <Text style={[styles.tabBalance, { color: colors.textPrimary }]}>
                    {fmt(acct.balance)} XAF
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* RECIPIENT ACCOUNT NUMBER */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>RECIPIENT ACCOUNT NUMBER</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
              <Text style={[styles.inputIcon, { color: colors.textTertiary }]}>#</Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="NB-2024-XXXX-XXX"
                placeholderTextColor={colors.textTertiary}
                value={toNumber}
                onChangeText={setToNumber}
                autoCapitalize="characters"
              />
            </View>

            {/* RECIPIENT NAME */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>RECIPIENT NAME (OPTIONAL)</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
              <Text style={[styles.inputIcon, { color: colors.textTertiary }]}>👤</Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="e.g. Alice Mbeki"
                placeholderTextColor={colors.textTertiary}
                value={recipientName}
                onChangeText={setRecipientName}
                autoCapitalize="words"
              />
            </View>

            {/* AMOUNT */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>AMOUNT (XAF)</Text>
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

            {/* DESCRIPTION */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>DESCRIPTION (OPTIONAL)</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="e.g. Rent payment"
                placeholderTextColor={colors.textTertiary}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Next */}
            <TouchableOpacity
              style={[
                styles.nextBtn,
                {
                  backgroundColor: colors.navy,
                  opacity: toNumber && amount ? 1 : 0.5,
                },
              ]}
              onPress={handleNext}
              disabled={!toNumber || !amount}
              activeOpacity={0.85}
            >
              <Text style={styles.nextBtnText}>Review Transfer →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  progressBar: { flexDirection: 'row', height: 3, marginBottom: 4 },
  progressFill: { height: 3 },
  progressTrack: { height: 3 },
  fieldLabel: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: 10, marginTop: 16,
  },
  accountTabs: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  accountTab: {
    flex: 1, borderRadius: Radius.md, padding: 12,
  },
  tabLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  tabBalance: { fontSize: 13, fontWeight: '800', marginTop: 4 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    height: 52, borderRadius: Radius.md, borderWidth: 1,
    paddingHorizontal: 16, marginBottom: 4,
  },
  inputIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: 15 },
  amountBox: {
    height: 64, borderRadius: Radius.md, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  amountInput: { fontSize: 28, fontWeight: '700', width: '100%', textAlign: 'center' },
  nextBtn: {
    height: 54, borderRadius: Radius.lg,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 24, marginBottom: 32,
  },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
