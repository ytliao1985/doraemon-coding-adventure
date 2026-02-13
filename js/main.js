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
                startPos: { x: 1, y: 1 }, targetPos: { x: 8, y: 8 },
                gadget: "竹蜻蜓", gadgetImgUrl: "assets/images/竹蜻蜓.jpg",
                dialogue: "振爲，水星地表太燙了！<br><b>【道具說明】：</b>使用竹蜻蜓可以<b>「一次飛越兩格」</b>！遇到擋路的石頭，就用飛的跨過去吧！",
                desc: "【迷宮】地表太熱了！請按順序規劃路徑，使用竹蜻蜓飛越障礙，找到終點。",
                maxCommands: 25,
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/240px-Mercury_in_color_-_Prockter07-edit1.jpg"
            },
            {
                id: 1, name: "第二站：金星", theme: "venus",
                startPos: { x: 2, y: 5 }, targetPos: { x: 7, y: 5 },
                gadget: "穿透環", gadgetImgUrl: "https://chinesedora.com/images/09.jpg",
                dialogue: "振爲，導航壞掉了！<br><b>【道具說明】：</b>穿透環會讓你變透明。<b>「只有在撞到牆壁時」</b>才會消耗它並穿過去，走平路是不會消耗的喔！",
                desc: "【除錯】導航壞了！預設指令會撞到隕石，請保留穿透環的邏輯，修正路徑。",
                debugScenario: true, maxCommands: 20,
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/240px-Venus-real_color.jpg"
            },
            {
                id: 2, name: "第三站：地球", theme: "earth",
                startPos: { x: 2, y: 5 }, targetPos: { x: 7, y: 5 },
                gadget: "竹蜻蜓", gadgetImgUrl: "assets/images/竹蜻蜓.jpg",
                dialogue: "振爲，回到地球了！<br><b>【道具說明】：</b>前面有垃圾牆擋路，用竹蜻蜓<b>「飛兩格」</b>直接跨過去，走捷徑吃銅鑼燒！",
                desc: "【捷徑】前面有太空垃圾牆！利用「竹蜻蜓」一次飛兩格，走最短路徑。",
                maxCommands: 20,
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/240px-The_Earth_seen_from_Apollo_17.jpg"
            },
            {
                id: 3, name: "第四站：火星", theme: "mars",
                startPos: { x: 4, y: 8 }, targetPos: { x: 4, y: 1 },
                gadget: "空氣砲", gadgetImgUrl: "https://chinesedora.com/gadget/ka_files/1_1_051.jpg",
                dialogue: "振爲，岩石擋住了！<br><b>【道具說明】：</b>空氣砲可以擊碎<b>「正前方一格」</b>的障礙。記得先轉身面向石頭，再發射喔！",
                desc: "【開路】火星上有整排的岩石擋路！使用「空氣砲」把擋路的石頭轟開！",
                maxCommands: 20,
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/240px-OSIRIS_Mars_true_color.jpg"
            },
            {
                id: 4, name: "第五站：小行星帶", theme: "asteroid",
                startPos: { x: 0, y: 5 }, targetPos: { x: 9, y: 5 },
                gadget: "石頭帽", gadgetImgUrl: "https://chinesedora.com/comic/c99.jpg",
                dialogue: "振爲，隕石好多啊！<br><b>【道具說明】：</b>戴上石頭帽，我們就會像路邊的石頭一樣被無視。在這關可以<b>「無限次穿過隕石」</b>喔！",
                desc: "【隱身】隕石密度極高！戴上「石頭帽」變隱形，直接穿過密集的隕石群吧！",
                maxCommands: 30,
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Vesta_full_mosaic.jpg/240px-Vesta_full_mosaic.jpg"
            },
            {
                id: 5, name: "第六站：木星", theme: "jupiter",
                startPos: { x: 0, y: 0 }, targetPos: { x: 5, y: 5 },
                gadget: "尋人手杖", gadgetImgUrl: "https://chinesedora.com/gadget/wp-content/uploads/2023/09/47759.png",
                dialogue: "振爲，這是完美的螺旋迷宮！<br><b>【道具說明】：</b>繞進去太遠了嗎？使用尋人手杖，它可以<b>「打穿螺旋的牆壁」</b>，直接開出一條捷徑！",
                desc: "【完美螺旋】請沿著螺旋路徑，由外而內一層層繞進中心。覺得太遠就用道具吧！",
                maxCommands: 60,
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/240px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg"
            },
            {
                id: 6, name: "第七站：土星", theme: "saturn",
                startPos: { x: 0, y: 0 }, targetPos: { x: 5, y: 5 },
                gadget: "穿透環", gadgetImgUrl: "https://chinesedora.com/images/09.jpg",
                dialogue: "振爲，你看！銅鑼燒被隕石包圍了！<br><b>【道具說明】：</b>必須使用穿透環。走到牆壁前面，勇敢地<b>「撞上去」</b>，就能穿牆吃到銅鑼燒！",
                desc: "【星環監獄】銅鑼燒被星環碎片完全包圍了！這是測試「穿透環」的最佳機會。",
                maxCommands: 25,
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/300px-Saturn_during_Equinox.jpg"
            },
            {
                id: 7, name: "第八站：天王星", theme: "uranus",
                startPos: { x: 1, y: 9 }, targetPos: { x: 8, y: 0 },
                gadget: "適應燈", gadgetImgUrl: "https://chinesedora.com/gadget/ta_files/1_1_094.jpg",
                dialogue: "振爲，地板結冰了！<br><b>【環境警告】：</b>如果不用道具，走一步會<b>「滑行兩格」</b>喔！<br>使用適應燈讓我們抓住地面吧！",
                desc: "【冰面打滑】天王星的冰層太滑了！移動指令會導致滑行失控。使用「適應燈」來恢復正常行走。",
                maxCommands: 30,
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/240px-Uranus2.jpg"
            },
            {
                id: 8, name: "第九站：海王星", theme: "neptune",
                startPos: { x: 0, y: 0 }, targetPos: { x: 9, y: 9 },
                gadget: "導航機器人", gadgetImgUrl: "https://chinesedora.com/gadget/wp-content/uploads/2023/09/47759.png",
                dialogue: "振爲，隨機迷宮太難了？<br><b>【道具升級】：</b>使用導航機器人，它會發動強光，<b>「炸毀你周圍的所有障礙物」</b>，瞬間清出場地！",
                desc: "【深藍迷宮】隨機生成的迷宮擋住去路？召喚機器人幫你「物理開路」！",
                maxCommands: 50,
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/240px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg"
            },
            {
                id: 9, name: "最終戰：太陽", theme: "sun",
                startPos: { x: 1, y: 1 }, targetPos: { x: 9, y: 9 },
                gadget: "任意門", gadgetImgUrl: "https://chinesedora.com/images/01.jpg",
                dialogue: "振爲，太陽表面都是火焰！<br><b>【道具說明】：</b>起點完全走不出去！使用任意門，先傳送到<b>「內部安全區」</b>，再想辦法走到核心吧！",
                desc: "【日冕迷宮】起點被封死了。利用任意門跳躍到中心，再穿越最後的火焰迷宮！",
                maxCommands: 30,
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

        // 從 CHAPTERS 強制讀取上限，確保 UI 顯示正確
        const currentLvl = CHAPTERS[this.currentChapterId].levels[this.currentLevelIndex];
        const max = currentLvl.maxCommands || 99;

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
                const currentLvl = CHAPTERS[this.currentChapterId].levels[this.currentLevelIndex];
                const realMaxCommands = currentLvl.maxCommands || 99;

                // 🛑 強制同步：再次確保 commandManager 的 limit 是最新的
                if (this.commandManager) this.commandManager.limit = realMaxCommands;

                if (this.commandManager.getQueue().length < realMaxCommands) {
                    this.commandManager.add(b.dataset.command);
                    this.updateCommandCounter();
                } else {
                    this.updateDoraemonTalk(`振爲，指令滿了！這關最多只能輸入 ${realMaxCommands} 個指令喔！`);
                }
            };
        });

        document.getElementById('gadget-btn').onclick = () => {
            const currentLvl = CHAPTERS[this.currentChapterId].levels[this.currentLevelIndex];
            const realMaxCommands = currentLvl.maxCommands || 99;

            // 🛑 強制同步
            if (this.commandManager) this.commandManager.limit = realMaxCommands;

            if (this.commandManager.getQueue().length < realMaxCommands) {
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
            if (document.getElementById('game-container').style.display !== 'none') this.refreshAll(false);
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

        // 🛑🛑🛑 暴力修復 Bug 1 🛑🛑🛑
        // 即使 command.js 沒改，這裡也會強制注入 limit 屬性
        // 並且我會嘗試修改 CommandManager 的 prototype (如果 add 方法寫死的話這行無效，但在按鈕點擊處有雙重保險)
        if (this.commandManager) {
            this.commandManager.limit = lvl.maxCommands || 99;
            this.commandManager.maxSize = lvl.maxCommands || 99;
            console.log(`[Level Loaded] Forced Limit set to: ${this.commandManager.limit}`);
        }

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
        if (queue.length === 0) {
            this.updateDoraemonTalk("振爲，還沒有輸入指令喔！");
            return;
        }
        document.querySelectorAll('button').forEach(b => b.disabled = true);

        const lvl = CHAPTERS[this.currentChapterId].levels[this.currentLevelIndex];
        this.player.x = lvl.startPos.x;
        this.player.y = lvl.startPos.y;
        this.player.direction = 'UP';

        this.refreshAll(false);
        await new Promise(r => setTimeout(r, 300));

        this.isGhostMode = false;
        this.isStoneHatMode = false;

        let failed = false;

        for (let cmd of queue) {
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
            this.refreshAll(false);
        } else if (this.player.x === this.targetPos.x && this.player.y === this.targetPos.y) {
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

        if (cmd === "GADGET") {
            const g = lvl.gadget;

            if (g === "穿透環") { this.isGhostMode = true; }
            else if (g === "石頭帽") { this.isStoneHatMode = true; }
            else if (g === "適應燈") {
                this.isAdaptiveMode = true;
                this.updateDoraemonTalk("適應燈生效！現在走在冰上也不會打滑了！");
                const gif = document.getElementById('player-gif');
                gif.style.filter = "drop-shadow(0 0 10px yellow)";
                setTimeout(() => gif.style.filter = "none", 1000);
            }
            // 🌟 尋人手杖 (木星 - 精準修復)
            else if (g === "尋人手杖") {
                this.updateDoraemonTalk("尋人手杖發動！核心的牆壁消失了！");

                // 🛑 修正邏輯：
                // 新的螺旋地圖中，內圈牆壁大約在 x=3~6, y=3~6 的範圍
                // 我們直接把這個「正方形區域」清空，銅鑼燒周圍就會瞬間變成空地
                this.currentObstacles = this.currentObstacles.filter(o => {
                    const isInnerWall = (o.x >= 3 && o.x <= 6 && o.y >= 3 && o.y <= 6);
                    return !isInnerWall; // 只要是內圈牆壁就移除 (return false)
                });

                this.refreshAll(true); // 立即刷新畫面讓玩家看到效果
                await new Promise(r => setTimeout(r, 800));
            }
            // 🌟 導航機器人 (海王星)
            else if (g === "導航機器人") {
                this.updateDoraemonTalk("導航機器人發射光束！炸毀周圍障礙物！");
                const px = this.player.x;
                const py = this.player.y;
                this.currentObstacles = this.currentObstacles.filter(o => {
                    return Math.abs(o.x - px) > 1 || Math.abs(o.y - py) > 1;
                });
                this.refreshAll(true);
                await new Promise(r => setTimeout(r, 800));
            }
            else if (g === "竹蜻蜓") {
                this.player.updateState(this.player.previewMove(this.player.direction));
                this.refreshAll(true);
                await new Promise(r => setTimeout(r, 300));
                this.player.updateState(this.player.previewMove(this.player.direction));
                this.refreshAll(true);
                await new Promise(r => setTimeout(r, 300));
            }
            else if (g === "任意門") {
                if (lvl.theme === "sun") {
                    this.player.x = 5;
                    this.player.y = 5;
                    this.updateDoraemonTalk("任意門開啟！我們進入日冕內部了，接下來要靠自己走！");
                    this.refreshAll(false);
                } else {
                    this.player.x = this.targetPos.x; this.player.y = this.targetPos.y;
                    this.refreshAll(false);
                }
            }
            else if (g === "空氣砲") {
                const front = this.player.previewMove(this.player.direction);
                const obsIndex = this.currentObstacles.findIndex(o => o.x === front.x && o.y === front.y);
                if (obsIndex > -1) {
                    this.currentObstacles.splice(obsIndex, 1);
                    this.refreshAll(true);
                }
                await new Promise(r => setTimeout(r, 500));
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
        const lvl = CHAPTERS[this.currentChapterId].levels[idx];

        this.player.x = lvl.startPos.x;
        this.player.y = lvl.startPos.y;
        this.player.direction = 'UP';
        this.targetPos = lvl.targetPos;

        const addRandomObstacles = (count, excludeX, excludeY) => {
            let placed = 0;
            while (placed < count) {
                let rx = Math.floor(Math.random() * 10);
                let ry = Math.floor(Math.random() * 10);
                if (Math.abs(rx - lvl.startPos.x) + Math.abs(ry - lvl.startPos.y) <= 1) continue;
                if (Math.abs(rx - excludeX) + Math.abs(ry - excludeY) <= 1) continue;
                if (idx === 9 && Math.abs(rx - 5) <= 0 && Math.abs(ry - 5) <= 0) continue;

                if (!this.currentObstacles.some(o => o.x === rx && o.y === ry)) {
                    this.currentObstacles.push({ x: rx, y: ry });
                    placed++;
                }
            }
        };

        if (idx === 0) { // 水星
            for (let x = 3; x < 7; x++) this.currentObstacles.push({ x, y: 3 }, { x, y: 6 });
            this.currentObstacles.push({ x: 1, y: 2 });
        }
        else if (idx === 1) { // 金星
            this.currentObstacles.push({ x: 5, y: 5 });
            for (let x = 3; x < 7; x++) { if (x !== 5) this.currentObstacles.push({ x, y: 4 }); this.currentObstacles.push({ x, y: 6 }); }
        }
        else if (idx === 2) { // 地球
            for (let y = 2; y < 8; y++) this.currentObstacles.push({ x: 4, y });
        }
        else if (idx === 3) { // 火星
            for (let x = 1; x < 9; x++) this.currentObstacles.push({ x, y: 4 });
        }
        else if (idx === 4) { // 小行星
            addRandomObstacles(30, 9, 5);
        }
        else if (idx === 5) { // 🔥🔥🔥 木星 (100% 手動繪製螺旋) 🔥🔥🔥
            // 1. 第一圈（最外層）：逼迫玩家 (0,0) -> 右 -> 下 -> 左 -> 上
            // 上牆 (y=1): 封鎖 x=0..8 (保留 x=9 通道)
            for (let x = 0; x <= 8; x++) this.currentObstacles.push({ x, y: 1 });

            // 右牆 (x=8): 封鎖 y=2..8 (保留 y=9 通道)
            // 注意：因為上面封到 (8,1)，所以這裡從 y=2 開始封
            for (let y = 2; y <= 8; y++) this.currentObstacles.push({ x: 8, y });

            // 下牆 (y=8): 封鎖 x=1..8 (保留 x=0 通道)
            for (let x = 1; x <= 8; x++) this.currentObstacles.push({ x, y: 8 });

            // 左牆 (x=1): 封鎖 y=3..8 (保留 y=2 入口)
            for (let y = 3; y <= 8; y++) this.currentObstacles.push({ x: 1, y });

            // 2. 第二圈（內層）
            // 內上牆 (y=3): 封鎖 x=2..6
            for (let x = 2; x <= 6; x++) this.currentObstacles.push({ x, y: 3 });

            // 內右牆 (x=6): 封鎖 y=4..6
            for (let y = 4; y <= 6; y++) this.currentObstacles.push({ x: 6, y });

            // 內下牆 (y=6): 封鎖 x=3..6
            for (let x = 3; x <= 6; x++) this.currentObstacles.push({ x, y: 6 });

            // 內左牆 (x=3): 封鎖 y=5..6 (留缺口 y=4 進去)
            for (let y = 5; y <= 6; y++) this.currentObstacles.push({ x: 3, y });

            // 目標在 (5,5)，玩家最後會從 (3,4) 進來，走到 (4,4) -> (5,4) -> (5,5)
        }
        else if (idx === 6) { // 土星
            for (let x = 4; x <= 6; x++) {
                this.currentObstacles.push({ x, y: 4 });
                this.currentObstacles.push({ x, y: 6 });
            }
            this.currentObstacles.push({ x: 4, y: 5 });
            this.currentObstacles.push({ x: 6, y: 5 });
        }
        else if (idx === 7) { // 天王星
            for (let x = 0; x < 10; x += 2) for (let y = 1; y < 9; y++) this.currentObstacles.push({ x, y });
        }
        else if (idx === 8) { // 海王星
            addRandomObstacles(20, 9, 9);
        }
        else if (idx === 9) { // 太陽
            this.currentObstacles.push({ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 });
            addRandomObstacles(35, 9, 9);
            const safePath = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 9, y: 8 }, { x: 9, y: 9 }];
            this.currentObstacles = this.currentObstacles.filter(o => {
                const isBlockingPath = safePath.some(p => p.x === o.x && p.y === o.y);
                const isBlockingCenter = (o.x === 5 && o.y === 5);
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