// decision.js - Decision Engine (Dark)

function renderDecision() {
  return `
      <div class="animate-fade-in">
          <div class="dark-card" style="text-align: center; padding: 3rem 1.5rem;">
              <h2 style="color: var(--action-cyan); font-size: 1.8rem; margin-bottom: 1rem;">DECISION ENGINE</h2>
              <p style="color: var(--text-muted-on-dark); margin-bottom: 3rem;">How's your vibe right now? (1-10)</p>
  
              <div style="position: relative; max-width: 400px; margin: 0 auto;">
                  <div class="vibe-track">
                      <div class="vibe-fill" id="vibe-fill" style="width: 50%"></div>
                      <div class="vibe-thumb" id="vibe-thumb" style="left: 50%"></div>
                  </div>
                  <input type="range" id="vibe-input" min="1" max="10" value="5" style="position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%;">
              </div>
  
              <div style="display: flex; justify-content: space-between; max-width: 400px; margin: 1rem auto; font-size: 0.8rem; color: var(--text-muted-on-dark);">
                  <span>1 (Low)</span>
                  <span id="vibe-val" style="font-size: 2rem; font-weight: 700; color: var(--success-green);">5</span>
                  <span>10 (High)</span>
              </div>
  
              <p id="vibe-text" style="color: var(--action-cyan); margin-bottom: 2rem;">Solid energy - keep going</p>
  
              <button class="btn-primary" id="get-decision-btn" style="max-width: 200px; margin: 0 auto;">Get Strategy</button>
          </div>
  
          <div id="decision-result" class="hidden animate-slide-up" style="margin-top: 2rem;">
              <!-- Result -->
          </div>
      </div>
    `;
}

function initDecision() {
  const slider = document.getElementById('vibe-input');
  const fill = document.getElementById('vibe-fill');
  const thumb = document.getElementById('vibe-thumb');
  const val = document.getElementById('vibe-val');
  const txt = document.getElementById('vibe-text');

  slider.addEventListener('input', (e) => {
    const v = e.target.value;
    const pct = ((v - 1) / 9) * 100;

    fill.style.width = `${pct}%`;
    thumb.style.left = `${pct}%`;
    val.textContent = v;

    if (v < 4) { txt.textContent = 'Low Energy / Distracted'; val.style.color = 'var(--danger-red)'; fill.style.background = 'var(--danger-red)'; }
    else if (v < 8) { txt.textContent = 'Solid Energy / Focused'; val.style.color = 'var(--success-green)'; fill.style.background = 'var(--success-green)'; }
    else { txt.textContent = 'BEAST MODE / UNSTOPPABLE'; val.style.color = 'var(--brand-primary)'; fill.style.background = 'var(--brand-primary)'; }
  });

  document.getElementById('get-decision-btn').addEventListener('click', () => {
    const v = parseInt(slider.value);
    showStrategy(v);
  });
}

function showStrategy(vibe) {
  const el = document.getElementById('decision-result');
  let plan = {};

  if (vibe <= 3) {
    plan = {
      title: '🔄 REBUILD PROTOCOL',
      color: 'var(--danger-red)',
      actions: ['Go for a 10 min walk', 'Drink 500ml water', 'Do 10 pushups', 'Read 1 page of a book'],
      quote: 'Rest is not quitting. Reset the machine.'
    };
  } else if (vibe <= 7) {
    plan = {
      title: '⚡ MOMENTUM BUILDER',
      color: 'var(--success-green)',
      actions: ['Start with 1 small task (5 mins)', 'Review your Roadmap', 'Fix 1 bug in code', 'Clear desk clutter'],
      quote: 'Motion creates emotion. Just start.'
    };
  } else {
    plan = {
      title: '🚀 EMPIRE EXPANSION',
      color: 'var(--brand-primary)',
      actions: ['Deep Work (2 hours)', 'Build new Agent Feature', 'Learn complex Algorithm', 'Reach out for Network'],
      quote: 'Strike while the iron is hot. Dominate.'
    };
  }

  el.innerHTML = `
          <div class="light-card" style="border-top: 4px solid ${plan.color};">
              <h3 style="color: ${plan.color}; font-size: 1.5rem; margin-bottom: 0.5rem;">${plan.title}</h3>
              <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-style: italic;">"${plan.quote}"</p>
              
              <div style="background: #f8f9fa; border-radius: 1rem; padding: 1.5rem;">
                  ${plan.actions.map(a => `
                      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; font-weight: 500;">
                          <div style="width: 24px; height: 24px; background: ${plan.color}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">✓</div>
                          ${a}
                      </div>
                  `).join('')}
              </div>
          </div>
      `;
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth' });
}
