// auth.js - Authentication and privacy lock for Aayush Bhandari

class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.sessionKey = null;
        this.masterHash = null;
    }

    async init() {
        await storage.init();

        const authData = await storage.get('auth', 'master');
        if (authData) {
            this.masterHash = authData.hash;

            const sessionData = sessionStorage.getItem('sm_session');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                if (Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
                    this.isAuthenticated = true;
                    this.sessionKey = session.key;
                    return true;
                }
            }
        }

        return false;
    }

    async verify(birthdate) {
        if (!birthdate || !this.isValidDate(birthdate)) {
            throw new Error('Invalid birthdate format');
        }

        const hash = cryptoManager.hash(birthdate);

        if (!this.masterHash) {
            this.masterHash = hash;
            await storage.put('auth', {
                id: 'master',
                hash: hash,
                setupDate: Date.now()
            });
        }

        if (hash === this.masterHash) {
            this.isAuthenticated = true;
            this.sessionKey = this.generateSessionKey();

            sessionStorage.setItem('sm_session', JSON.stringify({
                key: this.sessionKey,
                timestamp: Date.now()
            }));

            await this.logAccess(true);
            return true;
        } else {
            await this.logAccess(false);
            throw new Error('Access Denied');
        }
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) && date < new Date('2010-12-31');
    }

    generateSessionKey() {
        return Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    async logAccess(success) {
        const logs = await storage.get('auth', 'access_logs') || { id: 'access_logs', attempts: [] };
        logs.attempts.push({
            timestamp: Date.now(),
            success,
            userAgent: navigator.userAgent
        });

        if (logs.attempts.length > 50) {
            logs.attempts = logs.attempts.slice(-50);
        }

        await storage.put('auth', logs);
    }

    logout() {
        this.isAuthenticated = false;
        this.sessionKey = null;
        sessionStorage.removeItem('sm_session');
    }
}

const authManager = new AuthManager();
