import { CanvasManager } from './core/canvas.js';
import { Player } from './entities/player.js';
import { CommandManager } from './logic/command.js';

// 🌟 資料層：關卡設定
const CHAPTERS = [
    {
        id: 0,
        title: "第一章：太陽系探險",
        levels: [
            { 
                id: 0, name: "第一站：水星", theme: "mercury", 
                gadget: "竹蜻蜓", gadgetImgUrl: "assets/images/竹蜻蜓.jpg", 
                dialogue: "振爲，水星地表太燙了！<br><b>【道具說明】：</b>使用竹蜻蜓可以<b>「一次飛越兩格」</b>！遇到擋路的石頭，就用飛的跨過去吧！",
                desc: "【迷宮】地表太熱了！請按順序規劃路徑，使用竹蜻蜓飛越障礙，找到終點。",
                maxCommands: 20, 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/240px-Mercury_in_color_-_Prockter07-edit1.jpg"
            },
            { 
                id: 1, name: "第二站：金星", theme: "venus", 
                gadget: "穿透環", gadgetImgUrl: "https://chinesedora.com/images/09.jpg", 
                dialogue: "振爲，導航壞掉了！<br><b>【道具說明】：</b>穿透環會讓你變透明。<b>「只有在撞到牆壁時」</b>才會消耗它並穿過去，走平路是不會消耗的喔！",
                desc: "【除錯】導航壞了！預設指令會撞到隕石，請保留穿透環的邏輯，修正路徑。", 
                debugScenario: true, maxCommands: 15, 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/240px-Venus-real_color.jpg"
            },
            { 
                id: 2, name: "第三站：地球", theme: "earth", 
                gadget: "竹蜻蜓", gadgetImgUrl: "assets/images/竹蜻蜓.jpg", 
                dialogue: "振爲，回到地球了！<br><b>【道具說明】：</b>前面有垃圾牆擋路，用竹蜻蜓<b>「飛兩格」</b>直接跨過去，走捷徑吃銅鑼燒！",
                desc: "【捷徑】前面有太空垃圾牆！利用「竹蜻蜓」一次飛兩格，走最短路徑。",
                maxCommands: 10, 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/240px-The_Earth_seen_from_Apollo_17.jpg"
            },
            { 
                id: 3, name: "第四站：火星", theme: "mars", 
                gadget: "空氣砲", gadgetImgUrl: "https://chinesedora.com/gadget/ka_files/1_1_051.jpg", 
                dialogue: "振爲，岩石擋住了！<br><b>【道具說明】：</b>空氣砲可以擊碎<b>「正前方一格」</b>的障礙。記得先轉身面向石頭，再發射喔！",
                desc: "【開路】火星上有整排的岩石擋路！使用「空氣砲」把擋路的石頭轟開！",
                maxCommands: 15, 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/240px-OSIRIS_Mars_true_color.jpg"
            },
            { 
                id: 4, name: "第五站：小行星帶", theme: "asteroid", 
                gadget: "石頭帽", gadgetImgUrl: "https://chinesedora.com/comic/c99.jpg", 
                dialogue: "振爲，隕石好多啊！<br><b>【道具說明】：</b>戴上石頭帽，我們就會像路邊的石頭一樣被無視。在這關可以<b>「無限次穿過隕石」</b>喔！",
                desc: "【隱身】隕石密度極高！戴上「石頭帽」變隱形，直接穿過密集的隕石群吧！",
                maxCommands: 20, 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Vesta_full_mosaic.jpg/240px-Vesta_full_mosaic.jpg"
            },
            { 
                id: 5, name: "第六站：木星", theme: "jupiter", 
                gadget: "尋人手杖", gadgetImgUrl: "https://chinesedora.com/gadget/wp-content/uploads/2023/09/47759.png", 
                dialogue: "振爲，這裡風暴好強！<br><b>【道具說明】：</b>迷宮太暈了嗎？使用尋人手杖，它會發出光束<b>「指出銅鑼燒的方向」</b>給你提示喔！",
                desc: "【大紅斑】木星風暴是螺旋狀的！請小心規劃，沿著氣旋的縫隙鑽進去。",
                maxCommands: 50, 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/240px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg"
            },
            { 
                id: 6, name: "第七站：土星", theme: "saturn", 
                gadget: "穿透環", gadgetImgUrl: "https://chinesedora.com/images/09.jpg", 
                dialogue: "振爲，你看！銅鑼燒被隕石包圍了！<br><b>【道具說明】：</b>必須使用穿透環。走到牆壁前面，勇敢地<b>「撞上去」</b>，就能穿牆吃到銅鑼燒！",
                desc: "【星環監獄】銅鑼燒被星環碎片完全包圍了！這是測試「穿透環」的最佳機會。",
                maxCommands: 20, 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/300px-Saturn_during_Equinox.jpg"
            },
            { 
                id: 7, name: "第八站：天王星", theme: "uranus", 
                gadget: "適應燈", gadgetImgUrl: "https://chinesedora.com/gadget/ta_files/1_1_094.jpg", 
                dialogue: "振爲，地板結冰了！<br><b>【環境警告】：</b>如果不用道具，走一步會<b>「滑行兩格」</b>喔！<br>使用適應燈讓我們抓住地面吧！",
                desc: "【冰面打滑】天王星的冰層太滑了！移動指令會導致滑行失控。使用「適應燈」來恢復正常行走。",
                maxCommands: 30, 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/240px-Uranus2.jpg"
            },
            { 
                id: 8, name: "第九站：海王星", theme: "neptune", 
                gadget: "導航機器人", gadgetImgUrl: "https://chinesedora.com/gadget/wp-content/uploads/2023/09/47759.png", 
                dialogue: "振爲，這是一個隨機迷宮！<br><b>【提示】：</b>失敗沒關係，地圖不會變。你可以修正指令再試一次！",
                desc: "【深藍迷宮】這裡是隨機生成的迷宮。如果一次沒過，請觀察地圖修正指令。",
                maxCommands: 35, 
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/240px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg"
            },
            { 
                id: 9, name: "最終戰：太陽", theme: "sun", 
                gadget: "任意門", gadgetImgUrl: "https://chinesedora.com/images/01.jpg", 
                dialogue: "振爲，太陽表面都是火焰！<br><b>【道具說明】：</b>起點完全走不出去！使用任意門，先傳送到<b>「內部安全區」</b>，再想辦法走到核心吧！",
                desc: "【日冕迷宮】起點被封死了。利用任意門跳躍到中心，再穿越最後的火焰迷宮！",
                maxCommands: 15, // 限制指令，強迫思考
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/240px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg"
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
        this.isStoneHatMode = false;
        this.isAdaptiveMode = false; 
        this.showHint = false;       
        this.currentMaxCommands = 99;

        this.canvasManager = new CanvasManager('gameCanvas', 10);
        this.commandManager = new CommandManager('queue-visual');
        this.player = new Player(0, 0);

        this.initUI();
    }

    updateDoraemonTalk(text) {
        const bubble = document.getElementById('dora-speak');
        if (bubble) bubble.innerHTML = text;
    }

    updateCommandCounter() {
        const queue = this.commandManager.getQueue();
        const count = queue.length;
        const max = this.currentMaxCommands;
        const counterEl = document.getElementById('command-counter');
        
        if (counterEl) {
            counterEl.innerText = `${count} / ${max}`;
            counterEl.className = 'cmd-counter'; 
            if (count >= max) counterEl.classList.add('limit-reached');
            else if (count >= max - 2) counterEl.classList.add('warning');
        }
    }

    initUI() {
        document.querySelectorAll('.cmd-btn').forEach(b => {
            b.onclick = () => {
                if (this.commandManager.getQueue().length < this.currentMaxCommands) {
                    this.commandManager.add(b.dataset.command);
                    this.updateCommandCounter();
                } else {
                    this.updateDoraemonTalk("振爲，記憶體滿了！指令不能再多了，試著精簡一下？");
                }
            };
        });

        document.getElementById('gadget-btn').onclick = () => {
            if (this.commandManager.getQueue().length < this.currentMaxCommands) {
                this.commandManager.add("GADGET");
                this.updateCommandCounter();
            } else {
                this.updateDoraemonTalk("振爲，記憶體滿了！不能再放道具了！");
            }
        };

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
            this.updateCommandCounter(); 
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
                alert("🎊 恭喜振爲！第一章全破了！\n(更多章節開發中...)");
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
            clearBtn.innerText = "🔒 鎖定"; 
        } else {
            clearBtn.disabled = false;
            clearBtn.style.opacity = "1";
            clearBtn.innerText = "🗑️ 重設";
        }

        this.commandManager.clear();
        this.updateCommandCounter(); 
        this.isGhostMode = false;
        this.isStoneHatMode = false;
        this.isAdaptiveMode = false;
        this.showHint = false;
        
        this.generateScenario(index);

        if (lvl.debugScenario) {
            ["RIGHT", "RIGHT", "RIGHT", "DOWN"].forEach(c => this.commandManager.add(c));
            this.updateCommandCounter();
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
        
        // ⚠️ 重要修正：這裡不再重新 generateScenario，保留原地形讓玩家除錯！
        this.player.x = 0; 
        this.player.y = 0; 
        this.player.direction = 'UP';
        // 針對太陽關卡和水星等特殊起點修正
        const lvl = CHAPTERS[this.currentChapterId].levels[this.currentLevelIndex];
        if (lvl.theme === "mercury") { this.player.x=1; this.player.y=1; }
        else if (lvl.theme === "venus" || lvl.theme === "earth") { this.player.x=2; this.player.y=5; }
        else if (lvl.theme === "mars") { this.player.x=4; this.player.y=8; }
        else if (lvl.theme === "uranus") { this.player.x=1; this.player.y=9; }
        else if (lvl.theme === "sun") { this.player.x=1; this.player.y=1; }

        this.refreshAll(false);
        await new Promise(r => setTimeout(r, 300));

        this.isGhostMode = false;
        this.isStoneHatMode = false; 
        // isAdaptiveMode 保持本關狀態
        
        let failed = false;
        
        for(let cmd of queue) {
            await this.executeSingleCommand(cmd);
            if (this.checkCollision()) {
                this.updateDoraemonTalk("哎呀！撞到了！修正指令再試試看，地圖不會變喔！");
                await new Promise(r => setTimeout(r, 200)); 
                alert("💥 撞到了！(已自動回到起點)");
                failed = true;
                break;
            }
        }

        if (failed) {
            // 失敗時，不重置地形，只重置玩家位置
            // 玩家位置重置邏輯已在下次 runCode 開頭處理
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
                this.refreshAll(false);
            }, 100);
        }
        document.querySelectorAll('button').forEach(b => b.disabled = false);
    }

    async executeSingleCommand(cmd) {
        const lvl = CHAPTERS[this.currentChapterId].levels[this.currentLevelIndex];
        
        if(cmd === "GADGET") {
            const g = lvl.gadget;
            
            if(g === "穿透環") { this.isGhostMode = true; }
            else if(g === "石頭帽") { this.isStoneHatMode = true; }
            else if(g === "適應燈") {
                this.isAdaptiveMode = true;
                this.updateDoraemonTalk("適應燈生效！現在走在冰上也不會打滑了！");
                const gif = document.getElementById('player-gif');
                gif.style.filter = "drop-shadow(0 0 10px yellow)";
                setTimeout(() => gif.style.filter = "none", 1000);
            }
            else if(g === "尋人手杖" || g === "導航機器人") {
                this.showHint = true; 
                this.refreshAll(false);
                this.updateDoraemonTalk("振爲，你看！道具指出銅鑼燒的方向了！");
                await new Promise(r => setTimeout(r, 1500));
                this.showHint = false;
                this.refreshAll(false);
            }
            else if(g === "竹蜻蜓") { 
                this.player.updateState(this.player.previewMove(this.player.direction)); 
                this.refreshAll(true); 
                await new Promise(r=>setTimeout(r,300));
                this.player.updateState(this.player.previewMove(this.player.direction)); 
                this.refreshAll(true); 
                await new Promise(r=>setTimeout(r,300));
            }
            else if(g === "任意門") {
                // ☀️ 太陽關卡難度升級：任意門不直接贏，而是傳送到內部安全區 (5,5)
                if (lvl.theme === "sun") {
                    this.player.x = 5; 
                    this.player.y = 5;
                    this.updateDoraemonTalk("任意門開啟！我們進入日冕內部了，接下來要靠自己走！");
                    this.refreshAll(false);
                } else {
                    // 其他關卡（如果有）維持舊設定
                    this.player.x = this.targetPos.x; this.player.y = this.targetPos.y;
                    this.refreshAll(false);
                }
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

        // --- 移動邏輯 ---
        if (lvl.theme === "uranus" && !this.isAdaptiveMode) {
            this.updateDoraemonTalk("哇哇哇！好滑啊～停不下來！");
            let next = this.player.previewMove(cmd);
            this.player.updateState(next);
            this.refreshAll(true);
            if (this.checkCollision()) return; 
            await new Promise(r => setTimeout(r, 300));
            next = this.player.previewMove(cmd);
            this.player.updateState(next);
            this.refreshAll(true);
        } else {
            const next = this.player.previewMove(cmd);
            this.player.updateState(next);
            this.refreshAll(true);
        }
        await new Promise(r => setTimeout(r, 550));
    }

    checkCollision() {
        const hitObstacle = this.currentObstacles.some(o => o.x === this.player.x && o.y === this.player.y);
        if (hitObstacle) {
            if (this.isStoneHatMode) return false; 
            if (this.isGhostMode) {
                this.isGhostMode = false; 
                return false; 
            }
            return true; 
        }
        return false;
    }

    generateScenario(idx) {
        this.currentObstacles = [];
        this.player.x = 0; this.player.y = 0; this.player.direction = 'UP';

        const addRandomObstacles = (count, excludeX, excludeY) => {
            let placed = 0;
            while(placed < count) {
                let rx = Math.floor(Math.random() * 10);
                let ry = Math.floor(Math.random() * 10);
                if (rx + ry <= 1) continue; 
                if (Math.abs(rx-excludeX) + Math.abs(ry-excludeY) <= 1) continue;
                // 太陽關卡保護區：任意門落點 (5,5) 周圍不能有障礙
                if (idx === 9 && Math.abs(rx-5) <= 0 && Math.abs(ry-5) <= 0) continue; 

                if (!this.currentObstacles.some(o => o.x===rx && o.y===ry)) {
                    this.currentObstacles.push({x:rx, y:ry});
                    placed++;
                }
            }
        };

        if (idx === 0) { // 水星
            this.player.x=1; this.player.y=1; this.targetPos={x:8,y:8}; 
            for(let x=3; x<7; x++) this.currentObstacles.push({x,y:3}, {x,y:6}); 
            this.currentObstacles.push({x:1,y:2}); 
        } 
        else if (idx === 1) { // 金星
            this.player.x=2; this.player.y=5; this.targetPos={x:7,y:5}; 
            this.currentObstacles.push({x:5,y:5}); 
            for(let x=3; x<7; x++) { if(x!==5) this.currentObstacles.push({x,y:4}); this.currentObstacles.push({x,y:6}); } 
        }
        else if (idx === 2) { // 地球
            this.player.x=2; this.player.y=5; this.targetPos={x:7,y:5}; 
            for(let y=2; y<8; y++) this.currentObstacles.push({x:4,y}); 
        }
        else if (idx === 3) { // 火星
            this.player.x=4; this.player.y=8; this.targetPos={x:4,y:1}; 
            for(let x=1; x<9; x++) this.currentObstacles.push({x, y:4}); 
        }
        else if (idx === 4) { // 小行星
            this.player.x=0; this.player.y=5; this.targetPos={x:9,y:5}; 
            addRandomObstacles(30, 9, 5);
        }
        else if (idx === 5) { // 木星 (修正版：打通死路)
            this.player.x=0; this.player.y=0; this.targetPos={x:5,y:5}; 
            // 繪製口字型外牆，但在 (3,2) 留缺口
            for (let x = 2; x < 8; x++) {
                if (x !== 3) this.currentObstacles.push({ x, y: 2 });
                this.currentObstacles.push({ x, y: 7 });
            }
            for (let y = 2; y < 8; y++) {
                this.currentObstacles.push({ x: 2, y });
                this.currentObstacles.push({ x: 7, y });
            }
            // 內部螺旋引導，移除 (5,4) 和 (6,4) 讓路通暢
            this.currentObstacles.push({ x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 });
        }
        else if (idx === 6) { // 土星 (修正版：監獄)
            this.player.x=0; this.player.y=0; this.targetPos={x:5,y:5}; 
            // 圍住銅鑼燒 (5,5) 的 3x3 監獄
            for(let x=4; x<=6; x++) {
                this.currentObstacles.push({x, y:4}); // 上
                this.currentObstacles.push({x, y:6}); // 下
            }
            this.currentObstacles.push({x:4, y:5}); // 左
            this.currentObstacles.push({x:6, y:5}); // 右
        }
        else if (idx === 7) { // 天王星
            this.player.x=1; this.player.y=9; this.targetPos={x:8,y:0}; 
            for(let x=0; x<10; x+=2) for(let y=1; y<9; y++) this.currentObstacles.push({x, y}); 
        }
        else if (idx === 8) { // 海王星
            this.player.x=0; this.player.y=0; this.targetPos={x:9,y:9}; 
            addRandomObstacles(20, 9, 9);
        }
        else if (idx === 9) { // 太陽 (修正版：保底路徑)
            this.player.x = 1; this.player.y = 1; this.targetPos = { x: 9, y: 9 };
            
            // 1. 起點封死 (維持原樣)
            this.currentObstacles.push({x:1,y:0}, {x:0,y:1}, {x:2,y:1}, {x:1,y:2});

            // 2. 隨機填滿障礙物 (稍微減少一點數量，從 40 -> 35)
            addRandomObstacles(35, 9, 9);

            // 3. ✨ 關鍵修正：挖出一條「保底路徑」 (Guaranteed Path) ✨
            // 這是一條從中間 (5,5) 到終點 (9,9) 的隱藏通道，確保一定有解
            const safePath = [
                {x:5,y:5}, // 安全區
                {x:6,y:5}, {x:6,y:6}, // 路徑...
                {x:7,y:6}, {x:7,y:7}, 
                {x:8,y:7}, {x:8,y:8}, 
                {x:9,y:8}, {x:9,y:9}  // 終點前
            ];

            // 4. 過濾障礙物：如果障礙物擋在「保底路徑」或「安全區周圍」，就移除它
            this.currentObstacles = this.currentObstacles.filter(o => {
                // 檢查是否在保底路徑上
                const isBlockingPath = safePath.some(p => p.x === o.x && p.y === o.y);
                // 檢查是否在 (5,5) 安全降落點本身
                const isBlockingCenter = (o.x === 5 && o.y === 5);
                
                // 如果擋路就移除 (return false)，否則保留 (return true)
                return !(isBlockingPath || isBlockingCenter);
            });
        }
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