class Level
{
  constructor(levelArray, startLocationX, startLocationY, skyboxImage, useShade, shadeColor, billboards, enemies, powerups, hazards, teleports)
  {
    this.startLocationX = startLocationX;
    this.startLocationY = startLocationY;
    this.levelArray = levelArray;
    this.width = levelArray.length;
    this.height = levelArray[0].length;
    this.skybox = skyboxImage;
    this.useShade = useShade;
    this.shadeColor = shadeColor;

    this.billboardTypes = billboards;
    this.enemyTypes = enemies;
    this.powerupTypes = powerups;
    this.hazardTypes = hazards;
    this.teleportTypes = teleports;

    this.projectiles = [];
  }

  loadData(data) {
    this.data = data;
    this.loadBillboards(this.billboardTypes);
    this.loadEnemies(this.enemyTypes);
    this.loadPowerups(this.powerupTypes);
    this.loadHazards(this.hazardTypes);
    this.loadTeleports(this.teleportTypes);
  }

  getAllBillboards() {
    return this.billboards.concat(this.projectiles).concat(this.enemies).concat(this.powerups).concat(this.teleports).concat(this.hazards);
  }

  getTeleportOnPlayer(camera) {
    for(let t = 0; t < this.teleports.length; t++){
      if (Math.sqrt(Math.pow(this.teleports[t].x - camera.x, 2) + Math.pow(this.teleports[t].y - camera.y, 2)) < 1.5)
        return this.teleports[t];
    }

    return undefined;
  }

  stopAllAnimations() {
    let billboards = this.getAllBillboards();
    for(let b = 0; b < billboards.length; b++){
      billboards[b].activeAnimation.stop();
    }
  }

  endLevel() {
    this.stopAllAnimations();
    this.enemies = [];
    this.hazards = [];
    this.teleports = [];
    this.projectiles = [];
  }

  async turnBasedUpdate(level, camera, data,  audio, updateInterval) {
    //move and remove player projectiles
    let projectilesToRemove = [];
    let playerProjectiles = this.projectiles.filter((p) => p.playerOwned);

    for (let p = 0; p < playerProjectiles.length; p++){
      playerProjectiles[p].isTakingTurn = true;
      for (let t = 0; t < 30; t++) {
        playerProjectiles[p].update(this, camera, audio);
        if (playerProjectiles[p].reachedMaxDistanceOrHitWall()) {
          projectilesToRemove.push(this.projectiles[p]);
          break;
        }
        await new Promise(r => setTimeout(r, 1000/30));
      }
      playerProjectiles[p].isTakingTurn = false;
    }

    for (let p = 0; p < projectilesToRemove.length; p++) {
      let index = this.projectiles.indexOf(projectilesToRemove[p]);
      this.projectiles[index].activeAnimation.stop();
      this.projectiles.splice(index, 1);
    }

    for (let e = 0; e < this.enemies.length; e++) {
      this.enemies[e].isTakingTurn = true;
      for (let t = 0; t < 30; t++) {
        this.enemies[e].update(level, camera, data, audio, updateInterval);
        await new Promise(r => setTimeout(r, 1000/30));
      }
      this.enemies[e].isTakingTurn = false;
    }

    //move and remove player projectiles
    projectilesToRemove = [];
    let enemiesProjectiles = this.projectiles.filter((p) => !p.playerOwned);

    for (let p = 0; p < enemiesProjectiles.length; p++){
      enemiesProjectiles[p].isTakingTurn = true;
      for (let t = 0; t < 30; t++) {
        enemiesProjectiles[p].update(this, camera, audio);
        if (enemiesProjectiles[p].reachedMaxDistanceOrHitWall()) {
          projectilesToRemove.push(this.projectiles[p]);
          break;
        }
        await new Promise(r => setTimeout(r, 1000/30));
      }
      enemiesProjectiles[p].isTakingTurn = false;
    }

    for (let p = 0; p < projectilesToRemove.length; p++) {
      let index = this.projectiles.indexOf(projectilesToRemove[p]);
      this.projectiles[index].activeAnimation.stop();
      this.projectiles.splice(index, 1);
    }
  }

  updateLocationEffects() {
    //See if Hazards hurt the player
    for (let h = 0; h < this.hazards.length; h++) {
      this.hazards[h].update(camera, audio);
    }

    //remove collected powerups
    let powerupsToRemove = [];
    for (let p = 0; p < this.powerups.length; p++){
      this.powerups[p].update(this.data, camera, audio);
      if (this.powerups[p].collected)
        powerupsToRemove.push(this.powerups[p]);
    }

    for (let p = 0; p < powerupsToRemove.length; p++) {
      let index = this.powerups.indexOf(powerupsToRemove[p]);
      this.powerups[index].activeAnimation.stop();
      this.powerups.splice(index, 1);
    }
  }

  update(level, camera, data,  audio, updateInterval) {
    for (let e = 0; e < this.enemies.length; e++) {
      this.enemies[e].update(level, camera, data, audio, updateInterval);
    }
    //See if Hazards hurt the player
    for (let h = 0; h < this.hazards.length; h++) {
      this.hazards[h].update(camera, audio);
    }
    //remove unnecessary projectiles
    let projectilesToRemove = [];
    for (let p = 0; p < this.projectiles.length; p++){
      this.projectiles[p].update(this, camera, audio);
      if (this.projectiles[p].reachedMaxDistanceOrHitWall())
        projectilesToRemove.push(this.projectiles[p]);
    }

    for (let p = 0; p < projectilesToRemove.length; p++) {
      let index = this.projectiles.indexOf(projectilesToRemove[p]);
      this.projectiles[index].activeAnimation.stop();
      this.projectiles.splice(index, 1);
    }

    //remove collected powerups
    let powerupsToRemove = [];
    for (let p = 0; p < this.powerups.length; p++){
      this.powerups[p].update(this.data, camera, audio);
      if (this.powerups[p].collected)
        powerupsToRemove.push(this.powerups[p]);
    }

    for (let p = 0; p < powerupsToRemove.length; p++) {
      let index = this.powerups.indexOf(powerupsToRemove[p]);
      this.powerups[index].activeAnimation.stop();
      this.powerups.splice(index, 1);
    }
  }

  loadBillboards(billboards) {
    this.billboards = [];
    for (let b = 0; b < billboards.length; b++) {
      this.billboards.push(this.data.billboards[billboards[b].type].copy(billboards[b].x, billboards[b].y));
    }
  }

  loadEnemies(enemies) {
    this.enemies = [];
    for (let e = 0; e < enemies.length; e++) {
      this.enemies.push(this.data.enemies[enemies[e].type].copy(enemies[e].x, enemies[e].y));
    }
  }

  loadPowerups(powerups) {
    this.powerups = [];
    for (let p = 0; p < powerups.length; p++) {
      this.powerups.push(this.data.powerups[powerups[p].type].copy(powerups[p].x, powerups[p].y));
    }
  }

  loadTeleports(teleports) {
    this.teleports = [];
    for (let p = 0; p < teleports.length; p++) {
      this.teleports.push(this.data.teleports[teleports[p].type].copy(teleports[p].x, teleports[p].y));
    }
  }

  loadHazards(hazards) {
    this.hazards = [];
    for (let h = 0; h < hazards.length; h++) {
      this.hazards.push(this.data.hazards[hazards[h].type].copy(hazards[h].x, hazards[h].y));
    }
  }

  isWall(x, y)
  {
    //for out of bounds just put a wall
    return this.wallTextureAt(x, y) !== undefined;
  }

  isPassable(x, y) {
    return this.levelArray[x][y] < 30;
  }

  wallTextureAt(x, y)
  {
    if (this.isInsideArray(x,y))
    {
    /**
     * switch walls textures: 
     * 1-14 floors without ceiling, 
     * 15-29 floors with ceiling,
     * 30-49 floors that cannot be passed.
     * 50-100 walls.
     */
      switch(this.levelArray[x][y])
      {
        case 50:
          return this.data.textures["default"];
        case 51:
          return this.data.textures["wall1_city"];
        case 52:
          return this.data.textures["wall2_city"];
        case 53:
          return this.data.textures["wall3_city"];
        case 61:
          return this.data.textures["wall1_cemetary"];
        case 62:
          return this.data.textures["wall2_cemetary"];
        case 63:
          return this.data.textures["wall3_cemetary"];
        case 71:
          return this.data.textures["wall_cave"];
        default:
          return undefined;
      }
    }
    else
    {
      return undefined;
    }    
  }

  getCeilingTextureAt(x,y) {
    if (x < 0 || x > this.levelArray.length || y < 0 || y > this.levelArray[0].length) {
      return undefined;
    }

    switch(this.levelArray[x][y]) {
      case 15:
        return this.data.textures["dirt3_cave"];
      case 16:
        return this.data.textures["dirt_cave"];
      case 17:
        return this.data.textures["dirt_cave"];
      default:
        return undefined;
    }
  }

  getFloorTextureAt(x,y) {
    if (x < 0 || x > this.levelArray.length || y < 0 || y > this.levelArray[0].length) {
      return this.data.textures["empty"];
    }

    /**
     * switch floor textures: 
     * 1-14 floors without ceiling, 
     * 15-29 floors with ceiling,
     * 30-49 floors that cannot be passed.
     * 50-100 walls.
     */
    switch(this.levelArray[x][y]) {
      case 1:
        return this.data.textures["default"];
      case 2:
        return this.data.textures["grass_city"];
      case 3:
        return this.data.textures["grass2_city"];
      case 5:
        return this.data.textures["floor1_cemetary"]
      case 6:
        return this.data.textures["floor2_cemetary"]
      case 15:
        return this.data.textures["dirt_cave"];
      case 16:
        return this.data.textures["dirt2_cave"];
      case 17:
        return this.data.textures["dirt3_cave"];
      case 30:
        return this.data.textures["water"];
      default:
        return this.data.textures["empty"];
    }
  }

  isInsideArray(x,y) {
    return x > -1 && x < this.levelArray.length && y > -1 && y < this.levelArray[0].length;
  }

  copy() {
    return new Level([...this.levelArray], this.skybox, this.useShade, this.shadeColor, this.billboardTypes, this.enemyTypes, this.powerupTypes, this.hazardTypes, this.teleportTypes);
  }
}