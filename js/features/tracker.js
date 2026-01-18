// tracker.js - Daily Tracker (Dark Cards)

function renderTracker() {
  return `
    <div class="animate-fade-in">
        <!-- Header Card -->
        <div class="dark-card" style="background: var(--bg-card-darker); border-bottom: 4px solid var(--success-green);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h2 style="color: var(--success-green); font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">DAILY TRACKER</h2>
                    <p style="color: var(--text-muted-on-dark); font-size: 0.9rem;" id="tracker-date">...</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 2rem; font-weight: 800; color: white;" id="completed-count">0/5</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted-on-dark);">habits completed</div>
                </div>
            </div>
            
            <!-- Progress Bar -->
            <div style="height: 12px; background: #333; border-radius: 6px; margin-top: 1.5rem; overflow: hidden;">
                <div id="daily-progress" style="height: 100%; width: 0%; background: var(--success-green); transition: width 0.5s ease;"></div>
            </div>
        </div>

        <!-- Habits Grid -->
        <div class="habit-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-top: 2rem;">
            <!-- Injected -->
        </div>
        
        <!-- Coding Time Logger -->
        <div class="dark-card" style="margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem;">Coding Time Today</h3>
            <div style="display: flex; gap: 1rem;">
                <input type="number" class="dark-input" style="flex: 1; margin: 0;" placeholder="Minutes (e.g. 60)" id="coding-mins">
                <button class="btn-primary" id="log-coding-btn" style="width: auto;">Log Session</button>
            </div>
        </div>
    </div>
  `;
}

const habits = [
  { id: 'coding', title: '1 Hour Coding', icon: '</>', pending: 'Pending', done: 'Completed' },
  { id: 'study', title: 'SEE Study Session', icon: 'Book', pending: 'Pending', done: 'Completed' },
  { id: 'habit', title: 'Habit Control', icon: 'Brain', pending: 'Pending', done: 'Clean' },
  { id: 'exercise', title: 'Physical Activity', icon: 'Dumbbell', pending: 'Pending', done: 'Done' }
];

async function initTracker() {
  const dateEl = document.getElementById('tracker-date');
  dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  await renderHabits();

  document.getElementById('log-coding-btn').addEventListener('click', () => {
    // Logic to save coding time
    notificationManager.trigger({ title: 'Coding Logged', message: 'Keep pushing your limits!', sound: true });
    document.getElementById('coding-mins').value = '';
  });
}

async function renderHabits() {
  // Get data
  const today = new Date().toISOString().split('T')[0];
  const data = await storage.get('tracker', today) || { habits: {} };

  const container = document.querySelector('.habit-grid');
  let completedCount = 0;

  container.innerHTML = habits.map(h => {
    const isDone = data.habits[h.id];
    if (isDone) completedCount++;

    return `
            <div class="dark-card" style="margin: 0; display: flex; align-items: center; justify-content: space-between; border: 1px solid ${isDone ? 'var(--success-green)' : '#333'}; opacity: ${isDone ? 0.6 : 1}">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 48px; height: 48px; border-radius: 12px; border: 1px solid ${isDone ? 'var(--success-green)' : 'var(--action-cyan)'}; color: ${isDone ? 'var(--success-green)' : 'var(--action-cyan)'}; display: flex; align-items: center; justify-content: center; font-weight: 700;">
                        ${h.icon}
                    </div>
                    <div>
                        <div style="font-weight: 700; font-size: 1rem;">${h.title}</div>
                        <div style="font-size: 0.8rem; color: ${isDone ? 'var(--success-green)' : 'var(--text-muted-on-dark)'};">
                            ${isDone ? h.done : h.pending}
                        </div>
                    </div>
                </div>
                
                <button onclick="toggleHabitStatus('${h.id}')" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #555; background: ${isDone ? 'var(--success-green)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white;">
                    ${isDone ? '✓' : ''}
                </button>
            </div>
        `;
  }).join('');

  // Update Progress
  const pct = (completedCount / habits.length) * 100;
  document.getElementById('daily-progress').style.width = `${pct}%`;
  document.getElementById('completed-count').textContent = `${completedCount}/${habits.length}`;
}

window.toggleHabitStatus = async (id) => {
  const today = new Date().toISOString().split('T')[0];
  let data = await storage.get('tracker', today) || { habits: {} };

  data.date = today;
  data.habits = data.habits || {};
  data.habits[id] = !data.habits[id];

  await storage.put('tracker', data);
  notificationManager.vibrate([50]);
  await renderHabits();
}
