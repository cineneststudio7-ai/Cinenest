import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase client SDK safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with explicit database ID from firebase-applet-config.json
export const FIRESTORE_DATABASE_ID = (firebaseConfig as any).firestoreDatabaseId || 'ai-studio-remixcineneststu-54035cee-ff39-4bb4-95a3-c907bbd7685c';
export const FIREBASE_PROJECT_ID = (firebaseConfig as any).projectId || 'gen-lang-client-0303849194';

export const db = getFirestore(app, FIRESTORE_DATABASE_ID);
export const auth = getAuth(app);

export const SUPER_ADMIN_EMAIL = 'cinenest.studio7@gmail.com';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test initial connection to Firestore
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is offline. Verify configuration.');
    }
    return false;
  }
}

// Google Sign-In helper
export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/drive.file');
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await fbSignOut(auth);
}

export function checkIsSuperAdmin(user: User | null | undefined): boolean {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'production_admin' | 'social_admin' | 'editor' | 'viewer';
  status: 'active' | 'invited' | 'suspended';
  assignedModules: string[];
  lastActive: string;
}

// Save or update an administrator in Cloud Firestore
export async function saveAdminToFirestore(adminUser: AdminUser): Promise<void> {
  const path = `admins/${adminUser.id}`;
  try {
    const { setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, 'admins', adminUser.id), {
      ...adminUser,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch all administrators from Cloud Firestore
export async function fetchAdminsFromFirestore(): Promise<AdminUser[]> {
  const path = 'admins';
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const snapshot = await getDocs(collection(db, path));
    const list: AdminUser[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as AdminUser);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Delete an administrator from Cloud Firestore
export async function deleteAdminFromFirestore(adminId: string): Promise<void> {
  const path = `admins/${adminId}`;
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'admins', adminId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

