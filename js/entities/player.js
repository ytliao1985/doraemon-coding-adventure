export class Player {
    constructor(x, y) { this.x = x; this.y = y; this.direction = 'UP'; }
    previewMove(cmd) {
        let tx = this.x, ty = this.y, dir = this.direction;
        if(cmd==='UP' && this.y>0) { ty--; dir='UP'; }
        else if(cmd==='DOWN' && this.y<9) { ty++; dir='DOWN'; }
        else if(cmd==='LEFT' && this.x>0) { tx--; dir='LEFT'; }
        else if(cmd==='RIGHT' && this.x<9) { tx++; dir='RIGHT'; }
        return { x: tx, y: ty, direction: dir };
    }
    updateState(s) { this.x = s.x; this.y = s.y; this.direction = s.direction; }
    getState() { return { x: this.x, y: this.y, direction: this.direction }; }
}