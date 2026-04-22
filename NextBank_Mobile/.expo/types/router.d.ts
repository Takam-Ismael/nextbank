/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/accounts` | `/(app)/accounts/open` | `/(app)/cards` | `/(app)/cards/request` | `/(app)/dashboard` | `/(app)/money/deposit` | `/(app)/money/transfer` | `/(app)/money/transfer-confirm` | `/(app)/money/transfer-success` | `/(app)/money/withdraw` | `/(app)/notifications` | `/(app)/profile` | `/(auth)` | `/(auth)/login` | `/(auth)/otp` | `/(auth)/qr-scan` | `/_sitemap` | `/accounts` | `/accounts/open` | `/cards` | `/cards/request` | `/dashboard` | `/login` | `/money/deposit` | `/money/transfer` | `/money/transfer-confirm` | `/money/transfer-success` | `/money/withdraw` | `/notifications` | `/otp` | `/profile` | `/qr-scan`;
      DynamicRoutes: `/(app)/accounts/${Router.SingleRoutePart<T>}` | `/accounts/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(app)/accounts/[id]` | `/accounts/[id]`;
    }
  }
}
