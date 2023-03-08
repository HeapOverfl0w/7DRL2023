//import { Billboard } from "./Billboard";

class KnightBoss extends Billboard {
    constructor(name, maxLife, speed, range, attackDelay, score, isStationary, projectile, walkAnimation, attackAnimation, destroyAnimation, punchAnimation, resistLightning, resistFire, resistBlunt, resistSlash, x, y) {
        super(walkAnimation, x, y);
        this.name = name;
        this.life = maxLife;
        this.maxLife = maxLife;
        this.score = score;
        this.projectile = projectile;
        this.attackDelay = attackDelay
        this.attackAnimation = attackAnimation;
        this.hasSeenCamera = false;
        this.isStationary = isStationary;
        this.speed = speed;
        this.destroyAnimation = destroyAnimation;
        this.punchAnimation = punchAnimation;
        this.isHit = false;

        this.resistLightning = resistLightning;
        this.resistFire = resistFire;
        this.resistBlunt = resistBlunt;
        this.resistSlash = resistSlash;

        this.maxViewRange = 50;
        this.maxAttackRange = range;
        this.lastAttackTime = 0
    }

    update(level, camera, data, audio, updateInterval) {
        if (this.life <= 0) { return; }

        for (let p = 0; p < level.projectiles.length; p++) {
            if (level.projectiles[p].playerOwned && level.projectiles[p].isInside(this)) {
                this.hasSeenCamera = true;
                let resist = 0;
                switch (level.projectiles[p].damageType) {
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

                this.life -= (level.projectiles[p].minDamage + Math.random() * (level.projectiles[p].maxDamage - level.projectiles[p].minDamage)) * (1 - resist);
                this.isHit = true;
                setTimeout((enemy) => { enemy.isHit = false; }, 100, this);
                level.projectiles[p].hitWall = true;
            }
        }

        if (this.life <= 0) {
            if (this.activeAnimation != this.destroyAnimation) {
                this.activeAnimation = this.destroyAnimation;
                //drop teleport
                this.level.teleports.push(this.data.teleports['portal'].copy(this.x, this.y));
            }
            camera.score += this.score;
            camera.kills += 1;
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
        const attackBuffer = this.lastAttackTime + this.attackDelay
        const canAttackAgain = attackBuffer < Date.now() ? true : false

        if (this.isStationary)
            return;
        if (distanceFromPlayer < 6 && distanceFromPlayer > 2) {
            let x = this.x + Math.cos(angle) * this.speed * updateInterval;
            let y = this.y + Math.sin(angle) * this.speed * updateInterval;
            if (level.isPassable(Math.floor(x), Math.floor(y)))
            {
                this.x = x;
                this.y = y;
            }
        }
        else if (this.attackAnimation != this.activeAnimation && distanceFromPlayer > 2) {
            let x = this.x + Math.cos(angle) * this.speed * updateInterval;
            let y = this.y + Math.sin(angle) * this.speed * updateInterval;
            if (level.isPassable(Math.floor(x), Math.floor(y))) {
                this.x = x;
                this.y = y;
            }
        }
    }

    attack(angle, playerInView, distanceFromPlayer, level, audio) {
        const attackBuffer = this.lastAttackTime + this.attackDelay
        const canAttackAgain = attackBuffer < Date.now() ? true : false
   
        if (this.defaultAnimation != this.activeAnimation && this.activeAnimation.isAnimating())
            return;
        else if (this.defaultAnimation != this.activeAnimation && !this.attackAnimation.isAnimating()) {
            this.activeAnimation = this.defaultAnimation;
            this.activeAnimation.start();
        }

        //if we're close enough then just punch
        else if (playerInView && 4 > distanceFromPlayer) {
            this.activeAnimation.stop();
            this.activeAnimation = this.punchAnimation;
            this.activeAnimation.start();
            if (this.projectile !== undefined) {
                const projectile = this.projectile.copy(this.x, this.y, Math.cos(angle), Math.sin(angle));
                projectile.minDamage = 2;
                projectile.maxDamage = 4;
                level.projectiles.push(projectile);
            }
        }
        else if (this.attackAnimation == this.activeAnimation && !this.attackAnimation.isAnimating()) {
            this.activeAnimation = this.defaultAnimation;
            this.activeAnimation.start();
        }
        else if (playerInView && this.maxAttackRange > distanceFromPlayer && canAttackAgain) {
            //audio.playSpell();
            this.activeAnimation.stop();
            this.activeAnimation = this.attackAnimation;
            this.activeAnimation.start();
            if (this.projectile !== undefined) {
                level.projectiles.push(this.projectile.copy(this.x, this.y, Math.cos(angle), Math.sin(angle)));
            }
            this.lastAttackTime = Date.now()
        }
    }

    rayCastForWallsOrPlayer(level, camera, maxViewRange, angle) {

        for (let i = 0; i < maxViewRange; i += 0.5) {
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
        let result = new KnightBoss(this.name, this.maxLife, this.speed, this.maxAttackRange, this.attackDelay, this.score, this.isStationary,
            this.projectile, this.defaultAnimation.copy(), this.attackAnimation.copy(), this.destroyAnimation.copy(), this.punchAnimation.copy(), this.resistLightning, this.resistFire, this.resistBlunt, this.resistSlash, x, y);

        result.sizeModifier = this.sizeModifier;
        return result;
}
}