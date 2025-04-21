# AI Customer Service Assistant Mobile App Setup

This document provides detailed instructions for setting up and running the AI Customer Service Assistant mobile app.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js 18+ and npm
- React Native development environment
  - For iOS: XCode and CocoaPods
  - For Android: Android Studio, JDK, and Android SDK
- Firebase account (for push notifications)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/ai-customer-service.git
cd ai-customer-service/mobile-app
```

2. Install dependencies:

```bash
npm install
```

3. Install iOS dependencies (if developing for iOS):

```bash
cd ios
pod install
cd ..
```

## Configuration

1. Create a Firebase project:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Add iOS and Android apps to your project
   - Download the configuration files:
     - `GoogleService-Info.plist` for iOS
     - `google-services.json` for Android

2. Place the Firebase configuration files in their respective directories:
   - iOS: `ios/AiCustomerServiceMobile/GoogleService-Info.plist`
   - Android: `android/app/google-services.json`

3. Configure environment variables:
   - Copy the `.env.example` file to `.env`
   - Update the values in `.env` with your API URL and Firebase configuration

```
API_URL=https://your-api-url.com/api
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id
FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
```

## Running the App

### Development

1. Start the Metro bundler:

```bash
npm start
```

2. Run on iOS:

```bash
npm run ios
```

3. Run on Android:

```bash
npm run android
```

### Production Build

#### iOS

1. Configure the app for release:
   - Update the bundle identifier in XCode
   - Configure signing certificates
   - Update version and build numbers

2. Build the app:

```bash
npm run build:ios
```

3. Archive and upload to App Store Connect using XCode.

#### Android

1. Configure the app for release:
   - Update the package name in `android/app/build.gradle`
   - Configure signing keys
   - Update version code and name

2. Build the app:

```bash
npm run build:android
```

3. The APK will be generated at `android/app/build/outputs/apk/release/app-release.apk`.

## Troubleshooting

### Common Issues

1. **Metro bundler fails to start**
   - Clear the cache: `npm start -- --reset-cache`

2. **iOS build fails**
   - Make sure CocoaPods is installed: `gem install cocoapods`
   - Reinstall pods: `cd ios && pod install && cd ..`

3. **Android build fails**
   - Make sure JAVA_HOME is set correctly
   - Check that Android SDK is properly configured
   - Update Gradle if needed

4. **Push notifications not working**
   - Verify Firebase configuration
   - Check that the device token is being sent to the backend
   - Ensure the backend is correctly configured to send notifications

### Getting Help

If you encounter issues not covered here, please:

1. Check the React Native documentation
2. Search for the error message in the React Native GitHub issues
3. Contact the development team for support

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/introduction/getting-started)
