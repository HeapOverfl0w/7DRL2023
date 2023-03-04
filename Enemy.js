//import { Billboard } from "./Billboard";

class Enemy extends Billboard {
    constructor(name, maxLife, speed, range, isStationary, projectile, walkAnimation, attackAnimation, destroyAnimation, resistLightning, resistFire, resistBlunt, resistSlash, x, y) {
        super(walkAnimation, x, y);
        this.name = name;
        this.life = maxLife;
        this.maxLife = maxLife;
        this.projectile = projectile;
        this.attackAnimation = attackAnimation;
        this.hasSeenCamera = false;
        this.isStationary = isStationary;
        this.speed = speed;
        this.destroyAnimation = destroyAnimation;
        this.isHit = false;

        this.resistLightning = resistLightning;
        this.resistFire = resistFire;
        this.resistBlunt = resistBlunt;
        this.resistSlash = resistSlash;

        this.maxViewRange = 20;
        this.maxAttackRange = range;
    }

    update(level, camera, data, audio, updateInterval) {
        if (this.life <= 0) { return; }

        for (let p = 0; p < level.projectiles.length; p++) {
            if (level.projectiles[p].playerOwned && level.projectiles[p].isInside(this)) {
                this.hasSeenCamera = true;
                let resist = 0;
                switch(level.projectiles[p].damageType) {
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

                this.life -= (level.projectiles[p].minDamage + Math.random() * level.projectiles[p].maxDamage) * (1 - resist);
                this.isHit = true;
                setTimeout((enemy) => {enemy.isHit = false;}, 100, this);
                level.projectiles[p].hitWall = true;
            }
        }

        if (this.life <= 0) {
            if (this.activeAnimation != this.destroyAnimation)
            {
                //audio.playDeath();
                this.activeAnimation = this.destroyAnimation;
                //drop ammo
                let rand = Math.random();
                if (rand < 0.15) {
                    //level.powerups.push(data.powerups["ammo"].copy(this.x, this.y));
                }
                else if (rand < 0.2) {
                    //level.powerups.push(data.powerups["health"].copy(this.x, this.y));
                }
            }
            return;
        }

        //if we've seen the player find a way to get to him
        //first determine if we're even in range to see him
        const distanceFromPlayer = Math.sqrt(Math.pow(camera.x - this.x, 2) + Math.pow(camera.y - this.y, 2));
        if (distanceFromPlayer < this.maxViewRange) {
            const angle = Math.atan2(camera.y - this.y, camera.x - this.x);
            const playerInView = this.rayCastForWallsOrPlayer(level, camera, this.maxViewRange, angle);

            if (!this.hasSeenCamera && playerInView)
                this.hasSeenCamera = true;

            if (this.hasSeenCamera) {
                this.move(level, angle, playerInView, updateInterval, distanceFromPlayer);
                this.attack(angle, playerInView, distanceFromPlayer, level, audio);
                
                //randomly play enemy sounds
                if (Math.random() < 0.001) {
                    //if (Math.random() < 0.5)
                        //audio.playGrowl();
                    //else
                        //audio.playSpirit();
                }
            }
        }
    }

    move(level, angle, playerInView, updateInterval, distanceFromPlayer) {
        if (this.isStationary)
            return;
        if (distanceFromPlayer > this.maxAttackRange) {
            let x = this.x + Math.cos(angle) * this.speed * updateInterval;
            let y = this.y + Math.sin(angle) * this.speed * updateInterval;
            if (!level.isWall(Math.floor(x), Math.floor(y)))
            {
                this.x = x;
                this.y = y;
            }
        }
    }

    attack(angle, playerInView, distanceFromPlayer, level, audio) {
        if (this.attackAnimation == this.activeAnimation && this.attackAnimation.isAnimating())
            return;
        else if (this.attackAnimation == this.activeAnimation && !this.attackAnimation.isAnimating()) {
            this.activeAnimation = this.defaultAnimation;
            this.activeAnimation.start();
        }
        else if (playerInView && this.maxAttackRange > distanceFromPlayer){
            //audio.playSpell();
            this.activeAnimation.stop();
            this.activeAnimation = this.attackAnimation;
            this.activeAnimation.start();
            if (this.projectile !== undefined) {
                level.projectiles.push(this.projectile.copy(this.x, this.y, Math.cos(angle), Math.sin(angle)));
            }
        }
    }

    rayCastForWallsOrPlayer(level, camera, maxViewRange, angle) {
        
        for(let i = 0; i < maxViewRange; i += 0.5) {
            let x = this.x + Math.cos(angle) * i;
            let y = this.y + Math.sin(angle) * i;
            if (level.isWall(Math.floor(x), Math.floor(y))) 
                return false;
            else if (camera.isInside(x, y)) 
                return true;
        }

        return false;
    }

    copy(x, y) {
        return new Enemy(this.name, this.maxLife, this.speed, this.maxAttackRange, this.isStationary, 
            this.projectile, this.defaultAnimation.copy(), this.attackAnimation.copy(), this.destroyAnimation.copy(), this.resistLightning, this.resistFire, this.resistBlunt, this.resistSlash, x, y);
    }
}