// onboarding.js - The Wizard
const Wizard = {
    steps: [
        {
            id: 'identity',
            html: `
                <h2 class="title-gradient" style="font-size: 2rem; margin-bottom: 1rem;">Protocol Initiation</h2>
                <p style="margin-bottom: 2rem; color: var(--text-muted);">Welcome, Future Legend. Let's calibrate your Life OS.</p>
                <div class="input-group">
                    <label class="input-label">Identity Name</label>
                    <input type="text" id="wiz-name" class="glass-input" placeholder="e.g. Aayush Bhandari">
                </div>
                <div class="input-group">
                    <label class="input-label">Ultimate Goal</label>
                    <input type="text" id="wiz-goal" class="glass-input" placeholder="e.g. 100M Net Worth by 18">
                </div>
            `
        },
        {
            id: 'rhythm',
            html: `
                <h2 class="title-gradient" style="font-size: 2rem; margin-bottom: 1rem;">Daily Rhythm</h2>
                <p style="margin-bottom: 2rem; color: var(--text-muted);">Syncing biological clock...</p>
                <div class="input-group">
                    <label class="input-label">Wake Up Time</label>
                    <input type="time" id="wiz-wake" class="glass-input" value="06:00">
                </div>
                <div class="input-group">
                    <label class="input-label">School Start</label>
                    <input type="time" id="wiz-school-start" class="glass-input" value="10:00">
                </div>
                <div class="input-group">
                    <label class="input-label">School End</label>
                    <input type="time" id="wiz-school-end" class="glass-input" value="16:00">
                </div>
            `
        },
        {
            id: 'focus',
            html: `
                <h2 class="title-gradient" style="font-size: 2rem; margin-bottom: 1rem;">Target Lock</h2>
                <p style="margin-bottom: 2rem; color: var(--text-muted);">What do we crush today?</p>
                <div class="input-group">
                    <label class="input-label">Weak Subject</label>
                    <select id="wiz-subject" class="glass-input">
                        <option value="science">Science</option>
                        <option value="math">Math</option>
                    </select>
                </div>
                <div class="input-group">
                    <label class="input-label">Topic</label>
                    <select id="wiz-topic" class="glass-input">
                        <option value="force">Force</option>
                        <option value="light">Light</option>
                        <option value="heredity">Heredity</option>
                        <option value="sets">Sets</option>
                        <option value="trigonometry">Trigonometry</option>
                    </select>
                </div>
            `
        }
    ],

    currentStep: 0,
    data: {},

    start: () => {
        Wizard.currentStep = 0;
        Wizard.render();
    },

    render: () => {
        const container = document.getElementById('wizard');
        const step = Wizard.steps[Wizard.currentStep];

        container.innerHTML = `
            <div class="animate-in">
                ${step.html}
                <button class="btn" onclick="Wizard.next()">
                    ${Wizard.currentStep === Wizard.steps.length - 1 ? 'Initialize OS' : 'Next Stage ->'}
                </button>
            </div>
        `;
        UI.show('wizard');
        UI.hide('dashboard');
        UI.hide('loading');
    },

    next: async () => {
        // Harvest Data
        if (Wizard.currentStep === 0) {
            Wizard.data.name = document.getElementById('wiz-name').value;
            Wizard.data.goal = document.getElementById('wiz-goal').value;
            if (!Wizard.data.name) return alert('Identity required.');
        } else if (Wizard.currentStep === 1) {
            Wizard.data.wakeTime = document.getElementById('wiz-wake').value;
            Wizard.data.schoolStart = document.getElementById('wiz-school-start').value;
            Wizard.data.schoolEnd = document.getElementById('wiz-school-end').value;
        } else if (Wizard.currentStep === 2) {
            Wizard.data.focusSubject = document.getElementById('wiz-subject').value;
            Wizard.data.focusTopic = document.getElementById('wiz-topic').value;
        }

        // Navigate
        if (Wizard.currentStep < Wizard.steps.length - 1) {
            Wizard.currentStep++;
            Wizard.render();
        } else {
            // Finish
            UI.show('loading');
            UI.hide('wizard');
            await state.saveProfile(Wizard.data);
            setTimeout(() => location.reload(), 1000); // Reload to load Dashboard
        }
    }
};

window.Wizard = Wizard; // Expose global
