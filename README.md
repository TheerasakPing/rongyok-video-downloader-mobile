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

---

## CI/CD (GitHub Actions)

The project uses GitHub Actions to automatically build Android APKs on release tags.

### Setup EAS Token

1. Login to EAS:
```bash
eas login
```

2. Get your EXPO_TOKEN:
```bash
eas whoami
```

3. Add EXPO_TOKEN to GitHub Secrets:
   - Go to: https://github.com/TheerasakPing/rongyok-video-downloader-mobile/settings/secrets/actions
   - Click "New repository secret"
   - Name: `EXPO_TOKEN`
   - Value: Your token from step 2

### Trigger Build

Push a new tag to trigger the CI/CD:

```bash
git tag v1.6.1
git push origin v1.6.1
```

This will:
1. Build Android APK via EAS
2. Upload APK to GitHub Actions artifacts
3. Create GitHub release with APK attached

### Manual Build

You can also trigger a build manually from GitHub:
1. Go to: https://github.com/TheerasakPing/rongyok-video-downloader-mobile/actions
2. Click "Build Android APK" workflow
3. Click "Run workflow" → "Run workflow"
