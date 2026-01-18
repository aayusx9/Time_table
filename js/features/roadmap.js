// roadmap.js - Interactive Roadmap (Accordion Style)

function renderRoadmap() {
  return `
    <div class="animate-fade-in">
        <div class="light-card" style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">Your Roadmap to NPR 100M</h2>
            <p style="color: var(--text-muted);">Uncopyable path from Lumbini to multi-millionaire by 18</p>
        </div>

        <div id="roadmap-container">
            <!-- Phases injected here -->
        </div>
    </div>
  `;
}

const roadmapData = [
  {
    id: 'phase1',
    title: 'Phase 1: Foundation Forge',
    date: 'Jan-Mar 2026',
    status: 'ACTIVE',
    icon: 'target',
    desc: 'Crush SEE (Chaitra 2082 BS ~Mar 2026) while building core skills',
    moves: [
      'Cipher Coding: Build encrypted Python agents for practice',
      'Decision Tree Scripts: Create logic-based automation tools',
      'Pitch Teacher: Present coding projects to teachers at Shree Mavi',
      'Lumbini Health Scraper: Collect maternal health data from NRB/local sources'
    ],
    metrics: ['85% SEE Score', '30-day streak', 'NPR 5K Saved']
  },
  {
    id: 'phase2',
    title: 'Phase 2: Arsenal Assembly',
    date: 'Apr-Dec 2026',
    status: 'LOCKED',
    icon: 'zap',
    desc: 'Prototype HealthGuardian & Build Network',
    moves: ['Vibe Agent: Hybrid code', 'Shadow Network: Teach peers', 'Barter for Upgrades'],
    metrics: ['100 Users', 'NPR 50K Revenue']
  },
  {
    id: 'phase3',
    title: 'Phase 3: Disruption Launch',
    date: '2027',
    status: 'LOCKED',
    icon: 'rocket',
    desc: 'Monetize SaaS & Scale',
    moves: ['Tharu Dialect Support', 'Event Infiltrate (NYEF)', 'Human Negotiate'],
    metrics: ['10K Users', 'NPR 5M ARR']
  },
  {
    id: 'phase4',
    title: 'Phase 4: Empire Conquest',
    date: '2028-2029',
    status: 'LOCKED',
    icon: 'trophy',
    desc: 'Exit Strategy & Impact',
    moves: ['Global Adapt', 'Exit Simulator', 'Legacy Lock'],
    metrics: ['1M Impact', 'NPR 100M Exit']
  }
];

function initRoadmap() {
  const container = document.getElementById('roadmap-container');

  container.innerHTML = roadmapData.map((phase, index) => `
        <div class="accordion-item ${phase.status === 'ACTIVE' ? 'accordion-featured' : ''}">
            <div class="accordion-header" onclick="toggleAccordion(${index})">
                <div class="accordion-icon">
                    ${getIcon(phase.icon)}
                </div>
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-weight: 700; font-size: 1.1rem; color: var(--text-main);">${phase.title}</span>
                        ${phase.status === 'ACTIVE' ? '<span style="font-size: 0.7rem; background: #fdf4ff; color: var(--brand-primary); padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700;">ACTIVE</span>' : ''}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">${phase.date}</div>
                </div>
                <svg class="chevron-${index}" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="transition: transform 0.2s;"><path d="M19 9l-7 7-7-7"/></svg>
            </div>
            
            <div id="acc-content-${index}" class="accordion-content ${phase.status === 'ACTIVE' ? 'open' : ''}">
                <p style="margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.95rem;">${phase.desc}</p>
                
                <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 1rem;">Strategic Moves</h4>
                <div style="background: #f8f9fa; border-radius: 0.5rem; padding: 0.5rem;">
                    ${phase.moves.map(move => `
                        <div style="padding: 0.8rem; display: flex; align-items: center; gap: 0.8rem; border-bottom: 1px solid #e5e7eb;">
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: #e5e7eb; border: 2px solid #d1d5db;"></div>
                            <span style="font-size: 0.9rem; color: var(--text-main);">${move}</span>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top: 1.5rem;">
                    <button class="btn-primary" style="width: auto; font-size: 0.9rem;">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

window.toggleAccordion = function (index) {
  const content = document.getElementById(`acc-content-${index}`);
  const chev = document.querySelector(`.chevron-${index}`);

  if (content.classList.contains('open')) {
    content.classList.remove('open');
    chev.style.transform = 'rotate(0deg)';
  } else {
    // Close others? For now allow multiple
    content.classList.add('open');
    chev.style.transform = 'rotate(180deg)';
  }
}

function getIcon(name) {
  if (name === 'target') return `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;
  if (name === 'zap') return `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
  if (name === 'rocket') return `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>`; // Simplification
  return `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
}
