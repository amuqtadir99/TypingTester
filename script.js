class TypingSpeedTester {
    constructor() {
        // DOM elements
        this.textDisplay = document.getElementById('text-display');
        this.typingInput = document.getElementById('typing-input');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.difficultySelect = document.getElementById('difficulty');
        this.resultsModal = document.getElementById('results-modal');
        
        // Stats elements
        this.wpmElement = document.getElementById('wpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.timerElement = document.getElementById('timer');
        this.errorsElement = document.getElementById('errors');
        
        // Modal elements
        this.finalWpm = document.getElementById('final-wpm');
        this.finalAccuracy = document.getElementById('final-accuracy');
        this.finalErrors = document.getElementById('final-errors');
        this.finalChars = document.getElementById('final-chars');
        this.closeModal = document.getElementById('close-modal');
        this.tryAgain = document.getElementById('try-again');
        
        // Test variables
        this.testText = '';
        this.userInput = '';
        this.startTime = null;
        this.endTime = null;
        this.timer = null;
        this.timeLimit = 60; // seconds
        this.timeLeft = this.timeLimit;
        this.isTestActive = false;
        this.errors = 0;
        this.totalChars = 0;
        
        // Text samples for different difficulties
        this.textSamples = {
            easy: [
                "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet. It is often used for typing practice because it includes all letters.",
                "Today is a beautiful day. The sun is shining brightly in the clear blue sky. Birds are singing lovely songs in the tall green trees.",
                "I love to read books in my free time. Reading helps me learn new things and escape to different worlds. Books are wonderful treasures of knowledge.",
                "Cats are amazing pets. They are soft and cuddly. Many people love cats because they are independent and affectionate animals.",
                "Pizza is my favorite food. I like it with cheese and pepperoni. Pizza brings people together for fun meals and good times."
            ],
            medium: [
                "Technology has revolutionized the way we communicate and work. From smartphones to artificial intelligence, modern innovations continue to shape our daily lives in unprecedented ways.",
                "The importance of environmental conservation cannot be overstated. Climate change poses significant challenges that require immediate action from governments, businesses, and individuals worldwide.",
                "Programming languages serve as the foundation for software development. Each language has unique strengths and applications, making it essential for developers to choose the right tool for specific projects.",
                "Exercise and proper nutrition are fundamental components of a healthy lifestyle. Regular physical activity combined with balanced eating habits can prevent numerous health issues and improve quality of life.",
                "The history of human civilization is marked by continuous innovation and adaptation. From the invention of the wheel to space exploration, humanity has consistently pushed the boundaries of possibility."
            ],
            hard: [
                "Quantum mechanics represents one of the most counterintuitive yet mathematically precise theories in physics. The probabilistic nature of quantum states challenges our classical understanding of reality and determinism.",
                "Cryptocurrency and blockchain technology have emerged as disruptive forces in the financial sector. These decentralized systems promise to revolutionize traditional banking, though regulatory challenges persist globally.",
                "Neuroplasticity research demonstrates the brain's remarkable ability to reorganize and adapt throughout life. This discovery has profound implications for education, rehabilitation, and our understanding of human potential.",
                "The intersection of artificial intelligence and ethics raises complex questions about automation, privacy, and the future of human labor. Balancing technological advancement with social responsibility remains a critical challenge.",
                "Epistemological frameworks in philosophy examine the nature and scope of knowledge itself. Questions about truth, justification, and belief systems have puzzled thinkers for millennia and continue to evolve."
            ]
        };
        
        this.init();
    }
    
    init() {
        this.loadRandomText();
        this.attachEventListeners();
        this.updateDisplay();
    }
    
    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTest());
        this.resetBtn.addEventListener('click', () => this.resetTest());
        this.difficultySelect.addEventListener('change', () => this.loadRandomText());
        this.typingInput.addEventListener('input', (e) => this.handleInput(e));
        this.typingInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.closeModal.addEventListener('click', () => this.hideResults());
        this.tryAgain.addEventListener('click', () => {
            this.hideResults();
            this.resetTest();
        });
        
        // Prevent paste
        this.typingInput.addEventListener('paste', (e) => e.preventDefault());
    }
    
    loadRandomText() {
        const difficulty = this.difficultySelect.value;
        const texts = this.textSamples[difficulty];
        this.testText = texts[Math.floor(Math.random() * texts.length)];
        this.displayText();
    }
    
    displayText() {
        this.textDisplay.innerHTML = '';
        for (let i = 0; i < this.testText.length; i++) {
            const char = document.createElement('span');
            char.textContent = this.testText[i];
            char.className = 'text-char untyped';
            char.id = `char-${i}`;
            this.textDisplay.appendChild(char);
        }
    }
    
    startTest() {
        this.isTestActive = true;
        this.startTime = Date.now();
        this.timeLeft = this.timeLimit;
        this.typingInput.disabled = false;
        this.typingInput.focus();
        this.startBtn.disabled = true;
        this.resetBtn.disabled = false;
        this.difficultySelect.disabled = true;
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }
    
    handleInput(e) {
        if (!this.isTestActive) return;
        
        this.userInput = e.target.value;
        this.totalChars = this.userInput.length;
        this.updateTextHighlighting();
        this.calculateStats();
        this.updateDisplay();
        
        // Check if test is complete
        if (this.userInput.length >= this.testText.length) {
            this.endTest();
        }
    }
    
    handleKeyDown(e) {
        if (!this.isTestActive) return;
        
        // Prevent certain keys
        if (e.key === 'Tab' || e.key === 'Escape') {
            e.preventDefault();
        }
    }
    
    updateTextHighlighting() {
        this.errors = 0;
        
        for (let i = 0; i < this.testText.length; i++) {
            const charElement = document.getElementById(`char-${i}`);
            
            if (i < this.userInput.length) {
                if (this.userInput[i] === this.testText[i]) {
                    charElement.className = 'text-char correct';
                } else {
                    charElement.className = 'text-char incorrect';
                    this.errors++;
                }
            } else if (i === this.userInput.length) {
                charElement.className = 'text-char current';
            } else {
                charElement.className = 'text-char untyped';
            }
        }
    }
    
    calculateStats() {
        if (!this.startTime) return;
        
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // minutes
        const wordsTyped = this.userInput.trim().split(/\s+/).length;
        const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
        
        const accuracy = this.totalChars > 0 ? 
            Math.round(((this.totalChars - this.errors) / this.totalChars) * 100) : 100;
        
        return { wpm, accuracy };
    }
    
    updateDisplay() {
        const stats = this.calculateStats();
        
        this.wpmElement.textContent = stats?.wpm || 0;
        this.accuracyElement.textContent = `${stats?.accuracy || 100}%`;
        this.timerElement.textContent = this.timeLeft;
        this.errorsElement.textContent = this.errors;
    }
    
    endTest() {
        this.isTestActive = false;
        this.endTime = Date.now();
        clearInterval(this.timer);
        
        this.typingInput.disabled = true;
        this.startBtn.disabled = false;
        this.resetBtn.disabled = false;
        this.difficultySelect.disabled = false;
        
        this.showResults();
    }
    
    showResults() {
        const stats = this.calculateStats();
        
        this.finalWpm.textContent = stats.wpm;
        this.finalAccuracy.textContent = `${stats.accuracy}%`;
        this.finalErrors.textContent = this.errors;
        this.finalChars.textContent = this.totalChars;
        
        this.resultsModal.classList.remove('hidden');
        this.resultsModal.classList.add('show');
    }
    
    hideResults() {
        this.resultsModal.classList.add('hidden');
        this.resultsModal.classList.remove('show');
    }
    
    resetTest() {
        // Clear timer
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Reset variables
        this.isTestActive = false;
        this.userInput = '';
        this.startTime = null;
        this.endTime = null;
        this.timeLeft = this.timeLimit;
        this.errors = 0;
        this.totalChars = 0;
        
        // Reset UI
        this.typingInput.value = '';
        this.typingInput.disabled = true;
        this.startBtn.disabled = false;
        this.resetBtn.disabled = true;
        this.difficultySelect.disabled = false;
        
        // Load new text and update display
        this.loadRandomText();
        this.updateDisplay();
        this.hideResults();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TypingSpeedTester();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to start test
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const startBtn = document.getElementById('start-btn');
        if (!startBtn.disabled) {
            startBtn.click();
        }
    }
    
    // Escape to reset
    if (e.key === 'Escape') {
        const resetBtn = document.getElementById('reset-btn');
        if (!resetBtn.disabled) {
            resetBtn.click();
        }
    }
});