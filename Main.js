class Main
{
  constructor(ctx)
  {
    this.audio = new AudioHandler();
    this.data = new Data();
    this.data.load();
    this.ctx = ctx;
    this.filter = new PostRenderFilter();
    this.filter.type = "none";
    this.levelFactory = new LevelFactory(this.data);
    this.level = this.levelFactory.generateLevel(1);

    this.activeCutscene = this.data.introCutscene;

    let fistsProjectile = this.data.projectiles["punch"].copyBase(1, 5, BLUNT);
    let fists = this.data.weapons["fists"].copy(fistsProjectile, 1, 0, 0);
    let fists1 = this.data.weapons["fists"].copy(fistsProjectile, 1, 0, 0);
    let fists2 = this.data.weapons["fists"].copy(fistsProjectile, 1, 0, 0);
    let fists3 = this.data.weapons["fists"].copy(fistsProjectile, 1, 0, 0);
    let fists4 = this.data.weapons["fists"].copy(fistsProjectile, 1, 0, 0);
    this.camera = new Camera(this.level.startLocationX, this.level.startLocationY, 0, Math.PI * (6/18), 6, [fists, fists1, fists2, fists3, fists4]);
    this.rayCaster = new RayCaster(50);
    this.FPS = 30;
    this.fpsCounter = 0;
    this.startTime = Date.now();
    this.endTime = 0;

    this.weaponMenu = new WeaponMenu(this.ctx, this.camera, this.data);

    this.showItemSelection = false;

    this.keysDown = [];
    this.mouseDown = false;
  }

  initialize()
  {
    setInterval(this.update, 1000/this.FPS, this);
  }

  update(main)
  {
    //render cutscene
    if (main.activeCutscene !== undefined) {
      main.activeCutscene.update();
      main.activeCutscene.draw(main.ctx);

      if (main.activeCutscene == main.data.deathCutscene && main.activeCutscene.isOver()) {
        main.ctx.fillStyle = 'black';
        main.ctx.fillText(`Level: ${main.camera.level}`, 350, 260);
        main.ctx.fillText(`Score: ${main.camera.score}`, 350, 270);
      }

      return;
    }

    for (let k = 0; k < main.keysDown.length; k++)
      main.camera.handleKeyDown(main.keysDown[k], main.level, 1/main.FPS);

    main.level.update(main.level, main.camera, main.data, main.audio, 1/main.FPS);

    if (main.showItemSelection) {
      main.weaponMenu.drawNewWeaponMenu();
    } else {
      main.rayCaster.draw(main.ctx, main.camera, main.level, main.filter);
      //draw HUD data
      main.camera.drawHUD(main.ctx);
    }

    main.audio.update();

    let teleport = main.level.getTeleportOnPlayer(main.camera);
    if (teleport !== undefined) {
      main.showItemSelection = true;
      main.weaponMenu.generateNewWeapons();
      main.camera.level++;
      main.level.endLevel();
      main.keysDown = [];
      main.mouseDown = false;
    }

    if (main.mouseDown)
      main.camera.handleMouseDown(main.level, main.audio);

    main.fpsCounter++;

    //death check
    if (main.camera.playerHealth <= 0) {
       main.activeCutscene = main.data.deathCutscene;
       main.activeCutscene.restart();
    }
  }

  handleMouseMove(movementx) {
    let angle = movementx * 0.02 * Math.PI / 180
    this.camera.angle = (this.camera.angle + angle) % (2 * Math.PI);
    if (this.angle < 0)
      this.camera.angle = this.camera.angle + (2 * Math.PI);
  }

  handleMouseDown() {
    this.mouseDown = true;
  }

  handleMouseUp() {
    if (!this.showItemSelection) {
      this.mouseDown = false;
      this.camera.handleMouseUp();
    }
  }

  handleMouseWheel(deltaY) {
    this.mouseDown = false;
    this.camera.handleMouseWheel(deltaY);
  }

  handleKeyDown(keyCode) {
    if (!this.keysDown.includes(keyCode) && !this.showItemSelection)
      this.keysDown.push(keyCode);
  }

  handleKeyUp(keyCode)
  {
    if (this.showItemSelection) {
      if (this.weaponMenu.handleKeyUp(keyCode)) {
        this.showItemSelection = false;
        this.level = this.levelFactory.generateLevel(main.camera.level);
        this.camera.x = this.level.startLocationX;
        this.camera.y = this.level.startLocationY;
        this.mouseDown = false;
      }
      return;
    }

    if (this.activeCutscene === undefined && !this.audio.musicPlaying) {
      this.audio.playAndLoopMusic();
    }
    if (this.activeCutscene !== undefined && (this.activeCutscene.skippable || (this.activeCutscene.isOver()))) {
      if (this.activeCutscene != this.data.introCutscene) {
        this.restartGame();
      }
      else {
        this.audio.playAndLoopMusic();
      }

      if (this.activeCutscene == this.data.deathCutscene) {
        this.restartGame();
      }
      this.activeCutscene = undefined;
    }

    if (keyCode == 81) {
      this.audio.toggleMute();
    }

    let removeAt = -1;
    for(let k = 0; k < this.keysDown.length; k++)
    {
      if (this.keysDown[k] == keyCode)
        removeAt = k;
    }
    
    if (removeAt != -1)
      this.keysDown.splice(removeAt,1);
      
      
    this.camera.handleKeyUp(keyCode);


    if (keyCode == 65 || keyCode == 68) {
      if (!this.keysDown.includes(65) && !this.keysDown.includes(68))
        this.camera.isStrafing = false;
    }
  }

  restartGame() {
    this.startTime = new Date().getTime();
    this.camera.stopAllWeaponAnimations();

    this.activeCutscene = undefined;
    let fistsProjectile = this.data.projectiles["punch"].copyBase(1, 5, BLUNT);
    let fists = this.data.weapons["fists"].copy(fistsProjectile, 1, 0, 0);
    let fists1 = this.data.weapons["fists"].copy(fistsProjectile, 1, 0, 0);
    let fists2 = this.data.weapons["fists"].copy(fistsProjectile, 1, 0, 0);
    let fists3 = this.data.weapons["fists"].copy(fistsProjectile, 1, 0, 0);
    let fists4 = this.data.weapons["fists"].copy(fistsProjectile, 1, 0, 0);
    this.level = this.levelFactory.generateLevel(1);
    this.camera = new Camera(this.level.startLocationX, this.level.startLocationY, 0, Math.PI * (6/18), 6, [fists, fists1, fists2, fists3, fists4]);
    this.weaponMenu = new WeaponMenu(this.ctx, this.camera, this.data);    
  }
}