# Solana Capacitor App

Next.js + Capacitor app with Phantom wallet integration for Web, Android, and iOS.
Uses Phantom deep links on mobile and browser wallet extensions on web.

---

## Prerequisites

* Node.js 18+
* Java 17+
* Android Studio / Xcode
* Android & iOS SDK

---

## Setup

```bash
git clone https://github.com/desocialapp/capacitor-solana-app
cd solana-capacitor-wallet
npm install
git init
```

> `git init` is required for the `stellar-sdk` postinstall script.

---

## Configuration

Update these values before building:

### `app/layout.tsx`

```tsx
<SolanaWalletProvider
  appUrl="https://your-domain.com"
  scheme="yourapp"
  cluster={WalletAdapterNetwork.Devnet}
  endpoint="https://your-rpc-url"
>
```

### `capacitor.config.ts`

```ts
appId: "com.yourcompany.yourapp",
appName: "Your App Name",
```

> The `scheme` value must match the AndroidManifest and iOS URL scheme configuration.

---

## Run on Web

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Connect using Phantom or Solflare browser extensions.

---

## Build Android / iOS

### 1. Build Web Assets

```bash
npm run build
```

### 2. Add Platforms (First Time Only)

```bash
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

### 3. Sync Capacitor

```bash
npx cap sync
```

### 4. Open Native Projects

```bash
npx cap open android
npx cap open ios
```

---

## Rebuild After Changes

```bash
npm run build
npx cap sync
```

Then reopen Android Studio or Xcode.

---

## Important

* Configure URL schemes correctly on both Android and iOS.
* Ensure the scheme matches across:

  * `layout.tsx`
  * `AndroidManifest.xml`
  * iOS URL Types (`Info.plist`)

---

## License

MIT License — Created by DeSocial

---

## Maintainer

Maintained by DeSocial
Contact: [desocialorg@gmail.com](mailto:desocialorg@gmail.com)
