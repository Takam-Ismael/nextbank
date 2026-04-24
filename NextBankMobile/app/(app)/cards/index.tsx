import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';
import { cardsApi } from '@/constants/api';

interface Card {
  id: number;
  userId: number;
  accountId: number;
  accountNumber: string;
  cardLastFour: string;
  cardType: 'VISA' | 'MASTERCARD';
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  status: 'ACTIVE' | 'FROZEN';
  createdAt: string;
}

const CARD_GRADIENTS: Record<string, [string, string]> = {
  VISA:       ['#12203A', '#1C2F4F'],
  MASTERCARD: ['#1a1a2e', '#16213e'],
};

function VirtualCard({ card }: { card: Card }) {
  const frozen = card.status === 'FROZEN';
  const [bg1, bg2] = CARD_GRADIENTS[card.cardType] ?? ['#12203A', '#1C2F4F'];

  return (
    <View style={[styles.virtualCard, { backgroundColor: bg1, opacity: frozen ? 0.75 : 1 }]}>
      <View style={styles.cardCircle1} />
      <View style={styles.cardCircle2} />

      <View style={styles.cardTopRow}>
        <Text style={styles.cardBrand}>NextBank</Text>
        <Text style={styles.cardNetwork}>{card.cardType}</Text>
      </View>

      <Text style={styles.cardNumberLabel}>Card Number</Text>
      <Text style={styles.cardNumber}>••••  ••••  ••••  {card.cardLastFour}</Text>

      <View style={styles.cardBottomRow}>
        <View>
          <Text style={styles.cardMeta}>CARD HOLDER</Text>
          <Text style={styles.cardMetaVal}>{card.cardholderName}</Text>
        </View>
        <View>
          <Text style={styles.cardMeta}>EXPIRES</Text>
          <Text style={styles.cardMetaVal}>
            {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
          </Text>
        </View>
        <View>
          <Text style={styles.cardMeta}>CVV</Text>
          <Text style={styles.cardMetaVal}>•••</Text>
        </View>
      </View>

      {frozen && (
        <View style={styles.frozenOverlay}>
          <Text style={styles.frozenText}>❄ FROZEN</Text>
        </View>
      )}
    </View>
  );
}

export default function CardsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchCards = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await cardsApi.getMyCards();
      setCards(res.data ?? []);
      setActiveIndex(0);
    } catch (e: any) {
      setError('Could not load cards. Check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCards();
    }, [fetchCards])
  );

  const onRefresh = () => { setRefreshing(true); fetchCards(true); };

  const handleToggleFreeze = async (card: Card) => {
    const action = card.status === 'ACTIVE' ? 'freeze' : 'unfreeze';
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Card`,
      `Are you sure you want to ${action} your card ending in ${card.cardLastFour}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: action === 'freeze' ? 'destructive' : 'default',
          onPress: async () => {
            setTogglingId(card.id);
            try {
              const res = await cardsApi.freezeCard(card.id);
              setCards(prev => prev.map(c => c.id === res.data.id ? res.data : c));
            } catch {
              Alert.alert('Error', `Failed to ${action} card. Please try again.`);
            } finally {
              setTogglingId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading cards...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.accent }]} onPress={() => fetchCards()}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const activeCard = cards[activeIndex];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>My Cards</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {cards.length} card{cards.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {cards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💳</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Cards Yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Request your first bank card below
            </Text>
          </View>
        ) : (
          <>
            {/* Card widget */}
            <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
              <VirtualCard card={activeCard} />
            </View>

            {/* Pagination dots */}
            {cards.length > 1 && (
              <View style={styles.dotsRow}>
                {cards.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setActiveIndex(i)}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: activeIndex === i ? colors.accent : colors.border,
                        width: activeIndex === i ? 22 : 8,
                      },
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Action buttons */}
            <View style={[styles.actionsRow, { paddingHorizontal: 20 }]}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
                onPress={() => router.push(`/(app)/cards/${activeCard.id}` as any)}
                activeOpacity={0.85}
              >
                <Text style={[styles.actionIcon, { color: colors.textSecondary }]}>👁</Text>
                <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>Details</Text>
              </TouchableOpacity>

              {/* 
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
                onPress={() => handleToggleFreeze(activeCard)}
                disabled={togglingId === activeCard.id}
                activeOpacity={0.85}
              >
                {togglingId === activeCard.id ? (
                  <ActivityIndicator size="small" color={colors.accent} />
                ) : (
                  <Text style={[styles.actionIcon, { color: colors.accent }]}>
                    {activeCard.status === 'FROZEN' ? '🔓' : '🔒'}
                  </Text>
                )}
                <Text style={[styles.actionLabel, { color: colors.accent }]}>
                  {activeCard.status === 'FROZEN' ? 'Unfreeze' : 'Freeze'}
                </Text>
              </TouchableOpacity>
              */}

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
                onPress={() => router.push('/(app)/cards/request')}
                activeOpacity={0.85}
              >
                <Text style={[styles.actionIcon, { color: colors.textSecondary }]}>➕</Text>
                <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>New Card</Text>
              </TouchableOpacity>
            </View>

            {/* Details */}
            <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
              <View style={[styles.detailCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                {[
                  { label: 'Account Number', value: activeCard.accountNumber },
                  { label: 'Card Network',   value: activeCard.cardType },
                  { label: 'Card ID',        value: `#${activeCard.id}` },
                  {
                    label: 'Status',
                    value: activeCard.status,
                    isStatus: true,
                    frozen: activeCard.status === 'FROZEN',
                  },
                ].map((row, i, arr) => (
                  <View key={i}>
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: colors.accent }]}>{row.label}</Text>
                      <Text style={[
                        styles.detailValue,
                        {
                          color: row.isStatus
                            ? (row.frozen ? '#EF4444' : '#22C55E')
                            : colors.textPrimary,
                          fontWeight: row.isStatus ? '700' : '600',
                        },
                      ]}>
                        {row.value}
                      </Text>
                    </View>
                    {i < arr.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Request new card */}
        <View style={{ paddingHorizontal: 20, marginTop: cards.length === 0 ? 16 : 0 }}>
          <TouchableOpacity
            style={[styles.requestBtn, { borderColor: colors.border }]}
            onPress={() => router.push('/(app)/cards/request')}
            activeOpacity={0.85}
          >
            <Text style={[styles.requestBtnText, { color: colors.textSecondary }]}>+ Request New Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
  loadingText: { fontSize: 14, marginTop: 8 },
  errorEmoji: { fontSize: 40 },
  errorText: { fontSize: 14, textAlign: 'center' },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, marginTop: 8 },
  retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 2 },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
  virtualCard: {
    borderRadius: Radius['2xl'], padding: 22, height: 200,
    overflow: 'hidden', position: 'relative', justifyContent: 'space-between',
  },
  cardCircle1: {
    position: 'absolute', right: -30, top: -30,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cardCircle2: {
    position: 'absolute', right: 20, bottom: -40,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBrand: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  cardNetwork: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  cardNumberLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  cardNumber: { fontSize: 17, color: '#FFFFFF', letterSpacing: 2.5, fontWeight: '600' },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardMeta: { fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  cardMetaVal: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius['2xl'],
  },
  frozenText: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 16 },
  dot: { height: 8, borderRadius: 4 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, borderRadius: Radius.lg, borderWidth: 1,
    paddingVertical: 14, alignItems: 'center', gap: 8,
  },
  actionIcon: { fontSize: 22 },
  actionLabel: { fontSize: 12, fontWeight: '600' },
  detailCard: { borderRadius: Radius.lg, borderWidth: 1, padding: 16, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  detailLabel: { fontSize: 14, fontWeight: '500' },
  detailValue: { fontSize: 14 },
  divider: { height: 1 },
  requestBtn: {
    height: 52, borderRadius: Radius.lg, borderWidth: 1.5,
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  requestBtnText: { fontSize: 15, fontWeight: '600' },
});
