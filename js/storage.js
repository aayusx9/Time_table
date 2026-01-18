// storage.js - IndexedDB wrapper for persistent data storage

class StorageManager {
    constructor() {
        this.dbName = 'SuccessMonsterDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores
                if (!db.objectStoreNames.contains('auth')) {
                    db.createObjectStore('auth', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('alarms')) {
                    const alarmStore = db.createObjectStore('alarms', { keyPath: 'id', autoIncrement: true });
                    alarmStore.createIndex('nextTrigger', 'nextTrigger', { unique: false });
                }
                if (!db.objectStoreNames.contains('journal')) {
                    const journalStore = db.createObjectStore('journal', { keyPath: 'id', autoIncrement: true });
                    journalStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
                if (!db.objectStoreNames.contains('notes')) {
                    db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('tracker')) {
                    const trackerStore = db.createObjectStore('tracker', { keyPath: 'date' });
                    trackerStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
                if (!db.objectStoreNames.contains('progress')) {
                    db.createObjectStore('progress', { keyPath: 'id' });
                }
            };
        });
    }

    async get(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
    }

    async put(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async delete(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async clear(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async query(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
    }
}

// Global storage instance
const storage = new StorageManager();

// Encryption utilities for secure notes
class CryptoManager {
    constructor() {
        this.algorithm = 'AES-GCM';
    }

    async deriveKey(password) {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);

        const baseKey = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );

        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode('SuccessMonster-Aayush'),
                iterations: 100000,
                hash: 'SHA-256'
            },
            baseKey,
            { name: this.algorithm, length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async encrypt(text, password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const key = await this.deriveKey(password);
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encryptedData = await crypto.subtle.encrypt(
            { name: this.algorithm, iv },
            key,
            data
        );

        const combined = new Uint8Array(iv.length + encryptedData.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encryptedData), iv.length);

        return btoa(String.fromCharCode(...combined));
    }

    async decrypt(encryptedText, password) {
        const combined = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);
        const key = await this.deriveKey(password);

        const decryptedData = await crypto.subtle.decrypt(
            { name: this.algorithm, iv },
            key,
            data
        );

        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
    }

    hash(text) {
        // Simple hash for verification
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }
}

const cryptoManager = new CryptoManager();
