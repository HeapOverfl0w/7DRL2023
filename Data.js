class Data {
    constructor() {
        this.textures = [
            "death_cutscene",
            "default",
            "defaultHigh",
            "test",
            "empty",
            "water",
            "statue",
            "teleport"
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
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        let textures = {};

        for (let i = 0; i < this.textures.length; i++) {
            let img = new Image();
            img.src = "resources\\" + this.textures[i] + ".png";
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            let imgData = ctx.getImageData(0,0,img.width,img.height);
            textures[this.textures[i]] = imgData;
        }
        this.textures = textures;
    }

    createAnimations() {
        this.animations = {};

        this.animations["test"] = new Animation(this.textures["test"], 64, 64, 1, 0, false);
        this.animations["statue"] = new Animation(this.textures["statue"], 64, 128, 1, 0, false);
        this.animations["teleport"] = new Animation(this.textures["teleport"], 128, 128, 3, 350, true);

        //cutscenes
        this.animations["death_cutscene"] = new Animation(this.textures["death_cutscene"], 240, 135, 6, 800, false);
    }

    createHazards() {
        this.hazards = {};
    }

    createTeleports() {
        this.teleports = {};

        this.teleports["portal"] = new Teleport(this.animations["teleport"], 0, 0);
    }

    createBillboards() {
        this.billboards = {};

        this.billboards["test"] = new Billboard(this.animations["test"], 0, 0);
        this.billboards["statue"] = new Billboard(this.animations["statue"], 0, 0);

        this.billboardsArray = Object.keys(this.billboards).map(key => key);
    }

    createProjectiles() {
        this.projectiles = {};
    }

    createPowerups() {
        this.powerups = {};
    }

    createEnemies() {
        this.enemies = {};
    }

    createWeapons() {
        this.weapons = {};
    }

    createCutscenes() {
        this.deathCutscene = new Cutscene([this.animations["death_cutscene"]], false);
    }
}