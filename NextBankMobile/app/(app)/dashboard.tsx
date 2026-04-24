import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/hooks/useAuthStore';
import { SectionHeader } from '@/components/ui';
import { Radius } from '@/constants/theme';
import { accountsApi, notificationsApi } from '@/constants/api';

const { width } = Dimensions.get('window');

// Helper to get account style
const getAccountStyle = (type: string) => {
  switch (type) {
    case 'SAVINGS': return { initial: 'S', color: '#12203A', lightBg: '#E8EBF0' };
    case 'BUSINESS': return { initial: 'B', color: '#6B7280', lightBg: '#F3F4F6' };
    default: return { initial: 'C', color: '#F5A623', lightBg: '#FEF3D7' };
  }
};

const MOCK_TRANSACTIONS: any[] = [];

function formatAmount(n: number) {
  return Math.abs(n).toLocaleString('fr-CM').replace(/,/g, ' ') + ' XAF';
}

function QuickAction({
  icon,
  label,
  onPress,
  iconBg,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  iconBg: string;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.quickAction,
        {
          backgroundColor: colors.bgCard,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <Text style={[styles.quickActionLabel, { color: colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function TransactionItem({ item }: { item: typeof MOCK_TRANSACTIONS[0] }) {
  const { colors } = useTheme();
  const isIn = item.amount > 0;
  return (
    <View style={[styles.txItem, { borderBottomColor: colors.border }]}>
      <View
        style={[
          styles.txIcon,
          {
            backgroundColor: isIn ? colors.accentLight : '#F3F4F6',
          },
        ]}
      >
        <MaterialCommunityIcons
          name={isIn ? 'arrow-bottom-left' : 'arrow-top-right'}
          size={18}
          color={isIn ? colors.accent : colors.textSecondary}
        />
      </View>
      <View style={styles.txMeta}>
        <Text style={[styles.txName, { color: colors.textPrimary }]}>{item.name}</Text>
        <Text style={[styles.txDate, { color: colors.textTertiary }]}>{item.date}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.txAmount, { color: isIn ? colors.accent : colors.textPrimary }]}>
          {isIn ? '+' : '-'}{formatAmount(item.amount)}
        </Text>
        <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textTertiary, marginTop: 2 }}>
          {item.status}
        </Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUnreadCount();
    }, [])
  );

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationsApi.getMyNotifications();
      const notifs = res.data?.content || res.data || [];
      const unread = notifs.filter((n: any) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.log('Failed to fetch notifications count', err);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await accountsApi.getAccounts();
      setAccounts(res.data);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning,';
    if (h < 18) return 'Good afternoon,';
    return 'Good evening,';
  };

  const firstName = user?.fullName?.split(' ')[0] || 'John';

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting()}</Text>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>{firstName}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[
                styles.notifBtn,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => router.push('/(app)/notifications')}
            >
              <Feather name="bell" size={18} color={colors.textPrimary} />
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.avatarBtn, { backgroundColor: colors.navy }]}
              onPress={() => router.push('/(app)/profile')}
            >
              <Text style={styles.avatarText}>
                {(user?.fullName || 'JD').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balancePadding}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80' }}
            style={styles.balanceCard}
            imageStyle={styles.balanceCardImage}
          >
            {/* Dark overlay so text is always readable */}
            <LinearGradient
              colors={['rgba(10,22,45,0.82)', 'rgba(12,26,50,0.88)', 'rgba(8,16,35,0.92)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Top row */}
            <View style={styles.balanceTopRow}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setBalanceVisible(!balanceVisible)}
                activeOpacity={0.7}
              >
                <Feather
                  name={balanceVisible ? 'eye' : 'eye-off'}
                  size={15}
                  color="rgba(255,255,255,0.8)"
                />
              </TouchableOpacity>
            </View>

            {/* Amount */}
            <View style={styles.amountRow}>
              <Text style={styles.balanceAmount}>
                {balanceVisible
                  ? `${totalBalance.toLocaleString('fr-CM').replace(/,/g, ' ')} XAF`
                  : '••••••• XAF'}
              </Text>
              <View style={styles.amountAccent} />
            </View>

            {/* Account pills */}
            <View style={styles.accountPills}>
              {accounts.slice(0, 3).map((acct) => (
                <View key={acct.id} style={styles.accountPill}>
                  <Text style={styles.pillType}>{acct.type}</Text>
                  <Text style={styles.pillAmount}>
                    {balanceVisible
                      ? `${(acct.balance || 0).toLocaleString('fr-CM').replace(/,/g, ' ')} XAF`
                      : '•••••'}
                  </Text>
                </View>
              ))}
              {accounts.length === 0 && !loading && (
                 <View style={styles.accountPill}>
                    <Text style={styles.pillType}>NO ACCOUNTS</Text>
                    <Text style={styles.pillAmount}>0 XAF</Text>
                 </View>
              )}
            </View>
          </ImageBackground>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickAction
            icon={<MaterialCommunityIcons name="send" size={20} color="#F5A623" />}
            label="Transfer"
            iconBg="rgba(245, 166, 35, 0.15)"
            onPress={() => router.push('/(app)/money/transfer')}
          />
          <QuickAction
            icon={<MaterialCommunityIcons name="plus-circle" size={20} color="#12203A" />}
            label="Deposit"
            iconBg="rgba(18, 32, 58, 0.1)"
            onPress={() => router.push('/(app)/money/deposit')}
          />
          <QuickAction
            icon={<MaterialCommunityIcons name="wallet-outline" size={20} color="#F5A623" />}
            label="Withdraw"
            iconBg="rgba(245, 166, 35, 0.15)"
            onPress={() => router.push('/(app)/money/withdraw')}
          />
          <QuickAction
            icon={<MaterialCommunityIcons name="trending-up" size={20} color="#12203A" />}
            label="Activity"
            iconBg="rgba(18, 32, 58, 0.1)"
            onPress={() => {}}
          />
        </View>

        {/* My Accounts */}
        <View style={{ paddingHorizontal: 20 }}>
          <SectionHeader
            title="My Accounts"
            action="See all"
            onAction={() => router.push('/(app)/accounts')}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 4 }}
        >
          {accounts.map((acct) => {
            const style = getAccountStyle(acct.type);
            return (
              <TouchableOpacity
                key={acct.id}
                style={[
                  styles.acctCard,
                  {
                    backgroundColor: colors.bgCard,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: '/(app)/accounts/[id]', params: { id: acct.accountNumber } })}
              >
                <View style={styles.acctCardTop}>
                  <View style={[styles.acctInitial, { backgroundColor: style.lightBg }]}>
                    <Text style={[styles.acctInitialText, { color: style.color }]}>{style.initial}</Text>
                  </View>
                  <Text style={[styles.acctType, { color: colors.textSecondary }]}>{acct.type}</Text>
                </View>
                <Text style={[styles.acctBalance, { color: colors.textPrimary }]}>
                  {(acct.balance || 0).toLocaleString('fr-CM').replace(/,/g, ' ')} XAF
                </Text>
                <Text style={[styles.acctCode, { color: colors.textTertiary }]}>{acct.accountNumber}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Recent Activity */}
        <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
          <SectionHeader
            title="Recent Activity"
            action="View all"
            onAction={() => {}}
          />
          <View
            style={[
              styles.txList,
              {
                backgroundColor: colors.bgCard,
                borderColor: colors.border,
              },
            ]}
          >
            {MOCK_TRANSACTIONS.map((tx) => (
              <TransactionItem key={tx.id} item={tx} />
            ))}
            {MOCK_TRANSACTIONS.length === 0 && (
              <View style={{ padding: 30, alignItems: 'center' }}>
                <Text style={{ color: colors.textTertiary, fontSize: 13 }}>No recent activity</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: { fontSize: 14, fontWeight: '500' },
  userName: { fontSize: 22, fontWeight: '800', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  balancePadding: { paddingHorizontal: 20, marginBottom: 20 },
  balanceCard: {
    borderRadius: Radius['2xl'],
    padding: 22,
    overflow: 'hidden',
  },
  balanceCardImage: {
    borderRadius: Radius['2xl'],
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.65)', fontWeight: '500' },
  eyeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountRow: {
    marginBottom: 20,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  amountAccent: {
    width: 40,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#F5A623',
  },
  accountPills: { flexDirection: 'row', gap: 8 },
  accountPill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pillType: { fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 5 },
  pillAmount: { fontSize: 11, color: '#FFFFFF', fontWeight: '700' },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 8,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: { fontSize: 12, fontWeight: '600' },
  acctCard: {
    width: width * 0.42,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: 14,
  },
  acctCardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  acctInitial: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acctInitialText: { fontSize: 13, fontWeight: '800' },
  acctType: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  acctBalance: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  acctCode: { fontSize: 10, fontWeight: '500' },
  txList: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  txMeta: { flex: 1 },
  txName: { fontSize: 14, fontWeight: '600' },
  txDate: { fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '700' },
});
