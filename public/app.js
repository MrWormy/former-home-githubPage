const DEFAULT_SETTINGS = {
    water: {
        picture: './public/icon144.png',
        dailyObjective: 8,
        currentObjective: 0
    }
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(function (reg) {
            // registration worked
            console.log('SW Registration succeeded. Scope is ' + reg.scope);
        }).catch(function (error) {
        // registration failed
        console.log('SW Registration failed with ' + error);
    });
}

function resetSettings() {
    localStorage.setItem('settings', JSON.stringify(DEFAULT_SETTINGS));
    return JSON.parse(localStorage.getItem('settings'));
}

function loadSetting() {
    const set = localStorage.getItem('settings');
    if (set) {
        try {
            return JSON.parse(set);
        } catch (e) {
            console.log('unknown settings, resetting...');
            return resetSettings();
        }
    } else return resetSettings();

}

const els = loadSetting();

for (let item in els) {
    const picture = new Image();
    picture.src = els[item].picture;
    document.body.appendChild(picture);
}

