// ui.js - Completed Task Logic
const UI = {
    show: (id) => document.getElementById(id).classList.remove('hidden'),
    hide: (id) => document.getElementById(id).classList.add('hidden'),

    toggleSidebar: () => {
        document.getElementById('sidebar').classList.toggle('open');
    },

    setGreeting: () => {
        const now = UI.getNepalTime();
        const hours = now.getHours();
        const el = document.getElementById('greeting');
        let greeting = "Good Morning";
        if (hours >= 12 && hours < 17) greeting = "Good Afternoon";
        else if (hours >= 17 && hours < 21) greeting = "Good Evening";
        else if (hours >= 21 || hours < 5) greeting = "Good Night";
        el.textContent = `${greeting}, Aayush.`;
    },

    renderSidebar: (timeline) => {
        const container = document.getElementById('timeline-list');
        const now = UI.getNepalTime();
        const currentHour = now.getHours();

        // Get completed tasks from state
        const completed = state.dailyProgress ? state.dailyProgress.completedTasks : [];

        container.innerHTML = timeline.map(item => {
            const itemHour = parseInt(item.time.split(':')[0]);
            const endHour = itemHour + (item.duration / 60 || 1);
            const isCurrent = currentHour >= itemHour && currentHour < endHour;
            const isDone = completed.includes(item.time);

            return `
                <div class="timeline-card ${isCurrent ? 'active' : ''}" style="${isDone ? 'opacity: 0.5; background: #f0fdf4;' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <div style="font-weight: 700; color: ${isCurrent ? 'var(--green-tea)' : 'var(--text-muted)'}; margin-bottom: 4px;">
                                ${item.time}
                            </div>
                            <div style="font-weight: 600; font-size: 0.95rem; ${isDone ? 'text-decoration: line-through;' : ''}">${item.title}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">${item.duration || 60}m</div>
                        </div>
                        <button onclick="UI.toggleTask('${item.time}')" style="
                            background: ${isDone ? 'var(--green-tea)' : 'white'}; 
                            border: 1px solid #ddd; 
                            width: 24px; height: 24px; 
                            border-radius: 50%; 
                            cursor: pointer;
                            display: flex; align-items: center; justify-content: center; color: white;">
                            ${isDone ? '✓' : ''}
                        </button>
                    </div>
                </div>
             `;
        }).join('');
    },

    toggleTask: async (time) => {
        const isDone = state.dailyProgress.completedTasks.includes(time);
        if (isDone) {
            await state.undoTask(time);
        } else {
            await state.completeTask(time);
        }
        // Re-render
        app.reloadSidebar();
    },

    renderActiveTask: (timeline) => {
        const now = UI.getNepalTime();
        const currentHour = now.getHours();

        const currentTask = timeline.find(item => {
            const h = parseInt(item.time.split(':')[0]);
            return currentHour >= h && currentHour < (h + (item.duration / 60 || 1));
        }) || { title: 'Free Time', desc: 'No protocol active.', time: 'Now' };

        document.getElementById('current-title').textContent = currentTask.title;
        UI.startTimer(currentTask);
    },

    startTimer: (task) => {
        if (window.timerInterval) clearInterval(window.timerInterval);
        const update = () => {
            const now = UI.getNepalTime();
            if (task.title === 'Free Time') {
                const pad = (n) => String(n).padStart(2, '0');
                document.getElementById('main-timer').textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
                return;
            }
            const startH = parseInt(task.time.split(':')[0]);
            const durationMins = task.duration || 60;
            const endTotalMins = (startH * 60) + durationMins;
            const nowTotalMins = (now.getHours() * 60) + now.getMinutes();
            let diffMins = endTotalMins - nowTotalMins;
            let diffSecs = 60 - now.getSeconds();
            if (diffSecs === 60) { diffSecs = 0; } else { diffMins -= 1; }

            if (diffMins < 0) {
                document.getElementById('main-timer').textContent = "COMPLETE";
            } else {
                document.getElementById('main-timer').textContent =
                    `${String(diffMins).padStart(2, '0')}:${String(diffSecs).padStart(2, '0')}`;
            }
        };
        update();
        window.timerInterval = setInterval(update, 1000);
    },

    getNepalTime: () => {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000 * 5.75));
    }
};
