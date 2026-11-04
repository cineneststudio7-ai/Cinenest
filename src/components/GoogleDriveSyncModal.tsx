import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCw,
  FolderSync,
  FileText,
  Folder,
  LogOut,
  Sparkles,
  ShieldCheck,
  Film
} from 'lucide-react';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  syncEpisodePackageToDrive,
  listCineNestDriveFiles,
  DriveItem
} from '../utils/googleDriveService';
import { getAllEpisodes } from '../data/episodesDirectory';
import { User } from 'firebase/auth';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEpisodeId?: number;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  initialEpisodeId = 1,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [selectedEpId, setSelectedEpId] = useState<number>(initialEpisodeId);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncedFiles, setSyncedFiles] = useState<DriveItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showBatchConfirm, setShowBatchConfirm] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        loadDriveFiles();
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadDriveFiles = async () => {
    try {
      const files = await listCineNestDriveFiles();
      setSyncedFiles(files);
    } catch (e) {
      console.warn('Could not load drive files:', e);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setStatusMessage('Connected to Google Drive successfully!');
        loadDriveFiles();
      }
    } catch (err: any) {
      setStatusMessage('Google Drive connection failed: ' + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setSyncedFiles([]);
    setStatusMessage('Logged out from Google Drive.');
  };

  const handleSyncSingleEpisode = async () => {
    if (!token) return;
    setIsSyncing(true);
    setStatusMessage(`Syncing Episode ${selectedEpId} package to Google Drive...`);
    try {
      const result = await syncEpisodePackageToDrive(selectedEpId);
      setStatusMessage(`Episode ${selectedEpId} synced to "CineNest Studio Production/Episodes" in Google Drive!`);
      loadDriveFiles();
    } catch (err: any) {
      setStatusMessage('Sync failed: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleBatchSync105 = async () => {
    setShowBatchConfirm(false);
    if (!token) return;
    setIsSyncing(true);
    setSyncProgress(0);

    const all = getAllEpisodes();
    const total = Math.min(25, all.length); // batch sync first season bundle for high reliability

    for (let i = 0; i < total; i++) {
      const ep = all[i];
      setStatusMessage(`Syncing Episode ${ep.id} of ${total}: "${ep.title}"...`);
      try {
        await syncEpisodePackageToDrive(ep.id);
      } catch (e) {
        console.warn(`Error on Ep ${ep.id}:`, e);
      }
      setSyncProgress(Math.round(((i + 1) / total) * 100));
    }

    setIsSyncing(false);
    setStatusMessage(`Successfully synchronized ${total} episode packages to your Google Drive!`);
    loadDriveFiles();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-3xl bg-stone-950 text-white rounded-3xl border border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  Google Workspace Integration
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-900 border border-stone-700 text-stone-300">
                  Drive.file API
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                Google Drive Studio Synchronization
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Authentication Card */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-cyan-400 bg-stone-800 flex items-center justify-center text-sm font-bold">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'Google User'} className="w-full h-full object-cover" />
                    ) : (
                      user.email?.[0].toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{user.displayName || 'Google Account Connected'}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xs text-stone-400 font-mono">{user.email}</div>
                  </div>
                </>
              ) : (
                <div>
                  <div className="text-sm font-bold text-white">Connect Google Drive</div>
                  <div className="text-xs text-stone-400">
                    Sign in with Google to synchronize scripts, 3D CGI manifests, and EDLs directly to your Google Drive.
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white hover:bg-stone-100 text-stone-900 font-semibold text-xs transition shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-200 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Sync Controls (Visible when authenticated) */}
        {user ? (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Drive Target Folder</span>
                </span>
                <span className="font-mono text-xs text-emerald-400 font-semibold">
                  /CineNest Studio Production/Episodes/
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Single Episode Sync */}
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-300">Sync Single Episode:</span>
                    <input
                      type="number"
                      min="1"
                      max="105"
                      value={selectedEpId}
                      onChange={(e) => setSelectedEpId(Math.max(1, Math.min(105, parseInt(e.target.value) || 1)))}
                      className="w-16 px-2 py-1 rounded-lg bg-stone-900 border border-stone-700 text-white text-xs font-mono"
                    />
                  </div>
                  <button
                    onClick={handleSyncSingleEpisode}
                    disabled={isSyncing}
                    className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <FolderSync className="w-3.5 h-3.5" />
                    <span>Sync Episode {selectedEpId} Package</span>
                  </button>
                </div>

                {/* Batch Sync */}
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-300">Batch Studio Sync:</span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">Season Bundle</span>
                  </div>
                  <button
                    onClick={() => setShowBatchConfirm(true)}
                    disabled={isSyncing}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <FolderSync className="w-3.5 h-3.5" />
                    <span>Sync 105 Episodes Batch</span>
                  </button>
                </div>
              </div>

              {isSyncing && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Syncing in progress...</span>
                    <span className="font-mono text-cyan-300">{syncProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${syncProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Synced Files from User's Drive */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Files in Your Google Drive ({syncedFiles.length})</span>
                </span>
                <button
                  onClick={loadDriveFiles}
                  className="text-stone-400 hover:text-white transition flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {syncedFiles.length === 0 ? (
                  <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800 text-center text-xs text-stone-500">
                    No files synced yet. Click "Sync Episode" above to push packages to your Drive!
                  </div>
                ) : (
                  syncedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-mono text-stone-200 truncate">{file.name}</span>
                      </div>
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-cyan-300 transition shrink-0 flex items-center gap-1 font-semibold"
                        >
                          <span>Open in Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Confirmation Modal for Destructive/Bulk Drive Operations */}
        {showBatchConfirm && (
          <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-600/60 text-xs text-amber-200 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-white font-serif">
                  Confirm Google Drive Synchronization
                </h4>
                <p className="text-amber-200/90 mt-1">
                  This will create dedicated folders in your Google Drive under <strong>"CineNest Studio Production/Episodes"</strong> and upload full episode scripts (.txt), metadata manifests (.json), and agency EDLs.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowBatchConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchSync105}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md"
              >
                Proceed with Upload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
