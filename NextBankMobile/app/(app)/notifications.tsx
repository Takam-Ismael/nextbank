import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';

const NOTIFS = [
  { id: 1, type: 'DEPOSIT_COMPLETED', title: 'Deposit Completed', message: 'Your 500 000 XAF deposit has been credited to your Checking account.', time: 'Just now', read: false, icon: 'plus-circle', iconBg: '#DCFCE7', iconColor: '#22C55E' },
  { id: 2, type: 'TRANSFER_RECEIVED', title: 'Transfer Received', message: 'You received 150 000 XAF from Alice Mbeki.', time: '2h ago', read: false, icon: 'arrow-bottom-left', iconBg: 'rgba(34, 197, 94, 0.15)', iconColor: '#22C55E' },
  { id: 3, type: 'TRANSFER_SENT', title: 'Transfer Sent', message: 'You sent 75 000 XAF to Bob Njoh (ACC 0002-SAV).', time: 'Apr 10', read: false, icon: 'arrow-top-right', iconBg: 'rgba(239, 68, 68, 0.15)', iconColor: '#EF4444' },
  { id: 4, type: 'WITHDRAWAL_PROCESSED', title: 'Withdrawal Processed', message: '50 000 XAF sent to Orange Money +237 699 123 456. Ref: WD-2024-00123.', time: 'Apr 11', read: true, icon: 'mobile-phone', iconBg: 'rgba(245, 166, 35, 0.15)', iconColor: '#F5A623' },
  { id: 5, type: 'CARD_CREATED', title: 'Card Issued', message: 'Your new Visa card ending in 7891 is ready to use.', time: 'Apr 9', read: true, icon: 'credit-card', iconBg: 'rgba(59, 130, 246, 0.15)', iconColor: '#3B82F6' },
  { id: 6, type: 'WELCOME', title: 'Welcome to NextBank', message: 'Welcome, John Doe! Your account is ready. A 50 XAF bonus has been credited.', time: 'Apr 8', read: true, icon: 'bank', iconBg: 'rgba(139, 92, 246, 0.15)', iconColor: '#8B5CF6' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [notifs, setNotifs] = useState(NOTIFS);

  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const markRead = (id: number) => setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
        >
          <Feather name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Notifications</Text>
        {unread > 0 && (
          <TouchableOpacity onPress={markAllRead} style={{ marginLeft: 'auto' }}>
            <Text style={[styles.markAll, { color: colors.accent }]}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {unread > 0 && (
        <View style={[styles.unreadBanner, { backgroundColor: colors.accentLight }]}>
          <Text style={[styles.unreadText, { color: colors.accent }]}>
            {unread} unread notification{unread > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        {notifs.map((notif, i) => (
          <TouchableOpacity
            key={notif.id}
            style={[
              styles.notifItem,
              {
                backgroundColor: notif.read ? colors.bgCard : colors.bgCard,
                borderColor: notif.read ? colors.border : colors.accent,
                borderLeftWidth: notif.read ? 1 : 3,
              },
            ]}
            onPress={() => markRead(notif.id)}
            activeOpacity={0.85}
          >
            <View style={[styles.notifIcon, { backgroundColor: notif.iconBg }]}>
              <MaterialCommunityIcons name={notif.icon} size={20} color={notif.iconColor} />
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifTopRow}>
                <Text style={[styles.notifTitle, { color: colors.textPrimary }]}>{notif.title}</Text>
                {!notif.read && (
                  <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
                )}
              </View>
              <Text style={[styles.notifMsg, { color: colors.textSecondary }]}>{notif.message}</Text>
              <Text style={[styles.notifTime, { color: colors.textTertiary }]}>{notif.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800' },
  markAll: { fontSize: 14, fontWeight: '600' },
  unreadBanner: { marginHorizontal: 20, borderRadius: Radius.md, padding: 12, marginBottom: 8 },
  unreadText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  notifItem: {
    flexDirection: 'row', gap: 12,
    borderRadius: Radius.lg, borderWidth: 1,
    padding: 14, marginBottom: 10,
  },
  notifIcon: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifContent: { flex: 1 },
  notifTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 14, fontWeight: '700', flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifMsg: { fontSize: 13, lineHeight: 19, marginBottom: 6 },
  notifTime: { fontSize: 11 },
});
