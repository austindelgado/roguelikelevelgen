// Find a way to handle dynamic resizing
let height = Math.floor(window.screen.availHeight / 30);
let width = Math.floor(window.screen.availWidth / 25);

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
const numWalkers = 5;
const chanceWalkerTurn = .25;

for (let i = 0; i < numWalkers; i++)
{
    // Starting walker pos
    currWalker = new Walker(startingX, startingY, getRandomDir());
    console.log(currWalker);

    cellArray[currWalker.posY][currWalker.posX].classList.add("floor");

    // Limit walker to 50 steps
    for (let j = 0; j < 50; j++)
    {
        if (currWalker.dir == 0)
        {
            currWalker.posY++;
        }
        else if (currWalker.dir == 1)
        {
            currWalker.posX++;
        }
        else if (currWalker.dir == 2)
        {
            currWalker.posY--;
        }
        else // Dir == 3
        {
            currWalker.posX--;
        }

        // Need these checks before moving pos
        // Mark move
        if (currWalker.posY > 0 && currWalker.posY < height && currWalker.posX > 0 && currWalker.posX < width)
            cellArray[currWalker.posY][currWalker.posX].classList.add("floor");

        // Roll to change
        if (Math.random() < chanceWalkerTurn)
        {
            // Pick new direction
            currWalker.dir = getRandomDir();
        }
    }
}

function getRandomDir() {
    return Math.floor(Math.random() * 3);
  }
