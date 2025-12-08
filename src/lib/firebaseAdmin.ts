import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App | undefined;
let db: Firestore | undefined;

export function getFirebaseAdmin(): { app: App; db: Firestore } {
  if (app && db) {
    return { app, db };
  }

  // Check if already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    db = getFirestore(app);
    return { app, db };
  }

  // Initialize Firebase Admin
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  // Check if Firebase is configured
  if (!serviceAccount || 
      serviceAccount === "PASTE_YOUR_JSON_KEY_HERE" || 
      serviceAccount.trim() === "" ||
      !serviceAccount.startsWith("{")) {
    const error = new Error("FIREBASE_SERVICE_ACCOUNT_KEY not configured");
    (error as any).isFirebaseConfigError = true;
    throw error;
  }
  
  // Check if it's a temporary/invalid config
  if (serviceAccount.includes('"project_id":"temp"') || 
      serviceAccount.includes('"private_key":"-----BEGIN PRIVATE KEY-----\\ntemp')) {
    const error = new Error("FIREBASE_SERVICE_ACCOUNT_KEY is using temporary/invalid config");
    (error as any).isFirebaseConfigError = true;
    throw error;
  }

  let serviceAccountJson;
  try {
    serviceAccountJson = JSON.parse(serviceAccount);
  } catch (e) {
    throw new Error(
      `FIREBASE_SERVICE_ACCOUNT_KEY must be valid JSON. Error: ${e instanceof Error ? e.message : String(e)}`
    );
  }

  try {
    app = initializeApp({
      credential: cert(serviceAccountJson),
    });

    db = getFirestore(app);

    return { app, db };
  } catch (error) {
    // If it's a credential error (invalid key), throw a more specific error
    if (error instanceof Error && (
      error.message.includes("credential") || 
      error.message.includes("private_key") ||
      error.message.includes("Invalid")
    )) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_KEY is invalid. Please check your Firebase service account JSON."
      );
    }
    throw new Error(
      `Failed to initialize Firebase Admin: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

