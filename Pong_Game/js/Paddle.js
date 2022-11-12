class Paddle {

    constructor(x, y, w, h) {
        this.pos = createVector(x, y);
        this.w = w;
        this.h = h;
        this.score = 0;
    }

    move(amt) {
        this.pos.y += amt;
        this.pos.y = constrain(this.pos.y, 10, height - 10 - this.h);
    }

    show() {
        noStroke();
        fill(255);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }
        

}