class CuttingSystem {
    constructor() {
        this.currentStep = 0;
        this.isAnimating = false;
        this.carrotStates = [
            '素材/蘿蔔1.png',
            '素材/蘿蔔2.png',
            '素材/蘿蔔3.png',
            '素材/蘿蔔4.png',
            '素材/蘿蔔5.png',
            '素材/蘿蔔6.png'
        ];
        this.clickIndicatorState = 1;
        this.initialize();
    }

    initialize() {
        this.gameContainer = document.querySelector('.game-container');
        this.knife = document.getElementById('knife');
        this.carrot = document.getElementById('carrot');
        this.clickIndicator = document.getElementById('clickIndicator');
        
        if (this.gameContainer && this.knife && this.carrot) {
            this.initializeEvents();
            this.startClickAnimation();
        }
    }

    initializeEvents() {
        // 監聽整個遊戲容器的點擊事件
        ['mousedown', 'touchstart'].forEach(eventType => {
            this.gameContainer.addEventListener(eventType, (e) => {
                e.preventDefault();
                this.cut();
            }, { passive: false });
        });
    }

    cut() {
        if (this.isAnimating || this.currentStep >= this.carrotStates.length) return;
        
        this.isAnimating = true;
        this.knife.style.transform = 'rotate(-30deg)';
        
        // 當開始切菜時隱藏點擊指示
        if (this.clickIndicator) {
            this.clickIndicator.style.display = 'none';
        }
        
        setTimeout(() => {
            this.carrot.src = this.carrotStates[this.currentStep];
            this.currentStep++;
            this.updateProgress();
            
            this.knife.style.transform = 'none';
            this.isAnimating = false;
        }, 150);
    }

    startClickAnimation() {
        setInterval(() => {
            if (this.currentStep >= this.carrotStates.length) {
                this.clickIndicator.style.display = 'none';
                return;
            }
            
            this.clickIndicatorState = this.clickIndicatorState === 1 ? 2 : 1;
            this.clickIndicator.src = `素材/點擊指示${this.clickIndicatorState}.png`;
        }, 500);
    }

    updateProgress() {
        const progress = (this.currentStep / this.carrotStates.length) * 100;
        const progressBar = document.querySelector('.progress-bar-bg');
        
        // 只在切完蘿蔔時更新到進度條2並切換場景
        if (this.currentStep >= this.carrotStates.length) {
            progressBar.src = '素材/進度條2.png';
            this.dispatchCuttingComplete();
        }
    }

    dispatchCuttingComplete() {
        const event = new CustomEvent('cuttingComplete', {
            detail: { success: true }
        });
        document.dispatchEvent(event);
        
        // 切換到煮咖哩場景
        this.switchToCurryGame();
    }

    switchToCurryGame() {
        // 隱藏切菜區域
        const cuttingBoard = document.getElementById('cuttingBoard');
        if (cuttingBoard) {
            cuttingBoard.style.display = 'none';
        }

        // 顯示煮咖哩區域
        const curryArea = document.getElementById('curryArea');
        if (curryArea) {
            curryArea.style.display = 'block';
            // 初始化煮咖哩遊戲
            window.currySystem = new CurrySystem();
        }

        // 隱藏點擊指示
        const clickIndicator = document.getElementById('clickIndicator');
        if (clickIndicator) {
            clickIndicator.style.display = 'none';
        }
    }

    reset() {
        this.currentStep = 0;
        this.isAnimating = false;
        this.carrot.src = this.carrotStates[0];
        
        const progressBar = document.querySelector('.progress-bar-bg');
        progressBar.src = '素材/進度條1.png';
        
        if (this.clickIndicator) {
            this.clickIndicator.style.display = 'block';
            this.clickIndicator.src = '素材/點擊指示1.png';
            this.clickIndicatorState = 1;
        }
    }
} 