const playBoard = document.querySelector(".play-board")
const scoreElement = document.querySelector(".score")
const highscoreElement = document.querySelector(".highscore")
const controls = document.querySelectorAll(".controls i")

let gameOver = false
let foodX, foodY
let snakeX = 5, snakeY = 5
let velocityX = 0, velocityY = 0
let snakeBody = []
let setIntervalId
let score = 0

//get highscore from local storage
let highscore = localStorage.getItem("highscore") || 0
highscoreElement.innerText = `High Score : ${highscore}`

//Pass a random between 1 and 30 as food position
const updateFoodPostion = () => {
    foodX = Math.floor(Math.random() * 30) + 1
    foodY = Math.floor(Math.random() * 30) + 1
}

const handleGameOver = () => {
    clearInterval(setIntervalId)
    alert("Game Over! Press OK to replay...")
    location.reload()
}

//change velocity value based on key press

const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0
        velocityY = -1
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0
        velocityY = 1
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1
        velocityY = 0
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1
        velocityY = 0
    }
}

//Change Direction on each key click

controls.forEach(button => button.addEventListener("click", () => changeDirection({key : button.dataset.key})))

const initGame = () =>{
    if (gameOver) return handleGameOver()
        let html = `<div class="food" style ="grid-area : ${foodY} / ${foodX}"></div>`

    //when snake eat the food
    if (snakeX === foodX && snakeY === foodY){
        updateFoodPostion()
        snakeBody.push([foodY, foodX]) //add food to snake body array
        score++
        highscore = score >= highscore ? score : highscore //if score > highscore => highscore = score

        localStorage.setItem("highscore", highscore)
        scoreElement.innerHTML = `Score : ${score}`
        highscoreElement.innerText = `High Score : ${highscore}`
    }

    //Update snake head
    snakeX += velocityX
    snakeY += velocityY

    //shift things forward values of element in snake body by one

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody [i - 1]
    }

    snakeBody[0] = [snakeX, snakeY]

    //check snake is out of wall or not

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        return gameOver = true
    }

    //add div for each part of the body

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class = "head" style = "grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`
        
        //check snake head hit body or not
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] ===snakeBody[i][0]){
            gameOver = true
        }
    }

    playBoard.innerHTML = html
}

updateFoodPostion();
setIntervalId = setInterval(initGame, 100)
document.addEventListener("keyup", changeDirection)