import {objDice} from "./dice.js"

/* Explanation of variables: playerScore and computerScore keep track of their respective
scores. diceHTML stores and keeps the html needed to render each dice roll available.
isPlayersTurn keeps track of who's turn it is. Frozen count keeps track of how many dice
are frozen to know when the game is over*/

let playerScore = 0
let computerScore = 0
let diceHTML = []
let isPlayersTurn = true;
let frozenCount= 0

document.getElementById("start-game-btn").addEventListener("click", startGame)
document.getElementById("roll").addEventListener("click", rollDice)
document.getElementById("play-again").addEventListener("click", playAgain)

/* This function swaps out the default html which explains the rules for five dice
containters and makes the roll button visible.*/
function startGame() {
    document.getElementById("dice").innerHTML = `
        <div class="die-container" id="dice-one"></div>
        <div class="die-container" id="dice-two"></div>
        <div class="die-container" id="dice-three"></div>
        <div class="die-container" id="dice-four"></div>
        <div class="die-container" id="dice-five"></div>
    `
    document.getElementById("roll").style.display = "block"
}

/* This function rolls the dice and sets their value in the object stored in dice.js.
it does this using a for loop that checks the dice's frozen status. If frozen the die's
value should not be changed. If the roll produces a 2 or a 5, that die's frozen status
is changed to true. The frozenCount is updated before tallyScore and renderDice are called.*/
function rollDice() {
    for (let i = 0; i < 5; i++) {
        let dieID = "die" + i
        if (objDice[dieID].isFrozen === false) {
            objDice[dieID].rollValue = Math.floor(Math.random() * 5) + 1
            if (objDice[dieID].rollValue === 2 || objDice[dieID].rollValue === 5) {
                objDice[dieID].isFrozen = true;
                isPlayersTurn && frozenCount++
                !isPlayersTurn && frozenCount--
        }}
    }
        tallyScore()
        renderDice()
}

/* This function creates the html needed to render the dice roll and then proceeds to
set the inner HTML of the proper div.*/
function renderDice() {
    diceHTML = []
    for (let i = 0; i < 5; i++) {
        let dieID = "die" + i
        diceHTML += `<div id="${dieID}"class="die-div ${objDice[dieID].isFrozen ? 'frozen' : 'not-frozen'}">
                 <p class="die-text" id="text-${dieID}">${objDice[dieID].rollValue}</p>
             </div>`
    }
    document.getElementById("dice").innerHTML = diceHTML
}

/* This function uses a for loop to cycle over the data stored in dice.js to add points
to the player's or computer's score, and renders those scores It checks the frozen status
of each die and then add the value to the total points if the frozen status is false. It
also ends the player's turn when all dice are frozen.*/
function tallyScore() {
    if (isPlayersTurn) {
        for (let i=0; i < 5; i++) {
            let dieID = "die" + i
            if (objDice[dieID].isFrozen === false) {
                playerScore += objDice[dieID].rollValue
                document.getElementById("player-score").textContent = playerScore
            }
        }
    } else {
        for (let i=0; i < 5; i++) {
            let dieID = "die" + i
            if (objDice[dieID].isFrozen === false) {
                computerScore += objDice[dieID].rollValue
                document.getElementById("computer-score").textContent = computerScore 
            }
        }
    }
    if (frozenCount === 5 && isPlayersTurn) {
        endPlayersTurn()}
    
}

/* This function ends the players turn by resetting the frozen status in dice.js, changes
the value of isPlayersTurn to false and removes the visibility of the roll button. Then
it calls the computersTurn function. */

function endPlayersTurn() {
    for(let i = 0; i < 5; i++){
        let dieID = "die" + i
        objDice[dieID].isFrozen = false
    }
    isPlayersTurn = false;
    document.getElementById("roll").style.display = "none"
    computersTurn()
}


/* This function is in charge of the players turn. I would like to improve the user
experience in this function by slowing it down, but I need to do more research on how
to do that. */

function computersTurn() {
    while (frozenCount > 0) {
    rollDice()}
    setTimeout(endGame, 500)
}

/* This function ends the game by displaying text to the user about whether they won
or not. It also makes the play again button visisble */

function endGame() {
    let result = ""

    if (playerScore === computerScore) {
        result = `<p class="result">It's a tie!</>`
    } else if (playerScore > computerScore) {
        result = `<p class="result">Woohoo! You won with ${playerScore} points! The computer scored ${computerScore}.</p>`
        document.getElementById("player-score-div").style.backgroundColor = "#9CF6FB"
    } else {
        result = `<p class="result">Better luck next time. The computer won with a score of ${computerScore}. You scored ${playerScore}.</p>`
        document.getElementById("computer-score-div").style.backgroundColor = "#9CF6FB"
    }
    document.getElementById("display-results").innerHTML = result
    document.getElementById("play-again").style.display = "block"
}

/*This function is called when the play again button is clicked. It resets all the 
variables, the HTML and the data stored in dice.js. It then renders the page to reflect
the reset. */

function playAgain() {
    playerScore = 0
    computerScore = 0
    diceHTML = []
    isPlayersTurn = true
    frozenCount= 0
    document.getElementById("display-results").innerHTML = ""
    document.getElementById("play-again").style.display = "none"
    document.getElementById("roll").style.display = "block"
    document.getElementById("computer-score").textContent = computerScore 
    document.getElementById("player-score").textContent = playerScore
    document.getElementById("computer-score-div").style.backgroundColor = "#E5B9A8"
    document.getElementById("player-score-div").style.backgroundColor = "#E5B9A8"
    for(let i = 0; i < 5; i++){
        let dieID = "die" + i
        objDice[dieID].isFrozen = false
        objDice[dieID].rollValue = 0
    }
    renderDice()
}