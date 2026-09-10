import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

let auth: ReturnType<typeof getAuth>
try {
    auth = getAuth(app)
} catch {
    // Fallback an toàn khi môi trường build chưa có biến môi trường Firebase
    auth = {} as ReturnType<typeof getAuth>
}

let db: ReturnType<typeof getFirestore>
try {
    // Trong môi trường Server-Side (Node.js / Vercel), Firebase web SDK dùng gRPC không tương thích
    // với experimentalAutoDetectLongPolling. Dùng experimentalForceLongPolling để dùng HTTP thay gRPC,
    // cũng giúp tránh AdBlocker / Brave Shields chặn WebChannel streaming trên client.
    db = initializeFirestore(app, {
        experimentalForceLongPolling: true
    })
} catch {
    db = getFirestore(app)
}

let storage: ReturnType<typeof getStorage>
try {
    storage = getStorage(app)
} catch {
    storage = {} as ReturnType<typeof getStorage>
}

export { app, auth, db, storage }
