class Projectile extends Billboard {
    constructor(animation, x, y, directionX, directionY, speed, maxDistance, minDamage, maxDamage, damageType) {
        super(animation, x, y);
        this.startX = x;
        this.startY = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.speed = speed;
        this.maxDistance = maxDistance;
        this.hitWall = false;
        this.playerOwned = false;
        this.minDamage = minDamage;
        this.maxDamage = maxDamage;
        this.damageType = damageType;
    }

    update(level, camera, audio) {
        if (!this.activeAnimation.isAnimating())
            this.activeAnimation.start();
            
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;

        if (!this.playerOwned && camera.isInside(this.x, this.y)) {
            this.hitWall = true;

            let resist = 0;
            switch(this.damageType) {
                case LIGHTNING:
                    resist = this.resistLightning;
                    break;
                case BLUNT:
                    resist = this.resistBlunt;
                    break;
                case SLASH:
                    resist = this.resistSlash;
                    break;
                case FIRE:
                    resist = this.resistFire;
                    break;
            }

            camera.playerHealth -= (this.minDamage + Math.random()) * this.maxDamage * (1 - resist);
            audio.playPain();
        }

        if (level.isWall(Math.floor(this.x), Math.floor(this.y)))
            this.hitWall = true;
    }

    reachedMaxDistanceOrHitWall() {
        return (this.maxDistance < Math.sqrt(Math.pow(this.x - this.startX, 2) + Math.pow(this.y - this.startY, 2))) || this.hitWall;
    }

    copy(x, y, directionX, directionY, playerOwned) {
        let projectile = new Projectile(this.defaultAnimation.copy(), x, y, directionX, directionY, this.speed, this.maxDistance, this.minDamage, this.maxDamage, this.damageType);
        if (playerOwned !== undefined) {
            projectile.playerOwned = playerOwned;
        }
        return projectile;
    }

    copyBase(minDamage, maxDamage, damageType) {
        return new Projectile(this.defaultAnimation.copy(), this.x, this.y, this.directionX, this.directionY, this.speed, this.maxDistance, minDamage, maxDamage, damageType);
    }
    
}