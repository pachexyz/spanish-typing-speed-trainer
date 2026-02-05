// ===== Spanish Words Database =====
const spanishWords = [
    // Common words
    'casa','perro','gato','libro','mesa','silla','agua','fuego','tierra','aire',
    'sol','luna','estrella','nube','lluvia','viento','mar','río','montaña','valle',
    'ciudad','pueblo','calle','puerta','ventana','techo','pared','piso','jardín','árbol',
    'flor','planta','fruta','verdura','pan','leche','queso','carne','pescado','pollo',
	'extraordinario','aproximadamente','responsabilidad','desafortunadamente',
    'interdisciplinario','internacionalización','descentralización',
    'configuración','autenticación','visualización','compatibilidad',
    'programación','documentación','funcionalidad','rendimiento',
    
    // Medium difficulty
    'computadora','teléfono','televisión','música','película','fotografía','pintura','escultura',
    'universidad','escuela','biblioteca','hospital','restaurante','supermercado','farmacia',
    'automóvil','bicicleta','motocicleta','avión','barco','tren','autobús','camión',
    'primavera','verano','otoño','invierno','febrero','septiembre','noviembre',
    
    // More complex
    'democracia','tecnología','economía','filosofía','psicología','biología','química','física',
    'matemáticas','geografía','historia','literatura','arquitectura','ingeniería','medicina',
    'comunicación','información','educación','investigación','desarrollo','innovación',
    'creatividad','imaginación','inspiración','motivación','dedicación','perseverancia',
    'responsabilidad','productividad','competitividad','sostenibilidad','globalización',
    
    // Action words
    'correr','saltar','caminar','nadar','volar','bailar','cantar','escribir','leer','estudiar',
    'trabajar','jugar','dormir','comer','beber','hablar','escuchar','mirar','pensar','soñar',
    'analizar','resolver','construir','desarrollar','implementar','optimizar','evaluar',
    
    // Descriptive words
    'hermoso','grande','pequeño','rápido','lento','fuerte','débil','alto','bajo','largo',
    'corto','nuevo','viejo','joven','antiguo','moderno','clásico','elegante','simple','complejo',
    'eficiente','robusto','flexible','preciso','consistente','intuitivo','acción','rápidamente',
	'difícil','comunicación','información','educación',
    'carácter','lógica','técnicamente','fácilmente','público','privado'
];

// ===== Game State =====
let gameState = {
    currentWord: '',
    successCount: 0,
    errorCount: 0,
    timeRemaining: 60,
    totalTime: 60,
    timerInterval: null,
    isGameActive: false,
    selectedLevel: 'easy'
};

// ===== DOM Elements =====
const elements = {
    levelSelector: document.getElementById('levelSelector'),
    gameArea: document.getElementById('gameArea'),
    resultsScreen: document.getElementById('resultsScreen'),
    currentWordDisplay: document.getElementById('currentWord'),
    wordInput: document.getElementById('wordInput'),
    timer: document.getElementById('timer'),
    successCount: document.getElementById('successCount'),
    errorCount: document.getElementById('errorCount'),
    progressBar: document.getElementById('progressBar'),
    finalSuccess: document.getElementById('finalSuccess'),
    finalErrors: document.getElementById('finalErrors'),
    accuracy: document.getElementById('accuracy'),
    wpm: document.getElementById('wpm'),
    restartBtn: document.getElementById('restartBtn')
};

// ===== Level Selection =====
document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const level = btn.dataset.level;
        const time = parseInt(btn.dataset.time);
        startGame(level, time);
    });
});

// ===== Start Game =====
function startGame(level, time) {
    // Reset game state
    gameState = {
        currentWord: '',
        successCount: 0,
        errorCount: 0,
        timeRemaining: time,
        totalTime: time,
        timerInterval: null,
        isGameActive: true,
        selectedLevel: level
    };
    
    // Update UI
    elements.levelSelector.classList.add('hidden');
    elements.gameArea.classList.remove('hidden');
    elements.resultsScreen.classList.add('hidden');
    
    // Reset displays
    elements.successCount.textContent = '0';
    elements.errorCount.textContent = '0';
    elements.timer.textContent = time;
    elements.wordInput.value = '';
    elements.wordInput.disabled = false;
    elements.wordInput.focus();
    
    // Start game
    generateNewWord();
    startTimer();
}

// ===== Generate New Word =====
function generateNewWord() {
    const randomIndex = Math.floor(Math.random() * spanishWords.length);
    gameState.currentWord = spanishWords[randomIndex];
    elements.currentWordDisplay.textContent = gameState.currentWord;
    
    // Remove any feedback classes
    elements.currentWordDisplay.classList.remove('correct', 'incorrect');
    elements.wordInput.classList.remove('correct', 'incorrect');
}

// ===== Timer =====
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        elements.timer.textContent = gameState.timeRemaining;
        
        // Update progress bar
        const progress = (gameState.timeRemaining / gameState.totalTime) * 100;
        elements.progressBar.style.width = progress + '%';
        
        // Timer warning (last 10 seconds)
        if (gameState.timeRemaining <= 10) {
            elements.timer.style.color = '#ff6a00';
        }
        
        // Game over
        if (gameState.timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

// ===== Input Validation =====
elements.wordInput.addEventListener('input', (e) => {
    if (!gameState.isGameActive) return;
    
    const typedWord = e.target.value.trim().toLowerCase();
    const currentWord = gameState.currentWord.toLowerCase();
    
    // Check if word is complete
    if (typedWord === currentWord) {
        // Correct word
        handleCorrectWord();
    } else if (typedWord.length > 0) {
        // Check if typing is on the right track
        if (currentWord.startsWith(typedWord)) {
            // Still typing correctly
            elements.wordInput.classList.remove('incorrect');
            elements.wordInput.classList.add('correct');
        } else {
            // Typing incorrectly
            elements.wordInput.classList.remove('correct');
            elements.wordInput.classList.add('incorrect');
        }
    } else {
        // Empty input
        elements.wordInput.classList.remove('correct', 'incorrect');
    }
});

// ===== Handle Enter Key =====
elements.wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && gameState.isGameActive) {
        const typedWord = e.target.value.trim().toLowerCase();
        const currentWord = gameState.currentWord.toLowerCase();
        
        if (typedWord === currentWord) {
            handleCorrectWord();
        } else if (typedWord.length > 0) {
            handleIncorrectWord();
        }
    }
});

// ===== Handle Correct Word =====
function handleCorrectWord() {
    gameState.successCount++;
    elements.successCount.textContent = gameState.successCount;
    
    // Visual feedback
    elements.currentWordDisplay.classList.add('correct');
    elements.wordInput.classList.add('correct');
    elements.wordInput.classList.remove('incorrect');
    
    // Play success animation
    setTimeout(() => {
        elements.wordInput.value = '';
        generateNewWord();
        elements.wordInput.classList.remove('correct');
    }, 300);
}

// ===== Handle Incorrect Word =====
function handleIncorrectWord() {
    gameState.errorCount++;
    elements.errorCount.textContent = gameState.errorCount;
    
    // Visual feedback
    elements.currentWordDisplay.classList.add('incorrect');
    elements.wordInput.classList.add('incorrect');
    elements.wordInput.classList.remove('correct');
    
    // Shake animation and reset
    setTimeout(() => {
        elements.wordInput.value = '';
        elements.currentWordDisplay.classList.remove('incorrect');
        elements.wordInput.classList.remove('incorrect');
    }, 400);
}

// ===== End Game =====
function endGame() {
    gameState.isGameActive = false;
    clearInterval(gameState.timerInterval);
    elements.wordInput.disabled = true;
    
    // Calculate statistics
    const totalWords = gameState.successCount + gameState.errorCount;
    const accuracyPercent = totalWords > 0 
        ? Math.round((gameState.successCount / totalWords) * 100) 
        : 0;
    const wordsPerMinute = Math.round((gameState.successCount / gameState.totalTime) * 60);
    
    // Update results screen
    elements.finalSuccess.textContent = gameState.successCount;
    elements.finalErrors.textContent = gameState.errorCount;
    elements.accuracy.textContent = accuracyPercent + '%';
    elements.wpm.textContent = wordsPerMinute;
    
    // Show results
    setTimeout(() => {
        elements.gameArea.classList.add('hidden');
        elements.resultsScreen.classList.remove('hidden');
    }, 500);
}

// ===== Restart Game =====
elements.restartBtn.addEventListener('click', () => {
    elements.resultsScreen.classList.add('hidden');
    elements.levelSelector.classList.remove('hidden');
    
    // Reset timer color
    elements.timer.style.color = '';
    elements.progressBar.style.width = '100%';
});

// ===== Initialize =====
window.addEventListener('load', () => {
    // Focus on first level button
    document.querySelector('.level-btn').focus();
});
