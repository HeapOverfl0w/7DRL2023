class Powerup extends Billboard {
    constructor(powerupType, animation, x, y) {
        super(animation, x, y);
        this.powerupType = powerupType;
        this.collected = false;
    }

    update(data, camera, audio) {
        if (!this.collected && this.isInside(camera)) {
            if ((this.powerupType == "health" && camera.playerHealth == camera.playerMaxHealth) ||
                (this.powerupType == "ammo" && !camera.activeWeapon.isRanged)) 
                return;

            switch(this.powerupType) {
                case "ammo":
                    let ammoAmount = camera.activeWeapon.maxMagazineSize > 4 ? camera.activeWeapon.maxMagazineSize : 4;
                    camera.activeWeapon.ammo += ammoAmount;
                    break;
                case "health":
                    camera.playerHealth = camera.playerHealth + 6 > camera.playerMaxHealth ? camera.playerMaxHealth : camera.playerHealth + 6;
                    break;
                default:
                    let weaponDoesNotExist = true;
                    for (let w = 0; w < camera.weapons.length; w++) {
                        if (camera.weapons[w].name == this.powerupType) {
                            weaponDoesNotExist = false;
                            camera.weapons[w].ammo += camera.weapons[w].maxMagazineSize;
                        }
                    }
                    if (weaponDoesNotExist) {
                        let newWeapon = data.weapons[this.powerupType].copy(data.weapons[this.powerupType].maxMagazineSize);
                        newWeapon.reload(audio);
                        camera.weapons.push(newWeapon);
                    }
                break;
            }
            this.activeAnimation.stop();
            this.collected = true;
        }
    }

    isInside(camera) {
        return (this.x + 0.5 > camera.x &&
            this.x - 0.5 < camera.x &&
            this.y + 0.5 > camera.y &&
            this.y - 0.5 < camera.y);
    }

    

    copy(x, y) {
        return new Powerup(this.powerupType, this.defaultAnimation.copy(), x, y);
    }
}