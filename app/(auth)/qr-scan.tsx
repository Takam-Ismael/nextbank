import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Radius, Typography } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function QrScanScreen() {
  const router = useRouter();
  const { fullName } = useLocalSearchParams<{ fullName: string }>();
  const { colors } = useTheme();
  const [mode, setMode] = useState<'scan' | 'upload'>('scan');

  const handleScanQR = () => {
    // In production: open camera + barcode scanner
    // For demo, simulate success
    router.push({ pathname: '/(auth)/otp', params: { fullName, userId: '42' } });
  };

  const handleUpload = () => {
    // In production: open image picker + decode QR
    router.push({ pathname: '/(auth)/otp', params: { fullName, userId: '42' } });
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {/* Hero — same as login */}
      <View style={styles.heroSection}>
        <View style={[styles.heroBg, { backgroundColor: '#1A0E05' }]} />
        <View style={styles.heroGlow} />
        <View style={styles.buildingsContainer}>
          {[
            { left: 20, h: 120, w: 48 },
            { left: 55, h: 170, w: 58 },
            { left: 100, h: 140, w: 44 },
            { left: 135, h: 200, w: 68 },
            { left: 195, h: 160, w: 52 },
            { left: 240, h: 185, w: 62 },
            { left: 295, h: 130, w: 48 },
          ].map((b, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                bottom: 0,
                left: b.left,
                width: b.w,
                height: b.h,
                backgroundColor: i === 3 ? '#1C2B45' : '#0D1520',
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
              }}
            />
          ))}
        </View>
        <View style={styles.brandContainer}>
          <View style={styles.logoMark}>
            <Text style={styles.logoLetter}>N</Text>
          </View>
          <Text style={styles.brandName}>NextBank</Text>
          <Text style={styles.brandTagline}>Your future, secured.</Text>
        </View>
      </View>

      {/* Sheet */}
      <View style={[styles.sheet, { backgroundColor: colors.bgCard }]}>
        {/* Back */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backRow}
        >
          <Text style={[styles.backIcon, { color: colors.textSecondary }]}>‹</Text>
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Scan your QR code
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Use the QR code provided by your branch to verify identity.
        </Text>

        {/* QR Viewfinder */}
        <View style={[styles.qrFrame, { borderColor: colors.border, backgroundColor: colors.bgCardAlt }]}>
          {/* Corner brackets — amber from design */}
          {[
            { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
            { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
            { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
            { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
          ].map((corner, i) => (
            <View
              key={i}
              style={[styles.corner, corner, { borderColor: colors.accent }]}
            />
          ))}

          {/* QR icon */}
          <View style={styles.qrIconContainer}>
            {/* Simple QR grid mockup */}
            <View style={styles.qrGrid}>
              {/* Top-left module */}
              <View style={[styles.qrModule, { borderColor: colors.textTertiary }]}>
                <View style={[styles.qrModuleInner, { backgroundColor: colors.textTertiary }]} />
              </View>
              <View style={[styles.qrModuleSmall, { backgroundColor: colors.textTertiary }]} />
              {/* Top-right module */}
              <View style={[styles.qrModule, { borderColor: colors.textTertiary }]}>
                <View style={[styles.qrModuleInner, { backgroundColor: colors.textTertiary }]} />
              </View>
            </View>
            <View style={[styles.qrDots, { backgroundColor: colors.textTertiary }]} />
            {/* Bottom-left module */}
            <View style={styles.qrGrid}>
              <View style={[styles.qrModule, { borderColor: colors.textTertiary }]}>
                <View style={[styles.qrModuleInner, { backgroundColor: colors.textTertiary }]} />
              </View>
              <View style={[styles.qrModuleSmall, { backgroundColor: colors.textTertiary }]} />
              <View style={[styles.qrModuleSmall, { backgroundColor: colors.textTertiary, opacity: 0 }]} />
            </View>
            <Text style={[styles.positionText, { color: colors.textTertiary }]}>
              Position QR here
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.scanBtn, { backgroundColor: colors.accent }]}
            onPress={handleScanQR}
            activeOpacity={0.85}
          >
            <Text style={styles.scanBtnIcon}>⊞</Text>
            <Text style={styles.scanBtnText}>Scan QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.uploadBtn, { backgroundColor: colors.bgCardAlt, borderColor: colors.border }]}
            onPress={handleUpload}
            activeOpacity={0.85}
          >
            <Text style={[styles.uploadBtnIcon, { color: colors.textSecondary }]}>↑</Text>
            <Text style={[styles.uploadBtnText, { color: colors.textPrimary }]}>Upload</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secureRow}>
          <View style={[styles.shieldDot, { borderColor: colors.textTertiary }]} />
          <Text style={[styles.secureText, { color: colors.textTertiary }]}>
            End-to-end encrypted verification
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  heroSection: {
    height: height * 0.35,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBg: { ...StyleSheet.absoluteFillObject },
  heroGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#8B4A10',
    opacity: 0.45,
  },
  buildingsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  brandContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoLetter: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0D1117',
    fontStyle: 'italic',
  },
  brandName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    marginTop: -24,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
  },
  backIcon: { fontSize: 22, fontWeight: '300' },
  backText: { fontSize: 15, fontWeight: '500' },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },
  qrFrame: {
    height: 200,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 3,
  },
  qrIconContainer: {
    alignItems: 'center',
  },
  qrGrid: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 6,
  },
  qrModule: {
    width: 22,
    height: 22,
    borderRadius: 3,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrModuleInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  qrModuleSmall: {
    width: 8,
    height: 8,
    borderRadius: 1,
    opacity: 0.4,
  },
  qrDots: {
    width: 52,
    height: 4,
    borderRadius: 2,
    opacity: 0.2,
    marginBottom: 6,
  },
  positionText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  scanBtn: {
    flex: 1,
    height: 52,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanBtnIcon: { fontSize: 18, color: '#FFFFFF' },
  scanBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  uploadBtn: {
    flex: 1,
    height: 52,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadBtnIcon: { fontSize: 18 },
  uploadBtnText: { fontSize: 15, fontWeight: '600' },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shieldDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },
  secureText: { fontSize: 12 },
});
