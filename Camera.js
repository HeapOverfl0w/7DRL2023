class Camera
{
  constructor(startX, startY, startAngle, fov, speed, defaultWeapons)
  {
    this.x = startX;
    this.y = startY;
    this.angle = startAngle;
    this.fov = fov;
    this.speed = speed;
    this.height = 16;
    this.isStrafing = false;

    this.activeWeapon = defaultWeapons[0];
    if (this.activeWeapon)
      this.activeWeapon.switchTo();
    this.weapons = defaultWeapons;
    this.playerMaxHealth = 20;
    this.playerMaxMana = 20;
    this.playerHealth = this.playerMaxHealth;
    this.playerMana = this.playerMaxMana;
    this.resistLightning = 0;
    this.resistFire = 0;
    this.resistBlunt = 0;
    this.resistSlash = 0;
    this.hudBoxImage = document.getElementById("hud");
  }

  stopAllWeaponAnimations() {
    for (let w = 0; w < this.weapons.length; w++) {
      this.weapons[w].activeAnimation.stop();
    }
  }

  isInside(x, y) {
    const cameraWidth = 0.6;
    return (x + cameraWidth / 2 > this.x &&
        x - cameraWidth / 2 < this.x &&
        y + cameraWidth / 2 > this.y &&
        y - cameraWidth / 2 < this.y);
  }

  draw(screenBuffer) {
    if (this.activeWeapon)
      this.activeWeapon.draw(screenBuffer);
  }

  drawHUD(ctx) {
    let width = ctx.canvas.width;

    //bar height = 108, bar width = 28
    //health
    ctx.fillStyle = "#b80b1a";
    ctx.fillRect(81, 289 + (109 * (1 - (this.playerHealth / this.playerMaxHealth))), 29, 109 * (this.playerHealth / this.playerMaxHealth));
    //mana
    ctx.fillStyle = "#0b11b8";
    ctx.fillRect(width - 111, 289 + (109 * (1 - (this.playerMana / this.playerMaxMana))), 29, 109 * (this.playerMana / this.playerMaxMana));

    ctx.drawImage(this.hudBoxImage,0,0);

    // ctx.fillStyle = "#000000";
    // ctx.fillText((Math.round(this.x * 10) / 10) + "," + (Math.round(this.y * 10) / 10), width - 40, height - 10);
  }

  handleMouseDown(level, audio) {
    if (this.activeWeapon)
      this.activeWeapon.attack(level, this, audio);
  }

  handleMouseUp( ) {
    if (this.activeWeapon)
      this.activeWeapon.stopAttack();
  }

  handleKeyUp(keyCode) {
    let weaponSlot = 0;
    let buttonPressed = false;
    if (keyCode >= 49 && keyCode <= 53) {
      weaponSlot = keyCode - 49;
      buttonPressed = true;
    }

    if (buttonPressed && this.activeWeapon && this.activeWeapon.isReady()) {
      this.activeWeapon.stopAttack();
      this.weapons[weaponSlot].switchTo();
      this.activeWeapon = this.weapons[weaponSlot];
    }
  }

  handleKeyDown(keyCode, level, updateInterval)
  {
    let adjustedX = this.x;
    let adjustedY = this.y;
    let actualX = this.x;
    let actualY = this.y;

    if (keyCode == 87)
    { //W
      let modifier = this.isStrafing ? 0.4 : 1;
      adjustedX = this.x + Math.cos(this.angle) * this.speed * modifier * updateInterval;
      adjustedY = this.y + Math.sin(this.angle) * this.speed * modifier * updateInterval;
      actualX = adjustedX;
      actualY = adjustedY;
    }
    if (keyCode == 83)
    { //S
      let modifier = this.isStrafing ? 0.2 : 0.5;
      adjustedX = this.x - Math.cos(this.angle) * this.speed * modifier * updateInterval;
      adjustedY = this.y - Math.sin(this.angle) * this.speed * modifier * updateInterval;
      actualX = adjustedX;
      actualY = adjustedY;
    }
    if (keyCode == 65)
    { //A
      adjustedX = this.x - Math.cos(this.angle + Math.PI/2) * this.speed * (0.4) * updateInterval;
      adjustedY = this.y - Math.sin(this.angle + Math.PI/2) * this.speed * (0.4) * updateInterval;
      actualX = adjustedX;
      actualY = adjustedY;
      this.isStrafing = true;
    }
    if (keyCode == 68)
    { //D
      adjustedX = this.x - Math.cos(this.angle - Math.PI/2) * this.speed * (0.4) * updateInterval;
      adjustedY = this.y - Math.sin(this.angle - Math.PI/2) * this.speed * (0.4) * updateInterval;
      actualX = adjustedX;
      actualY = adjustedY;
      this.isStrafing = true;
    }

    let floorAdjustedX = Math.floor(adjustedX);
    let floorAdjustedY = Math.floor(adjustedY);
    if (!level.isPassable(floorAdjustedX, floorAdjustedY)) {
      actualX = this.x;
      actualY = this.y;
    }

    this.x = actualX;
    this.y = actualY;
    
  }
}