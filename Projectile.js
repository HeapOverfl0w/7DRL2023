class Projectile extends Billboard {
    constructor(animation, x, y, directionX, directionY, speed, maxDistance, damage) {
        super(animation, x, y);
        this.startX = x;
        this.startY = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.speed = speed;
        this.maxDistance = maxDistance;
        this.hitWall = false;
        this.playerOwned = false;
        this.damage = damage;
    }

    update(level, camera, audio) {
        if (!this.activeAnimation.isAnimating())
            this.activeAnimation.start();
            
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;

        if (!this.playerOwned && camera.isInside(this.x, this.y)) {
            this.hitWall = true;
            camera.playerHealth -= this.damage;
            audio.playPain();
        }

        if (level.isWall(Math.floor(this.x), Math.floor(this.y)))
            this.hitWall = true;
    }

    reachedMaxDistanceOrHitWall() {
        return (this.maxDistance < Math.sqrt(Math.pow(this.x - this.startX, 2) + Math.pow(this.y - this.startY, 2))) || this.hitWall;
    }

    copy(x, y, directionX, directionY, playerOwned) {
        let projectile = new Projectile(this.defaultAnimation.copy(), x, y, directionX, directionY, this.speed, this.maxDistance, this.damage);
        if (playerOwned !== undefined) {
            projectile.playerOwned = playerOwned;
        }
        return projectile;
    }
    
}