// scheduler.js - The Brain (Advanced 4.0)
class Scheduler {
    generate(user) {
        const timeline = [];

        // 1. Miracle Morning
        timeline.push({
            time: user.wakeTime,
            title: 'Miracle Morning',
            type: 'ritual',
            desc: 'Hydrate • Exercise • Visualize Success',
            duration: 60
        });

        // 2. The Edge (Coding)
        const wakeHour = parseInt(user.wakeTime.split(':')[0]);
        const schoolStartHour = parseInt(user.schoolStart.split(':')[0]);

        if (schoolStartHour - wakeHour > 2) {
            timeline.push({
                time: `${wakeHour + 1}:00`,
                title: 'Deep Coding Session',
                type: 'code',
                desc: 'Build your empire before the world wakes up.',
                action: 'Code C++ / Web',
                url: 'https://docs.google.com'
            });
        }

        // 3. School Block
        timeline.push({
            time: user.schoolStart,
            title: 'School Mode',
            type: 'school',
            desc: 'Network with teachers. Learn socially. Don\'t sleep.',
            duration: (parseInt(user.schoolEnd.split(':')[0]) - schoolStartHour) * 60
        });

        // 4. Recovery
        timeline.push({
            time: user.schoolEnd,
            title: 'Power Nap / Recovery',
            type: 'rest',
            desc: 'Reset the brain. 20 mins max.',
            duration: 45
        });

        // 5. Academic Focus
        const studyTime = parseInt(user.schoolEnd.split(':')[0]) + 1;
        const subject = user.focusSubject || 'science';
        const topic = user.focusTopic || 'force';
        const content = curriculum.get(subject, topic);

        timeline.push({
            time: `${studyTime}:00`,
            title: `Master ${subject.toUpperCase()}`,
            type: 'study',
            desc: `Focus Topic: ${content ? content.title : topic}`,
            action: content ? 'Watch Class' : null,
            url: content ? content.videos[0].url : '#',
            duration: 90
        });

        // 6. Physical Activity (New)
        timeline.push({
            time: `${studyTime + 2}:00`,
            title: 'Physical Activation',
            type: 'health',
            desc: 'Pushups, Running, or Yoga. Healthy body = Strong Code.',
            duration: 45
        });

        // 7. Entertainment (New)
        timeline.push({
            time: `${studyTime + 3}:00`,
            title: 'Guilt-Free Entertainment',
            type: 'fun',
            desc: 'Watch Anime, Play Games. You earned it.',
            duration: 60
        });

        return timeline;
    }
}

const scheduler = new Scheduler();
