# 📦 Installation Instructions

## Required Packages

To complete the Farcaster Mini App and Wagmi integration, you need to install the following packages:

### Step 1: Install Farcaster Mini App SDK

```bash
npm install @farcaster/miniapp-sdk
```

**Purpose**: Enables integration with Farcaster's Mini App environment, providing access to user context, FID, and profile data.

---

### Step 2: Install Wagmi and Wallet Dependencies

```bash
npm install wagmi @farcaster/miniapp-wagmi-connector viem
```

**Packages:**
- `wagmi` - React hooks for Ethereum wallet management (Type-safe)
- `@farcaster/miniapp-wagmi-connector` - Connector to link Farcaster Mini App wallet
- `viem` - Low-level library for Ethereum interactions (used by Wagmi)

---

## What Each Package Does

### @farcaster/miniapp-sdk
- 🔐 Authenticates Farcaster users
- 📱 Provides user FID, username, profile picture
- ✅ Verifies user identity within Farcaster frame
- 🚀 Signals app readiness with `sdk.actions.ready()`

### wagmi
- 💼 Manages wallet connections
- 💰 Tracks wallet balance in real-time
- ⛓️ Handles chain switching (Base L2)
- 🔄 Provides React hooks for wallet state

### @farcaster/miniapp-wagmi-connector
- 🔗 Bridges Farcaster wallet to Wagmi
- 🤝 Enables seamless wallet connection within Mini App
- 🔒 Secure authentication without manual connection

### viem
- ⚡ Fast, lightweight Ethereum library
- 🔢 Formats values (e.g., `formatEther`)
- 📜 Interacts with smart contracts
- 🔧 Low-level transaction handling

---

## Installation Command (All at Once)

```bash
npm install @farcaster/miniapp-sdk wagmi @farcaster/miniapp-wagmi-connector viem
```

---

## Verification

After installation, verify the packages are installed:

```bash
npm list @farcaster/miniapp-sdk wagmi @farcaster/miniapp-wagmi-connector viem
```

Expected output:
```
├── @farcaster/miniapp-sdk@x.x.x
├── wagmi@x.x.x
├── @farcaster/miniapp-wagmi-connector@x.x.x
└── viem@x.x.x
```

---

## Files Already Updated

The following files have been created/updated to use these packages:

### Created Files:
- ✅ `/utils/wagmiConfig.ts` - Wagmi configuration
- ✅ `/components/WalletConnector.tsx` - Auto-connect component
- ✅ `/FARCASTER_WAGMI_INTEGRATION.md` - Integration guide

### Updated Files:
- ✅ `/App.tsx` - Added WagmiProvider and SDK initialization
- ✅ `/utils/farcaster.tsx` - Real SDK integration
- ✅ `/utils/wallet.tsx` - Wagmi hooks integration
- ✅ `/contexts/UserContext.tsx` - Already configured

---

## Testing the Integration

### 1. Check Console Logs
After installation and running the app, you should see:
```
✅ Farcaster Mini App SDK ready
✅ Farcaster user loaded: {...}
✅ Wallet connected via Wagmi: 0x...
```

### 2. Test in Farcaster Frame
The app is designed to work inside a Farcaster Mini App frame. To test:
1. Deploy to Vercel/hosting
2. Create a Farcaster frame pointing to your deployment
3. Open in Farcaster client

### 3. Development Mode
The app includes fallbacks for local development:
- Mock user data if SDK unavailable
- Mock wallet if connection fails
- Console warnings for debugging

---

## Next Steps After Installation

1. ✅ Run `npm install` to install packages
2. ✅ Restart development server
3. ✅ Test wallet auto-connection
4. ✅ Verify user data loads
5. 🚀 Deploy as Farcaster Mini App

---

## Troubleshooting

### Error: Module not found
**Solution**: Make sure all packages are installed:
```bash
npm install
```

### Error: SDK context unavailable
**Solution**: This is normal in development. The app falls back to mock data. Deploy to test real integration.

### Error: Wallet connection failed
**Solution**: Check console logs. In development, mock wallet is used. Real wallet works only in Farcaster frame.

---

## Support

- 📖 [Farcaster Mini App Docs](https://docs.farcaster.xyz/developers/miniapps)
- 📖 [Wagmi Documentation](https://wagmi.sh/)
- 💬 Issues? Check console logs for detailed error messages

---

**Status**: Ready to install! Just run the npm install command above. ✨
