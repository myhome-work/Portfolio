// --- Variabel Global ---
let currentLevel = 0;
let timeLimit = 3000; // Waktu berpikir dalam milidetik (3 detik)
let transitionDelay = 1500; // Jeda transisi (1.5 detik)
let instructionColor = '';
let isTrapMode = false;
let gameTimer;
let timerInterval;

const colors = ['RED', 'YELLOW', 'BLUE', 'GREEN'];

// --- Akses DOM Elements ---
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverOverlay = document.getElementById('gameover-overlay');
const playButton = document.getElementById('play-button');
const retryButton = document.getElementById('retry-button');
const levelDisplay = document.getElementById('level-display');
const instructionText = document.getElementById('game-instruction');
const colorButtons = document.querySelectorAll('.color-button');
const timerDisplay = document.getElementById('timer-display');
const reasonDisplay = document.getElementById('reason-display'); // Dari HTML revisi

// FIX: Bersihkan instruksi saat dimuat
instructionText.textContent = ''; 


// --- 1. Event Listeners Utama (Dijalankan HANYA SEKALI) ---
playButton.addEventListener('click', startGame);
retryButton.addEventListener('click', retryGame);

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Hentikan timer & interval saat klik terjadi
        clearTimeout(gameTimer); 
        clearInterval(timerInterval);

        const buttonColor = button.id.split('-')[0].toUpperCase();

        // Logika Pengecekan
        if (isTrapMode) {
            // KLIK APA SAJA saat Trap Mode -> Kalah
            handleGameOver("Jebakan! Seharusnya kamu tidak menekan apa-apa.", true);
            return; // FIX: Hentikan eksekusi setelah kalah
        } else if (buttonColor === instructionColor) {
            // Jawaban Benar
            handleCorrectAnswer();
            return; // FIX: Hentikan eksekusi setelah benar
        } else {
            // Jawaban Salah
            handleGameOver("Jawaban salah!", true);
            return; // FIX: Hentikan eksekusi setelah salah
        }
    });
});


// --- 2. Fungsi Kontrol Game ---

function startGame() {
    menuScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    gameOverOverlay.style.display = 'none';
    
    // FIX: Bersihkan instruksi/timer lama saat mulai game
    instructionText.textContent = ''; 
    timerDisplay.textContent = '';

    currentLevel = 0;
    setTimeout(startNextLevel, 500); 
}

function startNextLevel() {
    // FIX: Hentikan timer & interval lama sebelum membuat yang baru
    if (gameTimer) {
        clearTimeout(gameTimer);
    }
    if (timerInterval) {
        clearInterval(timerInterval); 
    }

    currentLevel++;

    // Tentukan Kesulitan
    timeLimit = Math.max(1000, 3000 - (currentLevel * 200)); 
    transitionDelay = Math.max(500, 1500 - (currentLevel * 100)); 

    // FIX: Menggunakan Penggabungan String (+)
    levelDisplay.textContent = "Level " + currentLevel; 

    // Tentukan Jebakan
    const trapChance = 10 + (currentLevel * 0.5); 
    isTrapMode = Math.floor(Math.random() * 100) < trapChance;

    // Tentukan Warna
    instructionColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Tampilkan Instruksi
    if (isTrapMode) {
        instructionText.textContent = instructionColor; 
    } else {
        // FIX: Menggunakan Penggabungan String (+)
        instructionText.textContent = "Simon Says: " + instructionColor; 
    }

    // Aktifkan Timer Batas Waktu Berpikir
    const startTime = Date.now();
    const endTime = startTime + timeLimit;
    
    // Timer Utama (Timeout)
    gameTimer = setTimeout(handleTimeout, timeLimit); 
    
    // Timer Interval (Update Display)
    timerInterval = setInterval(() => {
        const timeLeft = (endTime - Date.now()) / 1000;
        if (timeLeft <= 0) {
            timerDisplay.textContent = "Time: 0.0"; // FIX: Menggunakan String biasa
            clearInterval(timerInterval);
        } else {
            // FIX: Menggunakan Penggabungan String (+)
            timerDisplay.textContent = "Time: " + timeLeft.toFixed(1); 
        }
    }, 100);
}

// --- 3. Fungsi Hasil & Reset ---

function handleCorrectAnswer() {
    instructionText.textContent = "BENAR!";
    timerDisplay.textContent = "";
    
    setTimeout(startNextLevel, transitionDelay); 
}

function handleTimeout() {
    if (!isTrapMode) {
        // Mode Normal: Timeout = Kalah
        handleGameOver("Waktu habis!", true);
    } else {
        // Mode Jebakan: Timeout (Tidak diklik) = Benar
        handleCorrectAnswer();
    }
}

function handleGameOver(reason, byPlayer = false) {
    clearTimeout(gameTimer);
    clearInterval(timerInterval);

    // Tampilkan alasan kalah (optional)
    reasonDisplay.textContent = reason; // Menggunakan elemen p baru di overlay

    // Tampilkan Overlay & Sembunyikan Game Screen
    gameScreen.style.display = 'none'; 
    gameOverOverlay.style.display = 'flex';
    
    // Pastikan teks utama overlay muncul
    document.querySelector('#gameover-overlay h1').textContent = "GAME OVER";
}

function retryGame() {
    // FIX: Reset total tampilan
    gameOverOverlay.style.display = 'none';
    gameScreen.style.display = 'none';
    menuScreen.style.display = 'flex';
    
    // FIX: Bersihkan instruksi yang tersisa
    instructionText.textContent = 'uhugg';
    timerDisplay.textContent = 'hhuhuhhhu';
    reasonDisplay.textContent = 'Salah!'; // Bersihkan alasan kalah
}