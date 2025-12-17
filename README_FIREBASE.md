# Firebase Setup

1. Create a file named `.env.local` in the root directory.
2. Add the following environment variables with your Firebase project keys:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

3. Enable Authentication:
   - Go to the **Firebase Console** -> **Build** -> **Authentication**.
   - Click on the **Sign-in method** tab.
   - Click on **Email/Password**.
   - Enable **Email/Password** and click **Save**.
