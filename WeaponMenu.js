class WeaponMenu {
  constructor(ctx, camera, data) {
    this.menuBackgroundImage = document.getElementById('menuBackground');
    this.card = document.getElementById('card');
    this.camera = camera;
    this.data = data;
    this.newWeaponSelected = false;
    this.newWeapons = [this.card, this.card, this.card];
    this.selectedCard = this.newWeapons[0];
    this.selectedIndex = this.ctx = ctx;
    this.borderWidth = 1;
    this.borderGrowth = 0.2;
  }

  drawNewWeaponMenu() {
    let width = this.ctx.canvas.width;
    this.ctx.drawImage(this.menuBackgroundImage, 0, 0);
    const cardHeight = this.card.height;
    const cardWidth = this.card.width;
    const numNewCards = this.newWeapons.length;
    const numCurrentCards = this.camera.weapons.length;

    if (!this.newWeaponSelected) {
      this.drawSelection(width, cardWidth, numNewCards, cardHeight, 35, 20);
    } else {
      this.drawSelection(
        width,
        cardWidth,
        numCurrentCards,
        cardHeight,
        220,
        20
      );
    }

    // Top row new Weapons
    this.drawWeaponRow(width, cardWidth, numNewCards, 35, this.newWeapons);

    // Bottom row current weapons
    this.drawWeaponRow(
      width,
      cardWidth,
      numCurrentCards,
      220,
      this.camera.weapons
    );
  }

  drawWeaponRow(canvasWidth, cardWidth, numCards, yStart, weapons) {
    const gap = this.calculateGap(canvasWidth, cardWidth, numCards);
    let position = gap;

    for (let i = 0; i < weapons.length; i++) {
      weapons[i].drawCard(position, yStart, this.ctx);
      if (this.newWeaponSelected) {
        if (
          i === this.selectedIndex &&
          weapons.length === this.newWeapons.length
        ) {
          this.ctx.beginPath();
          this.ctx.lineWidth = 2;
          this.ctx.rect(position, yStart, 106, 150);
          this.ctx.strokeStyle = '#FFFF00';
          this.ctx.stroke();
        }
      }
      position += gap + cardWidth;
    }
  }

  calculateGap(canvasWidth, cardWidth, numCards) {
    const gap = (canvasWidth - cardWidth * numCards) / (numCards + 1);
    return gap;
  }

  drawSelection(canvasWidth, cardWidth, numCards, cardHeight, yStart, padding) {
    const gap = this.calculateGap(canvasWidth, cardWidth, numCards);
    const xPos = gap - padding;
    const yPos = yStart - padding;
    const borderHeight = cardHeight + padding * 2;
    const borderLength =
      gap * (numCards - 1) + cardWidth * numCards + padding * 2;

    if (this.borderWidth >= 5) {
      this.borderGrowth *= -1;
    } else if (this.borderWidth <= 0) {
      this.borderGrowth *= -1;
    }
    this.borderWidth += this.borderGrowth;
    this.ctx.beginPath();
    this.ctx.lineWidth = this.borderWidth;
    this.ctx.rect(xPos, yPos, borderLength, borderHeight);
    this.ctx.strokeStyle = '#FFFF00';
    this.ctx.stroke();
  }

  generateNewWeapons(numWeapons) {
    // Add random generation of properties for weapon
    let fistsProjectile = this.data.projectiles['punch'].copyBase(1, 3, BLUNT);
    let fists = this.data.weapons['fists'].copy(fistsProjectile, 1, 0, 0);
    this.newWeapons = [];
    for (let i = 0; i < numWeapons; i++) {
      this.newWeapons.push(fists);
    }
  }

  handleKeyUp(keyCode) {
    if (!this.newWeaponSelected) {
      if (keyCode == 49) {
        this.selectedCard = this.newWeapons[0];
        this.selectedIndex = 0;
        this.newWeaponSelected = true;
      }
      if (keyCode == 50) {
        this.selectedCard = this.newWeapons[1];
        this.selectedIndex = 1;
        this.newWeaponSelected = true;
      }
      if (keyCode == 51) {
        this.selectedCard = this.newWeapons[2];
        this.selectedIndex = 2;
        this.newWeaponSelected = true;
      }
    } else if (this.newWeaponSelected) {
      if (keyCode >= 49 && keyCode <= 53) {
        this.camera.weapons[keyCode - 49] = this.selectedCard;
        this.newWeaponSelected = false;
        return true;
      }
    }

    return false;
  }

  // Handle weapon generation

  // Handle Selection highlight

  // Handle selection
}
