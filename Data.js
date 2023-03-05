class Data {
  constructor() {
    this.textures = [
      'death_cutscene',
      'default',
      'defaultHigh',
      'test',
      'empty',
      'water',
      'statue',
      'shrub',
      'teleport',
      'fists',
      'fistsAttack',
      'fistsMagic',
      'fistsMagicAttack',
      'fistsMagicProjectile',
      'knuckles',
      'knucklesAttack',
      'punch',
      'fistscard',
      "harpy",
      "harpyAttack",
      "harpyDeath",
      "healthPotion",
      "manaPotion",
      "spookyTree",
      "gorgon",
      "gorgonDeath",
      "gorgonAttack",
      "gorgonFire"
    ];
  }

  load() {
    this.loadTextures();
    this.createAnimations();
    this.createProjectiles();
    this.createBillboards();
    this.createPowerups();
    this.createEnemies();
    this.createWeapons();
    this.createHazards();
    this.createTeleports();

    this.createCutscenes();
  }

  loadTextures() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    let textures = {};

    for (let i = 0; i < this.textures.length; i++) {
      let img = new Image();
      img.src = 'resources\\' + this.textures[i] + '.png';
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      let imgData = ctx.getImageData(0, 0, img.width, img.height);
      textures[this.textures[i]] = imgData;
    }
    this.textures = textures;
  }

  createAnimations() {
    this.animations = {};

    this.animations['test'] = new Animation(this.textures['test'], 64, 64, 1,0, false);
    this.animations['statue'] = new Animation(this.textures['statue'], 64, 128, 1, 0, false);
    this.animations['teleport'] = new Animation(this.textures['teleport'], 128, 128, 3, 350, true);
    this.animations['shrub'] = new Animation(this.textures['shrub'], 40, 96, 2, 1000, true);
    this.animations['spookyTree'] = new Animation(this.textures['spookyTree'], 128, 260, 1,0, false);

    //enemies
    this.animations["harpy"] = new Animation(this.textures["harpy"], 40, 96, 2, 200, true);
    this.animations["harpyAttack"] = new Animation(this.textures["harpyAttack"], 40, 96, 2, 1250, false);
    this.animations["harpyDeath"] = new Animation(this.textures["harpyDeath"], 40, 96, 3, 600, false);

    this.animations["gorgon"] = new Animation(this.textures["gorgon"], 64, 93, 3, 100, true);
    this.animations["gorgonDeath"] = new Animation(this.textures["gorgonDeath"], 64, 93, 3, 400, false);
    this.animations["gorgonAttack"] = new Animation(this.textures["gorgonAttack"], 64, 93, 2, 100, false);

    //weapons
    this.animations['fistsIdle'] = new Animation(this.textures['fists'], 720, 405, 3, 400, true);
    this.animations['fistsAttack'] = new Animation(this.textures['fistsAttack'], 720, 405, 3, 200, false);
    this.animations['knucklesIdle'] = new Animation(this.textures['knuckles'], 720, 405, 3, 400, true);
    this.animations['knucklesAttack'] = new Animation(this.textures['knucklesAttack'], 720, 405, 3, 200, false);

    this.animations['fistsMagicIdle'] = new Animation(this.textures['fistsMagic'], 720, 405, 3, 400, true);
    this.animations['fistsMagicAttack'] = new Animation(this.textures['fistsMagicAttack'], 720, 405, 3, 200, false);

    //projectiles
    this.animations['punch'] = new Animation(this.textures['punch'], 32, 32, 1, 0, true);
    this.animations['magicPunch'] = new Animation(this.textures['fistsMagicProjectile'], 32, 32, 3, 250, true);
    this.animations['gorgonFire'] = new Animation(this.textures['gorgonFire'], 64, 64, 3, 200, false);

    //cutscenes
    this.animations['death_cutscene'] = new Animation(this.textures['death_cutscene'], 240, 135, 6, 800, false);

    //powerups
    this.animations['healthPotion'] = new Animation(this.textures['healthPotion'], 32, 32, 4, 400, true);
    this.animations['manaPotion'] = new Animation(this.textures['manaPotion'], 32, 32, 4, 400, true);
  }

  createHazards() {
    this.hazards = {};
  }

  createTeleports() {
    this.teleports = {};

    this.teleports['portal'] = new Teleport(this.animations['teleport'], 0, 0);
  }

  createBillboards() {
    this.billboards = {};

    this.billboards['test'] = new Billboard(this.animations['test'], 0, 0);
    this.billboards['statue'] = new Billboard(this.animations['statue'], 0, 0);
    this.billboards['shrub'] = new Billboard(this.animations['shrub'], 0, 0);
    this.billboards['spookyTree'] = new Billboard(this.animations['spookyTree'], 0, 0, true);

    this.billboardsArray = Object.keys(this.billboards).map((key) => key);
  }

  createProjectiles() {
    this.projectiles = {};

    this.projectiles['punch'] = new Projectile(this.animations['punch'], 0, 0, 0, 0, 1, 3, 1, 2, BLUNT);
    this.projectiles['magicPunch'] = new Projectile(this.animations['magicPunch'], 0, 0, 0, 0, 0.5, 20, 2, 3, LIGHTNING);
    this.projectiles['gorgonFire'] = new Projectile(this.animations['gorgonFire'], 0, 0, 0, 0, 0.25, 10, 1, 2, FIRE);
  }

  createPowerups() {
    this.powerups = {};
    this.powerups['healthPotion'] = new Powerup('health', this.animations['healthPotion'], 0, 0);
    this.powerups['manaPotion'] = new Powerup('mana', this.animations['manaPotion'], 0, 0);
  }

  createEnemies() {
    this.enemies = {};

    // this.enemies["harpy"] = new Enemy("Harpy", 4, 4, 2, 2, false, this.projectiles["punch"], this.animations["harpy"], this.animations["harpyAttack"], this.animations["harpyDeath"], 0.1, 0.0, 0.1, 0.0, 0, 0);
    this.enemies["gorgon"] = new Enemy2("gorgon", 4, 1, 5, 3000, 2, false, this.projectiles["gorgonFire"], this.animations["gorgon"], this.animations["gorgonAttack"], this.animations["gorgonDeath"], 0.1, 0.0, 0.1, 0.0, 0, 0);


    this.enemiesArray = Object.keys(this.enemies).map(key => key);
  }

  createWeapons() {
    this.weapons = {};

    this.weapons['fists'] = new Weapon('Fists', this.animations['fistsIdle'], this.animations['fistsAttack'], document.getElementById('fistCard'), undefined, 0, 0, 0);
    this.weapons['knuckles'] = new Weapon('Knuckles', this.animations['knucklesIdle'], this.animations['knucklesAttack'], document.getElementById('knucklesCard'), undefined, 0, 0, 0);
    this.weapons['magicFists'] = new Weapon('Magic Fists', this.animations['fistsMagicIdle'], this.animations['fistsMagicAttack'], document.getElementById('fistsCardMagic'), this.projectiles['magicPunch'], 1, 0, 2)
  }

  createCutscenes() {
    this.deathCutscene = new Cutscene(
      [this.animations['death_cutscene']],
      false
    );
  }
}
