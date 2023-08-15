
// Board elements
const grid = document.querySelector('.grid')

// Global variables
const width = 9
const height = 8
const cellCount = width * height
const cells = []
// Track where the player has been:
const playerTracking = {
  x: null,
  y: null,
  divReference: null,
  lives: 3
}
const isCharacterPlaying = true

// Storing the 2D array of cells
const rows = []


function detectPlayerOnAnyObstacle(player, obstacles = []) {
  // Loop over every obstacle and if any of the obstacles have the
  //  same x and same y positions as the player, return True
  return obstacles.some((value, index, array) => {
    if (value.y === player.y && value.x === player.x) return true
    return false
  })
}

// Make a single obstacle:
function addObstacle(rows, x, y) {
  // Try and get a rows position:
  const cell = rows[y][x]
  const mapping = {
    0: 'obstacle-0',
    1: 'obstacle-1',
    3: 'obstacle-0',
    5: 'obstacle-1',
  }

  if (cell) {
    const obstacle = {
      x: x, 
      y: y,
      class: mapping[y],
      divReference: cell
    }
    obstacle.divReference.classList.add(obstacle.class)
    // Add a setInterval
    obstacle.moveObstacle = setInterval( () => {
      // Move the obstacle to the left:
      const newCell = rows[obstacle.y][obstacle.x - 1]
      obstacle.divReference.classList.remove(obstacle.class)
      if (!newCell) {
        // It is undefined:
        const furthestRightCell = rows[obstacle.y][width - 1]
        obstacle.divReference =  furthestRightCell
        obstacle.x = width - 1
        obstacle.divReference.classList.add(obstacle.class)
      }
      else {
        obstacle.divReference = newCell
        obstacle.x = obstacle.x - 1
        obstacle.divReference.classList.add(obstacle.class)
      }
     

      // If the left gives us undefined, then move it completely to the right
      console.log('yayyy!')
    }, 500)



    return obstacle
  }
}

// Make multiple obstacles:
function addObstacles(rows, xValues, yValues) {
  const obstacles = []
  for (const index in xValues) {
    const obstacle = addObstacle(rows, xValues[index], yValues[index])
    obstacles.push(obstacle)
  }
  return obstacles
}



function generateGrid() {
  // Clear the grid HTML for regeneration of a grid of cells
  grid.innerHTML = ''

  // Iterating over the height and width to generate rows and cells
  for(let y = 0; y < height; y++){
    // Create a new row array for every iteration of height
    const currentRow = []
    for(let x = 0; x < width; x++){
      // Create a div
      const cell = document.createElement('DIV')
      // Give the div a class of "cell"
      cell.classList.add('cell')
      // Set the width to be a percentage of the width
      cell.style.width = `${100 / width}%`
      // Set the height to be a percentage of the height
      cell.style.height = `${100 / height}%`
      // Add data index
      const index = y * width + x // Calculate the 1D index
      cell.dataset.index = index
      // Add the new cell to the grid container
      grid.append(cell)
      // Add newly created cell to our cells array, so later we have access to it
      cells.push(cell)
      // Add the cell to the current row array
      currentRow.push(cell)
    }
    // After iterating over the width, add the currentRow to the rows array
    rows.push(currentRow)
  }
}



function addCharacter() {
  const lastCell = rows[rows.length-1][8]
  playerTracking.x = 8
  playerTracking.y = rows.length -1
  playerTracking.divReference = rows[rows.length-1][8]
  lastCell.classList.add('character')
 }

function moveCharacter(e){
  // Keep track of where we've gone:
  // If the character would go off the grid, don't do anything:
  const key = e.keyCode

if (key === 38) {
  // If we're going up we want to decrease y by 1
  const newGridCell = rows?.[playerTracking.y - 1]?.[playerTracking.x]
  if (newGridCell) {
    // Before moving the player, let's remove the class:
    playerTracking.divReference.classList.remove('character')
    playerTracking.y -= 1
    playerTracking.divReference = newGridCell 
    playerTracking.divReference.classList.add('character')

  }

} else if (key === 40) {
  console.log('down')
  const newGridCell = rows?.[playerTracking.y + 1]?.[playerTracking.x]
  if (newGridCell) {
    // Before moving the player, let's remove the class:
    playerTracking.divReference.classList.remove('character')
    playerTracking.y += 1
    playerTracking.divReference = newGridCell 
    playerTracking.divReference.classList.add('character')

  }
  // If we are going down increase y by 1
} else if (key === 37) {
  const newGridCell = rows?.[playerTracking.y]?.[playerTracking.x -1]
  if (newGridCell) {
    // Before moving the player, let's remove the class:
    playerTracking.divReference.classList.remove('character')
    playerTracking.x -= 1
    playerTracking.divReference = newGridCell 
    playerTracking.divReference.classList.add('character')

  }
  // If we're going to the left decreasing x by 1
  console.log('left')
} else if (key === 39) {
  const newGridCell = rows?.[playerTracking.y]?.[playerTracking.x +1]
  if (newGridCell) {
    // Before moving the player, let's remove the class:
    playerTracking.divReference.classList.remove('character')
    playerTracking.x += 1
    playerTracking.divReference = newGridCell 
    playerTracking.divReference.classList.add('character')
  }

  console.log('right')
  // If we're going to increase x by 1
} else {
 console.log('Invalid')
}
}

generateGrid()
addCharacter()
// addObstacle(rows, 1, 1)
const obstacles = addObstacles(rows, [1, 3, 5, 8, 1], [1, 1, 1, 1, 3])
document.addEventListener('keyup', moveCharacter)
console.log(obstacles)

function collisionDetection() {
  console.log(playerTracking.lives)


  if (detectPlayerOnAnyObstacle(playerTracking, obstacles)) {
      // Handle the collision
      console.log("Collision detected!");

      // You can reduce the player's lives or take some other action:
      playerTracking.lives -= 1;

      // Delete the current cell that has the playerTracking in it.
      playerTracking.divReference.classList.remove('character')

      addCharacter()

      if (playerTracking.lives <= 0) {
          console.log("Game Over!");
          clearInterval(collisionInterval);
          // Optionally stop other intervals or game loops, display an end-game screen, etc.
      }
  }
}

let collisionInterval; 

if (isCharacterPlaying) {
  collisionInterval = setInterval(collisionDetection, 100); // Check for collision every 100ms
}


