import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/hooks/useAuthStore';
import { SectionHeader } from '@/components/ui';
import { Radius } from '@/constants/theme';

const { width } = Dimensions.get('window');

// Mock data
const MOCK_ACCOUNTS = [
  { id: 1, type: 'CHECKING', label: 'CHECKING', code: '0001-CHK', balance: 2847350, initial: 'C', color: '#F5A623', lightBg: '#FEF3D7' },
  { id: 2, type: 'SAVINGS', label: 'SAVINGS', code: '0002-SAV', balance: 5120000, initial: 'S', color: '#12203A', lightBg: '#E8EBF0' },
  { id: 3, type: 'BUSINESS', label: 'BUSINESS', code: '0003-BIZ', balance: 12500000, initial: 'B', color: '#6B7280', lightBg: '#F3F4F6' },
];

const MOCK_TRANSACTIONS = [
  { id: 1, name: 'Payment from Alice Mbeki', date: 'Apr 11', amount: 150000, type: 'in', status: 'COMPLETED' },
  { id: 2, name: 'Orange Money Withdrawal', date: 'Apr 11', amount: -50000, type: 'out', status: 'COMPLETED' },
  { id: 3, name: 'Stripe Deposit', date: 'Apr 10', amount: 500000, type: 'in', status: 'COMPLETED' },
  { id: 4, name: 'Transfer to Bob Njoh', date: 'Apr 10', amount: -75000, type: 'out', status: 'COMPLETED' },
  { id: 5, name: 'Salary deposit', date: 'Apr 9', amount: 200000, type: 'in', status: 'COMPLETED' },
];

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

  const totalBalance = MOCK_ACCOUNTS.reduce((s, a) => s + a.balance, 0);

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
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>5</Text>
              </View>
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
              {MOCK_ACCOUNTS.map((acct) => (
                <View key={acct.id} style={styles.accountPill}>
                  <Text style={styles.pillType}>{acct.label}</Text>
                  <Text style={styles.pillAmount}>
                    {balanceVisible
                      ? `${acct.balance.toLocaleString('fr-CM').replace(/,/g, ' ')} XAF`
                      : '•••••'}
                  </Text>
                </View>
              ))}
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
          {MOCK_ACCOUNTS.map((acct) => (
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
              onPress={() => router.push({ pathname: '/(app)/accounts/[id]', params: { id: acct.id } })}
            >
              <View style={styles.acctCardTop}>
                <View style={[styles.acctInitial, { backgroundColor: acct.lightBg }]}>
                  <Text style={[styles.acctInitialText, { color: acct.color }]}>{acct.initial}</Text>
                </View>
                <Text style={[styles.acctType, { color: colors.textSecondary }]}>{acct.label}</Text>
              </View>
              <Text style={[styles.acctBalance, { color: colors.textPrimary }]}>
                {acct.balance.toLocaleString('fr-CM').replace(/,/g, ' ')} XAF
              </Text>
              <Text style={[styles.acctCode, { color: colors.textTertiary }]}>{acct.code}</Text>
            </TouchableOpacity>
          ))}
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
