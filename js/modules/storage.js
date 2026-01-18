// storage.js - Enhanced for History (v5.0)
const DB_NAME = 'SuccessMonsterDB';
const STORE_NAME = 'user_data';
const HISTORY_STORE = 'daily_logs';

class Storage {
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 2); // Version 2

            request.onerror = e => reject(e);
            request.onsuccess = e => {
                this.db = e.target.result;
                resolve();
            };

            request.onupgradeneeded = e => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
                if (!db.objectStoreNames.contains(HISTORY_STORE)) {
                    // Key is "YYYY-MM-DD" inside the object, or just keyPath
                    db.createObjectStore(HISTORY_STORE, { keyPath: 'date' });
                }
            };
        });
    }

    // Generic KV
    async get(key) {
        return new Promise(resolve => {
            const tx = this.db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(key);
            req.onsuccess = () => resolve(req.result);
        });
    }

    async set(key, value) {
        return new Promise(resolve => {
            const tx = this.db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put(value, key);
            tx.oncomplete = () => resolve();
        });
    }

    // History Specific
    async saveDailyLog(log) {
        // log = { date: "2082-Magh-05", tasks: [], journal: {}, stats: {} }
        return new Promise(resolve => {
            const tx = this.db.transaction(HISTORY_STORE, 'readwrite');
            tx.objectStore(HISTORY_STORE).put(log);
            tx.oncomplete = () => resolve();
        });
    }

    async getHistory() {
        return new Promise(resolve => {
            const tx = this.db.transaction(HISTORY_STORE, 'readonly');
            const req = tx.objectStore(HISTORY_STORE).getAll();
            req.onsuccess = () => resolve(req.result || []);
        });
    }

    async getDayLog(dateStr) {
        return new Promise(resolve => {
            const tx = this.db.transaction(HISTORY_STORE, 'readonly');
            const req = tx.objectStore(HISTORY_STORE).get(dateStr);
            req.onsuccess = () => resolve(req.result);
        });
    }
}

const storage = new Storage();
