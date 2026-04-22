import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/theme';

const { width } = Dimensions.get('window');

const CARDS = [
  {
    id: 1, type: 'VISA', lastFour: '7891', holder: 'JOHN DOE',
    expMonth: 12, expYear: 27, status: 'ACTIVE', accountId: 1,
    accountName: 'Checking', bg1: '#12203A', bg2: '#1C2F4F',
  },
  {
    id: 2, type: 'MASTERCARD', lastFour: '4521', holder: 'JOHN DOE',
    expMonth: 6, expYear: 26, status: 'ACTIVE', accountId: 2,
    accountName: 'Savings', bg1: '#1a1a2e', bg2: '#16213e',
  },
];

function VirtualCard({ card, frozen }: { card: typeof CARDS[0]; frozen: boolean }) {
  return (
    <View style={[styles.virtualCard, { backgroundColor: card.bg1, opacity: frozen ? 0.7 : 1 }]}>
      {/* Decorative circles */}
      <View style={styles.cardCircle1} />
      <View style={styles.cardCircle2} />

      {/* Top row */}
      <View style={styles.cardTopRow}>
        <Text style={styles.cardBrand}>NextBank</Text>
        <Text style={styles.cardNetwork}>{card.type}</Text>
      </View>

      {/* Card number */}
      <Text style={styles.cardNumberLabel}>Card Number</Text>
      <Text style={styles.cardNumber}>
        {card.lastFour.slice(0, 2)}32  ••••  ••••  {card.lastFour}
      </Text>

      {/* Bottom row */}
      <View style={styles.cardBottomRow}>
        <View>
          <Text style={styles.cardMeta}>CARD HOLDER</Text>
          <Text style={styles.cardMetaVal}>{card.holder}</Text>
        </View>
        <View>
          <Text style={styles.cardMeta}>EXPIRES</Text>
          <Text style={styles.cardMetaVal}>{card.expMonth.toString().padStart(2, '0')}/{card.expYear}</Text>
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
  const [activeCard, setActiveCard] = useState(0);
  const [frozen, setFrozen] = useState(false);

  const card = CARDS[activeCard];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>My Cards</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {CARDS.length} active cards
          </Text>
        </View>

        {/* Card widget */}
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <VirtualCard card={card} frozen={frozen} />
        </View>

        {/* Pagination dots */}
        <View style={styles.dotsRow}>
          {CARDS.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => { setActiveCard(i); setFrozen(false); }}
              style={[
                styles.dot,
                {
                  backgroundColor: activeCard === i ? colors.accent : colors.border,
                  width: activeCard === i ? 22 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Action buttons — Show Details / Freeze / Settings */}
        <View style={[styles.actionsRow, { paddingHorizontal: 20 }]}>
          {[
            { icon: '👁', label: 'Show Details', onPress: () => {} },
            {
              icon: frozen ? '🔓' : '🔒',
              label: frozen ? 'Unfreeze' : 'Freeze',
              onPress: () => setFrozen(!frozen),
              accent: true,
            },
            { icon: '⚙', label: 'Settings', onPress: () => {} },
          ].map((btn, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: colors.border,
                },
              ]}
              onPress={btn.onPress}
              activeOpacity={0.85}
            >
              <Text style={[styles.actionIcon, { color: btn.accent ? colors.accent : colors.textSecondary }]}>
                {btn.icon}
              </Text>
              <Text style={[styles.actionLabel, { color: btn.accent ? colors.accent : colors.textSecondary }]}>
                {btn.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Details */}
        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <View style={[styles.detailCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            {[
              { label: 'Linked Account', value: card.accountName },
              { label: 'Card Type', value: card.type },
              { label: 'Status', value: frozen ? 'FROZEN' : 'ACTIVE', isStatus: true, frozen },
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

          {/* Request new card */}
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
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 2 },
  virtualCard: {
    borderRadius: Radius['2xl'],
    padding: 22,
    height: 200,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
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
    alignItems: 'center',
    justifyContent: 'center',
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
