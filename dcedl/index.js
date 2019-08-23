(function(win, document){
    // Display logic
    let gameTimer;
    let gameState;
    let gameContent;

    function clearGame() {
        let child;
        gameState = null;
        if (gameTimer) {
            clearTimeout(gameTimer);
            gameTimer = null;
        }
        if (gameContent) {
            while ((child = gameContent.firstChild) !== null) {
                gameContent.removeChild(child);
            }
        }
    }

    function hideContentButOne(type) {
        const contents = document.querySelectorAll('.content');
        Array.from(contents).forEach((content) => {
            if (content.id === type) content.className = content.className.replace(/dsp-[^\s]*/, 'dsp-bck');
            else content.className = content.className.replace(/dsp-[^\s]*/, 'dsp-hdn');
        });
    }

    function displayChoice(e) {
        const type = e.target.value;
        clearGame();
        hideContentButOne(type);
    }

    Array.from(document.querySelectorAll('.btn-choice')).forEach((choiceEl) => {
        choiceEl.addEventListener('click', displayChoice, false);
    });

    // Games logic
    // dc
    const dcLaunch = document.getElementById('dc-launch');
    const dcContent = document.getElementById('dc-content');

    function startDC() {
        let s;
        const g = win.dcInit();
        gameContent = dcContent;
        clearGame();
        dcContent.appendChild(document.createTextNode(`${g.draw.join(', ')} looking for ${g.target}\n\n`));
        gameTimer = setTimeout(() => {
            dcContent.appendChild(document.createTextNode(`${s.solution}\n`));
        }, 30000);
        setTimeout(() => {
            s = win.dcSolve(g);
        });
    }

    dcLaunch.addEventListener('click', startDC, false);

    // dl
    const dlLaunch = document.getElementById('dl-launch');
    const dlVowel = document.getElementById('dl-vowel');
    const dlConsonant = document.getElementById('dl-consonant');
    const dlContent = document.getElementById('dl-content');

    function drawLetter(type) {
        gameContent = dlContent;
        if (Array.isArray(gameState)) {
            if(gameState.length < 10) {
                const l = win.dlLetter(type);
                gameState.push(l);
                dlContent.appendChild(document.createTextNode(`, ${l}`));
                if (gameState.length === 10 && !gameTimer) {
                    startDL();
                }
            }
        } else {
            const l = win.dlLetter(type);
            gameState = [l];
            dlContent.appendChild(document.createTextNode(l));
        }
    }

    function draw() {
        gameContent = dlContent;
        clearGame();
        gameState = win.dlDraw();
        dlContent.appendChild(document.createTextNode(gameState.join(', ')));
        startDL();
    }

    function startDL() {
        clearTimeout(gameTimer);
        gameTimer = setTimeout(() => {
            if (Array.isArray(gameState)) {
                const s = win.dlMaxAvail(gameState);
                dlContent.appendChild(document.createTextNode(`\n\nRéponses : ${s.map(el => `${el} (${el.length})`).join(', ')}`));
            }
        }, 30000);
    }


    dlVowel.addEventListener('click', drawLetter.bind(null, 'vowel'), false);
    dlConsonant.addEventListener('click', drawLetter.bind(null, 'consonant'), false);
    dlLaunch.addEventListener('click', draw, false);
})(window, document);
