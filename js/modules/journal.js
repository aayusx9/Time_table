// journal.js - Creamy UI Edition
const Journal = {
    open: () => {
        const overlay = document.getElementById('journal-overlay');
        overlay.classList.remove('hidden');
        overlay.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2 style="font-size: 2rem; font-weight: 800;">Daily Log</h2>
                <button onclick="Journal.close()" style="border: none; background: #eee; width: 40px; height: 40px; border-radius: 50%; font-size: 1.2rem; cursor: pointer;">×</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; overflow-y: auto;">
                <div>
                    <label style="display: block; font-weight: 700; margin-bottom: 8px;">🏆 Daily Wins</label>
                    <textarea id="j-wins" style="width: 100%; height: 120px; padding: 16px; border-radius: 16px; border: 1px solid #ddd; font-family: inherit; resize: none;"></textarea>
                </div>
                <div>
                    <label style="display: block; font-weight: 700; margin-bottom: 8px;">💡 Key Learnings</label>
                    <textarea id="j-learn" style="width: 100%; height: 120px; padding: 16px; border-radius: 16px; border: 1px solid #ddd; font-family: inherit; resize: none;"></textarea>
                </div>
                <div>
                    <label style="display: block; font-weight: 700; margin-bottom: 8px;">📖 Pages Read</label>
                    <input type="number" id="j-read" style="width: 100%; padding: 16px; border-radius: 16px; border: 1px solid #ddd; font-family: inherit;">
                </div>
                <div>
                    <label style="display: block; font-weight: 700; margin-bottom: 8px;">😴 Sleep Hours</label>
                    <input type="number" id="j-sleep" style="width: 100%; padding: 16px; border-radius: 16px; border: 1px solid #ddd; font-family: inherit;">
                </div>
            </div>

            <button onclick="Journal.save()" class="btn-primary" style="margin-top: 30px; align-self: flex-end;">Save Entry</button>
        `;
    },

    close: () => {
        document.getElementById('journal-overlay').classList.add('hidden');
    },

    save: async () => {
        const entry = {
            id: Date.now(),
            wins: document.getElementById('j-wins').value,
            learnings: document.getElementById('j-learn').value,
            read: document.getElementById('j-read').value,
            sleep: document.getElementById('j-sleep').value,
            date: new Date().toISOString()
        };
        await storage.set('journal_last', entry); // Simplified
        alert('Entry Saved to Empire Database.');
        Journal.close();
    }
};

window.Journal = Journal;
