export class CanvasManager {
    constructor(canvasId, gridSize = 10) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = gridSize;
        
        // 🌟 載入本地銅鑼燒圖片
        this.dorayakiImg = new Image();
        // ✅ 修改處：使用本地路徑
        this.dorayakiImg.src = "assets/images/dorayaki.png";
        
        this.resize();
    }
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.cellSize = this.canvas.width / this.gridSize;
    }
    gridToPixel(g) { return g * this.cellSize + this.cellSize / 2; }

    drawScene(p, target, obs, planet) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 1. 背景繪製
        if (planet.includes("水星")) this.fillBg("#2c2c2c");
        else if (planet.includes("金星")) this.fillBg("#5D4037", "rgba(255,193,7,0.1)");
        else if (planet.includes("地球")) {
            this.fillBg("#0D47A1");
            this.ctx.fillStyle = "#388E3C";
            [{x:0.2,y:0.3,r:0.2},{x:0.7,y:0.4,r:0.25},{x:0.4,y:0.7,r:0.18}].forEach(l=>this.drawCircle(l.x, l.y, l.r));
        }
        else if (planet.includes("火星")) this.fillBg("#8D3B2E");
        else if (planet.includes("小行星")) this.fillBg("#000000");
        else if (planet.includes("木星")) this.fillBg("#D4A373", "rgba(0,0,0,0.1)");
        else if (planet.includes("土星")) this.fillBg("#E3C67B");
        else if (planet.includes("天王星")) this.fillBg("#A6E7FF");
        else if (planet.includes("海王星")) this.fillBg("#1A237E");
        else if (planet.includes("太陽")) {
            const g = this.ctx.createRadialGradient(this.canvas.width/2,this.canvas.height/2,0,this.canvas.width/2,this.canvas.height/2,this.canvas.width);
            g.addColorStop(0, "#FF4500"); g.addColorStop(1, "#8B0000");
            this.ctx.fillStyle = g; this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        }

        // 2. 格線
        this.ctx.strokeStyle = planet.includes("太陽") ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for(let i=0; i<=this.gridSize; i++) {
            this.ctx.moveTo(i*this.cellSize, 0); this.ctx.lineTo(i*this.cellSize, this.canvas.height);
            this.ctx.moveTo(0, i*this.cellSize); this.ctx.lineTo(this.canvas.width, i*this.cellSize);
        }
        this.ctx.stroke();

        // 3. 障礙物
        obs.forEach(o => {
            const px = this.gridToPixel(o.x), py = this.gridToPixel(o.y);
            if (planet.includes("太陽")) { this.ctx.fillStyle="#000"; this.ctx.shadowBlur=10; this.ctx.shadowColor="red"; }
            else if(planet.includes("地球")) this.ctx.fillStyle="#E0E0E0"; 
            else if(planet.includes("火星")) this.ctx.fillStyle="#5D1000"; 
            else if(planet.includes("天王星")) this.ctx.fillStyle="#E0F7FA"; 
            else this.ctx.fillStyle="#5D4037";
            
            this.ctx.beginPath(); this.ctx.arc(px, py, this.cellSize*0.4, 0, Math.PI*2); this.ctx.fill();
            this.ctx.shadowBlur=0;
        });

        // 🌟 4. 繪製終點 (銅鑼燒)
        if(target) {
            const tx = this.gridToPixel(target.x);
            const ty = this.gridToPixel(target.y);
            const size = this.cellSize * 0.7; // 圖片大小

            this.ctx.save();
            this.ctx.shadowBlur = 20; 
            this.ctx.shadowColor = "#FFEB3B";
            
            if (this.dorayakiImg.complete) {
                this.ctx.beginPath();
                this.ctx.arc(tx, ty, size/2, 0, Math.PI*2);
                this.ctx.clip(); // 裁切成圓形
                this.ctx.drawImage(this.dorayakiImg, tx - size/2, ty - size/2, size, size);
            } else {
                // 備用：黃色圓圈
                this.ctx.fillStyle = "#FFEB3B";
                this.ctx.beginPath();
                this.ctx.arc(tx, ty, size/2, 0, Math.PI*2);
                this.ctx.fill();
            }
            this.ctx.restore();
        }
    }

    fillBg(color, overlay) {
        this.ctx.fillStyle = color; this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        if(overlay) { this.ctx.fillStyle=overlay; this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height); }
    }
    drawCircle(x, y, r) {
        this.ctx.beginPath(); this.ctx.arc(x*this.canvas.width, y*this.canvas.height, r*this.canvas.width, 0, Math.PI*2); this.ctx.fill();
    }
}