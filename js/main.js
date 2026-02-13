import { CanvasManager } from './core/canvas.js';
import { Player } from './entities/player.js';
import { CommandManager } from './logic/command.js';

// 🌟 資料層：新增 maxCommands 與 第二章資料
const CHAPTERS = [
    {
        id: 0,
        title: "第一章：太陽系探險",
        levels: [
            { 
                id: 0, name: "第一站：水星", theme: "mercury", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/240px-Mercury_in_color_-_Prockter07-edit1.jpg",
                concept: "序列 (Sequence)", gadget: "竹蜻蜓", gadgetImgUrl: "https://chinesedora.com/images/03.jpg", 
                desc: "【迷宮】地表太熱了！請按順序規劃路徑，去吃終點的「銅鑼燒」！",
                dialogue: "振爲，水星好熱啊！快幫我想想辦法，按順序走到終點吃銅鑼燒降溫！",
                maxCommands: 10 // ✨ 限制指令數
            },
            { 
                id: 1, name: "第二站：金星", theme: "venus", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/240px-Venus-real_color.jpg",
                concept: "除錯 (Debug)", gadget: "穿透環", gadgetImgUrl: "https://chinesedora.com/images/09.jpg", 
                desc: "【除錯】導航壞了！請修正指令，讓哆啦A夢順利吃到「銅鑼燒」。", debugScenario: true,
                dialogue: "振爲，這關的導航壞掉了！你幫我檢查一下指令哪裡錯了？",
                maxCommands: 15
            },
            { 
                id: 2, name: "第三站：地球", theme: "earth", 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/240px-The_Earth_seen_from_Apollo_17.jpg",
                concept: "優化", gadget: "竹蜻蜓", gadgetImgUrl: "https://chinesedora.com/images/03.jpg", 
                desc: "【捷徑】利用「竹蜻蜓」飛越障礙，用最短路徑去拿「銅鑼燒」。",
                dialogue: "振爲，回到地球了！我們用竹蜻蜓直接飛過去吃銅鑼燒吧！",
                maxCommands: 8
            },
            // ... (為了節省篇幅，其他第一章關卡請依此類推加入 maxCommands: 20) ...
            { id: 3, name: "第四站：火星", theme: "mars", imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/240px-OSIRIS_Mars_true_color.jpg", concept: "模式", gadget: "空氣砲", gadgetImgUrl: "https://chinesedora.com/gadget/ka_files/1_1_051.jpg", desc: "使用「空氣砲」轟開障礙！", dialogue: "振爲，前面有岩石擋路！快用空氣砲！", maxCommands: 12 },
            { id: 4, name: "第五站：小行星帶", theme: "asteroid", imgUrl: "https://zh.wikipedia.org/wiki/%E7%A9%80%E7%A5%9E%E6%98%9F#/media/File:Ceres_-_RC3_-_Haulani_Crater_(22381131691)_(cropped).jpg", concept: "障礙迴避", gadget: "石頭帽", gadgetImgUrl: "https://chinesedora.com/comic/c99.jpg", desc: "戴上「石頭帽」變隱形穿過隕石群。", dialogue: "振爲，好多隕石喔！戴上石頭帽我們就會變隱形！", maxCommands: 15 },
            { id: 5, name: "第六站：木星", theme: "jupiter", imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/240px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg", concept: "拆解問題", gadget: "尋人手杖", gadgetImgUrl: "https://chinesedora.com/gadget/wp-content/uploads/2023/09/47759.png", desc: "小心規劃路徑，鑽進氣旋中心。", dialogue: "振爲，那是大紅斑風暴！我們要小心規劃路線！", maxCommands: 20 },
            { id: 6, name: "第七站：土星", theme: "saturn", imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/300px-Saturn_during_Equinox.jpg", concept: "迴圈結構", gadget: "穿透環", gadgetImgUrl: "https://chinesedora.com/images/09.jpg", desc: "找到星環的缺口，或者使用道具穿過去！", dialogue: "振爲，土星環好漂亮，但也好多障礙！", maxCommands: 15 },
            { id: 7, name: "第八站：天王星", theme: "uranus", imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/240px-Uranus2.jpg", concept: "狀態判斷", gadget: "適應燈", gadgetImgUrl: "https://chinesedora.com/gadget/ta_files/1_1_094.jpg", desc: "使用「適應燈」適應環境。", dialogue: "振爲，好冷喔～快用適應燈！", maxCommands: 15 },
            { id: 8, name: "第九站：海王星", theme: "neptune", imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/240px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg", concept: "複雜路徑", gadget: "導航機器人", gadgetImgUrl: "https://chinesedora.com/gadget/wp-content/uploads/2023/09/47759.png", desc: "找出通往「銅鑼燒」的唯一路徑。", dialogue: "振爲，這裡像迷宮一樣，你要冷靜思考！", maxCommands: 25 },
            { id: 9, name: "最終戰：太陽", theme: "sun", imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/240px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg", concept: "邏輯極限", gadget: "任意門", gadgetImgUrl: "https://chinesedora.com/images/01.jpg", desc: "唯一的辦法是用「任意門」直接跳進去！", dialogue: "振爲，太陽核心太危險了！只能用任意門！", maxCommands: 5 }
        ]
    },
    {
        id: 1,
        title: "第二章：時光機之旅",
        levels: [
            {
                id: 0, name: "時光隧道入口", theme: "timetunnel",
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Artist%E2%80%99s_impression_of_a_black_hole_accretion_disc.jpg/240px-Artist%E2%80%99s_impression_of_a_black_hole_accretion_disc.jpg", // 示意圖
                concept: "迴圈 (Loops)", 
                gadget: "時光布",
                gadgetImgUrl: "https://chinesedora.com/gadget/wp-content/uploads/2016/06/1715091763e0e71f92e21b777a.png", // 時光布示意圖
                dialogue: "振爲，時光機壞了！我們陷入了時間迴圈。這條路好長，用重複指令來走吧！",
                desc: "【規律】前方是連續 8 格的直線。請找出規律，用最少的指令走到終點。",
                maxCommands: 3 // 🔥 極限挑戰：強迫使用迴圈 (Loop 1次 + 內容 1次 = 2指令，如果不用迴圈要8次，會失敗)
            }
            // 後續關卡待補
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
        
        // 記錄當前關卡的指令上限
        this.currentMaxCommands = 99; 

        this.canvasManager = new CanvasManager('gameCanvas', 10);
        this.commandManager = new CommandManager('queue-visual');
        this.player = new Player(0, 0);

        this.initUI();
    }

    // 🗣️ 更新哆啦A夢對話
    updateDoraemonTalk(text) {
        const bubble = document.getElementById('dora-speak');
        if (bubble) bubble.innerHTML = text;
    }

    // ✨ 更新指令計數器
    updateCommandCounter() {
        const queue = this.commandManager.getQueue();
        const count = queue.length;
        const max = this.currentMaxCommands;
        const counterEl = document.getElementById('command-counter');
        
        counterEl.innerText = `${count} / ${max}`;
        
        // 樣式變化
        counterEl.className = 'cmd-counter'; // 重置
        if (count >= max) {
            counterEl.classList.add('limit-reached');
        } else if (count >= max - 2) {
            counterEl.classList.add('warning');
        }
    }

    initUI() {
        // 修改：按鈕點擊時檢查上限
        document.querySelectorAll('.cmd-btn').forEach(b => {
            b.onclick = () => {
                if (this.commandManager.getQueue().length < this.currentMaxCommands) {
                    this.commandManager.add(b.dataset.command);
                    this.updateCommandCounter(); // 更新顯示
                } else {
                    this.updateDoraemonTalk("振爲，指令滿了！試著刪除一些，或者思考更精簡的寫法。");
                }
            };
        });

        document.getElementById('gadget-btn').onclick = () => {
            if (this.commandManager.getQueue().length < this.currentMaxCommands) {
                this.commandManager.add("GADGET");
                this.updateCommandCounter();
            } else {
                this.updateDoraemonTalk("振爲，記憶體不足！不能再放道具了！");
            }
        };

        // 撤銷時也要更新計數器
        document.getElementById('undo-btn').onclick = () => {
            this.commandManager.undo();
            this.updateCommandCounter();
        };

        document.getElementById('clear-btn').onclick = () => { 
            const lvl = CHAPTERS[this.currentChapterId].levels[this.currentLevelIndex];
            if (lvl.debugScenario) {
                this.updateDoraemonTalk("振爲，這關是練習除錯，不能全部重來喔！試試看用「撤銷」？");
                return;
            }
            this.commandManager.clear(); 
            this.updateCommandCounter(); // 更新顯示
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
                // 如果這一章結束了
                if (this.currentChapterId === 0) {
                    alert("🎊 恭喜振爲！第一章全破了！\n準備進入第二章：時光機之旅！");
                    // 解鎖第二章 (這裡暫時用簡單邏輯切換，實際可存檔)
                    document.querySelectorAll('.chapter-tab')[1].classList.remove('locked');
                    document.querySelectorAll('.chapter-tab')[1].onclick = () => this.renderChapter(1);
                    document.getElementById('back-to-map').click();
                } else {
                    alert("🎊 太神了！目前版本的所有關卡都完成了！");
                    document.getElementById('back-to-map').click();
                }
            }
        };

        // 章節切換按鈕邏輯
        const tabs = document.querySelectorAll('.chapter-tab');
        tabs[0].onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabs[0].classList.add('active');
            this.renderChapter(0);
        };
        // 第二章按鈕先保留 alert，全破後解鎖的邏輯在上面 next-btn 處理

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
        
        // 更新章節標題顯示 (可選)
        // document.querySelector('.logo-area h2').innerText = chapter.title;

        chapter.levels.forEach((lvl, i) => {
            const card = document.createElement('div'); 
            card.className = 'planet-card';
            card.innerHTML = `
                <div class="planet-img" style="background-image: url('${lvl.imgUrl}')"></div>
                <div class="planet-name">${lvl.name.split('：')[0].replace("第一站", "1").replace("第二站", "2").replace("第三站", "3").replace("第四站", "4").replace("第五站", "5").replace("第六站", "6").replace("第七站", "7").replace("第八站", "8").replace("第九站", "9").replace("最終戰", "10")} ${lvl.name.split(' ')[1] || ''}</div>
            `;
            // 簡化名字顯示邏輯，避免過長
            
            card.onclick = () => this.loadLevel(i); 
            map.appendChild(card);
        });
    }

    loadLevel(index) {
        this.currentLevelIndex = index;
        const lvl = CHAPTERS[this.currentChapterId].levels[index];
        
        // 設定本關最大指令數
        this.currentMaxCommands = lvl.maxCommands || 99;

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
        this.updateCommandCounter(); // 初始歸零
        this.isGhostMode = false;
        this.generateScenario(index);

        if (lvl.debugScenario) {
            ["RIGHT", "RIGHT", "RIGHT", "DOWN"].forEach(c => this.commandManager.add(c));
            this.updateCommandCounter(); // 更新預設指令數量
            this.updateDoraemonTalk("振爲，你看！我設好的指令會撞到牆壁。幫我修好它吧！");
        }
        
        this.refreshAll(false);
    }

    // ... (runCode, executeSingleCommand, checkCollision, generateScenario, refreshAll 保持不變) ...
    // 請保留原本的這些函式內容，它們不需要修改 (除了 generateScenario 若要新增第二章地形，這裡暫時省略，下個步驟再加)
    async runCode() {
        // ... (保持原樣) ...
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
        // ... (保持原樣) ...
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
        // ... (保持原樣) ...
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
        // ⚠️ 重要：這裡需要判斷章節，因為第二章有不同的地形邏輯
        this.currentObstacles = [];
        this.player.x = 0; this.player.y = 0; this.player.direction = 'UP';
        
        // 如果是第一章
        if (this.currentChapterId === 0) {
            if (idx === 0) { this.player.x=1; this.player.y=1; this.targetPos={x:8,y:8}; for(let x=3; x<7; x++) this.currentObstacles.push({x,y:3}, {x,y:6}); } 
            else if (idx === 1) { this.player.x=2; this.player.y=5; this.targetPos={x:7,y:5}; this.currentObstacles.push({x:5,y:5}); for(let x=3; x<7; x++) { if(x!==5) this.currentObstacles.push({x,y:4}); this.currentObstacles.push({x,y:6}); } }
            // ... (其他關卡地形保持不變) ...
            else if (idx === 2) { this.player.x=2; this.player.y=5; this.targetPos={x:7,y:5}; for(let y=2; y<8; y++) this.currentObstacles.push({x:4,y}, {x:5,y}); }
            else if (idx === 3) { this.player.x=4; this.player.y=8; this.targetPos={x:4,y:1}; for(let x=1; x<9; x++) this.currentObstacles.push({x, y:4}); }
            else if (idx === 4) { this.player.x=0; this.player.y=5; this.targetPos={x:9,y:5}; for(let i=0; i<30; i++) { let rx=Math.floor(Math.random()*8)+1, ry=Math.floor(Math.random()*10); if(rx!==this.targetPos.x) this.currentObstacles.push({x:rx, y:ry}); } }
            else if (idx === 5) { this.player.x=0; this.player.y=0; this.targetPos={x:5,y:5}; for(let x=2;x<8;x++) this.currentObstacles.push({x,y:2}, {x,y:7}); for(let y=2;y<8;y++) this.currentObstacles.push({x:2,y}, {x:7,y}); this.currentObstacles.push({x:6,y:3}, {x:6,y:4}, {x:6,y:5}, {x:6,y:6}); }
            else if (idx === 6) { this.player.x=0; this.player.y=0; this.targetPos={x:9,y:9}; [[4,4],[4,5],[5,4],[5,5]].forEach(p=>this.currentObstacles.push({x:p[0],y:p[1]})); for(let i=0; i<10; i++) this.currentObstacles.push({x:i, y:i}); }
            else if (idx === 7) { this.player.x=1; this.player.y=9; this.targetPos={x:8,y:0}; for(let x=0; x<10; x+=2) for(let y=1; y<9; y++) this.currentObstacles.push({x, y}); }
            else if (idx === 8) { this.player.x=0; this.player.y=0; this.targetPos={x:9,y:9}; for(let i=0; i<15; i++) this.currentObstacles.push({x:Math.floor(Math.random()*9)+1, y:Math.floor(Math.random()*9)+1}); }
            else if (idx === 9) { this.player.x=1; this.player.y=1; this.targetPos={x:5,y:5}; this.currentObstacles.push({x:5,y:4},{x:5,y:6},{x:4,y:5},{x:6,y:5}); for(let i=0; i<10; i++) this.currentObstacles.push({x:Math.random()*9|0, y:Math.random()*9|0}); }
        } 
        // 🚀 新增：第二章地形
        else if (this.currentChapterId === 1) {
            if (idx === 0) { // 時光隧道：直線長路 (強迫使用迴圈)
                this.player.x=0; this.player.y=5; this.targetPos={x:9,y:5}; 
                // 上下做牆壁，只能走直線
                for(let x=0; x<10; x++) { this.currentObstacles.push({x,y:4}); this.currentObstacles.push({x,y:6}); }
            }
        }
    }

    refreshAll(animate = true) {
        // ... (保持原樣) ...
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