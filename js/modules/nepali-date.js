// nepali-date.js - Bikram Sambat Converter
// Simplified approximate conversion for demo (Full calendar requires massive logic)
// Assuming current AD 2026 = BS 2082/2083
const NepaliDate = {
    months: [
        "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
        "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
    ],

    // Manual offset for 2026 AD -> 2082/83 BS
    // Jan 1 2026 is roughly Poush 17, 2082
    convertToBS: (dateObj) => {
        const startAD = new Date("2026-01-01"); // Reference
        const startBS = { y: 2082, m: 8, d: 17 }; // Poush is index 8 (0-based)

        const diffTime = dateObj - startAD;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Approximate month length (avg 30 days)
        let totalDays = startBS.d + diffDays;
        let currentMonth = startBS.m;
        let currentYear = startBS.y;

        while (totalDays > 30) {
            totalDays -= 30; // Rough approximation
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }

        return {
            year: currentYear,
            month: NepaliDate.months[currentMonth],
            day: Math.max(1, Math.floor(totalDays)),
            full: `${NepaliDate.months[currentMonth]} ${Math.floor(totalDays)}, ${currentYear}`
        };
    },

    getCurrentBS: () => {
        return NepaliDate.convertToBS(new Date());
    }
};

// Expose
window.NepaliDate = NepaliDate;
