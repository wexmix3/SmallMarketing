# AI Customer Service Assistant Mobile App

This is the mobile application for business owners to manage their AI Customer Service Assistant.

## Features

- Real-time conversation monitoring
- Push notifications for important customer interactions
- Quick responses to customer inquiries
- Analytics dashboard
- Knowledge base management
- Integration management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- React Native development environment
- iOS: XCode and CocoaPods
- Android: Android Studio and JDK

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd mobile-app
npm install
```

3. Install iOS dependencies:

```bash
cd ios
pod install
cd ..
```

4. Start the development server:

```bash
npm start
```

5. Run on iOS:

```bash
npm run ios
```

6. Run on Android:

```bash
npm run android
```

## Project Structure

```
mobile-app/
├── android/            # Android native code
├── ios/                # iOS native code
├── src/
│   ├── api/            # API services
│   ├── assets/         # Static assets
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # App screens
│   ├── services/       # Business logic services
│   ├── store/          # State management
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── App.tsx             # App entry point
├── index.js            # React Native entry point
└── package.json        # Dependencies
```

## Development

### Code Style

This project uses ESLint and Prettier for code formatting. Run linting with:

```bash
npm run lint
```

### Testing

Run tests with:

```bash
npm test
```

### Building for Production

#### iOS

```bash
npm run build:ios
```

#### Android

```bash
npm run build:android
```

## Push Notifications

This app uses Firebase Cloud Messaging (FCM) for push notifications. To set up:

1. Create a Firebase project
2. Add your iOS and Android apps to the project
3. Download the configuration files:
   - `GoogleService-Info.plist` for iOS
   - `google-services.json` for Android
4. Place these files in their respective directories:
   - iOS: `/ios/[ProjectName]/GoogleService-Info.plist`
   - Android: `/android/app/google-services.json`

## API Integration

The mobile app connects to the same API as the web application. Configure the API endpoint in `.env`:

```
API_URL=https://your-api-url.com/api
```

## Authentication

The app uses JWT authentication. Users can log in with the same credentials as the web application.
