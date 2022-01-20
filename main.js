// Find a way to handle dynamic resizing
let height = 30;
let width = 30;

const grid = document.getElementById('grid');

// Create grid based off screen size
let cellArray = new Array(height); // Create 2d array for the grid, probably not best practice
for (let y = 0; y < height; y++)
{
    // New table row
    let row = document.createElement('tr');
    cellArray[y] = new Array(width);

    for (let x = 0; x < width; x++)
    {
        // New col in row
        let id = y * width + x;
        let cell = document.createElement('td');
        cell.id = id;

        row.appendChild(cell);
        cellArray[y][x] = cell;
    }
    grid.appendChild(row);
}

// Please organize and clean up all X and Y
function Walker(x, y, dir) {
    this.posX = x;
    this.posY = y;
    this.dir = dir;
}

// Walker variables
let startingY = Math.round(height / 2);
let startingX = Math.round(width / 2);
let startingWalkers;
let maxWalkers;
let leftTurnChance;
let rightTurnChance;
let uTurnChance;
let walkerSpawnChance;
let walkerDeleteChance;
let bigRoomChance;
let maxFloor;
let floorNum = 0;

let walkers = [];

function WalkerSetup() 
{
    // Spawn starting walkers
    for (let i = 0; i < startingWalkers; i++)
        walkers.push(new Walker(startingX, startingY, Math.floor(Math.random() * 4)));
}

function FloorGen()
{
    let chestX, chestY, chestMax = 0;
    let ammoX, ammoY, ammoMax = 0;

    while (floorNum < maxFloor)
    {
        //Add floors
        walkers.forEach ((currWalker) => {
            if (!cellArray[currWalker.posY][currWalker.posX].classList.contains("floor"))
            {
                if (Math.random() < bigRoomChance)
                {
                    cellArray[currWalker.posY][currWalker.posX].classList.add("floor");
                    floorNum++;

                    if (currWalker.posY + 1 < height) 
                    {
                        cellArray[currWalker.posY + 1][currWalker.posX].classList.add("floor");
                        floorNum++;
                    }
                    
                    if (currWalker.posX + 1 < width)
                    {
                        cellArray[currWalker.posY][currWalker.posX + 1].classList.add("floor");
                        floorNum++;
                    }
                    
                    if (currWalker.posX + 1 < width && currWalker.posY + 1 < height)
                    {
                        cellArray[currWalker.posY + 1][currWalker.posX + 1].classList.add("floor");
                        floorNum++;
                    }

                    console.log("Adding 2x2 floor");
                }
                else
                {
                    cellArray[currWalker.posY][currWalker.posX].classList.add("floor");
                    floorNum++;
                    console.log("Adding floor");
                }
            }
        });
    
        // Chance to add walkers
        walkers.forEach ((currWalker) => {
            if (Math.random() < walkerSpawnChance)
            {
                walkers.push(new Walker(currWalker.posX, currWalker.posY));
                console.log("New walker");
                // Maybe limit this?
            }
        });
    
        // Chance to destory walkers
        walkers.forEach ((currWalker) => {
            if (Math.random() < walkerDeleteChance && walkers.length > 1)
            {
                walkers.splice(walkers.indexOf(currWalker, 1));
                console.log("Deleting walker");

                // Spawn ammo
                newAmmo = GetDistance(startingX, startingY, currWalker.posX, currWalker.posY);
                if (newAmmo > ammoMax && currWalker.posX != chestX && currWalker.posX != chestY)
                {
                    ammoMax = newAmmo;
                    ammoX = currWalker.posX;
                    ammoY = currWalker.posY;
                }
            }
        });
    
        // Chance to turn
        walkers.forEach ((currWalker) => {
            const rng = Math.random();
            console.log(rng);

            if (0 < rng < leftTurnChance)
            {
                console.log("Walker left turn");
                currWalker.dir--;
            }
            else if (leftTurnChance < rng < rightTurnChance + leftTurnChance)
            {
                console.log("Walker right turn");
                currWalker.dir++;
            }
            else if (rightTurnChance + leftTurnChance < rng < uTurnChance + leftTurnChance + rightTurnChance)
            {
                console.log("Walker u turn");
                currWalker.dir += 2;

                // Check chest distance on u-turn
                newChest = GetDistance(startingX, startingY, currWalker.posX, currWalker.posY);
                if (newChest > chestMax && currWalker.posX != ammoX && currWalker.posX != ammoY)
                {
                    chestMax = newChest;
                    chestX = currWalker.posX;
                    chestY = currWalker.posY;
                }
            }

            if (currWalker.dir > 3)
                currWalker.dir -= 4;
            else if (currWalker.dir < 0)
                currWalker.dir += 4;
        });
    
        // Move walkers
        walkers.forEach ((currWalker) => {
            if (currWalker.dir == 0 && currWalker.posY + 1 < height) 
            {
                currWalker.posY++;
            }
            else if (currWalker.dir == 1 && currWalker.posX + 1 < width)
            {
                currWalker.posX++;
            }
            else if (currWalker.dir == 2 && currWalker.posY - 1 > -1)
            {
                currWalker.posY--;
            }
            else if (currWalker.dir == 3 && currWalker.posX - 1 > -1)
            {
                currWalker.posX--;
            }
            console.log("Walker moving");
        });
    }

    if (chestX != 0 || chestY != 0)
        SpawnObject(chestX, chestY, 0);

    if (ammoX != 0 || ammoY != 0)
        SpawnObject(ammoX, ammoY, 1);
}

function SpawnObject(x, y, obj) 
{
    // 0 - Chest
    if (obj == 0)
    {
        console.log("Spawning Chest");
        cellArray[y][x].classList.add('chest');
    }
    else if (obj == 1)
    {
        console.log("Spawning Ammo");
        cellArray[y][x].classList.add('ammo');
    }
}

// Potentially change to a flood fill
function WallGen()
{
    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            if (cellArray[y][x].classList.contains("floor"))
            {
                if (y + 1 < height && !cellArray[y + 1][x].classList.contains("floor"))
                {
                    cellArray[y + 1][x].classList.add("wall");
                }
                if (x + 1 < width && !cellArray[y][x + 1].classList.contains("floor"))
                {
                    cellArray[y][x + 1].classList.add("wall");
                }
                if (y - 1 > -1 && !cellArray[y - 1][x].classList.contains("floor"))
                {
                    cellArray[y - 1][x].classList.add("wall");
                }
                if (x - 1 > -1 && !cellArray[y][x - 1].classList.contains("floor"))
                {
                    cellArray[y][x - 1].classList.add("wall");
                }
            }
        }
    }
}

function ClearLevel()
{
    // Remove all tiles
    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            cellArray[y][x].className = '';
        }
    }

    floorNum = 0;
    walkers = [];
}

function GrabValues()
{
    startingWalkers = document.getElementById('startWalkers').value;
    maxWalkers = document.getElementById('maxWalkers').value;
    leftTurnChance = parseFloat(document.getElementById('leftTurnChance').value);
    rightTurnChance = parseFloat(document.getElementById('rightTurnChance').value);
    uTurnChance = parseFloat(document.getElementById('uTurnChance').value);
    walkerSpawnChance = parseFloat(document.getElementById('spawnChance').value);
    walkerDeleteChance = parseFloat(document.getElementById('deleteChance').value);
    bigRoomChance = parseFloat(document.getElementById('bigRoomChance').value);
    maxFloor = document.getElementById('maxFloor').value;

    if (maxFloor > height * width)
        maxFloor = height * width;
}

function GetDistance(x1, y1, x2, y2)
{
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function GenerateNewLevel()
{
    ClearLevel();
    
    GrabValues();
    WalkerSetup();
    FloorGen();
    WallGen();
}

GrabValues();
WalkerSetup();
FloorGen();
WallGen();

// Grab button? Probably a better way to do this
document.getElementById("generate").onclick = GenerateNewLevel;