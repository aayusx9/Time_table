// settings.js - Control Console
const Settings = {
    render: () => {
        const u = state.user || {};
        const container = document.getElementById('workspace');

        container.innerHTML = `
            <div class="animate-in" style="max-width: 600px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 class="title-xl gradient-text">Settings Console</h2>
                    <button onclick="app.loadWorkspace()" class="btn-cream" style="width: auto;">✕</button>
                </div>

                <div class="glass-card">
                    <h3 class="title-lg" style="margin-bottom: 20px;">Rhythm Configuration</h3>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; color: var(--text-muted); margin-bottom: 8px;">Wake Up Time</label>
                        <input type="time" id="set-wake" value="${u.wakeTime}" style="padding: 12px; border-radius: 8px; border: 1px solid #ddd; width: 100%;">
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; color: var(--text-muted); margin-bottom: 8px;">Target Subject</label>
                        <select id="set-subject" style="padding: 12px; border-radius: 8px; border: 1px solid #ddd; width: 100%;">
                            <option value="science" ${u.focusSubject === 'science' ? 'selected' : ''}>Science</option>
                            <option value="math" ${u.focusSubject === 'math' ? 'selected' : ''}>Math</option>
                            <option value="coding" ${u.focusSubject === 'coding' ? 'selected' : ''}>Coding</option>
                        </select>
                    </div>

                    <button onclick="Settings.save()" class="btn-primary" style="margin-top: 10px;">Update Configuration</button>
                </div>

                <div class="glass-card" style="border-color: rgba(239, 68, 68, 0.3);">
                    <h3 class="title-lg" style="color: var(--danger);">Danger Zone</h3>
                    <p class="text-body" style="margin-bottom: 16px;">Wipe all data and restart the protocol.</p>
                    <button onclick="app.reset()" style="background: var(--danger); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 700;">Factory Reset</button>
                </div>
            </div>
        `;
    },

    save: async () => {
        state.user.wakeTime = document.getElementById('set-wake').value;
        state.user.focusSubject = document.getElementById('set-subject').value;

        await state.saveProfile(state.user);
        alert('Configuration Updated.');
        app.loadWorkspace();
    }
};

window.Settings = Settings;
