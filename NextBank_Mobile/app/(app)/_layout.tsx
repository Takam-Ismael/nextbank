import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export default function AppLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.navBg,
          borderTopColor: colors.navBorder,
          borderTopWidth: 1,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 8),
        },
        tabBarActiveTintColor: colors.navActive,
        tabBarInactiveTintColor: colors.navInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts/index"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="money/transfer"
        options={{
          title: 'Transfer',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="transfer" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards/index"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color, size }) => (
            <Feather name="credit-card" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size ?? 22} color={color} />
          ),
        }}
      />
      {/* Hidden from tab bar */}
      <Tabs.Screen name="accounts/[id]" options={{ href: null }} />
      <Tabs.Screen name="accounts/open" options={{ href: null }} />
      <Tabs.Screen name="money/deposit" options={{ href: null }} />
      <Tabs.Screen name="money/withdraw" options={{ href: null }} />
      <Tabs.Screen name="money/transfer-confirm" options={{ href: null }} />
      <Tabs.Screen name="money/transfer-success" options={{ href: null }} />
      <Tabs.Screen name="cards/request" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
    </Tabs>
  );
}