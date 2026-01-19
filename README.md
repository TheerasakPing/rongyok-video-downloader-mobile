# Rongyok Video Downloader - Mobile

Expo SDK 52 mobile app with pause/resume video downloads.

## Features

- ⏸️ **Pause** downloads
- ▶️ **Resume** downloads
- ✕ **Cancel** downloads (deletes partial file)
- 🔄 **Auto-resume** on app restart
- 📱 **NativeWind** styling (Tailwind CSS)
- 📦 **Android APK** output

## Setup

```bash
cd ~/rongyok-mobile
npm install
```

## Development

```bash
# Start Expo dev server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator
npm run ios
```

## Build Android APK

```bash
# Login to EAS
eas login

# Configure project
eas build:configure

# Build APK (preview)
eas build --platform android --profile preview

# Build APK (production)
eas build --platform android --profile production
```

## Project Structure

```
rongyok-mobile/
├── app/
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Home screen
├── components/              # Reusable components
├── hooks/
│   └── useVideoDownloader.ts  # Download hook
├── stores/
│   └── downloadStore.ts     # Zustand store
├── assets/                  # Images, fonts
├── app.json                 # App config
├── eas.json                 # EAS build config
└── tailwind.config.js       # NativeWind config
```

## Tech Stack

- **Framework**: Expo SDK 54
- **Routing**: Expo Router v6
- **Styling**: NativeWind v4
- **State**: Zustand
- **Downloads**: expo-file-system (resumable)
- **Storage**: AsyncStorage
- **Notifications**: expo-notifications

## Version

1.6.0 - Initial mobile release
