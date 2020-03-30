const height = 20;
const width = 10;

const oneFourFigure = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
]

const twoTwoFigure = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
]

const snakeFigure = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
]

const cornerFigure = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 1],
    [0, 1, 1, 1],
]

const batmanStand = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 1],
]

const figures = [oneFourFigure, twoTwoFigure, snakeFigure, cornerFigure, batmanStand];


var leaderBoard = []
var currentUserName = null;
var currentUserScore = null;


var isGameStarted = false;
var gameField = null;
var figurePosition = { height: 0, width: 4 }
var currentFigure = null


document.addEventListener('DOMContentLoaded', function () {
    initGame()
    drawField(gameField)
    redrawLeaderBoard()
    redrawScore()
    document.addEventListener("keydown", keyProcessor)
    document.querySelector("#input_form").addEventListener("submit", startGame)
});

const startGame = (event) => {
    event.preventDefault();
    if (isGameStarted) {
        return false
    } else {
        initGame()
        currentUserName = event.target.name.value;
        isGameStarted = true;
        currentUserScore = 0;
        figurePosition = { height: 0, width: 5 }
        currentFigure = generateFigure()
        setTimeout(nextTick, 1000)
    }
}

const drawField = (gameField) => {
    document.querySelector("#main").innerHTML = gameField.map((item) => {
        return `<div class="row">${item.map(item => {
            return `<div class="block ${item ? "colored" : ""}"></div>`
        }).join("")}</div>`
    }).join("")
}

const addToLeaderBoard = (name, score) => {
    leaderBoard = [...leaderBoard, { name, score }].sort((a, b) => b.score - a.score).slice(0, 10);
}

const initGame = () => {
    gameField = [...Array(height).keys()].map(item => [...Array(width).keys()].map(item => 0));
}

const redrawLeaderBoard = () => {
    document.querySelector("#leader_board").innerHTML = leaderBoard.map((item, index) => {
        return `<div>${index + 1}. ${item.name}: ${item.score}</div>`
    }).join("")
}

const redrawScore = () => {
    document.querySelector("#score").innerHTML = `Score: ${String(currentUserScore || 0)}`
}

const keyProcessor = (event) => {
    if (isGameStarted) {
        if (event.keyCode == 37) {
            moveFigureLeft()
        }
        if (event.keyCode == 38) {
            rotateFigure()
        }
        if (event.keyCode == 39) {
            moveFigureRight()
        }
        if (event.keyCode == 40) {
            moveFigureBellow()
        }
    }
}


const moveFigureLeft = () => {
    if (checkIsPossibleMoveLeft()) {
        figurePosition.width -= 1;
    }
}
const moveFigureRight = () => {
    if (checkIsPossibleMoveRight()) {
        figurePosition.width += 1;
    }
}
const rotateFigure = () => {
    if (checkIsPossibleRotate()) {
        currentFigure = rotate(currentFigure);
    }
}
const moveFigureBellow = () => {
    if (!checkIsStopped()) {
        figurePosition.height += 1;
    } else {

    }
}

const removeFullLines = () => {
    const linesToRemove = gameField.reduce((acc, curr, index) => curr.every(item => item) ? [...acc, index] : acc, []);

    const additionalTopLines = linesToRemove.map(item => [...(Array(10).keys())].map(item => 0));
    const gameLinesWithoutRemoved = [
        ...gameField.slice(0, [linesToRemove[0]]),
        ...[...linesToRemove.map((rowNumber, index) => index ?
            gameField.slice(linesToRemove[index - 1], rowNumber) : []).flat()],
        ...gameField.slice(linesToRemove[linesToRemove.length - 1] + 1, height)]

    gameField = [
        ...additionalTopLines,
        ...gameLinesWithoutRemoved]

    return linesToRemove.length;
}
const generateFigure = () => {
    return figures[Math.floor(Math.random() * figures.length)]
}

const drawFieldWithFigure = () => {
    const tmpField = gameField.map(arr => arr.map(item => item));
    currentFigure.forEach((row, height) => row.map((item, width) => tmpField[height + figurePosition.height][width + figurePosition.width] = item || tmpField[height + figurePosition.height][width + figurePosition.width]))

    drawField(tmpField)
}
const moveFigureToField = () => {
    currentFigure.forEach((row, height) => row.map((item, width) => item ? gameField[height + figurePosition.height][width + figurePosition.width] = item : {}));
 }

const checkIsStopped = () => {
    return currentFigure.some((row, curHeight) => row.some((val, curWidth) => {
        return val ? (curHeight + figurePosition.height + 1 === height ? true : !!gameField[curHeight + figurePosition.height + 1][curWidth + figurePosition.width]) : false;
    }))
}
const checkIsGameOver = () => {
    return gameField[2].slice(4, 7).some(item => item);
}
const checkIsPossibleMoveLeft = () => { 
    return currentFigure.every((row, curHeight) => row.every((val, curWidth) => {
        return val ? (curWidth + figurePosition.width === 0 ? false : !gameField[curHeight + figurePosition.height][curWidth + figurePosition.width - 1]) : true;
    }))
}
const checkIsPossibleMoveRight = () => {
    return currentFigure.every((row, curHeight) => row.every((val, curWidth) => {
        return val ? (curWidth + figurePosition.width + 1 === width ? false : !gameField[curHeight + figurePosition.height][curWidth + figurePosition.width + 1]) : true;
    }))
}
const checkIsPossibleRotate = () => {
    const tmpFigure = rotate(currentFigure);

    return tmpFigure.every((row, curHeight) => row.every((item, curWidth) => {
        return !item ? true 
                : curHeight + figurePosition.height >= height ? false 
                : curWidth + figurePosition.width < 0 || curWidth + figurePosition.width >= width ? false
                : !gameField[curHeight + figurePosition.height][curWidth + figurePosition.width]  
    }))
}

const gameOverProcessing = () => {
    isGameStarted = false;
    addToLeaderBoard(currentUserName, currentUserScore)    
    currentUserName = null;
    currentUserScore = null;
    redrawLeaderBoard()
}



const rotate = (matrix) => {          
    var newCurrent = [];
    for (var y=0; y<4; y++) {
    newCurrent[y] = [];
    for (var x=0; x<4; x++) newCurrent[y][x]=matrix[3-x][y];
    }
    return newCurrent;
}

const nextTick = () => {
    if (checkIsStopped()) {
        moveFigureToField()
        
        const additionalScore = removeFullLines();

        currentUserScore += additionalScore * 100;
        redrawScore();

        if(checkIsGameOver()) {
            gameOverProcessing()
        } else {
            currentFigure = generateFigure()
            figurePosition = {height: 0, width: 4}
            setTimeout(nextTick, 300 - Math.log(currentUserScore + 1))
        }
    } else {
        moveFigureBellow()
        setTimeout(nextTick, 300 - Math.log(currentUserScore + 1))
    }
    drawFieldWithFigure()
}