// ─── Native IndexedDB Audio Storage for Mockly ───────────────────
// Stores large audio blobs safely without exceeding localStorage 5MB quota.

const DB_NAME = 'mockly_audio_db';
const DB_VERSION = 1;
const STORE_NAME = 'audio_recordings';

function openAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment.'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAudioKey(sessionId: string, questionId: string): string {
  return `${sessionId}_${questionId}`;
}

export async function saveAudioRecording(
  sessionId: string,
  questionId: string,
  blob: Blob
): Promise<void> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const key = getAudioKey(sessionId, questionId);

      const record = {
        key,
        sessionId,
        questionId,
        blob,
        createdAt: new Date().toISOString(),
        mimeType: blob.type || 'audio/webm',
        size: blob.size,
      };

      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to save audio recording to IndexedDB:', err);
  }
}

export async function getAudioRecording(
  sessionId: string,
  questionId: string
): Promise<Blob | null> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const key = getAudioKey(sessionId, questionId);

      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result?.blob || null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to get audio recording from IndexedDB:', err);
    return null;
  }
}

export async function hasAudioRecording(
  sessionId: string,
  questionId: string
): Promise<boolean> {
  const blob = await getAudioRecording(sessionId, questionId);
  return !!blob && blob.size > 0;
}

export async function deleteSessionAudio(sessionId: string): Promise<void> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          if (cursor.value.sessionId === sessionId) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to delete session audio from IndexedDB:', err);
  }
}
