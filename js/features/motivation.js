// motivation.js - Daily Motivation (Clean Dark)

function renderMotivation() {
    return `
      <div class="animate-fade-in" style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
          <div class="dark-card" style="text-align: center; padding: 3rem 2rem; background: linear-gradient(135deg, #1a1a1a 0%, #000 100%); border: 1px solid #333;">
              <div style="font-size: 4rem; margin-bottom: 1rem;">🔥</div>
              <h2 style="font-size: 1.5rem; color: white; margin-bottom: 2rem; line-height: 1.6;">
                  "Aayush, you are not here to be average. You are here to build an empire. Every second you waste is money lost."
              </h2>
              <p style="color: var(--brand-primary); font-weight: 700;">- Future Self</p>
          </div>
  
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 2rem;">
              <div class="light-card" style="text-align: center; padding: 2rem;">
                  <h3 style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem;">Days Left to 18</h3>
                  <div style="font-size: 2.5rem; font-weight: 800; color: var(--text-main);">~600</div>
              </div>
               <div class="light-card" style="text-align: center; padding: 2rem;">
                  <h3 style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem;">Target Net Worth</h3>
                  <div style="font-size: 2.5rem; font-weight: 800; color: var(--success-green);">100M</div>
              </div>
          </div>
      </div>
    `;
}

function initMotivation() {
    // Could cycle quotes
}
