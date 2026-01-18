// alarms.js - Reminders & Alarms (Dark List)

function renderAlarms() {
  return `
    <div class="animate-fade-in">
        <div class="dark-card" style="background: var(--bg-card-darker); border-radius: var(--radius-lg);">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                <svg width="24" height="24" fill="none" stroke="var(--action-cyan)" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--action-cyan);">REMINDERS & ALARMS</h2>
            </div>
            <p style="color: var(--text-muted-on-dark); font-size: 0.9rem;">Automated schedule based on your roadmap. All times in NPT.</p>
        </div>

        <div class="dark-card" style="margin-top: 1.5rem;">
            <h3>Create New Reminder</h3>
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                <div>
                    <label style="color: var(--text-muted-on-dark); font-size: 0.8rem; display: block; margin-bottom: 0.5rem;">Title</label>
                    <input type="text" id="alarm-title" class="dark-input" placeholder="e.g. Project Work">
                </div>
                <div>
                    <label style="color: var(--text-muted-on-dark); font-size: 0.8rem; display: block; margin-bottom: 0.5rem;">Time (NPT)</label>
                    <input type="time" id="alarm-time" class="dark-input">
                </div>
                <div>
                    <label style="color: var(--text-muted-on-dark); font-size: 0.8rem; display: block; margin-bottom: 0.5rem;">Frequency</label>
                    <select id="alarm-freq" class="dark-input">
                        <option value="daily">Daily</option>
                        <option value="once">Once</option>
                    </select>
                </div>
            </div>
            <button class="btn-primary" style="background: var(--action-cyan); width: 100%; color: white;" id="add-alarm-btn">+ Add Reminder</button>
        </div>

        <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Active Reminders</h3>
        <div id="alarm-list-container">
            <!-- Injected -->
        </div>
    </div>
  `;
}

async function initAlarms() {
  await renderAlarmList();

  document.getElementById('add-alarm-btn').addEventListener('click', async () => {
    const title = document.getElementById('alarm-title').value;
    const time = document.getElementById('alarm-time').value;
    const freq = document.getElementById('alarm-freq').value;

    if (!title || !time) return alert('Please details');

    await notificationManager.setAlarm({
      title,
      message: 'Time to focus!',
      time,
      recurring: freq === 'daily'
    });

    document.getElementById('alarm-title').value = '';
    renderAlarmList();
  });
}

async function renderAlarmList() {
  const alarms = await storage.getAll('alarms');
  const container = document.getElementById('alarm-list-container');

  if (alarms.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-muted);">No active alarms.</p>`;
    return;
  }

  container.innerHTML = alarms.filter(a => a.enabled).map(a => `
        <div class="dark-card" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; margin-bottom: 1rem; border-left: 4px solid var(--action-cyan);">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="background: rgba(6, 182, 212, 0.1); padding: 0.8rem; border-radius: 8px;">
                     <svg width="20" height="20" fill="none" stroke="var(--action-cyan)" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                </div>
                <div>
                    <div style="font-weight: 700; font-size: 1rem;">${a.title}</div>
                    <div style="font-size: 0.85rem; color: var(--action-cyan);">${a.time} NPT • ${a.recurring ? 'Daily' : 'Once'}</div>
                </div>
            </div>
            
            <button onclick="deleteAlarm(${a.id})" style="background: none; border: none; color: var(--danger-red); cursor: pointer;">
                 <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
        </div>
    `).join('');
}

window.deleteAlarm = async (id) => {
  if (confirm('Delete reminder?')) {
    await storage.delete('alarms', id);
    renderAlarmList();
  }
}
