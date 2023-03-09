class Weapon {
  constructor(
    name,
    defaultAnimation,
    attackAnimation,
    card,
    projectile,
    projectileCount,
    projectileAngle,
    manaCost
  ) {
    this.name = name;
    this.card = card;
    this.defaultAnimation = defaultAnimation;
    this.activeAnimation = defaultAnimation;
    this.attackAnimation = attackAnimation;
    this.projectile = projectile;
    this.projectileCount = projectileCount;
    this.projectileAngle = projectileAngle;
    this.manaCost = manaCost;
  }

  switchTo() {
    this.activeAnimation.stop();
    this.activeAnimation = this.defaultAnimation;
    this.activeAnimation.start();
  }

  isReady() {
    return this.activeAnimation === this.defaultAnimation;
  }

  attack(level, camera, audio) {
    //only shoot if weapon is ready and ammo is in the magazine
    if (this.isReady() && camera.playerMana - this.manaCost >= 0) {
      audio.playWeaponAttack(this.name);
      this.activeAnimation.stop();
      this.activeAnimation = this.attackAnimation;
      this.activeAnimation.start();
      camera.playerMana -= this.manaCost;
      if (this.projectile !== undefined) {
        for (let p = 0; p < this.projectileCount; p++) {
          let angleModifier =
            p % 2 == 0
              ? Math.ceil(p/2) * -1 * this.projectileAngle
              : Math.ceil(p/2) * this.projectileAngle;
          level.projectiles.push(
            this.projectile.copy(
              camera.x,
              camera.y,
              Math.cos(camera.angle + angleModifier),
              Math.sin(camera.angle + angleModifier),
              true
            )
          );
        }
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
      if (animationFrameBuffer.data[i + 3] != 0) {
        screenBuffer.data[i] = animationFrameBuffer.data[i];
        screenBuffer.data[i + 1] = animationFrameBuffer.data[i + 1];
        screenBuffer.data[i + 2] = animationFrameBuffer.data[i + 2];
        screenBuffer.data[i + 3] = animationFrameBuffer.data[i + 3];
      }
    }
  }

  drawCard(position, yStart, ctx) {
    const textOffset = 55;
    let damageType;

    switch (this.projectile.damageType) {
      case LIGHTNING:
        damageType = 'Light';
        break;
      case FIRE:
        damageType = 'Fire';
        break;
      case BLUNT:
        damageType = 'Blunt';
        break;
      case SLASH:
        damageType = 'Slash';
        break;
    }

    ctx.drawImage(this.card, Math.floor(position), Math.floor(yStart));
    ctx.fillStyle = 'black';
    ctx.fillText(
      `${Math.round(this.projectile.minDamage).toString().split(".")[0]} - ${Math.round(this.projectile.maxDamage).toString().split(".")[0]}`,
      position + textOffset,
      yStart + 80
    );
    ctx.fillText(`${damageType}`, position + textOffset, yStart + 90);
    ctx.fillText(`${this.manaCost}`, position + textOffset, yStart + 100);
    ctx.fillText(
      `${this.projectileCount}`,
      position + textOffset,
      yStart + 111
    );
  }

  copy(projectile, projectileCount, projectileAngle, manaCost) {
    return new Weapon(
      this.name,
      this.defaultAnimation.copy(),
      this.attackAnimation.copy(),
      this.card,
      projectile,
      projectileCount,
      projectileAngle,
      manaCost
    );
  }
}
