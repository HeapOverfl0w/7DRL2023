class WeaponMenu {
  constructor(ctx) {
    this.menuBackgroundImage = document.getElementById('menuBackground');
    this.card = document.getElementById('card');
    this.newWeaponSelected = false;
    this.newWeapons = [2, 3, 3];
    this.ctx = ctx;
  }

  //fix
  drawNewWeaponMenu(currentWeapons) {
    let width = this.ctx.canvas.width;
    this.ctx.drawImage(this.menuBackgroundImage, 0, 0);

    const cardWidth = this.card.width;
    const numNewCards = this.newWeapons.length;
    const numCurrentCards = currentWeapons.length;

    // Top row new Weapons
    this.drawWeaponRow(width, cardWidth, numNewCards, 35);

    // Bottom row current weapons
    this.drawWeaponRow(width, cardWidth, numCurrentCards, 220);
  }

  drawWeaponRow(canvasWidth, cardWidth, numCards, yStart) {
    const gap = (canvasWidth - cardWidth * numCards) / (numCards + 1);
    let position = gap;
    for (let i = 0; i < numCards; i++) {
      console.log('Drawing card at', gap, yStart);
      this.ctx.drawImage(this.card, position, yStart);
      position += gap + cardWidth;
    }
  }

  // Handle weapon generation

  // Handle Selection highlight

  // Handle selection
}
