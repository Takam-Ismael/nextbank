import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/hooks/useAuthStore';
import { authApi } from '@/constants/api';
import { Radius } from '@/constants/theme';

const { height } = Dimensions.get('window');

const HERO_IMAGE = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [fullName, setFullName] = useState('');
  const [nameError, setNameError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleScanQR = async () => {
    if (!fullName.trim()) {
      setNameError('Please enter your full name first.');
      return;
    }
    setNameError('');
    setLoading(true);
    try {
      // Real API Call: Using demo QR code
      const qrCode = "demo_qr_123"; 
      const response = await authApi.login(fullName.trim(), qrCode);
      
      // The backend sends OTP to the user's phone number.
      // We pass the demo phone number to the OTP screen for verification.
      // In production, this would come from the API response.
      const phoneNumber = "+237693671898"; // Demo user's real phone
      router.push({ pathname: '/(auth)/otp', params: { fullName: fullName.trim(), identifier: phoneNumber } });
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'We couldn\'t find a match for that name and QR code.';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    // "Upload" does the same thing as "Scan QR" — just a different UI entry point
    await handleScanQR();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bg }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <ImageBackground
          source={{ uri: HERO_IMAGE }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'rgba(5,15,30,0.75)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.brand}>
            <View style={styles.logoMark}>
              <Text style={styles.logoLetter}>N</Text>
            </View>
            <Text style={styles.brandName}>NextBank</Text>
            <Text style={styles.brandTagline}>Your future, secured.</Text>
          </View>
        </ImageBackground>

        {/* ── Sheet ── */}
        <View style={[styles.sheet, { backgroundColor: colors.bgCard }]}>

          {/* — Name section — */}
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Welcome back</Text>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            Enter your full name as registered with NextBank.
          </Text>

          <View style={[
            styles.inputWrapper,
            { backgroundColor: colors.bgInput, borderColor: nameError ? colors.danger : colors.border },
          ]}>
            <Feather name="user" size={18} color={colors.textTertiary} />
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="Full Name"
              placeholderTextColor={colors.textTertiary}
              value={fullName}
              onChangeText={(t) => { setFullName(t); setNameError(''); }}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>
          {nameError ? (
            <Text style={[styles.errorText, { color: colors.danger }]}>{nameError}</Text>
          ) : null}

          {/* — Divider — */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerLabel, { color: colors.textTertiary }]}>or verify with QR</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* — QR section — */}
          <Text style={[styles.qrTitle, { color: colors.textPrimary }]}>Scan your QR code</Text>
          <Text style={[styles.qrSub, { color: colors.textSecondary }]}>
            Use the QR code provided by your branch to verify identity.
          </Text>

          {/* QR Viewfinder */}
          <View style={[styles.qrFrame, { backgroundColor: colors.bgCardAlt, borderColor: colors.border }]}>
            {/* Amber corner brackets */}
            <View style={[styles.corner, styles.cornerTL, { borderColor: colors.accent }]} />
            <View style={[styles.corner, styles.cornerTR, { borderColor: colors.accent }]} />
            <View style={[styles.corner, styles.cornerBL, { borderColor: colors.accent }]} />
            <View style={[styles.corner, styles.cornerBR, { borderColor: colors.accent }]} />
            {/* QR icon placeholder */}
            <MaterialCommunityIcons name="qrcode-scan" size={48} color={colors.textTertiary} />
            <Text style={[styles.qrHint, { color: colors.textTertiary }]}>Position QR here</Text>
          </View>

          {/* Scan / Upload buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.scanBtn, { backgroundColor: colors.accent }]}
              onPress={handleScanQR}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="qrcode-scan" size={18} color="#fff" />
              <Text style={styles.scanBtnText}>Scan QR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.uploadBtn, { backgroundColor: colors.bgCardAlt, borderColor: colors.border }]}
              onPress={handleUpload}
              activeOpacity={0.85}
            >
              <Feather name="upload" size={16} color={colors.textPrimary} />
              <Text style={[styles.uploadBtnText, { color: colors.textPrimary }]}>Upload</Text>
            </TouchableOpacity>
          </View>

          {/* Trust badges */}
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Feather name="lock" size={13} color={colors.textTertiary} />
              <Text style={[styles.trustText, { color: colors.textTertiary }]}>256-bit encrypted</Text>
            </View>
            <View style={styles.trustItem}>
              <MaterialCommunityIcons name="fingerprint" size={14} color={colors.textTertiary} />
              <Text style={[styles.trustText, { color: colors.textTertiary }]}>Biometric ready</Text>
            </View>
          </View>

          <View style={styles.secureRow}>
            <Feather name="shield" size={13} color={colors.textTertiary} />
            <Text style={[styles.secureText, { color: colors.textTertiary }]}>
              End-to-end encrypted verification
            </Text>
          </View>

          <Text style={[styles.noAccount, { color: colors.textTertiary }]}>
            No account?{' '}
            <Text style={{ color: colors.accent, fontWeight: '600' }}>
              Visit your nearest branch
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: height * 0.36,
    justifyContent: 'flex-end',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  brand: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoLetter: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0D1117',
    fontStyle: 'italic',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  sectionSub: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 54,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  qrTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  qrSub: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  qrFrame: {
    height: 180,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
    gap: 8,
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderWidth: 3,
    borderRadius: 4,
  },
  cornerTL: { top: 10, left: 10, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 10, right: 10, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 10, left: 10, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 10, right: 10, borderLeftWidth: 0, borderTopWidth: 0 },
  qrHint: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
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
  uploadBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 14,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trustText: {
    fontSize: 12,
    fontWeight: '500',
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  secureText: {
    fontSize: 12,
  },
  noAccount: {
    textAlign: 'center',
    fontSize: 13,
  },
});
