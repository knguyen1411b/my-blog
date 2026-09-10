import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_API_KEY,
    authDomain:
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
        process.env.NEXT_PUBLIC_AUTH_DOMAIN ||
        (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_PROJECT_ID
            ? `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_PROJECT_ID}.firebaseapp.com`
            : undefined),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket:
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_PROJECT_ID
            ? `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_PROJECT_ID}.firebasestorage.app`
            : undefined),
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_APP_ID
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)

let db: ReturnType<typeof getFirestore>
try {
    // Kích hoạt experimentalAutoDetectLongPolling giúp tự động chuyển sang HTTP long polling
    // khi trình duyệt cài AdBlocker / Brave Shields chặn WebChannel stream (/Listen/channel)
    db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true
    })
} catch {
    db = getFirestore(app)
}

const storage = getStorage(app)

export { app, auth, db, storage }
