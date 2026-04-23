import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/hooks/useAuthStore';
import { authApi } from '@/constants/api';
import { Radius } from '@/constants/theme';

const { height } = Dimensions.get('window');
const OTP_LENGTH = 6;
const HERO_IMAGE = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80';

export default function OtpScreen() {
  const router = useRouter();
  const { fullName, identifier } = useLocalSearchParams<{ fullName: string; identifier: string }>();
  const { colors } = useTheme();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(296); // 4:56
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleChange = (val: string, index: number) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
    if (newOtp.every((d) => d) && index === OTP_LENGTH - 1) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    try {
      // Real API Call
      const res = await authApi.verifyOtp(identifier, code);
      // Backend returns flat: { token, id, fullName, phoneNumber, role }
      const user = {
        id: res.data.id,
        fullName: res.data.fullName,
        email: '',
        phone: res.data.phoneNumber,
        nationalId: '',
      };
      setAuth(res.data.token, user);

      router.replace('/(app)/dashboard');
    } catch (err: any) {
      Alert.alert('Invalid OTP', 'The code you entered is incorrect or has expired.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
      setActiveIndex(0);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(300);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputs.current[0]?.focus();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {/* Hero */}
      <ImageBackground
        source={{ uri: HERO_IMAGE }}
        style={styles.heroSection}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.15)', 'rgba(5,15,30,0.75)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.brandContainer}>
          <View style={styles.logoMark}>
            <Text style={styles.logoLetter}>N</Text>
          </View>
          <Text style={styles.brandName}>NextBank</Text>
          <Text style={styles.brandTagline}>Your future, secured.</Text>
        </View>
      </ImageBackground>

      {/* Sheet */}
      <View style={[styles.sheet, { backgroundColor: colors.bgCard }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
          <Feather name="chevron-left" size={18} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.textPrimary }]}>Enter OTP</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          We sent a 6-digit code to your phone ending in ***{identifier?.slice(-3)}
        </Text>

        {/* OTP boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => { inputs.current[i] = r; }}
              style={[
                styles.otpBox,
                {
                  backgroundColor: colors.bgInput,
                  borderColor: activeIndex === i ? colors.accent : colors.border,
                  color: colors.textPrimary,
                },
              ]}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              onFocus={() => setActiveIndex(i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              caretHidden
            />
          ))}
        </View>

        {/* Timer + Resend */}
        <View style={styles.timerRow}>
          <Text style={[styles.timerText, { color: colors.textSecondary }]}>
            Expires in{' '}
            <Text style={{ fontWeight: '700', color: colors.textPrimary }}>
              {formatTime(timer)}
            </Text>
          </Text>
        </View>

        {timer === 0 ? (
          <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
            <Text style={[styles.resendText, { color: colors.accent }]}>Resend Code</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.resendBtn}>
            <Text style={[styles.resendText, { color: colors.accent }]}>Resend Code</Text>
          </TouchableOpacity>
        )}

        <View style={styles.secureRow}>
          <Feather name="shield" size={13} color={colors.textTertiary} />
          <Text style={[styles.secureText, { color: colors.textTertiary }]}>Secured by NextBank</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  heroSection: {
    height: height * 0.36,
    justifyContent: 'flex-end',
  },
  brandContainer: {
    alignItems: 'center',
    paddingBottom: 40,
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
  brandName: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  brandTagline: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    marginTop: -24,
  },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  backText: { fontSize: 15, fontWeight: '500' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 21, marginBottom: 28 },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 24,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 22,
    fontWeight: '700',
  },
  timerRow: { alignItems: 'center', marginBottom: 12 },
  timerText: { fontSize: 14 },
  resendBtn: { alignItems: 'center', marginBottom: 32 },
  resendText: { fontSize: 15, fontWeight: '600' },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 'auto',
  },
  secureText: { fontSize: 12 },
});
