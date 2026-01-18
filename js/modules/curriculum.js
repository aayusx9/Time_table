// curriculum.js - Expanded for Success Monster 4.0
const CURRICULUM = {
    science: {
        'force': {
            title: 'Force (Physics)',
            videos: [
                { title: 'Force & Motion - Class 10 Nepal', url: 'https://www.youtube.com/results?search_query=force+class+10+science+nepal', duration: '45m' },
                { title: 'Newton\'s Laws Deep Dive', url: 'https://www.youtube.com/results?search_query=newton+laws+class+10+nepal', duration: '30m' }
            ]
        },
        'light': {
            title: 'Light (Optics)',
            videos: [
                { title: 'Refraction of Light', url: 'https://www.youtube.com/results?search_query=light+refraction+class+10+nepal', duration: '40m' },
                { title: 'Lens Formula Numerical', url: 'https://www.youtube.com/results?search_query=lens+formula+numerical+class+10', duration: '35m' }
            ]
        },
        'biology': {
            title: 'Biology (Heredity)',
            videos: [
                { title: 'Mendel\'s Laws Explained', url: 'https://www.youtube.com/results?search_query=mendel+laws+class+10+biology+nepal', duration: '50m' }
            ]
        }
    },
    math: {
        'sets': { title: 'Sets Formulae', videos: [{ title: 'Sets Full Chapter', url: 'https://www.youtube.com/results?search_query=sets+class+10+math+nepal', duration: '1h' }] },
        'trigonometry': { title: 'Trigonometry', videos: [{ title: 'Trig Identities', url: 'https://www.youtube.com/results?search_query=trigonometry+class+10+nepal', duration: '1h 15m' }] },
        'algebra': { title: 'Algebra HCF/LCM', videos: [{ title: 'HCF LCM Class 10', url: 'https://www.youtube.com/results?search_query=hcf+lcm+class+10+nepal', duration: '45m' }] }
    },
    coding: {
        'cpp': {
            title: 'C++ Systems Programming',
            videos: [
                { title: 'C++ Pointers & References', url: 'https://www.youtube.com/results?search_query=cpp+pointers+nepali', duration: '20m' },
                { title: 'OOP in C++', url: 'https://www.youtube.com/results?search_query=cpp+oop+nepali', duration: '1h' }
            ],
            tasks: ['Create a Bank System', 'Pointer Memory Map']
        },
        'web': {
            title: 'Full Stack Web',
            videos: [
                { title: 'JS DOM Manipulation', url: 'https://www.youtube.com/results?search_query=javascript+dom+nepali', duration: '40m' }
            ]
        }
    }
};

const curriculum = {
    get: (subject, topic) => {
        if (!CURRICULUM[subject]) return null;
        return CURRICULUM[subject][topic] || null;
    }
};
