class WeaponMenu {
  constructor(ctx) {
    this.menuBackgroundImage = document.getElementById('menuBackground');
    this.card = document.getElementById('card');
    this.newWeaponSelected = false;
    this.newWeapons = [this.card, this.card, this.card];
    this.currentWeapons = undefined;
    this.selectedCard = this.newWeapons[0];
    this.ctx = ctx;
    this.borderWidth = 1;
    this.borderGrowth = 0.2;
  }

  //fix
  drawNewWeaponMenu(currentWeapons) {
    this.currentWeapons = currentWeapons;
    let width = this.ctx.canvas.width;
    this.ctx.drawImage(this.menuBackgroundImage, 0, 0);
    const cardHeight = this.card.height;
    const cardWidth = this.card.width;
    const numNewCards = this.newWeapons.length;
    const numCurrentCards = currentWeapons.length;

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
    this.drawWeaponRow(width, cardWidth, numCurrentCards, 220, currentWeapons);
  }

  drawWeaponRow(canvasWidth, cardWidth, numCards, yStart, weapons) {
    const gap = this.calculateGap(canvasWidth, cardWidth, numCards);
    let position = gap;

    weapons.forEach((element) => {
      element.drawCard(position, yStart, this.ctx);
      position += gap + cardWidth;
    });
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

  // Handle weapon generation

  // Handle Selection highlight

  // Handle selection

  generateNewWeapons(numWeapons) {
    // Add random generation of properties for weapon
    this.newWeapons = [];
    for (let i = 0; i < numWeapons; i++) {
      this.newWeapons.push(
        new Weapon(
          'Fists',
          'defaultAnimation',
          'attackAnimation',
          document.getElementById('card'),
          'projectile',
          'projectileCount',
          'projectileAngle',
          'manaCost'
        )
      );
    }
  }

  handleKeyUp(keyCode) {
    let currentCardToReplace = undefined;
    if (!this.newWeaponSelected) {
      if (keyCode == 49) {
        this.selectedCard = this.newWeapons[0];
        console.log('Pressing 1 for selection 1', this.selectedCard);
        this.newWeaponSelected = true;
      }
      if (keyCode == 50) {
        this.selectedCard = this.newWeapons[1];
        console.log('Pressing 2 for selection 1', this.selectedCard);
        this.newWeaponSelected = true;
      }
      if (keyCode == 51) {
        this.selectedCard = this.newWeapons[2];
        console.log('Pressing 3 for selection 1', this.selectedCard);
        this.newWeaponSelected = true;
      }
    } else if (this.newWeaponSelected) {
      if (keyCode == 49) {
        currentCardToReplace = this.currentWeapons[0];
        console.log('Pressing 1 for selection 1', currentCardToReplace);
        this.newWeaponSelected = false;
      }
      if (keyCode == 50) {
        currentCardToReplace = this.currentWeapons[1];
        console.log('Pressing 2 for selection 2', currentCardToReplace);
        this.newWeaponSelected = false;
      }
      if (keyCode == 51) {
        currentCardToReplace = this.currentWeapons[2];
        console.log('Pressing 3 for selection 3', currentCardToReplace);
        this.newWeaponSelected = false;
      }
      if (keyCode == 52) {
        currentCardToReplace = this.currentWeapons[3];
        console.log('Pressing 4 for selection 3', currentCardToReplace);
        this.newWeaponSelected = false;
      }
      if (keyCode == 53) {
        currentCardToReplace = this.currentWeapons[4];
        console.log('Pressing 5 for selection 3', currentCardToReplace);
        this.newWeaponSelected = false;
      }
    }
  }
}
