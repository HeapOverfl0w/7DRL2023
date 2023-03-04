class LevelFactory
{
    constructor(data) {
        this.data = data;
    }

    generateLevel() {
        const floor = 1;
        const floorWithCeiling = 15;
        const wall = Math.random() > 0.5 ? 50 : 51;
        const water = 30;
        const levelWidth = Math.round(Math.random() * 150) + 100;
        const levelHeight = Math.round(Math.random() * 150) + 100;
        let levelArray = new Array(levelWidth);

        let levelType = Math.random();
        if (levelType < 0.3) {
            levelType = "inside";
        } else if (levelType > 0.6) {
            levelType = "islands";
        } else {
            levelType = "outside";
        }

        for(let x = 0; x < levelWidth; x++) {
            levelArray[x] = new Array(levelHeight);
            for(let y = 0; y < levelHeight; y++) {
                levelArray[x][y] = 0;
            }
        }

        //generate rooms
        let roomCount = Math.round(Math.random() * 7) + 2;
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
                    levelArray[x][y] = levelType === "inside" ? floorWithCeiling : floor;
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
                        levelArray[x][y] = levelType === "inside" ? floorWithCeiling : floor;
                    }
                }
            }

            let yHallwayStep = ((roomTwo.yStart - roomOne.yStart)/Math.abs(roomTwo.yStart - roomOne.yStart));
            if (yHallwayStep !== Number.NaN) {
                let hallwayLength = Math.round(Math.random() * 4) + 1;
                for(let y = roomOne.yStart; y != roomTwo.yStart; y += yHallwayStep) {
                    for(let x = roomTwo.xStart; x <= roomTwo.xStart + hallwayLength; x++) {
                        levelArray[x][y] = levelType === "inside" ? floorWithCeiling : floor;
                    }
                }
            } 
        }

        if (levelType !== "islands") {
            //add walls
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
                        levelArray[x][y] = wall;
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
        const billboardCount = Math.round(Math.random() * 60);
        const billboards = [];
        for(let b = 0; b < billboardCount; b++) {
            let billboardIndex = Math.round(Math.random() * (this.data.billboardsArray.length - 1));
            let billboard = { type: this.data.billboardsArray[billboardIndex], x: 0, y: 0 };
            this.placeBillboard(billboard, levelArray);
            billboards.push(billboard);
        }

        //add random enemies
        const enemyCount = Math.round(Math.random() * 5);
        const enemies = [];
        for(let b = 0; b < enemyCount; b++) {
            let enemyIndex = Math.round(Math.random() * (this.data.enemiesArray.length - 1));
            let enemy = { type: this.data.enemiesArray[enemyIndex], x: 0, y: 0 };
            this.placeBillboard(enemy, levelArray);
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

        let teleport = {type: "portal", x: farthestDistanceRoom.xStart + Math.random() * farthestDistanceRoom.width, y: farthestDistanceRoom.yStart + Math.random() * farthestDistanceRoom.height};

        let result = new Level(levelArray, rooms[0].xStart + 1, rooms[0].yStart + 1, document.getElementById("defaultskybox"), true, "#1d1c1f", 
            billboards,
            enemies,
            [], [], [teleport]);

        result.loadData(this.data);

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

        billboard.x = x;
        billboard.y = y;
    }
}