class Teleport extends Billboard {
    constructor(animation, x, y) {
        super(animation, x, y);
    }

    isPlayerInside(camera) {
        let isInside = camera.isInside(this.x, this.y);
        if (isInside && this.direction !== undefined) {
            camera.angle = this.direction;
        }
        return isInside;
    }

    copy(x,y) {
        return new Teleport(this.defaultAnimation, x, y);
    }
}