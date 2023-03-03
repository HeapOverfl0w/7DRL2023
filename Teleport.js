class Teleport extends Billboard {
    constructor(animation, x, y, toLevel, toLevelX, toLevelY, direction) {
        super(animation, x, y);
        this.toLevel = toLevel;
        this.toLevelX = toLevelX;
        this.toLevelY = toLevelY;
        this.direction = direction;
    }

    isPlayerInside(camera) {
        let isInside = camera.isInside(this.x, this.y);
        if (isInside && this.direction !== undefined) {
            camera.angle = this.direction;
        }
        return isInside;
    }

    copy(x,y) {
        return new Teleport(this.defaultAnimation, x, y, this.toLevel, this.toLevelX, this.toLevelY,this.direction);
    }
}