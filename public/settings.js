const thumbnails = document.getElementById('thumbnail');

const settingFieldConfig = {
    'name': {
        name: 'nom',
        type: 'input',
        valueField: 'value',
        hasLabel: true,
        properties: {
            type: 'text',
            value: '#value'
        }
    },
    'picture': {
        name: 'image',
        type: 'img',
        valueField: 'src',
        properties: {
            width: 144,
            height: 144,
            src: '#value'
        }
    },
    'dailyObjective' : {
        name: 'objectif quotidien',
        type: 'input',
        valueField: 'value',
        hasLabel: true,
        properties: {
            type: 'number',
            value: '#value'
        }
    },
    'currentObjective': {
        name: 'avancement actuel',
        type: 'input',
        valueField: 'value',
        hasLabel: true,
        properties: {
            type: 'number',
            value: '#value'
        }
    },
    'default': {
        name: 'champ inconnu',
        type: 'input',
        valueField: 'value',
        hasLabel: true,
        properties: {
            type: 'text',
            value: '#value'
        }
    }
};

function getSettings() {
    const settings = localStorage.getItem('settings');
    try {
        return JSON.parse(settings);
    } catch (e) {
        console.error(e);
        return null;
    }
}

function setSettings(settings) {
    try {
        localStorage.setItem('settings', JSON.stringify(settings));
    } catch (e) {
        console.error(e);
    }
}

function resize(tm, e) {
    const c = document.createElement('canvas');
    c.width = 144;
    c.height = 144;
    const ctx = c.getContext('2d');
    ctx.drawImage(e.target, 0, 0, e.target.width, e.target.height, 0, 0, 144, 144);
    tm.src = c.toDataURL('image/jpeg', 0.92);
}

function newThumbnail (tmb, e) {
    if (e.target.files[0]) {
        const fr = new FileReader();
        const pr = new Image();

        fr.addEventListener('load', function () {
            pr.addEventListener('load', resize.bind(null, tmb), false);
            pr.src = fr.result;
        }, false);

        fr.readAsDataURL(e.target.files[0]);
    }
}

function clearElement (el) {
    let child;
    while ((child = el.firstChild) !== null) {
        el.removeChild(child);
    }
}

function createElWithBinding(type, child, className, eventType, cb, ...args) {
    if (typeof type === 'string') {
        const el = document.createElement(type);
        if (child) {
            el.appendChild(child);
        }
        if (className) {
            el.className = className;
        }
        if (eventType && cb) {
            el.addEventListener(eventType, cb.bind(el, ...args), false);
        }
        return el;
    }

    return null;
}

function getSettingsValues(name) {
    const settings = document.querySelectorAll(`.setting-${name}`);
    const ret = {};
    Array.prototype.forEach.call(settings, (setting) => {
        const settingName = setting.id.split('-')[1];
        ret[settingName] = setting[settingFieldConfig[settingName].valueField];
    });
    return ret;
}

function updateSetting(name) {
    const updatedSettings = getSettingsValues(name);
    const currentSettings = getSettings();
    if (currentSettings) {
        currentSettings[name] = updatedSettings;
        setSettings(currentSettings);
    }
}

function deleteSetting(name) {
    const currentSettings = getSettings();
    if (currentSettings.hasOwnProperty(name)) {
        delete currentSettings[name];
        setSettings(currentSettings);
        document.getElementById('settings').removeChild(document.getElementById(`setting-${name}-container`));
    }
}

function populateElementFromSetting (element, settingValue, properties) {
    for (let property in properties) {
        if (properties.hasOwnProperty(property)) {
            const propertyVal = properties[property];
            if (propertyVal === '#value') element[property] = settingValue;
            else element[property] = propertyVal;
        }
    }
}

function createLabel(forId, settingName) {
    const label = document.createElement('label');
    label.htmlFor = forId;
    label.appendChild(document.createTextNode(`${settingFieldConfig[settingName].name} : `));

    return label;
}

function createElementFromSetting (setDiv, setting, settingName, name) {
    const settingConfig = settingFieldConfig[settingName] || 'default';
    const el = document.createElement(settingConfig.type);
    const settingId = `setting-${settingName}-${name}`;
    el.id = settingId;
    el.className += ` setting-${name}`;
    if (settingConfig.properties) populateElementFromSetting(el, setting[settingName], settingConfig.properties);
    if (settingConfig.hasLabel) {
        // setDiv.appendChild(createLabel(settingId, settingName));
    }
    setDiv.appendChild(el);
    setDiv.appendChild(document.createElement('br'));

    return el;
}

function createHiddenFileInput(parent, img, id) {
    const input = createElWithBinding('input', null, 'dsp-hidden', 'change', newThumbnail, img);
    input.type = 'file';
    input.accept = 'image/*';
    input.id = id;
    parent.appendChild(input);
}

function populateSetting (parent, setting, name) {
    const setDiv = document.createElement('div');
    setDiv.id = `setting-${name}-container`;
    for (let settingName in setting) {
        if (setting.hasOwnProperty(settingName)) {
            if (settingName === 'picture') {
                const inputId = `hidden-${settingName}-${name}`;
                const label = document.createElement('label');
                const img = createElementFromSetting(label, setting, settingName, name);
                label.htmlFor = inputId;
                setDiv.appendChild(label);
                createHiddenFileInput(setDiv, img, inputId);
            } else {
                createElementFromSetting(setDiv, setting, settingName, name);
            }
        }
    }

    setDiv.appendChild(createElWithBinding('button', document.createTextNode('update'), null, 'click', updateSetting, name));
    setDiv.appendChild(createElWithBinding('button', document.createTextNode('delete'), null, 'click', deleteSetting, name));
    parent.appendChild(setDiv);
}

populateSettings = () => {
    const setting = document.getElementById('settings');
    clearElement(setting);
    const sets = getSettings();
    if (sets) {
        for (let set in sets) {
            if (sets.hasOwnProperty(set)) {
                populateSetting(setting, sets[set], set);
            }
        }
    }
};


populateSettings();
