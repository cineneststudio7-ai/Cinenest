import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { getEpisode } from '../data/episodesDirectory';
import { exportEpisodeToPlainText } from './episodeCalculator';
import { generateAgencyEDL, CGP_PRESETS } from './cgpPresets';

export const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get Google Drive access token from Firebase Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
  size?: string;
}

/**
 * Searches for or creates a folder in Google Drive with the specified name
 */
export async function getOrCreateFolder(
  folderName: string,
  parentFolderId?: string
): Promise<DriveItem> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  // Search existing
  let query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  if (parentFolderId) {
    query += ` and '${parentFolderId}' in parents`;
  }

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,webViewLink)`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0];
  }

  // Create folder
  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };
  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  return await createRes.json();
}

/**
 * Uploads a text/json file to Google Drive using multipart upload
 */
export async function uploadTextFileToDrive(
  fileName: string,
  content: string,
  parentFolderId: string,
  mimeType: string = 'text/plain'
): Promise<DriveItem> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  const metadata = {
    name: fileName,
    parents: [parentFolderId],
    mimeType,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n` +
    content +
    closeDelimiter;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  return await res.json();
}

/**
 * Syncs an entire CineNest Episode package to Google Drive
 */
export async function syncEpisodePackageToDrive(
  episodeId: number
): Promise<{ folder: DriveItem; files: DriveItem[] }> {
  const ep = getEpisode(episodeId);
  const root = await getOrCreateFolder('CineNest Studio Production');
  const episodesFolder = await getOrCreateFolder('Episodes', root.id);
  const epFolder = await getOrCreateFolder(`Ep_${String(ep.id).padStart(3, '0')}_${ep.title.replace(/\s+/g, '_')}`, episodesFolder.id);

  const files: DriveItem[] = [];

  // 1. Script TXT file
  const scriptContent = exportEpisodeToPlainText(ep);
  const scriptFile = await uploadTextFileToDrive(
    `Ep_${String(ep.id).padStart(3, '0')}_Script.txt`,
    scriptContent,
    epFolder.id,
    'text/plain'
  );
  files.push(scriptFile);

  // 2. Production Manifest JSON
  const manifestContent = JSON.stringify(
    {
      series: 'Puchu Puku',
      episodeId: ep.id,
      title: ep.title,
      titleBn: ep.titleBn,
      timeOfDay: ep.timeOfDay,
      location: ep.location,
      durationSec: 330,
      timecodes: ep.timecodes,
      prompts: ep.productionPrompts,
      rhyme: ep.rhyme,
      syncedAt: new Date().toISOString(),
    },
    null,
    2
  );
  const manifestFile = await uploadTextFileToDrive(
    `Ep_${String(ep.id).padStart(3, '0')}_Manifest.json`,
    manifestContent,
    epFolder.id,
    'application/json'
  );
  files.push(manifestFile);

  // 3. Agency EDL
  const edlContent = generateAgencyEDL(ep.id, ep.title, CGP_PRESETS[0]);
  const edlFile = await uploadTextFileToDrive(
    `Ep_${String(ep.id).padStart(3, '0')}_Agency.edl`,
    edlContent,
    epFolder.id,
    'text/plain'
  );
  files.push(edlFile);

  return { folder: epFolder, files };
}

/**
 * Lists all CineNest synced files from Google Drive
 */
export async function listCineNestDriveFiles(): Promise<DriveItem[]> {
  const token = await getAccessToken();
  if (!token) return [];

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=trashed=false&fields=files(id,name,mimeType,webViewLink,createdTime,size)&pageSize=50&orderBy=createdTime desc`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();
  return data.files || [];
}
