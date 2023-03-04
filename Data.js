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
      'teleport',
      'fists',
      'fistsAttack',
      'punch',
      'fistscard',
      "harpy",
      "harpyAttack",
      "harpyDeath"
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

    //enemies
    this.animations["harpy"] = new Animation(this.textures["harpy"], 40, 96, 2, 200, true);
    this.animations["harpyAttack"] = new Animation(this.textures["harpyAttack"], 40, 96, 2, 1250, false);
    this.animations["harpyDeath"] = new Animation(this.textures["harpyDeath"], 40, 96, 3, 600, false);

    //weapons
    this.animations['fistsIdle'] = new Animation(this.textures['fists'], 720, 405, 3, 400, true);
    this.animations['fistsAttack'] = new Animation(this.textures['fistsAttack'], 720, 405, 3, 200, true);

    //projectiles
    this.animations['punch'] = new Animation(this.textures['punch'], 32, 32, 1, 0, true);

    //cutscenes
    this.animations['death_cutscene'] = new Animation(this.textures['death_cutscene'], 240, 135, 6, 800, false);
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

    this.billboardsArray = Object.keys(this.billboards).map((key) => key);
  }

  createProjectiles() {
    this.projectiles = {};

    this.projectiles['punch'] = new Projectile(
      this.animations['punch'],
      0,
      0,
      0,
      0,
      1,
      2,
      0,
      0,
      BLUNT
    );
  }

  createPowerups() {
    this.powerups = {};
  }

  createEnemies() {
    this.enemies = {};

    this.enemies["harpy"] = new Enemy("Harpy", 4, 4, 2, false, this.projectiles["punch"], this.animations["harpy"], this.animations["harpyAttack"], this.animations["harpyDeath"], 0.1, 0.0, 0.1, 0.0, 0, 0);

    this.enemiesArray = Object.keys(this.enemies).map(key => key);
  }

  createWeapons() {
    this.weapons = {};

    this.weapons['fists'] = new Weapon(
      'Fists',
      this.animations['fistsIdle'],
      this.animations['fistsAttack'],
      document.getElementById('fistCard'),
      undefined,
      0,
      0,
      0
    );
  }

  createCutscenes() {
    this.deathCutscene = new Cutscene(
      [this.animations['death_cutscene']],
      false
    );
  }
}
