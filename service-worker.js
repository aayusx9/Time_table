const CACHE_NAME = 'success-monster-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/auth.js',
    '/js/storage.js',
    '/js/notifications.js',
    '/js/features/dashboard.js',
    '/js/features/tracker.js',
    '/js/features/alarms.js',
    '/js/features/journal.js',
    '/js/features/decision.js',
    '/js/features/motivation.js',
    '/js/features/notes.js',
    '/js/features/roadmap.js',
    '/js/features/agent-builder.js',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
            .catch(() => caches.match('/index.html'))
    );
});

// Background sync for alarms
self.addEventListener('sync', (event) => {
    if (event.tag === 'check-alarms') {
        event.waitUntil(checkAndTriggerAlarms());
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Periodic background sync for alarms (if supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'alarm-check') {
        event.waitUntil(checkAndTriggerAlarms());
    }
});

async function checkAndTriggerAlarms() {
    // This will be called by the periodic background sync
    // In the actual implementation, we'll check IndexedDB for pending alarms
    const db = await openDB();
    const alarms = await getAllAlarms(db);
    const now = Date.now();

    for (const alarm of alarms) {
        if (alarm.nextTrigger <= now && alarm.enabled) {
            await showNotification(alarm);
            await updateAlarmNextTrigger(db, alarm);
        }
    }
}

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('SuccessMonsterDB', 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function getAllAlarms(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['alarms'], 'readonly');
        const store = transaction.objectStore('alarms');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

async function showNotification(alarm) {
    const options = {
        body: alarm.message || 'Time for action, Aayush!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [200, 100, 200, 100, 200],
        tag: `alarm-${alarm.id}`,
        requireInteraction: true,
        actions: [
            { action: 'snooze', title: '5 min snooze' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };

    await self.registration.showNotification(alarm.title || 'Success Monster Alarm', options);
}

function updateAlarmNextTrigger(db, alarm) {
    // Update next trigger time based on recurrence
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['alarms'], 'readwrite');
        const store = transaction.objectStore('alarms');

        if (alarm.recurring) {
            alarm.nextTrigger = calculateNextTrigger(alarm);
            const request = store.put(alarm);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        } else {
            alarm.enabled = false;
            const request = store.put(alarm);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        }
    });
}

function calculateNextTrigger(alarm) {
    const now = new Date();
    const next = new Date(alarm.nextTrigger);

    if (alarm.frequency === 'daily') {
        next.setDate(next.getDate() + 1);
    } else if (alarm.frequency === 'weekly') {
        next.setDate(next.getDate() + 7);
    }

    return next.getTime();
}
