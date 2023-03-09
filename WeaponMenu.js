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
    this.borderWidth = 2;
    this.borderGrowth = 0.2;

    this.passives = [
      new Passive('fireCard'),
      new Passive('lightningCard'),
      new Passive('bluntCard'),
      new Passive('slashCard'),
      new Passive('healthCard'),
      new Passive('speedCard'),
      new Passive('manaCard')
    ];
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
          this.ctx.strokeStyle = '#FFFFFF';
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
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.stroke();
  }

  generateNewWeapons() {
    const nextSelections = [];
    const projectileWeapons = ["Magic Fists", "Magic Bow", "Magic Sword", "Magic Staff"];
  
    for (let i = 0; i < 3; i++) {
      if (Math.random() < 0.5) { //add passive
        const randomPassive = Math.floor(Math.random() * 5);
        const selectedPassive = this.passives[randomPassive];
        selectedPassive.setRandomValue();
        nextSelections.push(selectedPassive);
      } else { //add weapon2
    
        // Select random weapon
        const keys = Object.keys(this.data.weapons)
        let weapon = this.data.weapons[keys[Math.floor(Math.random()*keys.length)]]
        let projectileCount = 1
        let projectileAngle = 0
        // add lvl modifier
        let weaponModifier = 1 + (Math.random() *  this.camera.level/3);
        let manaCost = 0;

        // figure out number of projectiles
        if (projectileWeapons.includes(weapon.name)){
          manaCost = Math.round(1 + Math.random() * 9);
          projectileCount = Math.floor((1 + Math.random() * 8));
          if (projectileCount !== 1){
            weaponModifier = (1 + Math.random()) * (2 / projectileCount);
          }
        } else if (weapon.name !== "knuckles"){
          if (Math.random() < 0.6) {
            projectileCount = 1;
          } else {
            projectileCount = Math.floor((1 + Math.random()*3));
          }
        }

        const weaponData = {
          "Knuckles": [this.data.projectiles["punch"].copyBase(2, 5, BLUNT)],
          "Magic Fists": [this.data.projectiles['magicPunch'].copyBase(1, 5, LIGHTNING)],
          "Bow": [this.data.projectiles["arrowProjectile"].copyBase(2, 3, SLASH)],
          "Magic Bow": [this.data.projectiles['lightningProjectile'].copyBase(1, 6, LIGHTNING), this.data.projectiles['gorgonFire'].copyBase(3, 4, FIRE)],
          "Sword": [this.data.projectiles['swordProjectile'].copyBase(3, 4, SLASH)],
          "Magic Sword": [this.data.projectiles['swordProjectile'].copyBase(4, 5, SLASH), this.data.projectiles['lightningProjectile'].copyBase(4, 5, LIGHTNING), this.data.projectiles['gorgonFire'].copyBase(4, 5, FIRE)],
          "Staff": [this.data.projectiles["punch"].copyBase(3, 4, BLUNT)],
          "Magic Staff": [this.data.projectiles['lightningProjectile'].copyBase(1, 6, LIGHTNING), this.data.projectiles['gorgonFire'].copyBase(2, 5, FIRE)]
        }

        // Figure out dmg mod
        const FinalWeapon = weapon.copy(weaponData[weapon.name][Math.floor(Math.random()*weaponData[weapon.name].length)], projectileCount, 0.261799, manaCost)
        
        nextSelections.push(FinalWeapon);
      }
    }

    this.newWeapons = nextSelections;
    // for (let i = 0; i < numWeapons; i++) {
    //   this.newWeapons.push(fists);
    // }
  }

  /*createRandomWeapon() {
    const weaponType = Math.random();
    let projectile = undefined;
    if (weaponType < 0.125) {
      weaponType = "sword";
      projectile = this.data.projectiles['swordProjectile'].copyBase(2, 3, SLASH);
    } else if (weaponType < 0.25) {
      weaponType = "staff";
      projectile = this.data.projectiles['punch'].copyBase(2, 4, BLUNT);
    } else if (weaponType < 0.375) {
      weaponType = "knuckles";
      projectile = this.data.projectiles['punch'].copyBase(1, 4, BLUNT);
    } else if (weaponType < 0.5) {
      weaponType = "bow";
      projectile = this.data.projectiles['bowProjectile'].copyBase(1, 3, SLASH);
    } else if (weaponType < 0.625) {
      weaponType = "magicFists";
    } else if (weaponType < 0.75) {
      weaponType = "magicBow";
    } else if (weaponType < 0.875) {
      weaponType = "magicSword";
    } else {
      weaponType = "magicStaff";
    }

    const projectileCount = Math.round(Math.random() * 3);
    if (weaponType.includes("magic")) {
      projectileCount = Math.round(Math.random() * 8);
    }

    const damageModifier = 2 / projectileCount;

    const weapon = this.data.weapons[weaponType].copy()
  }*/

  handleKeyUp(keyCode) {
    if (!this.newWeaponSelected) {
      if (keyCode >=49 && keyCode <= 51){
        const keyValue = keyCode - 49;
        this.selectedCard = this.newWeapons[keyValue];
        this.selectedIndex = keyValue;
        this.newWeaponSelected = true;

        //if it's a passive card
        if (this.selectedCard.addValueToCamera) {
          this.selectedCard.addValueToCamera(this.camera);
          this.newWeaponSelected = false;
          return true;
        }
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
