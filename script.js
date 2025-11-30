// --- LOGICA DEL MINIGIOCO CYBER-HACK (VERSIONE CORRETTA) ---

const generateCode = () => {
    let code = '';
    for (let i = 0; i < 3; i++) {
        code += Math.floor(Math.random() * 9) + 1; // 1 a 9
    }
    return code;
};

let secretCode = generateCode();
// *** IMPORTANTE: Controlla sempre la Console (F12) per il codice corretto. ***
console.log('Codice Segreto (VERIFICA): ' + secretCode);

const guessInputs = [
    document.getElementById('guess1'),
    document.getElementById('guess2'),
    document.getElementById('guess3')
];
const submitButton = document.getElementById('submit-guess');
const messageElement = document.getElementById('message');
const attemptsList = document.getElementById('attempts-list');

// Funzione per eseguire il controllo del codice
const checkGuess = () => {
    // 1. Lettura e Validazione Input
    const userGuessArr = guessInputs.map(input => input.value);
    const userGuess = userGuessArr.join('');

    if (userGuess.length !== 3 || userGuess.includes('')) {
        messageElement.innerHTML = '<span class="incorrect">ERROR: INPUT INCOMPLETE.</span>';
        return;
    }

    const secretArr = secretCode.split('');
    let tempSecret = [...secretArr];
    let tempGuess = [...userGuessArr];
    
    let correctPosition = 0; // Cifre esatte (verde)
    let misplacedDigits = 0; // Cifre corrette ma fuori posto (giallo)
    let feedback = [];

    // 2. Controlla le cifre CORRETTE (Posizione e Valore)
    for (let i = 0; i < 3; i++) {
        if (tempGuess[i] === tempSecret[i]) {
            feedback[i] = `<span class="correct">${tempGuess[i]}</span>`;
            correctPosition++;
            tempSecret[i] = null; // Annulla per non contarli più
            tempGuess[i] = null; // Annulla per non contarli più
        } else {
            feedback[i] = `<span class="incorrect">${tempGuess[i]}</span>`; // Inizializza come sbagliato
        }
    }

    // 3. Controlla le cifre SPOSTATE (Valore corretto, Posizione sbagliata)
    for (let i = 0; i < 3; i++) {
        if (tempGuess[i] !== null) {
            const misplacedIndex = tempSecret.indexOf(tempGuess[i]);
            if (misplacedIndex !== -1) {
                // Trovato un numero corretto ma fuori posto
                feedback[i] = `<span class="misplaced">${tempGuess[i]}</span>`;
                misplacedDigits++;
                tempSecret[misplacedIndex] = null; // Segna come usato
            }
        }
    }
    
    // 4. Mostra il Risultato
    if (correctPosition === 3) {
        messageElement.innerHTML = `<span class="correct">ACCESS GRANTED! CODE: [${secretCode}]</span> <button class="neon-button" onclick="resetGame()">REBOOT</button>`;
        submitButton.disabled = true;
    } else {
        messageElement.innerHTML = `<span class="incorrect">ACCESS DENIED. ${correctPosition} CORRECT (Pos/Val). ${misplacedDigits} MISPLACED (Val).</span>`;
    }
    
    // 5. Aggiungi il tentativo al log
    const attemptItem = document.createElement('li');
    attemptItem.innerHTML = `[ATTEMPT: ${attemptsList.children.length + 1}] CODE: ${feedback.join('')}`;
    attemptsList.prepend(attemptItem);
    
    // Pulisci e metti a fuoco
    guessInputs.forEach(input => input.value = '');
    guessInputs[0].focus();
};

const resetGame = () => {
    secretCode = generateCode();
    console.log('NUOVO Codice Segreto (VERIFICA): ' + secretCode);
    messageElement.textContent = '';
    attemptsList.innerHTML = '';
    submitButton.disabled = false;
    guessInputs.forEach(input => input.value = '');
    guessInputs[0].focus();
};

submitButton.addEventListener('click', checkGuess);

// Gestione Focus e Invio tramite tastiera
guessInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length > 1) {
            e.target.value = e.target.value.slice(0, 1);
        }
        if (e.target.value && index < guessInputs.length - 1) {
            guessInputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkGuess();
        }
    });
});

// OROLOGIO FOOTER (Rimane invariato)

const updateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('time-display').textContent = `${hours}:${minutes}:${seconds}`;
};

setInterval(updateTime, 1000);

updateTime();
