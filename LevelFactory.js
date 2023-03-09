class LevelFactory
{
    constructor(data) {
        this.data = data;
    }

    generateLevel(levelNumber) {
        const water = 30;
        let maxLevelSize = 150;
        if (levelNumber < 6) {
            maxLevelSize = 100;
        }

        const levelWidth = Math.round(Math.random() * maxLevelSize) + 100;
        const levelHeight = Math.round(Math.random() * maxLevelSize) + 100;
        let levelArray = new Array(levelWidth);
        

        let levelType = Math.random();
        if (levelType < 0.2) {
            levelType = "cave";
        } else if (levelType < 0.4) {
            levelType = "islands";
        } else if (levelType < 0.6) {
            levelType = "city";
        } else if (levelType < 0.8) {
            levelType = "cemetary";
        } else {
            levelType = "snow";
        }

        for(let x = 0; x < levelWidth; x++) {
            levelArray[x] = new Array(levelHeight);
            for(let y = 0; y < levelHeight; y++) {
                levelArray[x][y] = 0;
            }
        }

        let skybox = this.getSkyboxByLevelType(levelType);

        //generate rooms
        let maxRoomCount = 8;
        if (levelNumber < 6) {
            maxRoomCount = 3;
        }

        let roomCount = Math.round(Math.random() * maxRoomCount) + 2;
        let rooms = new Array(roomCount);
        for(let r = 0; r < roomCount; r++) {
            let xStart = Math.round(Math.random() * (levelWidth - 60)) + 20;
            let yStart = Math.round(Math.random() * (levelHeight - 60)) + 20;
            let width = Math.round(Math.random() * 30) + 10;
            let height = Math.round(Math.random() * 30) + 10;
            rooms[r] = {
                xStart: xStart, 
                yStart: yStart, 
                width: width, 
                height: height
            };

            for(let x = xStart; x < xStart + width; x++) {
                for(let y = yStart; y < yStart + height; y++) {
                    levelArray[x][y] = this.getFloorByLevelType(levelType);
                }
            }
        }

        //hallway connect rooms
        for(let r = 0; r < roomCount - 1; r++) {
            let roomOne = rooms[r];
            let roomTwo = rooms[r + 1];
            
            let xHallwayStep = ((roomTwo.xStart - roomOne.xStart)/Math.abs(roomTwo.xStart - roomOne.xStart));
            if (xHallwayStep !== Number.NaN) {
                let hallwayLength = Math.round(Math.random() * 4) + 1;
                for(let x = roomOne.xStart; x != roomTwo.xStart; x += xHallwayStep) {
                    for(let y = roomOne.yStart; y <= roomOne.yStart + hallwayLength; y++) {
                        levelArray[x][y] = this.getHallwayFloorByLevelType(levelType);
                    }
                }
            }

            let yHallwayStep = ((roomTwo.yStart - roomOne.yStart)/Math.abs(roomTwo.yStart - roomOne.yStart));
            if (yHallwayStep !== Number.NaN) {
                let hallwayLength = Math.round(Math.random() * 4) + 1;
                for(let y = roomOne.yStart; y != roomTwo.yStart; y += yHallwayStep) {
                    for(let x = roomTwo.xStart; x <= roomTwo.xStart + hallwayLength; x++) {
                        levelArray[x][y] = this.getHallwayFloorByLevelType(levelType);
                    }
                }
            } 
        }

        if (levelType !== "islands") {
            //add walls
            //decide outdoor wall type
            for(let x = 0; x < levelWidth; x++) {
                for(let y = 0; y < levelHeight; y++) {
                    //any adjacent floors
                    let top = y > 0 ? levelArray[x][y - 1] : 0;
                    let right = x < levelWidth - 1 ? levelArray[x + 1][y] : 0;
                    let bottom = y < levelHeight - 1 ? levelArray[x][y + 1] : 0;
                    let left = x > 0 ? levelArray[x - 1][y] : 0;

                    let topRight = x < levelWidth - 1 && y > 0 ? levelArray[x + 1][y - 1] : 0;
                    let bottomRight = x < levelWidth - 1 && y < levelHeight - 1 ? levelArray[x + 1][y + 1] : 0;
                    let bottomLeft = x > 0 && y < levelHeight - 1 ? levelArray[x - 1][y + 1] : 0;
                    let topLeft = x > 0 && y > 0 ? levelArray[x - 1][y - 1] : 0;

                    if (levelArray[x][y] === 0 && 
                        ((top > 0 && top < 30) || 
                        (right > 0 && right < 30)  || 
                        (bottom > 0 && bottom < 30) || 
                        (left > 0 && left < 30) ||
                        (topRight > 0 && topRight < 30) || 
                        (bottomRight > 0 && bottomRight < 30) || 
                        (bottomLeft > 0 && bottomLeft < 30) || 
                        (topLeft > 0 && topLeft < 30))) {
                        levelArray[x][y] = this.getWallByLevelType(levelType);
                    }
                }
            }
        } else {
            for(let x = 0; x < levelWidth; x++) {
                for(let y = 0; y < levelHeight; y++) {
                    if (levelArray[x][y] === 0) {
                        levelArray[x][y] = water;
                    }
                }
            }
        }

        //add random billboards
        const billboardCount = Math.round(Math.random() * 100);
        const billboards = [];
        for(let b = 0; b < billboardCount; b++) {
            
            let billboard = { type: this.getBillboardByLevelType(levelType), x: 0, y: 0 };
            this.placeBillboard(billboard, levelArray);
            billboards.push(billboard);
        }

        //add random enemies
        const enemyCount =  8 + Math.round(Math.random() * levelNumber * 3);
        const enemies = [];

        //every 5 level guarantee a boss.
        if (levelNumber % 5 == 0) {
            let enemy = {type: this.getRandomBoss(), x: 0, y: 0};
            enemies.push(enemy);
            this.placeEnemy(enemy, levelArray, rooms);
        }        
        
        for(let b = 0; b < enemyCount; b++) {
            let enemy = { type: this.getEnemyByLevelType(levelType), x: 0, y: 0 };
            this.placeEnemy(enemy, levelArray, rooms);
            enemies.push(enemy);
        }

        //create end level teleport 
        //find farthest distance room from start
        let farthestDistanceRoom = rooms[1];
        let farthestDistance = Math.sqrt(Math.pow(rooms[0].xStart - rooms[1].xStart, 2) + Math.pow(rooms[0].yStart - rooms[1].yStart, 2));
        for(let r = 2; r < roomCount; r++) {
            let distance = Math.sqrt(Math.pow(rooms[0].xStart - rooms[r].xStart, 2) + Math.pow(rooms[0].yStart - rooms[r].yStart, 2));
            if (distance > farthestDistance) {
                farthestDistance = distance;
                farthestDistanceRoom = rooms[r];
            }
        }

        let teleports = [];

        if (levelNumber % 5 != 0) {
            teleports.push({type: "portal", x: farthestDistanceRoom.xStart + Math.random() * farthestDistanceRoom.width, y: farthestDistanceRoom.yStart + Math.random() * farthestDistanceRoom.height});
        }

        let result = new Level(levelArray, rooms[0].xStart + 1, rooms[0].yStart + 1, skybox, true, this.getShadeColorByLevelType(levelType), 
            billboards,
            enemies,
            [], [], teleports);

        result.loadData(this.data);

        //update enemy strength based on levelNumber
        for(let e = 0; e < result.enemies.length; e++) {
            let levelMultiplier = Math.floor(levelNumber / 6);
            result.enemies[e].life += Math.floor(result.enemies[e].life * (0.5 * levelMultiplier));
            result.enemies[e].projectile.minDamage += Math.round(result.enemies[e].projectile.minDamage * (0.5 * levelMultiplier));
            result.enemies[e].projectile.maxDamage += Math.round(result.enemies[e].projectile.maxDamage * (0.5 * levelMultiplier));
        }

        return result;
    }
    

    /**
     * Randomly find a place to locate the billboard
     * @param {Billboard} billboard 
     * @param {number[][]} levelArray 
     */
    placeBillboard(billboard, levelArray) {
        let x = 0;
        let y = 0;
        while(!(levelArray[x][y] > 0 && levelArray[x][y] < 30)) {
            x = Math.round(Math.random() * (levelArray.length - 1));
            y = Math.round(Math.random() * (levelArray[0].length - 1));
        }

        billboard.x = x + 0.5;
        billboard.y = y + 0.5;
    }

    placeEnemy(billboard, levelArray, rooms) {
        let x = 0;
        let y = 0;
        const firstRoom = rooms[0];
        while(!(levelArray[x][y] > 0 && levelArray[x][y] < 30) || 
            (Math.sqrt(Math.pow(firstRoom.xStart - x, 2) + Math.pow(firstRoom.yStart - y, 2)) < 20)) {
            x = Math.round(Math.random() * (levelArray.length - 1));
            y = Math.round(Math.random() * (levelArray[0].length - 1));
        }

        billboard.x = x + 0.5;
        billboard.y = y + 0.5;
    }

    getRandomBoss() {
        const random = Math.random();
        if (random < 0.3) {
            return "ogre";
        } else if (random < 0.6) {
            return "knight";
        } else {
            return "necro";
        }
    }

    getEnemyByLevelType(levelType) {
        if (levelType === "snow") {
            const random = Math.random();
            if (random < 0.3) {
                return "rat";
            } else if (random < 0.5) {
                return "harpy";
            } else if (random < 0.7) {
                return "demon";
            } else if (random < 0.9) {
                return "skeleton";
            } else if (random < 0.97) {
                return "gorgon";
            } else if (random < 0.98) {
                return "ogre";
            } else if (random < 0.99) {
                return "necro";
            } else {
                return "knight";
            }
        } else if (levelType === "cemetary") {
            const random = Math.random();
            if (random < 0.3) {
                return "rat";
            } else if (random < 0.5) {
                return "skeleton";
            } else if (random < 0.6) {
                return "gorgon";
            } else if (random < 0.7) {
                return "harpy";
            } else if (random < 0.8) {
                return "demon";
            } else if (random < 0.82) {
                return "necro";
            } else {
                return "goblinShaman";
            }
        } else if (levelType === "cave") {
            const random = Math.random();
            if (random < 0.3) {
                return "rat";
            } else if (random < 0.5) {
                return "totem";
            } else if (random < 0.6) {
                return "goblin";
            } else if (random < 0.8) {
                return "goblinShaman";
            } else if (random < 0.9) {
                return "harpy";
            } else if (random < 0.98) {
                return "gorgon";
            } else {
                return "ogre";
            }
        } else if (levelType === "islands") {
            const random = Math.random();
            if (random < 0.3) {
                return "sandSlime";
            } else if (random < 0.5) {
                return "goblin";
            } else if (random < 0.6) {
                return "gorgon";
            } else if (random < 0.8) {
                return "goblinShaman";
            } else if (random < 0.98) {
                return "harpy";
            } else {
                return "ogre";
            }
        } else if (levelType === "city") {
            const random = Math.random();
            if (random < 0.4) {
                return "rat";
            } else if (random < 0.5) {
                return "harpy";
            } else if (random < 0.7) {
                return "skeleton";
            } else if (random < 0.8) {
                return "goblin";
            } else if (random < 0.9) {
                return "goblinShaman";
            } else if (random < 0.98) {
                return "demon";
            } else {
                return "knight";
            }
        } else {
            let billboardIndex = Math.round(Math.random() * (this.data.enemiesArray.length - 1));
            return this.data.enemiesArray[billboardIndex];
        }
    }

    getBillboardByLevelType(levelType) {
        if (levelType === "snow") {
            const random = Math.random();
            if (random < 0.6) {
                return "fir";
            } else if (random < 0.7) {
                return "rock";
            } else if (random < 0.9) {
                return "shrub";
            } else if (random < 0.95) {
                return "skullPile"
            } else {
                return "spookyTree"
            }
        } else if (levelType === "cave") {
            const random = Math.random();
            if (random < 0.6) {
                return "stalactite";
            } else if (random < 0.7) {
                return "rock";
            } else if (random < 0.9) {
                return "shrub";
            } else {
                return "skullPile"
            }
        } else if (levelType === "cemetary") {
            const random = Math.random();
            if (random < 0.6) {
                return "skullPile";
            } else if (random < 0.7) {
                return "rock";
            } else if (random < 0.9) {
                return "spookyTree";
            } else {
                return "shrub"
            }
        } else if (levelType === "islands") {
            const random = Math.random();
            if (random < 0.6) {
                return "palmTree";
            } else if (random < 0.7) {
                return "rock";
            } else if (random < 0.9) {
                return "sandPile";
            } else {
                return "shrub";
            }
        } else if (levelType === "city") {
            const random = Math.random();
            if (random < 0.5) {
                return "fir";
            } else if (random < 0.6) {
                return "rock";
            } else if (random < 0.7) {
                return "targetPractice";
            } else if (random < 0.8) {
                return "statue";
            } else if (random < 0.9) {
                return "shrub";
            } else if (random < 0.95) {
                return "fountain";
            } else {
                return "spookyTree";
            }
        } else {
            let billboardIndex = Math.round(Math.random() * (this.data.billboardsArray.length - 1));
            return this.data.billboardsArray[billboardIndex];
        }
    }

    getSkyboxByLevelType(levelType) {
        // Set Skyboxes
        if (levelType === "cemetary") {
            return document.getElementById("skybox_cemetary");
        } else if (levelType === "cave") {
            return document.getElementById("caveSkybox");
        } else {
            return document.getElementById('defaultskybox');
        }
    }

    getShadeColorByLevelType(levelType) {
        if (levelType === 'city') {
            return '#5f8e9c';
        } else if (levelType === 'cemetary') {
            return '#15362b';
        } else if (levelType === 'snow') {
            return '#3addf0'
        } else {
            return '#1d1c1f';
        }
    }

    getWallByLevelType(levelType) {
        if (levelType === 'city') {
            const randomWall = Math.random();
            if (randomWall < 0.65) {
                return 51;
            } else if (randomWall < 0.83) {
                return 52;
            } else {
                return 53;
            }
        } else if (levelType === 'cemetary') {
            let randomWall = Math.random();
            if (randomWall < 0.20) {
                return 63;
            } else if (randomWall < 0.40) {
                return 62;
            } else {
                return 61;
            }
        } else if (levelType === 'cave') {
            return 71;
        } else if (levelType === 'snow') {
            return 81;
        }
        else {
            return 50;
        }
    }

    getFloorByLevelType(levelType) {
        if (levelType === 'city') {
            const randomFloor = Math.random();
            if (randomFloor < 0.5) {
                return 2;
            } else {
                return 3;
            }                    
        } else if (levelType === 'cemetary') {
            const randomFloor = Math.random();
            if (randomFloor < 0.7) {
                return 5;
            } else {
                return 6;
            }    
        } else if (levelType === 'cave'){
            const randomFloor = Math.random();
            if (randomFloor < 0.7) {
                return 15;
            } else if (randomFloor < 0.8){
                return 16;
            } else {
                return 17;
            }
        } 
        else if (levelType === 'islands'){
            const randomFloor = Math.random();
            if (randomFloor < 0.3){
                return 11;
            } else if (randomFloor < 0.6){
                return 10;
            } else if (randomFloor < 0.7){
                return 7
            } else if (randomFloor < 0.8){
                return 8
            } else {
                return 9
            }
        } else if (levelType === 'snow') {
            const randomFloor = Math.random();
            if (randomFloor < 0.95) {
                return 12;
            } else {
                return 13;
            }
        }
         else {
            return 1;
        }
    }

    getHallwayFloorByLevelType(levelType) {
        return this.getFloorByLevelType(levelType);
    }   
}