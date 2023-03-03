class Camera
{
  constructor(startX, startY, startAngle, fov, speed, defaultWeapon)
  {
    this.x = startX;
    this.y = startY;
    this.angle = startAngle;
    this.fov = fov;
    this.speed = speed;
    this.height = 16;
    this.isStrafing = false;

    this.activeWeapon = defaultWeapon;
    if (this.activeWeapon)
      this.activeWeapon.switchTo();
    this.weapons = [ defaultWeapon ];
    this.playerMaxHealth = 20;
    this.playerMaxMana = 20;
    this.myTurn = true;
    this.playerHealth = this.playerMaxHealth;
    this.playerMana = this.playerMaxMana;
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
    if (this.activeWeapon && this.myTurn)
      this.activeWeapon.attack(level, this, audio);
  }

  handleMouseUp( ) {
    if (this.activeWeapon)
      this.activeWeapon.stopAttack();
  }

  handleKeyUp(keyCode) {
    //switch weapons on F
    if (this.activeWeapon && this.activeWeapon.isReady() && keyCode == 70) {
      let requestedWeaponIndex = this.weapons.indexOf(this.activeWeapon) + 1;
      if (this.weapons.length <= requestedWeaponIndex) {
        this.activeWeapon.stopAttack();
        this.weapons[0].switchTo();
        this.activeWeapon = this.weapons[0];
      }
      else {
        this.activeWeapon.stopAttack();
        this.weapons[requestedWeaponIndex].switchTo();
        this.activeWeapon = this.weapons[requestedWeaponIndex];
      }
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