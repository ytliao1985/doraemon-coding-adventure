import { CanvasManager } from './core/canvas.js';
import { Player } from './entities/player.js';
import { CommandManager } from './logic/command.js';

// 🌟 資料層：加入哆啦A夢對振爲的對話
const CHAPTERS = [
    {
        id: 0,
        title: "第一章：太陽系探險",
        levels: [
            { 
                id: 0, name: "第一站：水星 Mercury", theme: "mercury", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/240px-Mercury_in_color_-_Prockter07-edit1.jpg",
                concept: "序列 (Sequence)", 
                gadget: "竹蜻蜓", 
                gadgetImgUrl: "https://chinesedora.com/images/03.jpg", 
                // ✅ 新增：哆啦A夢的台詞
                dialogue: "振爲，水星好熱啊！快幫我想想辦法，按順序走到終點吃銅鑼燒降溫！",
                desc: "地表太熱了！請按順序規劃路徑，穿過蜿蜒的岩石迷宮，找到終點。" 
            },
            { 
                id: 1, name: "第二站：金星 Venus", theme: "venus", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/240px-Venus-real_color.jpg",
                concept: "除錯 (Debug)", 
                gadget: "穿透環", 
                gadgetImgUrl: "https://chinesedora.com/images/09.jpg", 
                dialogue: "振爲，這關的導航壞掉了！會撞到隕石。你幫我檢查一下指令哪裡錯了？",
                desc: "導航壞了！預設指令會撞到隕石，請刪除錯誤指令，修正路徑。", debugScenario: true 
            },
            { 
                id: 2, name: "第三站：地球 Earth", theme: "earth", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/240px-The_Earth_seen_from_Apollo_17.jpg",
                concept: "優化 (Efficiency)", 
                gadget: "竹蜻蜓", 
                gadgetImgUrl: "https://chinesedora.com/images/03.jpg", 
                dialogue: "振爲，回到地球了！可是垃圾好多，我們用竹蜻蜓直接飛過去吃銅鑼燒吧！",
                desc: "前面有太空垃圾牆！利用「竹蜻蜓」一次飛兩格，走最短路徑。" 
            },
            { 
                id: 3, name: "第四站：火星 Mars", theme: "mars", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/240px-OSIRIS_Mars_true_color.jpg",
                concept: "模式 (Pattern)", 
                gadget: "空氣砲", 
                gadgetImgUrl: "https://chinesedora.com/gadget/ka_files/1_1_051.jpg", 
                dialogue: "振爲，前面有岩石擋路！快用空氣砲「碰」的一聲把障礙轟開！",
                desc: "火星上有整排的岩石擋路！使用「空氣砲」把擋路的石頭轟開！" 
            },
            { 
                id: 4, name: "第五站：小行星帶", theme: "asteroid", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg",
                concept: "障礙迴避", 
                gadget: "石頭帽", 
                gadgetImgUrl: "https://chinesedora.com/comic/c99.jpg", 
                dialogue: "振爲，好多隕石喔！戴上石頭帽我們就會變隱形，可以偷偷溜過去！",
                desc: "隕石密度極高！戴上「石頭帽」變隱形，直接穿過密集的隕石群吧！" 
            },
            { 
                id: 5, name: "第六站：木星 Jupiter", theme: "jupiter", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/240px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
                concept: "拆解問題", 
                gadget: "尋人手杖", 
                gadgetImgUrl: "https://chinesedora.com/gadget/wp-content/uploads/2023/09/47759.png", 
                dialogue: "振爲，那是大紅斑風暴！我們要小心規劃路線，繞進去吃銅鑼燒！",
                desc: "木星風暴是螺旋狀的！請小心規劃，沿著氣旋的縫隙鑽進去。" 
            },
            { 
                id: 6, name: "第七站：土星 Saturn", theme: "saturn", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/300px-Saturn_during_Equinox.jpg",
                concept: "迴圈結構", 
                gadget: "穿透環", 
                gadgetImgUrl: "https://chinesedora.com/images/09.jpg", 
                dialogue: "振爲，土星環好漂亮，但也好多障礙！用穿透環穿過去吧！",
                desc: "土星環是一圈圈的障礙。找到星環的缺口，或者使用道具穿過去！" 
            },
            { 
                id: 7, name: "第八站：天王星 Uranus", theme: "uranus", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/240px-Uranus2.jpg",
                concept: "狀態判斷", 
                gadget: "適應燈", 
                gadgetImgUrl: "https://chinesedora.com/gadget/ta_files/1_1_094.jpg", 
                dialogue: "振爲，好冷喔～快用適應燈，不然我們會凍僵的！",
                desc: "天王星太冷了！使用「適應燈」適應環境，才能在冰面上移動。" 
            },
            { 
                id: 8, name: "第九站：海王星 Neptune", theme: "neptune", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/240px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg",
                concept: "複雜路徑", 
                gadget: "導航機器人", 
                gadgetImgUrl: "https://chinesedora.com/gadget/wp-content/uploads/2023/09/47759.png", 
                dialogue: "振爲，這裡像迷宮一樣，你要冷靜思考，帶我走出去喔！",
                desc: "這裡是太陽系邊緣的巨大迷宮。冷靜思考，找出唯一的出路。" 
            },
            { 
                id: 9, name: "最終戰：太陽 Sun", theme: "sun", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/240px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
                concept: "邏輯極限", 
                gadget: "任意門", 
                gadgetImgUrl: "https://chinesedora.com/images/01.jpg", 
                dialogue: "振爲，太陽核心太危險了！沒路可走... 只能用任意門直接跳進去吃銅鑼燒！",
                desc: "核心被黑曜岩完全封死！這是不可能走進去的... 除非你用「那個」道具！" 
            }
        ]
    }
];

class GameApp {
    constructor() {
        this.currentChapterId = 0;
        this.currentLevelIndex = 0;
        this.currentObstacles = [];
        this.targetPos = { x: 0, y: 0 };
        this.isGhostMode = false;

        this.canvasManager = new CanvasManager('gameCanvas', 10);
        this.commandManager = new CommandManager('queue-visual');
        this.player = new Player(0, 0);

        this.initUI();
    }

    // 🗣️ 哆啦A夢說話控制函式
    updateDoraemonTalk(text) {
        const bubble = document.getElementById('dora-speak');
        if (bubble) {
            bubble.innerHTML = text;
        }
    }

    initUI() {
        document.querySelectorAll('.cmd-btn').forEach(b => b.onclick = () => this.commandManager.add(b.dataset.command));
        document.getElementById('gadget-btn').onclick = () => this.commandManager.add("GADGET");
        document.getElementById('undo-btn').onclick = () => this.commandManager.undo();
        
        document.getElementById('clear-btn').onclick = () => { 
            const lvl = CHAPTERS[this.currentChapterId].levels[this.currentLevelIndex];
            if (lvl.debugScenario) {
                this.updateDoraemonTalk("振爲，這關是練習除錯，不能全部重來喔！試試看用「撤銷」？");
                return;
            }
            this.commandManager.clear(); 
            this.loadLevel(this.currentLevelIndex); 
        };
        
        document.getElementById('back-to-map').onclick = () => {
            document.getElementById('home-screen').style.display = 'flex';
            document.getElementById('game-container').style.display = 'none';
            document.getElementById('victory-overlay').classList.add('hidden');
            document.getElementById('victory-overlay').style.display = 'none';
        };
        
        document.getElementById('run-btn').onclick = () => this.runCode();

        document.getElementById('next-btn').onclick = () => {
            const overlay = document.getElementById('victory-overlay');
            overlay.classList.add('hidden');
            overlay.style.display = 'none';

            const nextIndex = this.currentLevelIndex + 1;
            const currentChapterLevels = CHAPTERS[this.currentChapterId].levels;

            if (nextIndex < currentChapterLevels.length) {
                this.loadLevel(nextIndex);
            } else {
                alert("🎊 恭喜振爲！第一章全破了！我們回地圖吧！");
                document.getElementById('back-to-map').click();
            }
        };

        this.renderChapter(0);
        window.addEventListener('resize', () => { 
            if(document.getElementById('game-container').style.display !== 'none') this.refreshAll(false); 
        });
    }

    renderChapter(chapterId) {
        this.currentChapterId = chapterId;
        const chapter = CHAPTERS[chapterId];
        const map = document.getElementById('level-map');
        map.innerHTML = '';
        
        chapter.levels.forEach((lvl, i) => {
            const card = document.createElement('div'); 
            card.className = 'planet-card';
            card.innerHTML = `
                <div class="planet-img" style="background-image: url('${lvl.imgUrl}')"></div>
                <div class="planet-name">${lvl.name.split('：')[1].split(' ')[0]}</div>
            `;
            card.onclick = () => this.loadLevel(i); 
            map.appendChild(card);
        });
    }

    loadLevel(index) {
        this.currentLevelIndex = index;
        const lvl = CHAPTERS[this.currentChapterId].levels[index];

        document.getElementById('home-screen').style.display = 'none';
        const gc = document.getElementById('game-container');
        gc.style.display = 'flex';
        gc.className = lvl.theme + "-theme";

        this.canvasManager.resize();

        document.getElementById('level-title').innerText = lvl.name;
        document.getElementById('gadget-display-area').innerHTML = `
            <img src="${lvl.gadgetImgUrl}" class="gadget-icon-img" alt="${lvl.gadget}">
            ${lvl.gadget}
        `;
        
        // ✅ 更新：設定哆啦A夢的開場白
        this.updateDoraemonTalk(lvl.dialogue);

        document.getElementById('gadget-btn-content').innerHTML = `
            <img src="${lvl.gadgetImgUrl}" class="gadget-btn-icon" alt="道具">
            使用：${lvl.gadget}
        `;

        const clearBtn = document.getElementById('clear-btn');
        if (lvl.debugScenario) {
            clearBtn.disabled = true;
            clearBtn.style.opacity = "0.5";
            clearBtn.style.cursor = "not-allowed";
            clearBtn.innerText = "🔒 鎖定"; 
        } else {
            clearBtn.disabled = false;
            clearBtn.style.opacity = "1";
            clearBtn.style.cursor = "pointer";
            clearBtn.innerText = "🗑️ 重設";
        }

        this.commandManager.clear();
        this.isGhostMode = false;
        this.generateScenario(index);

        if (lvl.debugScenario) {
            ["RIGHT", "RIGHT", "RIGHT", "DOWN"].forEach(c => this.commandManager.add(c));
            // 對話更新
            this.updateDoraemonTalk("振爲，你看！我設好的指令會撞到牆壁。幫我修好它吧！");
        }
        
        this.refreshAll(false);
    }

    async runCode() {
        const queue = this.commandManager.getQueue();
        if(queue.length === 0) {
            this.updateDoraemonTalk("振爲，還沒有輸入指令喔！");
            return;
        }
        document.querySelectorAll('button').forEach(b => b.disabled = true);
        
        this.generateScenario(this.currentLevelIndex);
        this.refreshAll(false);
        await new Promise(r => setTimeout(r, 300));

        this.isGhostMode = false;
        let failed = false;
        
        for(let cmd of queue) {
            await this.executeSingleCommand(cmd);
            if (this.checkCollision()) {
                // ✅ 失敗對話
                this.updateDoraemonTalk("哎呀！振爲，撞到了！沒關係，修正一下再試試看！");
                alert("💥 撞到了！(已自動回到起點)");
                failed = true;
                break;
            }
        }

        if (failed) {
            this.generateScenario(this.currentLevelIndex);
            this.refreshAll(false);
        } else if(this.player.x === this.targetPos.x && this.player.y === this.targetPos.y) {
            setTimeout(() => {
                const overlay = document.getElementById('victory-overlay');
                overlay.style.display = 'flex'; 
                overlay.classList.remove('hidden'); 
            }, 100);
        } else {
            setTimeout(() => {
                // ✅ 未完成對話
                this.updateDoraemonTalk("振爲，我們還沒走到終點呢！繼續加油！");
                alert("🤔 執行完畢，但還沒吃到銅鑼燒。");
                this.generateScenario(this.currentLevelIndex);
                this.refreshAll(false);
            }, 100);
        }
        document.querySelectorAll('button').forEach(b => b.disabled = false);
        
        const lvl = CHAPTERS[this.currentChapterId].levels[this.currentLevelIndex];
        if (lvl.debugScenario) {
            document.getElementById('clear-btn').disabled = true;
        }
    }

    async executeSingleCommand(cmd) {
        const lvl = CHAPTERS[this.currentChapterId].levels[this.currentLevelIndex];
        
        if(cmd === "GADGET") {
            const g = lvl.gadget;
            if(g === "穿透環" || g === "石頭帽") { this.isGhostMode = true; }
            else if(g === "竹蜻蜓") { 
                this.player.updateState(this.player.previewMove(this.player.direction)); 
                this.player.updateState(this.player.previewMove(this.player.direction)); 
                this.refreshAll(true); await new Promise(r=>setTimeout(r,500)); 
            }
            else if(g === "任意門") {
                this.player.x = this.targetPos.x; this.player.y = this.targetPos.y;
                this.refreshAll(false);
            }
            else if(g === "空氣砲") {
                const front = this.player.previewMove(this.player.direction);
                const obsIndex = this.currentObstacles.findIndex(o => o.x === front.x && o.y === front.y);
                if(obsIndex > -1) {
                    this.currentObstacles.splice(obsIndex, 1);
                    this.refreshAll(true);
                }
                await new Promise(r=>setTimeout(r,500));
            }
            return;
        }

        const next = this.player.previewMove(cmd);
        this.player.updateState(next);
        this.refreshAll(true);
        await new Promise(r => setTimeout(r, 550));
    }

    checkCollision() {
        const hitObstacle = this.currentObstacles.some(o => o.x === this.player.x && o.y === this.player.y);
        
        if (hitObstacle) {
            if (this.isGhostMode) {
                console.log("使用了道具，安全通過！");
                this.isGhostMode = false; 
                return false; 
            } else {
                return true; 
            }
        }
        return false;
    }

    generateScenario(idx) {
        this.currentObstacles = [];
        this.player.x = 0; this.player.y = 0; this.player.direction = 'UP';

        if (idx === 0) { this.player.x=1; this.player.y=1; this.targetPos={x:8,y:8}; for(let x=3; x<7; x++) this.currentObstacles.push({x,y:3}, {x,y:6}); } 
        else if (idx === 1) { this.player.x=2; this.player.y=5; this.targetPos={x:7,y:5}; this.currentObstacles.push({x:5,y:5}); for(let x=3; x<7; x++) { if(x!==5) this.currentObstacles.push({x,y:4}); this.currentObstacles.push({x,y:6}); } }
        else if (idx === 2) { this.player.x=2; this.player.y=5; this.targetPos={x:7,y:5}; for(let y=2; y<8; y++) this.currentObstacles.push({x:4,y}, {x:5,y}); }
        else if (idx === 3) { this.player.x=4; this.player.y=8; this.targetPos={x:4,y:1}; for(let x=1; x<9; x++) this.currentObstacles.push({x, y:4}); }
        else if (idx === 4) { this.player.x=0; this.player.y=5; this.targetPos={x:9,y:5}; for(let i=0; i<30; i++) { let rx=Math.floor(Math.random()*8)+1, ry=Math.floor(Math.random()*10); if(rx!==this.targetPos.x) this.currentObstacles.push({x:rx, y:ry}); } }
        else if (idx === 5) { this.player.x=0; this.player.y=0; this.targetPos={x:5,y:5}; for(let x=2;x<8;x++) this.currentObstacles.push({x,y:2}, {x,y:7}); for(let y=2;y<8;y++) this.currentObstacles.push({x:2,y}, {x:7,y}); this.currentObstacles.push({x:6,y:3}, {x:6,y:4}, {x:6,y:5}, {x:6,y:6}); }
        else if (idx === 6) { this.player.x=0; this.player.y=0; this.targetPos={x:9,y:9}; [[4,4],[4,5],[5,4],[5,5]].forEach(p=>this.currentObstacles.push({x:p[0],y:p[1]})); for(let i=0; i<10; i++) this.currentObstacles.push({x:i, y:i}); }
        else if (idx === 7) { this.player.x=1; this.player.y=9; this.targetPos={x:8,y:0}; for(let x=0; x<10; x+=2) for(let y=1; y<9; y++) this.currentObstacles.push({x, y}); }
        else if (idx === 8) { this.player.x=0; this.player.y=0; this.targetPos={x:9,y:9}; for(let i=0; i<15; i++) this.currentObstacles.push({x:Math.floor(Math.random()*9)+1, y:Math.floor(Math.random()*9)+1}); }
        else if (idx === 9) { this.player.x=1; this.player.y=1; this.targetPos={x:5,y:5}; this.currentObstacles.push({x:5,y:4},{x:5,y:6},{x:4,y:5},{x:6,y:5}); for(let i=0; i<10; i++) this.currentObstacles.push({x:Math.random()*9|0, y:Math.random()*9|0}); }
    }

    refreshAll(animate = true) {
        const lvlName = CHAPTERS[this.currentChapterId].levels[this.currentLevelIndex].name;
        this.canvasManager.drawScene(null, this.targetPos, this.currentObstacles, lvlName);
        const px = this.canvasManager.gridToPixel(this.player.x);
        const py = this.canvasManager.gridToPixel(this.player.y);
        const gif = document.getElementById('player-gif');
        gif.style.width = this.canvasManager.cellSize * 1.4 + 'px';
        gif.style.height = this.canvasManager.cellSize * 1.4 + 'px';
        gif.style.transition = animate ? "all 0.5s ease-in-out" : "none";
        gif.style.left = px + 'px'; gif.style.top = (py - 2) + 'px';
    }
}

window.gameApp = new GameApp();