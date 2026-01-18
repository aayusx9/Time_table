// state.js - Task Tracking (v5.0)
class State {
    constructor() {
        this.user = null;
        this.currentDay = null; // "2082-Magh-05"
        this.dailyProgress = {
            completedTasks: [], // IDs of tasks done
            productivityScore: 0
        };
    }

    async load() {
        this.user = await storage.get('profile');

        // Load today's progress if exists
        const todayBS = window.NepaliDate ? NepaliDate.getCurrentBS().full : 'Unknown';
        if (todayBS !== this.currentDay) {
            // New Day check logic could go here
            this.currentDay = todayBS;
            const saved = await storage.getDayLog(this.currentDay);
            if (saved) {
                this.dailyProgress = saved;
            } else {
                this.dailyProgress = { date: this.currentDay, completedTasks: [], productivityScore: 0 };
            }
        }

        return !!this.user;
    }

    async saveProfile(profile) {
        this.user = profile;
        await storage.set('profile', profile);
    }

    async completeTask(taskTime) {
        if (!this.dailyProgress.completedTasks.includes(taskTime)) {
            this.dailyProgress.completedTasks.push(taskTime);
            // Auto save to history
            await storage.saveDailyLog(this.dailyProgress);
            return true;
        }
        return false;
    }

    async undoTask(taskTime) {
        this.dailyProgress.completedTasks = this.dailyProgress.completedTasks.filter(t => t !== taskTime);
        await storage.saveDailyLog(this.dailyProgress);
    }
}

const state = new State();
