class CurrySystem {
    constructor() {
        this.stirCount = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.isStirring = false;
        this.direction = 0;
        this.points = [];
        this.spoonAngle = 0;
        this.circleCount = 0;
        this.lastAngle = 0;
        this.initialize();
    }

    initialize() {
        this.stirArea = document.getElementById('stirArea');
        this.spoon = document.getElementById('spoon');
        this.stirHint = document.getElementById('stirHint');
        
        if (this.stirArea && this.spoon) {
            this.initializeEvents();
        }
    }

    initializeEvents() {
        ['mousedown', 'touchstart'].forEach(eventType => {
            this.stirArea.addEventListener(eventType, (e) => {
                this.startStirring(e);
            });
        });

        ['mousemove', 'touchmove'].forEach(eventType => {
            this.stirArea.addEventListener(eventType, (e) => {
                if (this.isStirring) {
                    this.stir(e);
                }
            });
        });

        ['mouseup', 'touchend'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                this.stopStirring();
            });
        });
    }

    startStirring(e) {
        this.isStirring = true;
        this.points = [];
        const point = this.getEventPoint(e);
        this.lastX = point.x;
        this.lastY = point.y;
        this.stirHint.style.display = 'none';
    }

    stir(e) {
        const point = this.getEventPoint(e);
        this.points.push(point);
        
        if (this.points.length > 10) {
            this.checkStirDirection();
            this.points.shift();
        }

        const deltaX = point.x - this.lastX;
        const deltaY = point.y - this.lastY;
        let targetAngle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        targetAngle = Math.max(-90, Math.min(90, targetAngle));

        this.spoonAngle = targetAngle;
        this.spoon.style.transform = `translate(-50%, -50%) rotate(${this.spoonAngle}deg)`;

        this.lastX = point.x;
        this.lastY = point.y;
    }

    stopStirring() {
        if (this.isStirring) {
            this.isStirring = false;
            this.spoon.style.transform = 'translate(-50%, -50%) rotate(0deg)';
            this.spoonAngle = 0;
            this.checkStirComplete();
        }
    }

    getEventPoint(e) {
        const rect = this.stirArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    }

    checkStirDirection() {
        if (this.points.length < 2) return;

        const deltaX = this.points[this.points.length - 1].x - this.points[0].x;
        const deltaY = this.points[this.points.length - 1].y - this.points[0].y;
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        
        const angleDiff = angle - this.lastAngle;
        if (Math.abs(angleDiff) > 300) {
            this.circleCount++;
            console.log("完成一圈", this.circleCount);
            
            if (this.circleCount >= 3) {
                this.complete();
            }
        }
        
        this.lastAngle = angle;
    }

    complete() {
        console.log("完成攪拌！");
        
        const progressBar = document.querySelector('.progress-bar-bg');
        if (progressBar) {
            progressBar.src = '素材/進度條3.png';
        }

        document.dispatchEvent(new CustomEvent('curryComplete', {
            detail: { success: true }
        }));
        
        if (this.stirHint) {
            this.stirHint.style.display = 'none';
        }
        
        this.isStirring = false;
        this.spoon.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    }

    reset() {
        this.stirCount = 0;
        this.circleCount = 0;
        this.lastAngle = 0;
        this.isStirring = false;
        this.points = [];
        this.spoonAngle = 0;
        
        if (this.spoon) {
            this.spoon.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        }
        if (this.stirHint) {
            this.stirHint.style.display = 'block';
        }
    }
} 