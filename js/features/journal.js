// journal.js - Progress Journal (Dark + Stats)

function renderJournal() {
  return `
      <div class="animate-fade-in">
          <div class="dark-card" style="background: var(--bg-card-darker); border-bottom: 4px solid var(--success-green);">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                  <svg width="24" height="24" fill="none" stroke="var(--success-green)" stroke-width="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                  <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--success-green); text-transform: uppercase;">PROGRESS JOURNAL</h2>
              </div>
              <p style="color: var(--text-muted-on-dark); font-size: 0.9rem;">Daily reflection system. Document wins, challenges, lessons, and plan tomorrow.</p>
          </div>
  
          <!-- Stats Row -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
              <div class="dark-card" style="margin: 0; padding: 1.2rem;">
                  <div style="color: var(--success-green); font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                       <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                       Total Entries
                  </div>
                  <div style="font-size: 2rem; font-weight: 800; color: white;" id="total-entries">0</div>
              </div>
              <div class="dark-card" style="margin: 0; padding: 1.2rem;">
                  <div style="color: var(--action-cyan); font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                       <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                       This Week
                  </div>
                  <div style="font-size: 2rem; font-weight: 800; color: white;" id="week-entries">0</div>
              </div>
          </div>
  
          <!-- Entry Form -->
          <div class="dark-card">
              <h3 style="margin-bottom: 1.5rem;">Today's Entry - <span style="color: white; font-weight: 400;">${new Date().toLocaleDateString()}</span></h3>
              
              <div style="margin-bottom: 1.5rem;">
                  <label style="color: var(--success-green); font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 0.5rem;">🏆 WINS (What went well?)</label>
                  <textarea id="journal-wins" class="dark-input" rows="3" placeholder="e.g., Coded for 3 hours, taught 2 peers..."></textarea>
              </div>
  
              <div style="margin-bottom: 1.5rem;">
                  <label style="color: var(--danger-red); font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 0.5rem;">⚠️ CHALLENGES (What blocked you?)</label>
                  <textarea id="journal-challenges" class="dark-input" rows="3" placeholder="e.g., Laptop lagged, habit control failed..."></textarea>
              </div>
  
              <div style="margin-bottom: 1.5rem;">
                  <label style="color: var(--brand-primary); font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 0.5rem;">💡 LESSONS (What did you learn?)</label>
                  <textarea id="journal-lessons" class="dark-input" rows="3" placeholder="e.g., Morning coding = better focus..."></textarea>
              </div>
  
              <button class="btn-primary" id="save-journal-btn">Save Entry</button>
          </div>
  
          <div style="margin-top: 2rem;">
              <h3 style="color: var(--text-main); margin-bottom: 1rem;">Recent Entries</h3>
              <div id="journal-history"></div>
          </div>
      </div>
    `;
}

async function initJournal() {
  // Stats
  const entries = await storage.getAll('journal');
  document.getElementById('total-entries').textContent = entries.length;
  document.getElementById('week-entries').textContent = entries.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return (now - d) / (1000 * 60 * 60 * 24) < 7;
  }).length;

  renderHistory(entries);

  document.getElementById('save-journal-btn').addEventListener('click', async () => {
    const wins = document.getElementById('journal-wins').value;
    const challenges = document.getElementById('journal-challenges').value;
    const lessons = document.getElementById('journal-lessons').value;

    if (!wins && !challenges) return alert('Write something!');

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      wins, challenges, lessons
    };

    await storage.put('journal', entry);
    notificationManager.vibrate([100]);
    await initJournal(); // Refresh
  });
}

function renderHistory(entries) {
  const container = document.getElementById('journal-history');
  if (entries.length === 0) {
    container.innerHTML = '<p class="text-muted">No entries yet.</p>';
    return;
  }

  container.innerHTML = entries.sort((a, b) => b.id - a.id).slice(0, 5).map(e => `
          <div class="light-card">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                  <span>${new Date(e.date).toLocaleDateString()}</span>
                  <span>${new Date(e.date).toLocaleTimeString()}</span>
              </div>
              <div style="display: grid; gap: 0.5rem;">
                  ${e.wins ? `<div style="font-size: 0.9rem;"><strong>🏆</strong> ${e.wins}</div>` : ''}
                  ${e.challenges ? `<div style="font-size: 0.9rem;"><strong>⚠️</strong> ${e.challenges}</div>` : ''}
              </div>
          </div>
      `).join('');
}
