export class CommandManager {
    constructor(id) {
        this.queue = [];
        this.container = document.getElementById(id);
        this.icons = { 'UP':'⬆️', 'DOWN':'⬇️', 'LEFT':'⬅️', 'RIGHT':'➡️', 'GADGET':'🎒' };
        
        // ✨ 修正 1: 加入 limit 屬性，預設 99，不再寫死 10
        this.limit = 99; 
    }

    add(cmd) {
        // ✨ 修正 2: 檢查 this.limit 而不是數字 10
        if(this.queue.length >= this.limit) return;
        
        this.queue.push(cmd);
        this.updateUI();
    }

    undo() { 
        this.queue.pop(); 
        this.updateUI(); 
    }

    clear() { 
        this.queue = []; 
        this.updateUI(); 
    }

    updateUI() {
        this.container.innerHTML = '';
        this.queue.forEach(q => {
            const s = document.createElement('span'); 
            s.className = 'cmd-icon';
            s.innerText = this.icons[q] || '❓';
            this.container.appendChild(s);
        });
    }

    getQueue() { 
        return [...this.queue]; 
    }
}