// app.js - Controller v5.0
class App {
    async init() {
        try {
            await storage.init();
            const hasUser = await state.load();

            setTimeout(() => {
                if (hasUser) {
                    this.loadWorkspace();
                } else {
                    document.getElementById('wizard').classList.remove('hidden');
                    Wizard.start();
                }
            }, 500);
        } catch (e) {
            console.error(e);
        }
    }

    loadWorkspace() {
        document.getElementById('wizard').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Restore Main View
        document.getElementById('workspace').innerHTML = this.getOriginalWorkspaceHTML();

        this.reloadSidebar();

        const timeline = scheduler.generate(state.user);
        UI.renderActiveTask(timeline);
        UI.setGreeting();

        if (window.NepaliDate) {
            const bs = NepaliDate.getCurrentBS();
            const ds = document.getElementById('nepali-date');
            if (ds) ds.textContent = `🇳🇵 ${bs.full}`;
            const mds = document.getElementById('mobile-nepali-time');
            if (mds) mds.textContent = `🇳🇵 ${bs.full}`;
        }
    }

    reloadSidebar() {
        const timeline = scheduler.generate(state.user);
        UI.renderSidebar(timeline);
    }

    // Switch Views
    openSettings() {
        Settings.render();
    }

    openAnalytics() {
        Analytics.render();
    }

    async reset() {
        if (confirm('Reset Protocol completely?')) {
            await storage.set('profile', null);
            location.reload();
        }
    }

    getOriginalWorkspaceHTML() {
        // Cache this ideally, but for now hardcode structure for restoration
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                <div>
                    <h1 id="greeting" style="font-size: 2rem; font-weight: 700;">Good Morning, Aayush.</h1>
                    <p style="color: var(--text-muted);">Protocol Status: <span style="color: var(--green-tea); font-weight: 700;">ONLINE</span></p>
                </div>
                <div>
                    <button onclick="app.openAnalytics()" style="background: white; border: 1px solid #ddd; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin-right: 8px;">📊 History</button>
                    <button onclick="app.openSettings()" style="background: white; border: 1px solid #ddd; padding: 8px 16px; border-radius: 20px; cursor: pointer;">⚙️ Settings</button>
                </div>
            </div>

            <div id="active-task-card" class="glass-card animate-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <span style="background: #eef2ff; color: var(--accent-secondary); padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 0.8rem;">CURRENT BLOCK</span>
                    <span id="next-event" style="color: var(--danger); font-weight: 600; font-size: 0.9rem;"></span>
                </div>
                
                <h2 id="current-title" style="font-size: 2.5rem; font-weight: 800; margin-bottom: 10px;">Loading...</h2>
                <div class="timer-huge" id="main-timer">00:00:00</div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
                <div class="glass-card" onclick="Journal.open()" style="cursor: pointer;">
                    <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">📖 Empire Journal</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Log wins & learnings.</p>
                </div>
            </div>
            
            <div id="journal-overlay" class="hidden glass-card animate-in" style="position: fixed; inset: 0; z-index: 200; margin: 0; border-radius: 0; overflow-y: auto;"></div>
        `;
    }
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
