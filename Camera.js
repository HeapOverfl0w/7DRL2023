class Camera
{
  constructor(startX, startY, startAngle, fov, speed, defaultWeapons)
  {
    this.x = startX;
    this.y = startY;
    this.angle = startAngle;
    this.fov = fov;
    this.speed = speed;
    this.score = 0;
    this.kills = 0;
    this.level = 1;
    this.height = 16;
    this.isStrafing = false;
    this.showWeaponCard = false;

    this.activeWeapon = defaultWeapons[0];
    if (this.activeWeapon)
      this.activeWeapon.switchTo();
    this.weapons = defaultWeapons;
    this.playerMaxHealth = 30;
    this.playerMaxMana = 30;
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
    //health counter
    ctx.fillStyle = "#ff0f24";
    ctx.font = 'bold 16px MS Gothic';
    ctx.textAlign = 'center';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'rgba(0, 0, 0, 1)'
    ctx.fillText(Math.round(this.playerHealth).toString().split(".")[0], 96, 285);
    //reset font to default style
    ctx.font = '10px MS Gothic';
    ctx.textAlign = 'start';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'rgba(0, 0, 0, 0)'

    //mana
    ctx.fillStyle = "#0b11b8";
    ctx.fillRect(width - 111, 289 + (109 * (1 - (this.playerMana / this.playerMaxMana))), 29, 109 * (this.playerMana / this.playerMaxMana));
    //mana counter
    ctx.fillStyle = "#0f64ff";
    ctx.font = 'bold 16px MS Gothic';
    ctx.textAlign = 'center';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'rgba(0, 0, 0, 1)'
    ctx.fillText(Math.round(this.playerMana).toString().split(".")[0], 624, 285);
    //reset font to default style
    ctx.font = '10px MS Gothic';
    ctx.textAlign = 'start';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'rgba(0, 0, 0, 0)'

    ctx.drawImage(this.hudBoxImage,0,0);

    ctx.fillStyle = 'black';
    ctx.fillText(`Level ${this.level}`, 130, 13);
    ctx.fillText(`Score ${this.score}`, 180, 13);
    ctx.fillText(`Speed ${this.speed}`, 230, 13);
    ctx.fillText(`Fire Res.  ${(this.resistFire * 100).toString().split(".")[0]}%`, 280, 13);
    ctx.fillText(`Blunt Res.  ${(this.resistBlunt * 100).toString().split(".")[0]}%`, 355, 13);
    ctx.fillText(`Slash Res.  ${(this.resistSlash * 100).toString().split(".")[0]}%`, 435, 13);
    ctx.fillText(`Light Res.  ${(this.resistLightning * 100).toString().split(".")[0]}%`, 515, 13);

    if (this.showWeaponCard) {
      this.activeWeapon.drawCard(20, 100, ctx);
    }

    let cardMenuXOffset = 264
    let cardMenuYOffset = 355
    
    for (let i = 0; i < this.weapons.length; i++) {
      if (this.weapons[i] === this.activeWeapon){
        //selected border
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.rect(cardMenuXOffset - 3, cardMenuYOffset - 3, 38, 51);
        ctx.strokeStyle = '#ac3232';
        ctx.stroke();

        this.weapons[i].drawCardMiniMenu(cardMenuXOffset, cardMenuYOffset, ctx, 0.3)
        ctx.fillRect(cardMenuXOffset + 11, cardMenuYOffset - 10, 11, 11)
        ctx.fillStyle = '#ac3232';
        ctx.font = 'bold 11px MS Gothic';
        ctx.fillRect(cardMenuXOffset + 11, cardMenuYOffset - 10, 11, 11)
        ctx.fillStyle = 'white';
        ctx.fillText(i + 1, cardMenuXOffset + 14, cardMenuYOffset);
      } else {
        ctx.fillStyle = 'white';
        this.weapons[i].drawCardMiniMenu(cardMenuXOffset, cardMenuYOffset, ctx, 0.3)
        ctx.font = '10px MS Gothic';
        ctx.fillRect(cardMenuXOffset + 11, cardMenuYOffset - 10, 11, 11)
        ctx.fillStyle = 'black';
        ctx.fillText(i + 1, cardMenuXOffset + 14, cardMenuYOffset -1);
      }
      ctx.font = '10px MS Gothic';
      cardMenuXOffset = cardMenuXOffset + 40
    }

    if (this.level % 5 == 0) {
      ctx.fillStyle = '#761d1d';
      ctx.fillText('BOSS STAGE - Kill the boss to progress to the next level.', 230, 30);
      ctx.filStyle = 'black';
    }

    // ctx.fillStyle = "#000000";
    // ctx.fillText((Math.round(this.x * 10) / 10) + "," + (Math.round(this.y * 10) / 10), width - 40, height - 10);
  }

  startShowWeaponCardTimeout() {
    this.showWeaponCardTimer = setTimeout((() => {
      this.showWeaponCard = false;
    }).bind(this), 3000);
  }

  stopShowWeaponCardTimer() {
    clearTimeout(this.showWeaponCardTimer);
  }

  handleMouseDown(level, audio) {
    if (this.activeWeapon)
      this.activeWeapon.attack(level, this, audio);
  }

  handleMouseUp( ) {
    if (this.activeWeapon)
      this.activeWeapon.stopAttack();
  }

  handleMouseWheel(deltaY) {
    let delta = -1;
    if (deltaY < 0 ) {
      delta = 1;
    }
    let weaponIndex = this.weapons.indexOf(this.activeWeapon);
    weaponIndex += delta;
    if (weaponIndex > 4) {
      weaponIndex = 0;
    } else if (weaponIndex < 0) {
      weaponIndex = 4;
    }

    this.activeWeapon.stopAttack();
    this.stopShowWeaponCardTimer();
    this.showWeaponCard = true;
    this.startShowWeaponCardTimeout();
    this.weapons[weaponIndex].switchTo();
    this.activeWeapon = this.weapons[weaponIndex];
  }

  handleKeyUp(keyCode) {
    let weaponSlot = 0;
    let buttonPressed = false;
    if (keyCode >= 49 && keyCode <= 53) {
      weaponSlot = keyCode - 49;
      buttonPressed = true;
    }

    if (buttonPressed && this.activeWeapon) {
      this.activeWeapon.stopAttack();
      this.stopShowWeaponCardTimer();
      this.showWeaponCard = true;
      this.startShowWeaponCardTimeout();
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