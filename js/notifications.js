// notifications.js - Notification System v2

class NotificationManager {
    constructor() {
        this.permission = 'default';
        this.audio = new Audio('/sounds/notification.mp3');
    }

    async init() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
        }
        // Preload audio
        this.audio.load();
        this.startAlarmCheck();
    }

    async requestPermission() {
        if (!('Notification' in window)) return false;
        const res = await Notification.requestPermission();
        this.permission = res;
        return res === 'granted';
    }

    async playSound() {
        try {
            this.audio.currentTime = 0;
            await this.audio.play();
        } catch (e) {
            console.warn('Audio play failed', e);
        }
    }

    vibrate(pattern = [200]) {
        if ('vibrate' in navigator) navigator.vibrate(pattern);
    }

    // Patterns
    patterns = {
        success: [100, 50, 100],
        error: [200, 100, 200, 100, 200],
        tap: [50]
    };

    // Alarm Logic
    async setAlarm(data) {
        const alarm = {
            id: Date.now(),
            enabled: true,
            ...data,
            nextTrigger: this.calcNext(data.time, data.days)
        };
        await storage.put('alarms', alarm);
        this.vibrate(this.patterns.success);
        return alarm;
    }

    calcNext(time, days = [0, 1, 2, 3, 4, 5, 6]) {
        const [h, m] = time.split(':').map(Number);
        const now = new Date();
        const trig = new Date();
        trig.setHours(h, m, 0, 0);

        if (trig <= now) trig.setDate(trig.getDate() + 1);
        while (!days.includes(trig.getDay())) {
            trig.setDate(trig.getDate() + 1);
        }
        return trig.getTime();
    }

    startAlarmCheck() {
        setInterval(() => this.check(), 30000);
    }

    async check() {
        const alarms = await storage.getAll('alarms');
        const now = Date.now();

        for (const a of alarms) {
            if (a.enabled && a.nextTrigger <= now) {
                this.trigger(a);
            }
        }
    }

    async trigger(alarm) {
        // Notification
        if (this.permission === 'granted') {
            // Try SW first
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(reg => {
                    reg.showNotification(alarm.title, {
                        body: alarm.message,
                        icon: '/icons/icon-192.png',
                        vibrate: [500, 200, 500]
                    });
                });
            } else {
                new Notification(alarm.title, { body: alarm.message });
            }
        }

        // Sound & Vibrate
        this.playSound();
        this.vibrate([500, 200, 500]);

        // Update next
        if (alarm.recurring) {
            alarm.nextTrigger = this.calcNext(alarm.time, alarm.days);
        } else {
            alarm.enabled = false;
        }
        await storage.put('alarms', alarm);

        // Update UI if needed
        // (In a real framework we'd use reactive state, here we rely on manual refresh)
    }
}

const notificationManager = new NotificationManager();
