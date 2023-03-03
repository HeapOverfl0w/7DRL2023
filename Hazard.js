class Hazard extends Billboard{
    constructor(animation, x, y, damage, radius) {
        super(animation,x,y);
        this.damage = damage;
        this.radius = radius;
        this.ready = true;
    }

    update(camera, audio) {
        if (this.x + this.radius > camera.x &&
            this.x - this.radius < camera.x &&
            this.y + this.radius > camera.y &&
            this.y - this.radius < camera.y) {
                if (this.ready) {
                    audio.playFire();
                    audio.playPain();
                    camera.playerHealth -= this.damage;
                    this.ready = false;
                    setTimeout((hazard) => {hazard.ready = true;}, 1000, this);
                }
        }
    }

    copy(x, y)
    {
        return new Hazard(this.defaultAnimation.copy(), x, y, this.damage, this.radius);
    }
}