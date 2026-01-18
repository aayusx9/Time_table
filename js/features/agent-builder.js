// agent-builder.js - AI Builder (Dark IDE Style)

function renderAgentBuilder() {
    return `
      <div class="animate-fade-in">
          <div class="dark-card" style="background: #111; border: 1px solid #333;">
              <h2 style="color: var(--action-cyan); margin-bottom: 0.5rem; font-family: monospace;">> AI_AGENT_BUILDER_v1.0</h2>
              <p style="color: #666; font-size: 0.8rem; font-family: monospace;">Select a template to generate Python 3.x code</p>
          </div>
  
          <div style="display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1rem; margin-top: 2rem;">
              ${templates.map(t => `
                  <button class="agent-card" onclick="loadTemplate('${t.id}')" style="min-width: 160px; padding: 1rem; background: white; border: 1px solid #e5e7eb; border-radius: 1rem; text-align: left; cursor: pointer; transition: transform 0.2s;">
                      <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${t.icon}</div>
                      <div style="font-weight: 700; font-size: 0.9rem;">${t.name}</div>
                  </button>
              `).join('')}
          </div>
  
          <div class="dark-card" style="margin-top: 1rem; font-family: monospace;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                  <span style="color: #666;">main.py</span>
                  <button id="copy-code" style="background: none; border: none; color: var(--action-cyan); cursor: pointer;">[ COPY ]</button>
              </div>
              <pre style="background: #000; padding: 1rem; border-radius: 0.5rem; color: #0f0; overflow-x: auto; font-size: 0.8rem;" id="code-display"># Select a template above...</pre>
          </div>
      </div>
    `;
}

const templates = [
    { id: 'nutrition', name: 'NutritionGuide', icon: '🥦', code: 'class NutritionAgent:\n  def analyze(self, food):\n    # Calculate BMI & suggestions\n    pass' },
    { id: 'maternal', name: 'MaternalCare', icon: '👶', code: 'class MaternalBot:\n  def schedule_checkups(self, trimester):\n    # Return Nepal Govt dates\n    pass' },
    { id: 'vaccine', name: 'VaccineTrack', icon: '💉', code: 'def next_vaccine(dob):\n  # BCG, DPT, Polio schedule\n  pass' }
];

function initAgentBuilder() {
    window.loadTemplate = (id) => {
        const t = templates.find(x => x.id === id);
        document.getElementById('code-display').textContent = t.code;
    };

    document.getElementById('copy-code').addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('code-display').textContent);
        alert('Code copied to clipboard!');
    });
}
