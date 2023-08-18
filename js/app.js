
// Board elements
const grid = document.querySelector('.grid')

// Player Screen
const startButton = document.querySelector('.start-button')
const playerScreen = document.querySelector('.player-screen')


// Game Over Screen
const restartButton = document.querySelector('.restart-button')
const gameOverScreen = document.querySelector('.game-over')

// You Win Screen
const playAgainButton = document.querySelector('.play-again')
const youWinScreen = document.querySelector('.you-win-screen')

// Lives
const livesDisplay = document.querySelector('#display-lives')


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

// Storing the array of cells as [row[], row[]]
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
    5: 'obstacle-2',
    6: 'obstacle-3'

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
    
      const cell = document.createElement('DIV')
      cell.classList.add('cell')
      cell.style.width = `${100 / width}%`
      cell.style.height = `${100 / height}%`
      const index = y * width + x 
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
  const lastCell = rows[rows.length-1][4]
  playerTracking.x = 4
  playerTracking.y = rows.length -1
  playerTracking.divReference = rows[rows.length-1][4]
  lastCell.classList.add('character')
 }

 const resetCharacter = () => {
  playerTracking.divReference.classList.remove('character')
  livesDisplay.innerHTML =  playerTracking.lives ? '❤️'.repeat( playerTracking.lives) : '💔'
  
  addCharacter()
 }

function moveCharacter(e){
  // Keep track of where the player has gone:
  // If the character would go off the grid, don't do anything:
  const key = e.keyCode

  // If they are at the top, then don't move:
  if (playerTracking.y === 0) return 

 

if (key === 38) {
  console.log('Up')
  // If going up we want to decrease y by 1
  const newGridCell = rows?.[playerTracking.y - 1]?.[playerTracking.x]
  if (newGridCell) {
    // Before moving the player, remove the class:
    playerTracking.divReference.classList.remove('character')
    playerTracking.y -= 1
    playerTracking.divReference = newGridCell 
    playerTracking.divReference.classList.add('character')

  }

} else if (key === 40) {
  console.log('down')
  const newGridCell = rows?.[playerTracking.y + 1]?.[playerTracking.x]
  if (newGridCell) {
    // Before moving the player, remove the class:
    playerTracking.divReference.classList.remove('character')
    playerTracking.y += 1
    playerTracking.divReference = newGridCell 
    playerTracking.divReference.classList.add('character')

  }
  // If going down increase y by 1
} else if (key === 37) {
  console.log('left')
  const newGridCell = rows?.[playerTracking.y]?.[playerTracking.x -1]
  if (newGridCell) {
    // Before moving the player,remove the class:
    playerTracking.divReference.classList.remove('character')
    playerTracking.x -= 1
    playerTracking.divReference = newGridCell 
    playerTracking.divReference.classList.add('character')

  }
  // If going to the left decreasing x by 1

} else if (key === 39) {
  const newGridCell = rows?.[playerTracking.y]?.[playerTracking.x +1]
  if (newGridCell) {
    // Before moving the player, remove the class:
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
const obstacles = addObstacles(rows, [1, 3, 5, 8, 1, 3, 5, 7, 8, 5, 7, 5, 3, 2, 4, 6, 8], [1, 1, 1, 1, 3, 3, 3, 3, 5, 5, 5, 5, 5, 6, 6, 6, 6])
// const obstacles = addObstacles(rows, [1, 3], [1, 1])
document.addEventListener('keydown', moveCharacter)
console.log(obstacles)

function collisionDetection() {

  if (playerTracking.y === 0) {
    // Hide grid and show the player screen:
    youWinScreen.style.display = 'flex'
    grid.style.display = 'none'
  }


  if (detectPlayerOnAnyObstacle(playerTracking, obstacles)) {
      // Handle the collision
      console.log("Collision detected!");

      // You can reduce the player's lives or take some other action:
      playerTracking.lives -= 1;

      // Delete the current cell that has the playerTracking in it.
      resetCharacter()

      if (playerTracking.lives <= 0) {
          console.log("Game Over!");
          // Hide the the grid
          // Show gameOver screen
          gameOverScreen.style.display = 'flex'
          grid.style.display = 'none'

          clearInterval(collisionInterval);
          // Optionally stop other intervals or game loops, display an end-game screen, etc.
      }
  }
}

rows[0].map((val) => {
  val.style.backgroundImage= 'url(../images/arctic.jpg)'
//  val.style.background = 'cover'
})

rows[1].map((val) => {
  val.style.background = '#9AD7F5'
})

rows[7].map((val) => {
  val.style.background = 'url(../images/realsnow.jpg)'
})

rows[5].map((val) => {
  val.style.background = '#F3FAFF'
})

rows[3].map((val) => {
  val.style.background = '#26658E '
})

rows[2].map((val) => {
  val.style.background = 'url(../images/realsnow.jpg)'
})

rows[4].map((val) => {
  val.style.background = 'url(../images/realsnow.jpg)'
})

rows[6].map((val) => {
  val.style.background = '#FDFEFF'
})

let collisionInterval; 
collisionInterval = setInterval(collisionDetection, 100); // Check for collision every 100ms



startButton.addEventListener('click', () => {
//  display: none for the player screen
// display: flex for grid
playerScreen.style.display = 'none'
grid.style.display = 'flex'

function playAudio() {
  new Audio("sounds/Wintervillage.mp3").play()
}
playAudio()

const intervalId = setInterval (playAudio, 70000)

})

restartButton.addEventListener('click', () => {
//  display: none for the player screen
//  display: none for the gameOver screen
//  display: flex for the grid
playerScreen.style.display = 'none'
gameOverScreen.style.display = 'none'
grid.style.display = 'flex'
// Change the lives to 3:
playerTracking.lives = 3

// Add the setInterval function:
collisionInterval = setInterval(collisionDetection, 100);

resetCharacter ()
})

playAgainButton.addEventListener('click', () => {
  //  display: none for the player screen
 //  display: none for the gameOver screen
youWinScreen.style.display = 'none'
gameOverScreen.style.display = 'none'
grid.style.display = 'flex'

playerTracking.lives = 3

// Add the setInterval function:
collisionInterval = setInterval(collisionDetection, 100);

resetCharacter ()
})


