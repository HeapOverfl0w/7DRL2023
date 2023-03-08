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
      'enemyTeleport',
      'fists',
      'fistsAttack',
      'bow',
      'bowAttack',
      'magicBow',
      'magicBowAttack',
      'sword',
      'swordAttack',
      'magicSword',
      'magicSwordAttack',
      'swordProjectile',
      'arrowProjectile',
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
      "skeleton",
      "skeletonAttack",
      "skeletonDeath",
      "healthPotion",
      "manaPotion",
      "spookyTree",
      "skullPile",
      "tombstone",
      "ogre",
      "ogreAttack",
      "ogrePunch",
      "ogreDeath",
      "ogreProjectile",
      "totem",
      "totemAttack",
      "totemDeath",
      "gorgon",
      "gorgonDeath",
      "gorgonAttack",
      "gorgonFire",
      "demon",
      "demonAttack",
      "demonDeath",
      "demonProjectile",
      "sandSlime",
      "sandSlimeAttack",
      "sandSlimeDeath",
      "grass_city",
      "grass2_city",
      "wall1_city",
      "wall2_city",
      "wall3_city",
      "wall1_cemetary",
      "wall2_cemetary",
      "wall3_cemetary",
      "floor1_cemetary",
      "floor2_cemetary",
      "fountain",
      "sand_islands",
      "sand1_islands",
      "sand2_islands",
      "sand3_islands",
      "sand4_islands",
      "targetPractice",
      "dirt_cave",
      "dirt2_cave",
      "dirt3_cave",
      "wall_cave",
      "shroom",
      "caveSkybox",
      "goblin",
      "goblinAttack",
      "goblinDeath",
      "goblinShaman",
      "goblinShamanAttack",
      "goblinShamanDeath",
      "rat",
      "ratAttack",
      "ratDeath",
      "stalactite",
      "lightningProjectile",
      "staff",
      "staffAttack",
      "magicStaff",
      "magicStaffAttack",
      "fir",
      "floor_snow",
      "floor2_snow",
      "wall_snow",
      "necro",
      "necroAttack",
      "necroDeath",
      "knight",
      "knightAttack",
      "knightPunch",
      "knightDeath",
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
    this.animations['targetPractice'] = new Animation(this.textures['targetPractice'], 48, 64, 1,0, false);
    this.animations['fountain'] = new Animation(this.textures['fountain'], 128, 128, 3, 200, true);
    this.animations['tombstone'] = new Animation(this.textures['tombstone'], 32,  128, 1, 0, false);
    this.animations['skullPile'] = new Animation(this.textures['skullPile'], 64,  128, 1, 0, false);
    this.animations['shroom'] = new Animation(this.textures['shroom'], 32, 64, 1, 0, false);
    this.animations['stalactite'] = new Animation(this.textures['stalactite'], 16, 80, 3, 500, true);
    this.animations['fir'] = new Animation(this.textures['fir'], 64, 100, 1, 0, false);

    //enemies
    this.animations["harpy"] = new Animation(this.textures["harpy"], 40, 96, 2, 200, true);
    this.animations["harpyAttack"] = new Animation(this.textures["harpyAttack"], 40, 96, 2, 1250, false);
    this.animations["harpyDeath"] = new Animation(this.textures["harpyDeath"], 40, 96, 3, 600, false);

    this.animations["skeleton"] = new Animation(this.textures["skeleton"], 32, 80, 4, 400, true);
    this.animations["skeletonAttack"] = new Animation(this.textures["skeletonAttack"], 32, 80, 3, 700, false);
    this.animations["skeletonDeath"] = new Animation(this.textures["skeletonDeath"], 32, 80, 3, 400, false);

    this.animations["goblin"] = new Animation(this.textures["goblin"], 32, 80, 3, 200, true);
    this.animations["goblinAttack"] = new Animation(this.textures["goblinAttack"], 32, 80, 3, 280, false);
    this.animations["goblinDeath"] = new Animation(this.textures["goblinDeath"], 32, 80, 3, 400, false);

    this.animations["goblinShaman"] = new Animation(this.textures["goblinShaman"], 32, 80, 3, 200, true);
    this.animations["goblinShamanAttack"] = new Animation(this.textures["goblinShamanAttack"], 32, 80, 3, 500, false);
    this.animations["goblinShamanDeath"] = new Animation(this.textures["goblinShamanDeath"], 32, 80, 3, 400, false);

    this.animations["rat"] = new Animation(this.textures["rat"], 32, 70, 2, 300, true);
    this.animations["ratAttack"] = new Animation(this.textures["ratAttack"], 32, 70, 3, 400, false);
    this.animations["ratDeath"] = new Animation(this.textures["ratDeath"], 32, 70, 2, 500, false);

    this.animations["gorgon"] = new Animation(this.textures["gorgon"], 64, 93, 3, 100, true);
    this.animations["gorgonDeath"] = new Animation(this.textures["gorgonDeath"], 64, 93, 3, 400, false);
    this.animations["gorgonAttack"] = new Animation(this.textures["gorgonAttack"], 64, 93, 2, 400, false);

    this.animations["ogre"] = new Animation(this.textures["ogre"], 80, 160, 4, 400, true);
    this.animations["ogreAttack"] = new Animation(this.textures["ogreAttack"], 80, 160, 3, 400, false);
    this.animations["ogreDeath"] = new Animation(this.textures["ogreDeath"], 80, 160, 4, 400, false);
    this.animations["ogrePunch"] = new Animation(this.textures["ogrePunch"], 80, 160, 2, 700, false);

    this.animations["knight"] = new Animation(this.textures["knight"], 80, 182, 2, 200, true);
    this.animations["knightAttack"] = new Animation(this.textures["knightAttack"], 128, 190, 2, 600, false);
    this.animations["knightDeath"] = new Animation(this.textures["knightDeath"], 128, 182, 4, 500, false);
    this.animations["knightPunch"] = new Animation(this.textures["knightPunch"], 128, 182, 3, 500, false);

    this.animations["necro"] = new Animation(this.textures["necro"], 63, 67, 4, 300, true);
    this.animations["necroAttack"] = new Animation(this.textures["necroAttack"], 63, 67, 4, 300, false);
    this.animations["necroDeath"] = new Animation(this.textures["necroDeath"], 63, 67, 5, 250, false);

    this.animations["totem"] = new Animation(this.textures["totem"], 32, 64, 2, 500, true);
    this.animations["totemAttack"] = new Animation(this.textures["totemAttack"], 32, 64, 2, 1000, false);
    this.animations["totemDeath"] = new Animation(this.textures["totemDeath"], 32, 64, 2, 1000, false);

    this.animations["demon"] = new Animation(this.textures["demon"], 64, 96, 3, 400, true);
    this.animations["demonAttack"] = new Animation(this.textures["demonAttack"], 64, 96, 3, 400, false);
    this.animations["demonDeath"] = new Animation(this.textures["demonDeath"], 64, 96, 4, 400, false);

    this.animations["sandSlime"] = new Animation(this.textures["sandSlime"], 80, 80, 4, 400, true);
    this.animations["sandSlimeAttack"] = new Animation(this.textures["sandSlimeAttack"], 80, 80, 4, 400, false);
    this.animations["sandSlimeDeath"] = new Animation(this.textures["sandSlimeDeath"], 80, 80, 4, 400, false);

    this.animations["enemyTeleport"] = new Animation(this.textures["enemyTeleport"], 64, 96, 4, 350, false)

    //weapons
    this.animations['fistsIdle'] = new Animation(this.textures['fists'], 720, 405, 3, 400, true);
    this.animations['fistsAttack'] = new Animation(this.textures['fistsAttack'], 720, 405, 3, 200, false);
    this.animations['knucklesIdle'] = new Animation(this.textures['knuckles'], 720, 405, 3, 400, true);
    this.animations['knucklesAttack'] = new Animation(this.textures['knucklesAttack'], 720, 405, 3, 200, false);

    this.animations['fistsMagicIdle'] = new Animation(this.textures['fistsMagic'], 720, 405, 3, 400, true);
    this.animations['fistsMagicAttack'] = new Animation(this.textures['fistsMagicAttack'], 720, 405, 3, 200, false);

    this.animations['bowIdle'] = new Animation(this.textures['bow'], 720, 405, 3, 450, true);
    this.animations['bowAttack'] = new Animation(this.textures['bowAttack'], 720, 405, 4, 450, false);
    this.animations['magicBowIdle'] = new Animation(this.textures['magicBow'], 720, 405, 3, 450, true);
    this.animations['magicBowAttack'] = new Animation(this.textures['magicBowAttack'], 720, 405, 4, 450, false);
    this.animations['swordIdle'] = new Animation(this.textures['sword'], 720, 405, 2, 450, true);
    this.animations['swordAttack'] = new Animation(this.textures['swordAttack'], 720, 405, 4, 200, false);
    this.animations['magicSwordIdle'] = new Animation(this.textures['magicSword'], 720, 405, 2, 450, true);
    this.animations['magicSwordAttack'] = new Animation(this.textures['magicSwordAttack'], 720, 405, 4, 200, false);
    this.animations['staffIdle'] = new Animation(this.textures['staff'], 720, 405, 2, 450, true);
    this.animations['staffAttack'] = new Animation(this.textures['staffAttack'], 720, 405, 4, 250, false);
    this.animations['magicStaffIdle'] = new Animation(this.textures['magicStaff'], 720, 405, 2, 450, true);
    this.animations['magicStaffAttack'] = new Animation(this.textures['magicStaffAttack'], 720, 405, 4, 250, false);

    //projectiles
    this.animations['punch'] = new Animation(this.textures['punch'], 32, 32, 1, 0, true);
    this.animations['magicPunch'] = new Animation(this.textures['fistsMagicProjectile'], 32, 32, 3, 250, true);
    this.animations['gorgonFire'] = new Animation(this.textures['gorgonFire'], 64, 64, 3, 200, false);
    this.animations['ogreProjectile'] = new Animation(this.textures['ogreProjectile'], 16, 16, 1, 0, false);
    this.animations['demonProjectile'] = new Animation(this.textures['demonProjectile'], 64, 48, 4, 200, false);
    this.animations['arrowProjectile'] = new Animation(this.textures['arrowProjectile'], 16, 16, 1, 0, false);
    this.animations['swordProjectile'] = new Animation(this.textures['swordProjectile'], 32, 16, 1, 0, false);
    this.animations['lightningProjectile'] = new Animation(this.textures['lightningProjectile'], 32, 32, 2, 100, true);

    //cutscenes
    this.animations['death_cutscene'] = new Animation(this.textures['death_cutscene'], 720, 405, 6, 800, false);

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

    this.billboards['shroom'] = new Billboard(this.animations['shroom'], 0, 0);
    this.billboards['statue'] = new Billboard(this.animations['statue'], 0, 0);
    this.billboards['shrub'] = new Billboard(this.animations['shrub'], 0, 0);
    this.billboards['spookyTree'] = new Billboard(this.animations['spookyTree'], 0, 0, 2.5);
    this.billboards['fir'] = new Billboard(this.animations['fir'], 0, 0, 3);
    this.billboards['targetPractice'] = new Billboard(this.animations['targetPractice'], 0, 0);
    this.billboards['fountain'] = new Billboard(this.animations['fountain'], 0, 0, 2);
    this.billboards['skullPile'] = new Billboard(this.animations['skullPile'], 0, 0, 1);
    this.billboards['tombstone'] = new Billboard(this.animations['tombstone'], 0, 0, 2);
    this.billboards['stalactite'] = new Billboard(this.animations['stalactite'], 0, 0);

    this.billboardsArray = Object.keys(this.billboards).map((key) => key);
  }

  createProjectiles() {
    this.projectiles = {};

    this.projectiles['punch'] = new Projectile(this.animations['punch'], 0, 0, 0, 0, 1, 3, 1, 2, BLUNT);
    this.projectiles['magicPunch'] = new Projectile(this.animations['magicPunch'], 0, 0, 0, 0, 0.5, 20, 2, 3, LIGHTNING);
    this.projectiles['gorgonFire'] = new Projectile(this.animations['gorgonFire'], 0, 0, 0, 0, 0.25, 10, 1, 2, FIRE);
    this.projectiles['ogreProjectile'] = new Projectile(this.animations['ogreProjectile'], 0, 0, 0, 0, 0.5, 15, 2, 3, FIRE);
    this.projectiles['demonProjectile'] = new Projectile(this.animations['demonProjectile'], 0, 0, 0, 0, 0.25, 10, 1, 2, FIRE);
    this.projectiles['arrowProjectile'] = new Projectile(this.animations['arrowProjectile'], 0, 0, 0, 0, 0.5, 25, 2, 3, SLASH);
    this.projectiles['swordProjectile'] = new Projectile(this.animations['swordProjectile'], 0, 0, 0, 0, 0.5, 5, 2, 3, SLASH);
    this.projectiles['lightningProjectile'] = new Projectile(this.animations['lightningProjectile'], 0, 0, 0, 0, 0.3, 15, 2, 3, LIGHTNING);
  }

  createPowerups() {
    this.powerups = {};
    this.powerups['healthPotion'] = new Powerup('health', this.animations['healthPotion'], 0, 0);
    this.powerups['manaPotion'] = new Powerup('mana', this.animations['manaPotion'], 0, 0);
  }

  createEnemies() {
    this.enemies = {};

    this.enemies["harpy"] = new Enemy("harpy", 4, 3.5, 2, 2, false, this.projectiles["punch"], this.animations["harpy"], this.animations["harpyAttack"], this.animations["harpyDeath"], 0.1, 0.0, 0.1, 0.0, 0, 0);
    this.enemies["rat"] = new Enemy("rat", 4, 3, 2, 2, false, this.projectiles["punch"], this.animations["rat"], this.animations["ratAttack"], this.animations["ratDeath"], 0.2, 0.0, 0.3, 0.0, 0, 0);
    this.enemies["gorgon"] = new Enemy2("gorgon", 4, 1.75, 5, 3000, 2, false, this.projectiles["gorgonFire"], this.animations["gorgon"], this.animations["gorgonAttack"], this.animations["gorgonDeath"], 0.1, 0.0, 0.1, 0.0, 0, 0);
    this.enemies["skeleton"] = new Enemy("skeleton", 4, 1.5, 2, 2, false, this.projectiles["punch"], this.animations["skeleton"], this.animations["skeletonAttack"], this.animations["skeletonDeath"], 0.3, 0.3, 0.0, 0.3, 0, 0);
    this.enemies["goblin"] = new Enemy("goblin", 4, 5, 2, 4, false, this.projectiles["punch"], this.animations["goblin"], this.animations["goblinAttack"], this.animations["goblinDeath"], 0.0, 0.2, 0.1, -0.2, 0, 0);
    this.enemies["goblinShaman"] = new Enemy2("goblinShaman", 7, 2.5, 10, 2000, 6, false, this.projectiles["lightningProjectile"], this.animations["goblinShaman"], this.animations["goblinShamanAttack"], this.animations["goblinShamanDeath"], 0.1, 0.0, 0.1, 0.0, 0, 0);
    this.enemies["ogre"] = new OgreBoss("ogre", 20, 1.5, 12, 20, false, this.projectiles["ogreProjectile"], this.animations["ogre"], this.animations["ogreAttack"], this.animations["ogreDeath"], this.animations["ogrePunch"], 0.2, 0.3, 0.1, -0.2, 0, 0);
    this.enemies["ogre"].sizeModifier = 1.5;
    this.enemies["knight"] = new KnightBoss("knight", 20, 3.5, 12, 2500, 20, false, this.projectiles["ogreProjectile"], this.animations["knight"], this.animations["knightAttack"], this.animations["knightDeath"], this.animations["knightPunch"], 0.2, -0.2, 0.2, 0.2, 0, 0);
    this.enemies["knight"].sizeModifier = 1.5;
    this.enemies["necro"] = new NecroBoss("necro", 20, 1.5, 12, 20, false, this.projectiles["lightningProjectile"], this.animations["necro"], this.animations["necroAttack"], this.animations["necroDeath"], 0.2, 0.0, -0.2, 0.25, 0, 0);
    this.enemies["necro"].sizeModifier = 1.3;
    this.enemies["totem"] = new Enemy("totem", 1, 0, 10, 1, true, this.projectiles["ogreProjectile"], this.animations["totem"], this.animations["totemAttack"], this.animations["totemDeath"], 0.1, 0.0, 0.1, 0.0, 0, 0);

    this.enemies["demon"] = new EnemyTeleport("demon", 6, 2, 10, 3000, 15, 5000, 5, false, this.projectiles["demonProjectile"], this.animations["demon"], this.animations["demonAttack"], this.animations["demonDeath"], this.animations["enemyTeleport"], 0.1, 0.1, 0.1, -0.2, 0, 0);
    this.enemies["sandSlime"] = new Enemy2("sandSlime", 4, 1.75, 5, 3000, 2, false, this.projectiles["demonProjectile"], this.animations["sandSlime"], this.animations["sandSlimeAttack"], this.animations["sandSlimeDeath"], 0.1, 0.0, 0.1, 0.0, 0, 0);

    this.enemiesArray = Object.keys(this.enemies).map(key => key);
  }

  createWeapons() {
    this.weapons = {};

    this.weapons['fists'] = new Weapon('Fists', this.animations['fistsIdle'], this.animations['fistsAttack'], document.getElementById('fistCard'), this.projectiles['punch'], 0, 0, 0);
    this.weapons['knuckles'] = new Weapon('Knuckles', this.animations['knucklesIdle'], this.animations['knucklesAttack'], document.getElementById('knucklesCard'), this.projectiles['punch'], 0, 0, 0);
    this.weapons['magicFists'] = new Weapon('Magic Fists', this.animations['fistsMagicIdle'], this.animations['fistsMagicAttack'], document.getElementById('fistsCardMagic'), this.projectiles['magicPunch'], 1, 0, 2);
    this.weapons['bow'] = new Weapon('Bow', this.animations['bowIdle'], this.animations['bowAttack'], document.getElementById('bowCard'), this.projectiles['arrowProjectile'], 0, 0, 0);
    this.weapons['magicBow'] = new Weapon('Magic Bow', this.animations['magicBowIdle'], this.animations['magicBowAttack'], document.getElementById('magicBowCard'), this.projectiles['arrowProjectile'], 0, 0, 2);
    this.weapons['sword'] = new Weapon('Sword', this.animations['swordIdle'], this.animations['swordAttack'], document.getElementById('swordCard'), this.projectiles['swordProjectile'], 3, 0.17, 0);
    this.weapons['magicSword'] = new Weapon('Magic Sword', this.animations['magicSwordIdle'], this.animations['magicSwordAttack'], document.getElementById('magicSwordCard'), this.projectiles['swordProjectile'], 3, 0.17, 2);
    this.weapons['staff'] = new Weapon('Staff', this.animations['staffIdle'], this.animations['staffAttack'], document.getElementById('staffCard'), this.projectiles['punch'], 3, 0.17, 0);
    this.weapons['magicStaff'] = new Weapon('Magic Staff', this.animations['magicStaffIdle'], this.animations['magicStaffAttack'], document.getElementById('magicStaffCard'), this.projectiles['swordProjectile'], 3, 0.17, 2);
  }

  createCutscenes() {
    this.deathCutscene = new Cutscene(
      [this.animations['death_cutscene']],
      false
    );
  }
}
