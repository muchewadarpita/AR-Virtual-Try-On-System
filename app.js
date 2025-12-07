// AR Virtual Dress Try-On Application
// Using MediaPipe Pose Detection for body tracking

class ARDressTryOn {
    constructor() {
        // DOM Elements
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('output-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadingScreen = document.getElementById('loading-screen');
        this.statusElement = document.getElementById('status');
        this.fpsElement = document.getElementById('fps');

        // MediaPipe Pose
        this.pose = null;
        this.camera = null;

        // State
        this.currentDress = null;
        this.showSkeleton = true;
        this.dressScale = 1.0;
        this.isReady = false;

        // Performance tracking
        this.frameCount = 0;
        this.lastTime = Date.now();
        this.fps = 0;

        // Dress catalog
        this.dresses = [
            {
                id: 1,
                name: 'Red Dress',
                icon: '👗',
                color: '#FF4444',
                style: 'elegant',
                pattern: null
            },
            {
                id: 2,
                name: 'Blue Gown',
                icon: '👗',
                color: '#4444FF',
                style: 'formal',
                pattern: null
            },
            {
                id: 3,
                name: 'Green Dress',
                icon: '👗',
                color: '#44FF44',
                style: 'casual',
                pattern: null
            },
            {
                id: 4,
                name: 'Purple Gown',
                icon: '👗',
                color: '#8844FF',
                style: 'elegant',
                pattern: null
            },
            {
                id: 5,
                name: 'Pink Dress',
                icon: '👗',
                color: '#FF44AA',
                style: 'party',
                pattern: null
            },
            {
                id: 6,
                name: 'Black Dress',
                icon: '👗',
                color: '#222222',
                style: 'formal',
                pattern: null
            },
            {
                id: 7,
                name: 'Yellow Dress',
                icon: '👗',
                color: '#FFDD44',
                style: 'summer',
                pattern: null
            },
            {
                id: 8,
                name: 'Floral Dress',
                icon: '🌺',
                color: '#FF88AA',
                style: 'floral',
                pattern: 'floral'
            }
        ];

        this.init();
    }

    async init() {
        try {
            this.updateStatus('Initializing camera...');
            await this.setupCamera();

            this.updateStatus('Loading pose detection...');
            await this.setupPose();

            this.setupUI();
            this.setupEventListeners();

            this.updateStatus('Ready! Select a dress to try on');
            this.hideLoading();
            this.isReady = true;

            // Auto-select first dress
            this.selectDress(this.dresses[0]);

        } catch (error) {
            console.error('Initialization error:', error);
            this.updateStatus('Error: ' + error.message);
            alert('Failed to initialize AR. Please ensure you have granted camera permissions.');
        }
    }

    async setupCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Camera not supported on this device');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        this.video.srcObject = stream;

        return new Promise((resolve) => {
            this.video.onloadedmetadata = () => {
                this.video.play();
                this.resizeCanvas();
                resolve();
            };
        });
    }

    async setupPose() {
        this.pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        this.pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.pose.onResults((results) => this.onPoseResults(results));

        // Start camera
        this.camera = new Camera(this.video, {
            onFrame: async () => {
                await this.pose.send({ image: this.video });
            },
            width: 1280,
            height: 720
        });

        await this.camera.start();
    }

    onPoseResults(results) {
        if (!this.isReady) return;

        // Update FPS
        this.updateFPS();

        // Clear canvas
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw video frame
        this.ctx.drawImage(results.image, 0, 0, this.canvas.width, this.canvas.height);

        if (results.poseLandmarks) {
            // Draw skeleton if enabled
            if (this.showSkeleton) {
                this.drawSkeleton(results.poseLandmarks);
            }

            // Draw dress overlay
            if (this.currentDress) {
                this.drawDress(results.poseLandmarks);
            }
        }

        this.ctx.restore();
    }

    drawSkeleton(landmarks) {
        // Draw connections
        const connections = [
            [11, 12], // Shoulders
            [11, 13], [13, 15], // Left arm
            [12, 14], [14, 16], // Right arm
            [11, 23], [12, 24], // Torso
            [23, 24], // Hips
            [23, 25], [25, 27], // Left leg
            [24, 26], [26, 28], // Right leg
        ];

        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        this.ctx.lineWidth = 2;

        connections.forEach(([start, end]) => {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];

            if (startPoint && endPoint) {
                this.ctx.beginPath();
                this.ctx.moveTo(
                    startPoint.x * this.canvas.width,
                    startPoint.y * this.canvas.height
                );
                this.ctx.lineTo(
                    endPoint.x * this.canvas.width,
                    endPoint.y * this.canvas.height
                );
                this.ctx.stroke();
            }
        });

        // Draw joints
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
        landmarks.forEach((landmark) => {
            this.ctx.beginPath();
            this.ctx.arc(
                landmark.x * this.canvas.width,
                landmark.y * this.canvas.height,
                4,
                0,
                2 * Math.PI
            );
            this.ctx.fill();
        });
    }

    drawDress(landmarks) {
        // Extract all necessary body landmarks
        const nose = landmarks[0];
        const leftEye = landmarks[2];
        const rightEye = landmarks[5];
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftElbow = landmarks[13];
        const rightElbow = landmarks[14];
        const leftWrist = landmarks[15];
        const rightWrist = landmarks[16];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        const leftKnee = landmarks[25];
        const rightKnee = landmarks[26];
        
        if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return;
        
        // Calculate key measurements
        const shoulderWidth = Math.abs((rightShoulder.x - leftShoulder.x) * this.canvas.width);
        const bodyHeight = Math.abs(((leftHip.y + rightHip.y) / 2 - (leftShoulder.y + rightShoulder.y) / 2) * this.canvas.height);
        
        // Key points in screen coordinates
        const lShoulderX = leftShoulder.x * this.canvas.width;
        const lShoulderY = leftShoulder.y * this.canvas.height;
        const rShoulderX = rightShoulder.x * this.canvas.width;
        const rShoulderY = rightShoulder.y * this.canvas.height;
        const lHipX = leftHip.x * this.canvas.width;
        const lHipY = leftHip.y * this.canvas.height;
        const rHipX = rightHip.x * this.canvas.width;
        const rHipY = rightHip.y * this.canvas.height;
        const noseX = nose.x * this.canvas.width;
        const noseY = nose.y * this.canvas.height;
        
        // Arm landmarks
        const lElbowX = leftElbow ? leftElbow.x * this.canvas.width : lShoulderX;
        const lElbowY = leftElbow ? leftElbow.y * this.canvas.height : lShoulderY + bodyHeight * 0.3;
        const rElbowX = rightElbow ? rightElbow.x * this.canvas.width : rShoulderX;
        const rElbowY = rightElbow ? rightElbow.y * this.canvas.height : rShoulderY + bodyHeight * 0.3;
        const lWristX = leftWrist ? leftWrist.x * this.canvas.width : lElbowX;
        const lWristY = leftWrist ? leftWrist.y * this.canvas.height : lElbowY + bodyHeight * 0.3;
        const rWristX = rightWrist ? rightWrist.x * this.canvas.width : rElbowX;
        const rWristY = rightWrist ? rightWrist.y * this.canvas.height : rElbowY + bodyHeight * 0.3;
        
        // Center points
        const shoulderCenterX = (lShoulderX + rShoulderX) / 2;
        const shoulderCenterY = (lShoulderY + rShoulderY) / 2;
        const hipCenterX = (lHipX + rHipX) / 2;
        const hipCenterY = (lHipY + rHipY) / 2;
        const waistY = shoulderCenterY + bodyHeight * 0.6;
        
        // Dress dimensions with scale
        const dressWidth = shoulderWidth * this.dressScale * 1.4;
        const dressLength = bodyHeight * this.dressScale * 2.2;
        const hemY = hipCenterY + dressLength * 0.6;
        
        this.ctx.save();
        
        // Draw dress based on style
        switch(this.currentDress.style) {
            case 'formal':
            case 'elegant':
                this.drawElegantGown(landmarks, {
                    lShoulderX, lShoulderY, rShoulderX, rShoulderY,
                    lHipX, lHipY, rHipX, rHipY, hipCenterX, hipCenterY,
                    shoulderCenterX, shoulderCenterY, waistY, dressWidth, dressLength, hemY,
                    lElbowX, lElbowY, rElbowX, rElbowY, lWristX, lWristY, rWristX, rWristY
                });
                break;
            case 'party':
                this.drawPartyDress(landmarks, {
                    lShoulderX, lShoulderY, rShoulderX, rShoulderY,
                    lHipX, lHipY, rHipX, rHipY, hipCenterX, hipCenterY,
                    shoulderCenterX, shoulderCenterY, waistY, dressWidth, dressLength, hemY,
                    lElbowX, lElbowY, rElbowX, rElbowY, lWristX, lWristY, rWristX, rWristY
                });
                break;
            case 'floral':
                this.drawFloralDress(landmarks, {
                    lShoulderX, lShoulderY, rShoulderX, rShoulderY,
                    lHipX, lHipY, rHipX, rHipY, hipCenterX, hipCenterY,
                    shoulderCenterX, shoulderCenterY, waistY, dressWidth, dressLength, hemY,
                    lElbowX, lElbowY, rElbowX, rElbowY, lWristX, lWristY, rWristX, rWristY
                });
                break;
            default:
                this.drawCasualDress(landmarks, {
                    lShoulderX, lShoulderY, rShoulderX, rShoulderY,
                    lHipX, lHipY, rHipX, rHipY, hipCenterX, hipCenterY,
                    shoulderCenterX, shoulderCenterY, waistY, dressWidth, dressLength, hemY,
                    lElbowX, lElbowY, rElbowX, rElbowY, lWristX, lWristY, rWristX, rWristY
                });
        }
        
        this.ctx.restore();
    }
    
    drawElegantGown(landmarks, points) {
        const color = this.currentDress.color;
        const {lShoulderX, lShoulderY, rShoulderX, rShoulderY, shoulderCenterX, shoulderCenterY,
               waistY, hipCenterX, hipCenterY, dressWidth, dressLength, hemY,
               lElbowX, lElbowY, rElbowX, rElbowY, lWristX, lWristY, rWristX, rWristY} = points;
        
        // Main dress body with realistic shaping
        const gradient = this.ctx.createLinearGradient(shoulderCenterX, shoulderCenterY, hipCenterX, hemY);
        gradient.addColorStop(0, this.adjustColor(color, 1.3));
        gradient.addColorStop(0.3, this.adjustColor(color, 1.1));
        gradient.addColorStop(0.6, color);
        gradient.addColorStop(1, this.adjustColor(color, 0.6));
        
        // Draw bodice (fitted top)
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        
        // Sweetheart neckline
        this.ctx.moveTo(lShoulderX + dressWidth * 0.1, shoulderCenterY - 10);
        this.ctx.quadraticCurveTo(shoulderCenterX - dressWidth * 0.15, shoulderCenterY + 20, shoulderCenterX, shoulderCenterY + 15);
        this.ctx.quadraticCurveTo(shoulderCenterX + dressWidth * 0.15, shoulderCenterY + 20, rShoulderX - dressWidth * 0.1, shoulderCenterY - 10);
        
        // Right shoulder strap
        this.ctx.lineTo(rShoulderX - dressWidth * 0.05, lShoulderY);
        
        // Right armhole
        this.ctx.quadraticCurveTo(rShoulderX + dressWidth * 0.05, lShoulderY + 30, rShoulderX, lShoulderY + 60);
        
        // Right side to waist
        this.ctx.lineTo(hipCenterX + dressWidth * 0.25, waistY);
        
        // Flared skirt - right side
        this.ctx.lineTo(hipCenterX + dressWidth * 0.45, hipCenterY + dressLength * 0.3);
        this.ctx.lineTo(hipCenterX + dressWidth * 0.55, hemY - 50);
        
        // Hem with gentle curve
        this.ctx.quadraticCurveTo(hipCenterX + dressWidth * 0.3, hemY, hipCenterX, hemY + 10);
        this.ctx.quadraticCurveTo(hipCenterX - dressWidth * 0.3, hemY, hipCenterX - dressWidth * 0.55, hemY - 50);
        
        // Flared skirt - left side
        this.ctx.lineTo(hipCenterX - dressWidth * 0.45, hipCenterY + dressLength * 0.3);
        this.ctx.lineTo(hipCenterX - dressWidth * 0.25, waistY);
        
        // Left side to armhole
        this.ctx.lineTo(lShoulderX, lShoulderY + 60);
        
        // Left armhole
        this.ctx.quadraticCurveTo(lShoulderX - dressWidth * 0.05, lShoulderY + 30, lShoulderX + dressWidth * 0.05, lShoulderY);
        
        // Left shoulder strap
        this.ctx.lineTo(lShoulderX + dressWidth * 0.1, shoulderCenterY - 10);
        
        this.ctx.closePath();
        this.ctx.globalAlpha = 0.85;
        this.ctx.fill();
        
        // Add dress outline
        this.ctx.strokeStyle = this.adjustColor(color, 0.4);
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.6;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
        
        // Add waist definition (belt/seam)
        this.ctx.strokeStyle = this.adjustColor(color, 0.5);
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(hipCenterX - dressWidth * 0.25, waistY);
        this.ctx.lineTo(hipCenterX + dressWidth * 0.25, waistY);
        this.ctx.stroke();
        
        // Add fabric texture with subtle lines
        this.addFabricTexture(shoulderCenterX, shoulderCenterY, dressWidth, dressLength, color);
        
        // Add highlights and shadows for depth
        this.addDressShading(shoulderCenterX, shoulderCenterY, hipCenterX, waistY, hemY, dressWidth);
        
        // Add decorative elements
        if (this.currentDress.pattern !== 'floral') {
            this.addDressEmbellishments(shoulderCenterX, waistY, dressWidth, color);
        }
    }
    
    drawCasualDress(landmarks, points) {
        const color = this.currentDress.color;
        const {lShoulderX, lShoulderY, rShoulderX, rShoulderY, shoulderCenterX, shoulderCenterY,
               waistY, hipCenterX, hipCenterY, dressWidth, dressLength, hemY,
               lElbowX, lElbowY, rElbowX, rElbowY} = points;
        
        // Gradient for casual dress
        const gradient = this.ctx.createLinearGradient(shoulderCenterX, shoulderCenterY, hipCenterX, hemY);
        gradient.addColorStop(0, this.adjustColor(color, 1.2));
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, this.adjustColor(color, 0.7));
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        
        // Round neckline
        this.ctx.arc(shoulderCenterX, shoulderCenterY, dressWidth * 0.18, Math.PI, 2 * Math.PI);
        
        // Right sleeve
        this.ctx.lineTo(rShoulderX + dressWidth * 0.05, rShoulderY);
        this.ctx.quadraticCurveTo(rElbowX + 15, rElbowY - 10, rShoulderX + dressWidth * 0.08, rShoulderY + 50);
        this.ctx.lineTo(rShoulderX, rShoulderY + 60);
        
        // Right side
        this.ctx.lineTo(hipCenterX + dressWidth * 0.35, waistY);
        this.ctx.lineTo(hipCenterX + dressWidth * 0.38, hemY - 30);
        
        // Hem
        this.ctx.quadraticCurveTo(hipCenterX, hemY, hipCenterX - dressWidth * 0.38, hemY - 30);
        
        // Left side
        this.ctx.lineTo(hipCenterX - dressWidth * 0.35, waistY);
        this.ctx.lineTo(lShoulderX, lShoulderY + 60);
        
        // Left sleeve
        this.ctx.lineTo(lShoulderX - dressWidth * 0.08, lShoulderY + 50);
        this.ctx.quadraticCurveTo(lElbowX - 15, lElbowY - 10, lShoulderX - dressWidth * 0.05, lShoulderY);
        
        this.ctx.closePath();
        this.ctx.globalAlpha = 0.8;
        this.ctx.fill();
        
        // Outline
        this.ctx.strokeStyle = this.adjustColor(color, 0.5);
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.5;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
        
        // Add pockets
        this.drawPockets(hipCenterX, waistY + 20, dressWidth * 0.12, color);
        
        // Add button details
        this.drawButtons(shoulderCenterX, shoulderCenterY + 30, waistY, color);
    }
    
    drawPartyDress(landmarks, points) {
        const color = this.currentDress.color;
        const {lShoulderX, lShoulderY, rShoulderX, rShoulderY, shoulderCenterX, shoulderCenterY,
               waistY, hipCenterX, hipCenterY, dressWidth, dressLength, hemY} = points;
        
        // Shimmery gradient
        const gradient = this.ctx.createRadialGradient(shoulderCenterX, waistY, 0, shoulderCenterX, waistY, dressWidth);
        gradient.addColorStop(0, this.adjustColor(color, 1.4));
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, this.adjustColor(color, 0.8));
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        
        // Strapless or thin strap design
        this.ctx.moveTo(lShoulderX + dressWidth * 0.15, lShoulderY + 10);
        this.ctx.lineTo(rShoulderX - dressWidth * 0.15, rShoulderY + 10);
        this.ctx.lineTo(rShoulderX - dressWidth * 0.1, rShoulderY + 30);
        
        // Fitted bodice
        this.ctx.lineTo(hipCenterX + dressWidth * 0.22, waistY);
        
        // Flared party skirt with layers
        for (let i = 0; i < 3; i++) {
            const offset = i * 15;
            this.ctx.lineTo(hipCenterX + dressWidth * (0.35 + i * 0.08), hipCenterY + offset);
        }
        this.ctx.lineTo(hipCenterX + dressWidth * 0.5, hemY - 40);
        
        // Bottom hem with ruffles
        this.ctx.quadraticCurveTo(hipCenterX, hemY + 5, hipCenterX - dressWidth * 0.5, hemY - 40);
        
        for (let i = 2; i >= 0; i--) {
            const offset = i * 15;
            this.ctx.lineTo(hipCenterX - dressWidth * (0.35 + i * 0.08), hipCenterY + offset);
        }
        
        this.ctx.lineTo(hipCenterX - dressWidth * 0.22, waistY);
        this.ctx.lineTo(lShoulderX + dressWidth * 0.1, lShoulderY + 30);
        
        this.ctx.closePath();
        this.ctx.globalAlpha = 0.85;
        this.ctx.fill();
        
        // Add sparkle effect
        this.addSparkles(shoulderCenterX, shoulderCenterY, dressWidth, dressLength, color);
        
        // Waist embellishment
        this.ctx.fillStyle = this.adjustColor(color, 1.5);
        this.ctx.globalAlpha = 0.6;
        this.ctx.fillRect(hipCenterX - dressWidth * 0.25, waistY - 5, dressWidth * 0.5, 10);
        this.ctx.globalAlpha = 1;
    }
    
    drawFloralDress(landmarks, points) {
        // First draw base dress
        this.drawCasualDress(landmarks, points);
        
        // Then add floral pattern overlay
        const {shoulderCenterX, shoulderCenterY, dressWidth, dressLength, hemY} = points;
        this.ctx.save();
        this.ctx.globalAlpha = 0.4;
        
        const flowers = ['🌸', '🌺', '🌼', '🌻', '🌷'];
        const numFlowers = 15;
        
        for (let i = 0; i < numFlowers; i++) {
            const x = shoulderCenterX + (Math.random() - 0.5) * dressWidth * 0.6;
            const y = shoulderCenterY + Math.random() * (hemY - shoulderCenterY);
            const flower = flowers[Math.floor(Math.random() * flowers.length)];
            const size = 20 + Math.random() * 15;
            
            this.ctx.font = `${size}px serif`;
            this.ctx.fillText(flower, x, y);
        }
        
        this.ctx.restore();
    }
    
    addFabricTexture(x, y, width, height, color) {
        this.ctx.save();
        this.ctx.strokeStyle = this.adjustColor(color, 0.9);
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = 0.1;
        
        // Vertical fabric lines
        for (let i = 0; i < 10; i++) {
            const offsetX = x - width * 0.3 + (i * width * 0.06);
            this.ctx.beginPath();
            this.ctx.moveTo(offsetX, y);
            this.ctx.lineTo(offsetX, y + height);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    addDressShading(centerX, topY, bottomX, waistY, hemY, width) {
        // Left side shadow
        const shadowGradient = this.ctx.createLinearGradient(centerX - width * 0.4, waistY, centerX - width * 0.2, waistY);
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.fillStyle = shadowGradient;
        this.ctx.globalAlpha = 0.4;
        this.ctx.fillRect(centerX - width * 0.4, topY, width * 0.2, hemY - topY);
        
        // Right side highlight
        const highlightGradient = this.ctx.createLinearGradient(centerX + width * 0.2, waistY, centerX + width * 0.4, waistY);
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
        
        this.ctx.fillStyle = highlightGradient;
        this.ctx.fillRect(centerX + width * 0.2, topY, width * 0.2, hemY - topY);
        this.ctx.globalAlpha = 1;
    }
    
    addDressEmbellishments(centerX, waistY, width, color) {
        // Add decorative waist bow or jewels
        this.ctx.fillStyle = this.adjustColor(color, 1.5);
        this.ctx.globalAlpha = 0.7;
        
        // Center jewel/button
        this.ctx.beginPath();
        this.ctx.arc(centerX, waistY, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Side decorations
        for (let i = 1; i <= 2; i++) {
            this.ctx.beginPath();
            this.ctx.arc(centerX - i * 25, waistY, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(centerX + i * 25, waistY, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    addSparkles(x, y, width, height, color) {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        for (let i = 0; i < 20; i++) {
            const sparkleX = x + (Math.random() - 0.5) * width * 0.8;
            const sparkleY = y + Math.random() * height;
            const size = Math.random() * 3 + 1;
            
            this.ctx.globalAlpha = Math.random() * 0.5 + 0.3;
            this.ctx.beginPath();
            this.ctx.arc(sparkleX, sparkleY, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    drawPockets(centerX, y, size, color) {
        this.ctx.strokeStyle = this.adjustColor(color, 0.6);
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.5;
        
        // Left pocket
        this.ctx.beginPath();
        this.ctx.arc(centerX - size * 1.5, y, size, 0, Math.PI);
        this.ctx.stroke();
        
        // Right pocket
        this.ctx.beginPath();
        this.ctx.arc(centerX + size * 1.5, y, size, 0, Math.PI);
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1;
    }
    
    drawButtons(centerX, startY, endY, color) {
        this.ctx.fillStyle = this.adjustColor(color, 1.3);
        this.ctx.globalAlpha = 0.6;
        
        const buttonCount = 5;
        const spacing = (endY - startY) / (buttonCount + 1);
        
        for (let i = 1; i <= buttonCount; i++) {
            const y = startY + spacing * i;
            this.ctx.beginPath();
            this.ctx.arc(centerX, y, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Button holes
            this.ctx.fillStyle = this.adjustColor(color, 0.8);
            this.ctx.beginPath();
            this.ctx.arc(centerX - 1, y, 1, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(centerX + 1, y, 1, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = this.adjustColor(color, 1.3);
        }
        
        this.ctx.globalAlpha = 1;
    }


    adjustColor(color, factor) {
        // Simple color adjustment
        const hex = color.replace('#', '');
        const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * factor));
        const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * factor));
        const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * factor));

        return `rgb(${r}, ${g}, ${b})`;
    }

    setupUI() {
        const dressGrid = document.getElementById('dress-grid');

        this.dresses.forEach((dress) => {
            const dressItem = document.createElement('div');
            dressItem.className = 'dress-item';
            dressItem.dataset.dressId = dress.id;

            dressItem.innerHTML = `
                <div class="dress-icon">${dress.icon}</div>
                <div class="dress-name">${dress.name}</div>
            `;

            dressItem.addEventListener('click', () => this.selectDress(dress));
            dressGrid.appendChild(dressItem);
        });
    }

    selectDress(dress) {
        this.currentDress = dress;

        // Update UI
        document.querySelectorAll('.dress-item').forEach(item => {
            if (parseInt(item.dataset.dressId) === dress.id) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        this.updateStatus(`Wearing: ${dress.name}`);
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());

        // Show skeleton toggle
        document.getElementById('show-skeleton').addEventListener('change', (e) => {
            this.showSkeleton = e.target.checked;
        });

        // Dress scale
        document.getElementById('dress-scale').addEventListener('input', (e) => {
            this.dressScale = parseFloat(e.target.value);
        });

        // Capture photo
        document.getElementById('capture-btn').addEventListener('click', () => {
            this.capturePhoto();
        });

        // Carousel navigation
        const dressGrid = document.getElementById('dress-grid');
        document.getElementById('prev-btn').addEventListener('click', () => {
            dressGrid.scrollBy({ left: -200, behavior: 'smooth' });
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            dressGrid.scrollBy({ left: 200, behavior: 'smooth' });
        });

        // Photo modal
        document.querySelector('.close-btn').addEventListener('click', () => {
            document.getElementById('photo-modal').classList.remove('show');
        });

        document.getElementById('download-btn').addEventListener('click', () => {
            this.downloadPhoto();
        });

        document.getElementById('share-btn').addEventListener('click', () => {
            this.sharePhoto();
        });
    }

    capturePhoto() {
        const photoCanvas = document.createElement('canvas');
        photoCanvas.width = this.canvas.width;
        photoCanvas.height = this.canvas.height;
        const photoCtx = photoCanvas.getContext('2d');

        // Copy current canvas
        photoCtx.drawImage(this.canvas, 0, 0);

        // Show in modal
        const capturedPhoto = document.getElementById('captured-photo');
        capturedPhoto.src = photoCanvas.toDataURL('image/png');
        document.getElementById('photo-modal').classList.add('show');

        // Store for download/share
        this.lastPhoto = photoCanvas;
    }

    downloadPhoto() {
        if (!this.lastPhoto) return;

        const link = document.createElement('a');
        link.download = `ar-tryon-${Date.now()}.png`;
        link.href = this.lastPhoto.toDataURL('image/png');
        link.click();
    }

    async sharePhoto() {
        if (!this.lastPhoto) return;

        try {
            this.lastPhoto.toBlob(async (blob) => {
                const file = new File([blob], 'ar-tryon.png', { type: 'image/png' });

                if (navigator.share) {
                    await navigator.share({
                        title: 'AR Virtual Try-On',
                        text: 'Check out my virtual try-on!',
                        files: [file]
                    });
                } else {
                    alert('Sharing not supported on this device. Use Download instead.');
                }
            });
        } catch (error) {
            console.error('Share error:', error);
            alert('Failed to share. Try downloading instead.');
        }
    }

    resizeCanvas() {
        this.canvas.width = this.video.videoWidth || window.innerWidth;
        this.canvas.height = this.video.videoHeight || window.innerHeight;
    }

    updateFPS() {
        this.frameCount++;
        const now = Date.now();
        const elapsed = now - this.lastTime;

        if (elapsed >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.fpsElement.textContent = `FPS: ${this.fps}`;
            this.frameCount = 0;
            this.lastTime = now;
        }
    }

    updateStatus(message) {
        this.statusElement.textContent = message;
    }

    hideLoading() {
        setTimeout(() => {
            this.loadingScreen.classList.add('hidden');
        }, 500);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ARDressTryOn();
    });
} else {
    new ARDressTryOn();
}

