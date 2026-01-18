// analytics.js - Retro Calendar & History
const Analytics = {
    render: async () => {
        const history = await storage.getHistory(); // Array of logs
        const container = document.getElementById('workspace');

        // Generate Grid
        let html = `
            <div class="animate-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 class="title-xl gradient-text">Time Traveler</h2>
                    <button onclick="app.loadWorkspace()" class="btn-cream" style="width: auto;">Exit History ✕</button>
                </div>

                <div class="glass-card">
                    <h3 class="title-lg" style="margin-bottom: 20px;">Empire History (Last 30 Days)</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px;">
                        ${Analytics.generateGrid(history)}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        container.style.overflowY = 'auto'; // Ensure scroll
    },

    generateGrid: (history) => {
        // Mocking last 7 days + actual history
        const cards = [];
        // Map history to map for easy lookup
        const historyMap = {};
        history.forEach(h => historyMap[h.date] = h);

        // Generate mock display for demo if empty, or just last few entries
        // Since we just started, history is likely empty.
        if (history.length === 0) {
            return `<p class="text-muted" style="grid-column: 1/-1;">No history recorded yet. Complete tasks today to build your legacy.</p>`;
        }

        return history.map(log => {
            const completedCount = log.completedTasks ? log.completedTasks.length : 0;
            const score = completedCount * 10; // Mock score
            return `
                <div onclick="Analytics.viewDay('${log.date}')" style="background: rgba(255,255,255,0.5); padding: 16px; border-radius: 16px; cursor: pointer; border: 1px solid rgba(0,0,0,0.1); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${log.date}</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-primary);">${score}%</div>
                    <div style="font-size: 0.7rem; color: var(--green-tea);">${completedCount} Tasks Done</div>
                </div>
            `;
        }).join('');
    },

    viewDay: async (dateStr) => {
        const log = await storage.getDayLog(dateStr);
        if (!log) return;

        const container = document.getElementById('workspace');
        container.innerHTML = `
            <div class="animate-in">
                <button onclick="Analytics.render()" style="margin-bottom: 20px; background: none; border: none; cursor: pointer; color: var(--text-muted);">← Back to Calendar</button>
                <h2 class="title-xl">${dateStr}</h2>
                
                <div class="glass-card">
                    <h3 class="title-lg">Completed Tasks</h3>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        ${log.completedTasks.map(t => `<li>${t}</li>`).join('') || 'No tasks completed.'}
                    </ul>
                </div>
                
                <!-- If we saved Journal in this log, show it -->
                ${log.journal ? `
                    <div class="glass-card">
                        <h3 class="title-lg">Journal Entry</h3>
                        <p><strong>Wins:</strong> ${log.journal.wins}</p>
                        <p><strong>Learnings:</strong> ${log.journal.learnings}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
};

window.Analytics = Analytics;
