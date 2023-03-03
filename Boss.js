class Boss extends Billboard {
    constructor(projectile, walkAnimation, attackAnimation, secondaryAttackAnimation, teleportAnimation, destroyAnimation, x, y) {
        super(walkAnimation, x, y);
        this.maxLife = 75;
        this.life = this.maxLife;
        
        this.projectile = projectile;
        this.attackAnimation = attackAnimation;
        this.secondaryAttackAnimation = secondaryAttackAnimation;
        this.teleportAnimation = teleportAnimation;
        this.destroyAnimation = destroyAnimation;

        this.maxViewRange = 20;
        this.maxAttackRange = 20;

        this.currentMode = 3;
        this.currentTimer = undefined;
        this.aoeAttackIncrement = 0;
    }

    update(level, camera, data, audio) {
        if (this.life <= 0) { return; }

        const initialHealth = this.life;

        //player bullets hit detection
        for (let p = 0; p < level.projectiles.length; p++) {
            if (level.projectiles[p].playerOwned && level.projectiles[p].isInside(this)) {
                this.hasSeenCamera = true;
                this.life -= level.projectiles[p].damage;
                level.projectiles[p].hitWall = true;
            }
        }

        if (this.life <= 0) {
            if (this.currentTimer !== undefined) {
                clearTimeout(this.currentTimer);
            }
            this.activeAnimation.stop();
            this.activeAnimation = this.destroyAnimation;
            this.activeAnimation.start();
        }
        else if ((this.life <= 30 && initialHealth > 30) || (this.life <= 50 && initialHealth > 50)) {
            this.currentMode = 1;
            this.activeAnimation.stop();
            this.activeAnimation = this.teleportAnimation;
            this.activeAnimation.start();
        }

        //maintain the animations and don't attack when teleporting
        if (this.activeAnimation === this.teleportAnimation) {
            if (this.activeAnimation.isAnimating())
                return;
            else {
                level.shadeColor = "#1d1c1f";
                //move to a random location
                if (this.currentMode == 0)
                    this.teleportToRandomLocation(level);
                else
                    this.teleportToCenter(level);
                //stop teleport animation
                this.activeAnimation.stop();
                //go back to normal attacks
                if (this.currentMode == 0) {
                    this.activeAnimation.stop();
                    this.activeAnimation = this.attackAnimation;
                    this.activeAnimation.start();
                }
                //go to secondary attack
                else if (this.currentMode == 1) {
                    this.activeAnimation.stop();
                    this.activeAnimation = this.secondaryAttackAnimation;
                    this.activeAnimation.start();
                }
            }
        }
        //normal attack mode
        if (this.currentMode == 3) {
            this.createTeleportTimer(2000);
            this.currentMode = 0;
        }   
        if (this.currentMode == 0){
            if (this.activeAnimation === this.attackAnimation && !this.activeAnimation.isAnimating()) {
                this.normalAttack(camera,level);
                this.activeAnimation.start();
            }
            if (this.currentTimer === undefined) {
                this.createTeleportTimer(5000);
            }
        }
        else if (this.currentMode == 1) {
            if (this.activeAnimation === this.secondaryAttackAnimation && !this.activeAnimation.isAnimating()) {
                this.spawnFourMeleeEnemies(level, data);
                this.activateFireHazards(level);
                this.currentMode = 2;
                this.createTeleportTimer(8000);
                audio.playDevelopers();
            }
        }
        else if (this.currentMode == 2) {
            if (this.activeAnimation === this.secondaryAttackAnimation && !this.activeAnimation.isAnimating()) {
                this.aoeAttack(level);
            }
        }
    }

    createTeleportTimer(baseTimeAmount) {
        if (this.currentTimer !== undefined) {
            clearTimeout(this.currentTimer);
        }
        let time = baseTimeAmount + Math.random() * 5000;
        this.currentTimer = setTimeout((boss) => {
            if (boss.currentMode == 2)
                boss.currentMode = 0;
            boss.activeAnimation.stop();
            boss.activeAnimation = boss.teleportAnimation;
            boss.activeAnimation.start();
            boss.currentTimer = undefined;
        }, time, this);
    }

    teleportToCenter(level) {
        this.clearFireHazards(level);
        this.x = 10;
        this.y = 10;
    }

    teleportToRandomLocation(level) {
        this.clearFireHazards(level);
        let randX = 1 + Math.random() * 17;
        let randY = 1 + Math.random() * 17;
        while(level.isWall(Math.floor(randX), Math.floor(randY))) {
            randX = 1 + Math.random() * 17;
            randY = 1 + Math.random() * 17;
        }
        this.x = randX;
        this.y = randY;
    }

    normalAttack(camera, level) {
        let angle = Math.atan2(camera.y - this.y, camera.x - this.x);
        const thirtyDegreesInRadians = 0.2236;
        level.projectiles.push(this.projectile.copy(this.x, this.y, Math.cos(angle), Math.sin(angle)));
        level.projectiles.push(this.projectile.copy(this.x, this.y, Math.cos(angle + thirtyDegreesInRadians), Math.sin(angle + thirtyDegreesInRadians)));
        level.projectiles.push(this.projectile.copy(this.x, this.y, Math.cos(angle - thirtyDegreesInRadians), Math.sin(angle - thirtyDegreesInRadians)));
    }

    aoeAttack(level) {
        if (this.aoeAttackIncrement == 20) {
            this.aoeAttackIncrement = 0;
        }
        else
        {
            this.aoeAttackIncrement++;
            return;
        }
        for (let angle = 0; angle < 360; angle = angle + 20) {
            level.projectiles.push(this.projectile.copy(this.x, this.y, Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180)));
        }
    }

    activateFireHazards(level) {
        level.shadeColor = "#f63f4c";
        let hazards = [];
        for (let x = 0; x < level.levelArray.length; x++){
            for (let y = 0; y < level.levelArray[x].length; y++){
                if (level.levelArray[x][y] == 60) {
                    hazards.push({type: "evilfire", x:x + 0.5, y:y + 0.5})
                    level.levelArray[x][y] = 75;
                }
            }
        }
        level.loadHazards(hazards);
    }

    clearFireHazards(level){
        for (let x = 0; x < level.levelArray.length; x++){
            for (let y = 0; y < level.levelArray[x].length; y++){
                if (level.levelArray[x][y] == 75) {
                    level.levelArray[x][y] = 60;
                }
            }
        }

        for (let h = 0; h < level.hazards.length; h++) {
            level.hazards[h].activeAnimation.stop();
        }
        level.loadHazards([]);
    }

    spawnFourMeleeEnemies(level, data) {
        level.enemies.push(data.enemies["melee"].copy(13,13));
        level.enemies.push(data.enemies["melee"].copy(7,7));
        level.enemies.push(data.enemies["melee"].copy(7,13));
        level.enemies.push(data.enemies["melee"].copy(13,7));
    }

    copy(x, y) {
        return new Boss(this.projectile, this.defaultAnimation.copy(), this.attackAnimation.copy(), 
        this.secondaryAttackAnimation.copy(), this.teleportAnimation.copy(), this.destroyAnimation.copy(),
        x, y);
    }


}