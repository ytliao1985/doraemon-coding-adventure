export class CommandManager {
    constructor(id) {
        this.queue = [];
        this.container = document.getElementById(id);
        this.icons = { 'UP':'⬆️', 'DOWN':'⬇️', 'LEFT':'⬅️', 'RIGHT':'➡️', 'GADGET':'🎒' };
    }
    add(cmd) {
        if(this.queue.length >= 10) return;
        this.queue.push(cmd);
        this.updateUI();
    }
    undo() { this.queue.pop(); this.updateUI(); }
    clear() { this.queue = []; this.updateUI(); }
    updateUI() {
        this.container.innerHTML = '';
        this.queue.forEach(q => {
            const s = document.createElement('span'); s.className='cmd-icon';
            s.innerText = this.icons[q] || '❓';
            this.container.appendChild(s);
        });
    }
    getQueue() { return [...this.queue]; }
}