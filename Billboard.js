class Billboard {
    constructor (animation, x, y) {
        this.defaultAnimation = animation;
        this.activeAnimation = animation;
        this.x = x;
        this.y = y;
        this.isTakingTurn = false;
    }

    isInside(billboard) {
        const billboardWidth = 0.75;
        return (billboard.x + billboardWidth / 2 > this.x &&
            billboard.x - billboardWidth / 2 < this.x &&
            billboard.y + billboardWidth / 2 > this.y &&
            billboard.y - billboardWidth / 2 < this.y);
    }

    getImageBuffer() {
        if (!this.activeAnimation.isAnimating() && !this.activeAnimation.played) {
            this.activeAnimation.start();
        }
        return this.activeAnimation.getFrameBuffer();
    }

    copy(x, y) {
        return new Billboard(this.defaultAnimation.copy(), x, y);
    }
}