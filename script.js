//Select the necessary DOM for the game
const playBoard = document.querySelector(".play-board") //play area
const scoreElement = document.querySelector(".score") //to display the score
const highscoreElement = document.querySelector(".highscore") // to display highscore
const controls = document.querySelectorAll(".controls i") //control button

let gameOver = false //game state
let foodX, foodY //food position
let snakeX = 5, snakeY = 5 //snake starting postion
let velocityX = 0, velocityY = 0 //snake movement direction
let snakeBody = [] //array to store snake body
let setIntervalId //to store the interval ID
let score = 0 //initial score

//get highscore from local storage or set 0
let highscore = localStorage.getItem("highscore") || 0
highscoreElement.innerText = `High Score : ${highscore}`

//to update food position randomly
const updateFoodPostion = () => {
    foodX = Math.floor(Math.random() * 30) + 1 // X position
    foodY = Math.floor(Math.random() * 30) + 1 // Y position
}

//handle gameover
const handleGameOver = () => {
    clearInterval(setIntervalId) //stop the loop
    alert("Game Over! Press OK to replay...") 
    location.reload() //reload the page
}

//change velocity value based on key press(to change direction of snake)
const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) { //snake can't move down when moving to up
        velocityX = 0
        velocityY = -1
    } else if (e.key === "ArrowDown" && velocityY != -1) { //snake can't move up when moving to down
        velocityX = 0
        velocityY = 1
    } else if (e.key === "ArrowLeft" && velocityX != 1) { //snake can't move right when moving to left
        velocityX = -1
        velocityY = 0
    } else if (e.key === "ArrowRight" && velocityX != -1) { //snake can't move left when moving to right
        velocityX = 1
        velocityY = 0
    }
}

//Change Direction on each key click
controls.forEach(button => button.addEventListener("click", () => changeDirection({key : button.dataset.key})))

//main game loop 
const initGame = () =>{
    if (gameOver) return handleGameOver() //if gameover stop the game
        let html = `<div class="food" style ="grid-area : ${foodY} / ${foodX}"></div>` //place food on the board

    //when snake eat the food
    if (snakeX === foodX && snakeY === foodY){
        updateFoodPostion() //update the food postion
        snakeBody.push([foodY, foodX]) //add food to snake body array
        score++ 
        highscore = score >= highscore ? score : highscore //if score > highscore => highscore = score

        localStorage.setItem("highscore", highscore) //save highscore to local storage
        scoreElement.innerHTML = `Score : ${score}` //update score on display
        highscoreElement.innerText = `High Score : ${highscore}` //highscore also
    }

    //Update snake position
    snakeX += velocityX
    snakeY += velocityY

    // Move snake body forward (shift positions)
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody [i - 1]
    }

    snakeBody[0] = [snakeX, snakeY] //update the head of the snake

    //check snake is out of wall or not
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        return gameOver = true
    }

    //add 'div' for each part of the body
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class = "head" style = "grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`
        
        //check snake head hit body or not
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] ===snakeBody[i][0]){
            gameOver = true
        }
    }

    playBoard.innerHTML = html //render the snake and food on the board
}

updateFoodPostion(); //initialize food postion
setIntervalId = setInterval(initGame, 100) //start the game with 100ms interval
document.addEventListener("keyup", changeDirection) //listen for keyboard input to change direction


//~ setIntervalID ~
//The 'setInterval' function repeatedly calls the initGame function every 100 milliseconds.
//This keeps the game running, updating the snake's movement, checking for collisions, and redrawing the game board.