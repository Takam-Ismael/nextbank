import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';
import { notificationsApi } from '@/constants/api';

interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  referenceId: number | null;
  createdAt: string;
}

// Map notification type → icon config
const TYPE_ICON: Record<string, { icon: string; bg: string; color: string }> = {
  WELCOME:              { icon: 'bank',              bg: 'rgba(139,92,246,0.15)',  color: '#8B5CF6' },
  ACCOUNT_FROZEN:       { icon: 'lock',              bg: 'rgba(239,68,68,0.15)',   color: '#EF4444' },
  ACCOUNT_UNFROZEN:     { icon: 'lock-open',         bg: 'rgba(34,197,94,0.15)',   color: '#22C55E' },
  DEPOSIT_PENDING:      { icon: 'clock-outline',     bg: 'rgba(245,166,35,0.15)',  color: '#F5A623' },
  DEPOSIT_COMPLETED:    { icon: 'plus-circle',       bg: '#DCFCE7',                color: '#22C55E' },
  DEPOSIT_FAILED:       { icon: 'close-circle',      bg: 'rgba(239,68,68,0.15)',   color: '#EF4444' },
  TRANSFER_SENT:        { icon: 'arrow-top-right',   bg: 'rgba(239,68,68,0.15)',   color: '#EF4444' },
  TRANSFER_RECEIVED:    { icon: 'arrow-bottom-left', bg: 'rgba(34,197,94,0.15)',   color: '#22C55E' },
  WITHDRAWAL_PROCESSED: { icon: 'mobile-phone',      bg: 'rgba(245,166,35,0.15)', color: '#F5A623' },
  CARD_CREATED:         { icon: 'credit-card',       bg: 'rgba(59,130,246,0.15)', color: '#3B82F6' },
  CARD_FROZEN:          { icon: 'credit-card-off',   bg: 'rgba(239,68,68,0.15)',  color: '#EF4444' },
  CARD_UNFROZEN:        { icon: 'credit-card-check', bg: 'rgba(34,197,94,0.15)',  color: '#22C55E' },
};

const DEFAULT_ICON = { icon: 'bell', bg: 'rgba(156,163,175,0.15)', color: '#9CA3AF' };

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await notificationsApi.getMyNotifications();
      setNotifications(res.data ?? []);
    } catch {
      setError('Could not load notifications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const onRefresh = () => { setRefreshing(true); fetchNotifications(true); };

  const markRead = async (id: number) => {
    const notif = notifications.find(n => n.id === id);
    if (!notif || notif.isRead) return;
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      await notificationsApi.markRead(id);
    } catch {
      // Revert on failure
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: false } : n));
    }
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await notificationsApi.markAllRead();
    } catch {
      fetchNotifications(true);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Feather name="chevron-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Notifications</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

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
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={{ marginLeft: 'auto' }}>
            <Text style={[styles.markAll, { color: colors.accent }]}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {unreadCount > 0 && (
        <View style={[styles.unreadBanner, { backgroundColor: colors.accentLight }]}>
          <Text style={[styles.unreadText, { color: colors.accent }]}>
            {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {error ? (
          <View style={styles.errorState}>
            <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
            <TouchableOpacity onPress={() => fetchNotifications()} style={[styles.retryBtn, { backgroundColor: colors.accent }]}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Notifications</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              You're all caught up!
            </Text>
          </View>
        ) : (
          notifications.map((notif) => {
            const iconConfig = TYPE_ICON[notif.type] ?? DEFAULT_ICON;
            return (
              <TouchableOpacity
                key={notif.id}
                style={[
                  styles.notifItem,
                  {
                    backgroundColor: colors.bgCard,
                    borderColor: notif.isRead ? colors.border : colors.accent,
                    borderLeftWidth: notif.isRead ? 1 : 3,
                  },
                ]}
                onPress={() => markRead(notif.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.notifIcon, { backgroundColor: iconConfig.bg }]}>
                  <MaterialCommunityIcons name={iconConfig.icon as any} size={20} color={iconConfig.color} />
                </View>
                <View style={styles.notifContent}>
                  <View style={styles.notifTopRow}>
                    <Text style={[styles.notifTitle, { color: colors.textPrimary }]}>{notif.title}</Text>
                    {!notif.isRead && (
                      <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
                    )}
                  </View>
                  <Text style={[styles.notifMsg, { color: colors.textSecondary }]}>{notif.message}</Text>
                  <Text style={[styles.notifTime, { color: colors.textTertiary }]}>
                    {formatTime(notif.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800' },
  markAll: { fontSize: 14, fontWeight: '600' },
  unreadBanner: { marginHorizontal: 20, borderRadius: Radius.md, padding: 12, marginBottom: 8 },
  unreadText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  errorState: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  errorText: { fontSize: 14, textAlign: 'center' },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySubtitle: { fontSize: 14 },
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
