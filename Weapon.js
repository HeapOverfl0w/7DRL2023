class Weapon {
    constructor(name, defaultAnimation, attackAnimation, reloadAnimation, isRanged, projectile, maxMagazineSize) {
        this.name = name;
        this.defaultAnimation = defaultAnimation;
        this.activeAnimation = defaultAnimation;
        this.attackAnimation = attackAnimation;
        this.reloadAnimation = reloadAnimation;
        this.isRanged = isRanged;
        this.projectile = projectile;
        this.ammo = 0;
        this.maxMagazineSize = maxMagazineSize;
        this.magazineAmmo = 0;
    }

    switchTo() {
        this.activeAnimation = this.defaultAnimation;
        if (!this.activeAnimation.isAnimating())
            this.activeAnimation.start();
    }

    isReady() {
        return this.activeAnimation === this.defaultAnimation;
    }

    attack(level, camera, audio) {
        //only shoot if weapon is ready and ammo is in the magazine
        if (this.isReady() && (this.magazineAmmo > 0 || !this.isRanged)) {
            audio.playWeaponAttack(this.name);
            this.activeAnimation.stop();
            this.activeAnimation = this.attackAnimation;
            this.activeAnimation.start();
            if (this.isRanged)
                this.magazineAmmo--;
            if (this.projectile !== undefined) {
                level.projectiles.push(this.projectile.copy(camera.x, camera.y, Math.cos(camera.angle), Math.sin(camera.angle), true));
            }
        }
        else if (this.isReady() && (this.magazineAmmo <= 0 && this.isRanged)) {
            this.reload(audio);
        }
    }

    reload(audio) {
        if (this.magazineAmmo !== this.maxMagazineSize && this.ammo > 0) {
            audio.playReload();
            this.activeAnimation.stop();
            this.activeAnimation = this.reloadAnimation;
            this.activeAnimation.start();
            this.ammo -= this.maxMagazineSize - this.magazineAmmo;
            this.magazineAmmo = this.maxMagazineSize;
            if (this.ammo < 0) {
                this.magazineAmmo += this.ammo;
                this.ammo = 0;
            }
        }
    }

    stopAttack() {
        if (this.activeAnimation != this.defaultAnimation)
        this.activeAnimation.requestEnd();
    }

    draw(screenBuffer) {
        if (!this.isReady() && !this.activeAnimation.isAnimating()) {
            this.activeAnimation = this.defaultAnimation;
            this.activeAnimation.start();
        }

        let animationFrameBuffer = this.activeAnimation.getFrameBuffer();
        for (let i = 0; i < animationFrameBuffer.data.length; i = i + 4) {
            if (animationFrameBuffer.data[i+3] != 0) {
                screenBuffer.data[i] = animationFrameBuffer.data[i];
                screenBuffer.data[i+1] = animationFrameBuffer.data[i+1];
                screenBuffer.data[i+2] = animationFrameBuffer.data[i+2];
                screenBuffer.data[i+3] = animationFrameBuffer.data[i+3];
            }
        }
    }

    copy(ammo) {
        let weapon = new Weapon(this.name, this.defaultAnimation.copy(), this.attackAnimation.copy(), this.reloadAnimation.copy(), this.isRanged, this.projectile, this.maxMagazineSize);
        weapon.ammo = ammo;
        return weapon;
    }
}