import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';
import { accountsApi, cardsApi } from '@/constants/api';

interface Account {
  id: number;
  accountNumber: string;
  type: string;
  balance: number;
  status: string;
}

export default function RequestCardScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    accountsApi.getAccounts()
      .then(res => {
        const active = (res.data ?? []).filter((a: Account) => a.status === 'ACTIVE');
        setAccounts(active);
        if (active.length > 0) setSelectedAccount(active[0]);
      })
      .catch(() => Alert.alert('Error', 'Could not load accounts.'))
      .finally(() => setLoadingAccounts(false));
  }, []);

  const handleRequest = async () => {
    if (!selectedAccount) return;
    setRequesting(true);
    try {
      await cardsApi.requestCard(selectedAccount.id);
      Alert.alert(
        'Card Requested ✅',
        `Your new Visa card has been issued and linked to account ${selectedAccount.accountNumber}.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Failed to request card. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
        >
          <Text style={{ fontSize: 22, color: colors.textPrimary }}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Request Card</Text>
      </View>

      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        {/* Card preview */}
        <View style={[styles.cardPreview, { backgroundColor: '#12203A' }]}>
          <View style={styles.previewTop}>
            <Text style={styles.previewBrand}>NextBank</Text>
            <Text style={styles.previewVisa}>VISA</Text>
          </View>
          <Text style={styles.previewNum}>••••  ••••  ••••  ••••</Text>
          <View style={styles.previewBottom}>
            <View>
              <Text style={styles.previewMeta}>CARD HOLDER</Text>
              <Text style={styles.previewMetaVal}>YOUR NAME</Text>
            </View>
            <View>
              <Text style={styles.previewMeta}>EXPIRES</Text>
              <Text style={styles.previewMetaVal}>MM/YY</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>LINK TO ACCOUNT</Text>

        {loadingAccounts ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.accent} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading accounts...</Text>
          </View>
        ) : accounts.length === 0 ? (
          <View style={[styles.infoBox, { backgroundColor: colors.bgCardAlt, borderColor: colors.border }]}>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              No active accounts found. Please contact your branch.
            </Text>
          </View>
        ) : (
          accounts.map((acct) => (
            <TouchableOpacity
              key={acct.id}
              style={[
                styles.acctRow,
                {
                  backgroundColor: selectedAccount?.id === acct.id ? colors.bgCard : colors.bgCardAlt,
                  borderColor: selectedAccount?.id === acct.id ? colors.accent : colors.border,
                  borderWidth: selectedAccount?.id === acct.id ? 1.5 : 1,
                },
              ]}
              onPress={() => setSelectedAccount(acct)}
              activeOpacity={0.85}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.acctLabel, { color: colors.textPrimary }]}>{acct.type}</Text>
                <Text style={[styles.acctCode, { color: colors.textTertiary }]}>{acct.accountNumber}</Text>
              </View>
              {selectedAccount?.id === acct.id && (
                <View style={[styles.check, { backgroundColor: colors.accent }]}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}

        <View style={[styles.infoBox, { backgroundColor: colors.bgCardAlt, borderColor: colors.border }]}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Your card will be a Luhn-valid virtual Visa card, valid for 3 years. CVV is securely hashed and never displayed.
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[
            styles.reqBtn,
            {
              backgroundColor: colors.navy,
              opacity: (requesting || !selectedAccount || loadingAccounts) ? 0.6 : 1,
            },
          ]}
          onPress={handleRequest}
          disabled={requesting || !selectedAccount || loadingAccounts}
          activeOpacity={0.85}
        >
          {requesting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.reqBtnText}>Request Card</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800' },
  cardPreview: {
    borderRadius: Radius.xl, padding: 20, height: 170,
    justifyContent: 'space-between', marginBottom: 24, overflow: 'hidden',
  },
  previewTop: { flexDirection: 'row', justifyContent: 'space-between' },
  previewBrand: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  previewVisa: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  previewNum: { fontSize: 16, color: 'rgba(255,255,255,0.6)', letterSpacing: 3 },
  previewBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  previewMeta: { fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: '700', textTransform: 'uppercase', marginBottom: 3 },
  previewMetaVal: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16 },
  loadingText: { fontSize: 14 },
  acctRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.md, padding: 14, marginBottom: 10,
  },
  acctLabel: { fontSize: 14, fontWeight: '700' },
  acctCode: { fontSize: 12, marginTop: 2 },
  check: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  infoBox: { borderRadius: Radius.md, borderWidth: 1, padding: 14, marginTop: 4, marginBottom: 16 },
  infoText: { fontSize: 13, lineHeight: 20 },
  reqBtn: { height: 54, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  reqBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
