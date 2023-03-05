class Powerup extends Billboard {
    constructor(powerupType, animation, x, y) {
        super(animation, x, y);
        this.powerupType = powerupType;
        this.collected = false;
    }

    update(data, camera, audio) {
        if (!this.collected && this.isInside(camera)) {
            if ((this.powerupType == "health" && camera.playerHealth >= camera.playerMaxHealth) || 
                (this.powerupType == "mana" && camera.playerMana >= camera.playerMaxMana)) 
                return;

            switch(this.powerupType) {
                case "health":
                    camera.playerHealth = camera.playerHealth + 5 > camera.playerMaxHealth ? camera.playerMaxHealth : camera.playerHealth + 5;
                    break;
                case "mana":
                    camera.playerMana = camera.playerMana + 5 > camera.playerMaxMana ? camera.playerMana : camera.playerMana + 5;
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