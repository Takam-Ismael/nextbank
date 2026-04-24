import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Radius } from '@/constants/theme';
import { accountsApi } from '@/constants/api';

const TYPES = [
  { id: 'SAVINGS', label: 'Savings', desc: 'Earn interest on your deposits', icon: '💰' },
  { id: 'BUSINESS', label: 'Business', desc: 'For business transactions', icon: '🏢' },
];

export default function OpenAccountScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableTypes, setAvailableTypes] = useState(TYPES);

  React.useEffect(() => {
    const fetchAccs = async () => {
      try {
        const res = await accountsApi.getAccounts();
        const existingTypes = res.data.map((a: any) => a.type);
        const filtered = TYPES.filter(t => !existingTypes.includes(t.id));
        setAvailableTypes(filtered);
        if (filtered.length > 0) {
          setSelected(filtered[0].id);
        }
      } catch (err) {}
    };
    fetchAccs();
  }, []);

  const handleOpen = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.openAccount(selected);
      
      Alert.alert('Request Sent', `Your request for a ${selected} account is pending approval by an admin.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to request account';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
        >
          <Text style={[{ fontSize: 22, color: colors.textPrimary }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Open New Account</Text>
      </View>

      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Select account type</Text>

        {availableTypes.length === 0 ? (
          <Text style={{ color: colors.textSecondary, marginTop: 10 }}>You have already opened all available account types.</Text>
        ) : (
          availableTypes.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.typeCard,
              {
                backgroundColor: colors.bgCard,
                borderColor: selected === t.id ? colors.accent : colors.border,
                borderWidth: selected === t.id ? 2 : 1,
              },
            ]}
            onPress={() => setSelected(t.id)}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</Text>
            <Text style={[styles.typeName, { color: colors.textPrimary }]}>{t.label}</Text>
            <Text style={[styles.typeDesc, { color: colors.textSecondary }]}>{t.desc}</Text>
            {selected === t.id && (
              <View style={[styles.checkmark, { backgroundColor: colors.accent }]}>
                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
          ))
        )}

        <View style={[styles.infoBox, { backgroundColor: colors.bgCardAlt, borderColor: colors.border }]}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            New accounts start with a balance of 0 XAF. Your account will be activated immediately.
          </Text>
        </View>

        {availableTypes.length > 0 && (
          <TouchableOpacity
            style={[styles.openBtn, { backgroundColor: colors.navy, opacity: loading ? 0.7 : 1 }]}
            onPress={handleOpen}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.openBtnText}>{loading ? 'Opening...' : 'Open Account'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800' },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 14, marginTop: 4 },
  typeCard: { borderRadius: Radius.lg, padding: 20, marginBottom: 12, position: 'relative' },
  typeName: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  typeDesc: { fontSize: 13 },
  checkmark: { position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  infoBox: { borderRadius: Radius.md, borderWidth: 1, padding: 14, marginBottom: 20 },
  infoText: { fontSize: 13, lineHeight: 20 },
  openBtn: { height: 54, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  openBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
