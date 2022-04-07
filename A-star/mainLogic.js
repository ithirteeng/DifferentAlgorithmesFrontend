import {createMaze} from "./createMaze.js";
alert("Настройте громкость звука")
playMusic()

let matrixSize = 30
let matrix = document.getElementById("matrix")
let cords = new Array(matrixSize)
let aStarMatrix = new Array(matrixSize)
/*
0 - clear cell
1 - wall
2 - start
3 - end
 */
let isStartButtonPressed = false;
let isFinisButtonPressed = false;
let lastButton = "";
let metrics = "Euclidean";

let isMouseDown = false;

let delay = 30;

function playMusic() {
    let music = document.createElement("audio");
    music.src = "music/a-star-music.m4a"
    music.autoplay = true;
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

document.querySelector('body').addEventListener("mouseup", function () {
    isMouseDown = false;
})

class Node {
    constructor(value, f, g, h, parentX, parentY) {
        this.value = value;
        this.f = f;
        this.h = h;
        this.g = g;
        this.parentX = parentX;
        this.parentY = parentY;
    }

    removeAll() {
        this.value = 0;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.parentX = 0;
        this.parentY = 0;
    }

}

let startCords = new Cell(0, 0);
let finishCords = new Cell(0, 0);

rangeViewer();
metricsDetermination();
buttonEventListener();
matrixCreation();
makeRandomMatrix();
await startFindingPath();

// Внешний вид
function rangeViewer() {
    document.getElementById("matrixSize").addEventListener("input", function () {
        document.getElementById("inputRangeViewer").textContent = document.getElementById("matrixSize").value;
    });
    document.getElementById("random").addEventListener("input", function () {
        document.getElementById("randomRangeViewer").textContent = document.getElementById("random").value;
    });
    document.getElementById("speedRange").addEventListener("input", function() {
        let string = document.getElementById("speedViewer").textContent;
        let counter = string.length - 1;
        while (string[counter] !== " ") {
            string = string.slice(0, -1);
            counter--;
        }
        delay = 10 * (10 - Number(document.getElementById("speedRange").value));
        string += document.getElementById("speedRange").value.toString();
        document.getElementById("speedViewer").textContent = string;
    })
}


// Создание матрицы + ее обновление
function matrixCreation() {
    createMatrix();
    createTableMatrix();
    updateMatrix();
}

function updateMatrix() {
    document.getElementById("matrixSize").addEventListener("mouseup", function () {
        matrixSize = Number(document.getElementById("matrixSize").value);
        startCords = new Cell(0, 0);
        finishCords = new Cell(0, 0);
        isFinisButtonPressed = false;
        isStartButtonPressed = false;
        lastButton = "";
        createMatrix();
        createTableMatrix();
    });
}

function createMatrix() {
    for (let i = 0; i < matrixSize; i++) {
        cords[i] = new Array(matrixSize);
        aStarMatrix[i] = new Array(matrixSize);
        for (let j = 0; j < matrixSize; j++) {
            aStarMatrix[i][j] = new Node(0, 0, 0, 0, 0, 0);
            cords[i][j] = 0;
        }
    }
}

function createTableMatrix() {
    matrix.innerHTML = "";
    matrix.visibility = false;
    let cellSize = matrix.width / matrixSize;

    for (let i = 0; i < matrixSize; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < matrixSize; j++) {
            let element = document.createElement('td');

            element.style.width = cellSize.toString();
            element.style.height = cellSize.toString();
            element.className = "elem";
            element.name = "cell";
            element.dataset.row = i.toString();
            element.dataset.col = j.toString();

            element.addEventListener("mousedown", function () {
                isMouseDown = true;
                pressOneCellEvent(element);
            });
            element.addEventListener("mouseover", function () {
                if(isMouseDown) {
                    pressOneCellEvent(element);
                }
            })

            element.addEventListener("mousedown", pressOneCellEvent);

            row.append(element);

        }
        matrix.append(row);
    }
}


// Очистка всего + рандомное заполнение
function makeRandomMatrix() {
    document.getElementById("randomButton").addEventListener("mousedown", function () {
        clearMatrix()
        let coefficient = +document.getElementById("random").value;
        for (let i = 0; i < matrixSize; i++) {
            let elements = document.querySelectorAll('td[data-row = "' + i + '"]');
            for (let j = 0; j < matrixSize; j++) {
                cords[i][j] = 0;
                aStarMatrix[i][j].value = 0;
                elements[j].classList.remove("wall");
                elements[j].classList.remove("start");
                elements[j].classList.remove("finish");

                if ((Math.floor(Math.random() * 100) + 1) <= coefficient) {
                    cords[i][j] = 1;
                    aStarMatrix[i][j].value = 1;
                    elements[j].classList.add("wall");
                }
            }
        }
    })

}

function clearMatrix() {
    startCords = new Cell(0, 0);
    finishCords = new Cell(0, 0);
    isFinisButtonPressed = false;
    isStartButtonPressed = false;
    lastButton = "";
    for (let i = 0; i < matrixSize; i++) {
        let elements = document.querySelectorAll('td[data-row = "' + i + '"]')
        for (let j = 0; j < matrixSize; j++) {
            cords[i][j] = 0;
            aStarMatrix[i][j].removeAll();
            elements[j].classList.remove("wall");
            elements[j].classList.remove("start");
            elements[j].classList.remove("finish");
            elements[j].classList.remove("currentCell");
            elements[j].classList.remove("path");
        }
    }
}


// Обработчики событий нажатия на кнопки
function buttonEventListener() {
    let buttons = document.querySelectorAll(".buttons");
    buttons.forEach(function (button) {
        button.addEventListener("mousedown", function () {
            if (button.id === "clearButton") {
                clearMatrix()
            } else if (button.id === "mazeButton") {
                clearMatrix()
                mazeCreation()
            } else {
                lastButton = button.innerText;
            }
        })

    });
}

function pressOneCellEvent(target) {
    let row = +(target.dataset.row);
    let col = +(target.dataset.col);
    if (lastButton !== "") {
        switch (lastButton) {
            case "Start":
                target.classList.remove("currentCell")
                target.classList.remove("path")
                if (!isStartButtonPressed) {
                    if (cords[row][col] !== 1 && cords[row][col] !== 3) {
                        isStartButtonPressed = true;

                        target.classList.add("start");
                        cords[row][col] = 2;
                        startCords.x = col;
                        startCords.y = row;
                    } else {
                        isMouseDown = false;
                        alert("This is the wall!");
                    }
                } else {
                    if (cords[row][col] !== 1 && cords[row][col] !== 3) {
                        let lastCell = document.getElementsByClassName("start");
                        let lastX = Number(lastCell[0].dataset.col)
                        let lastY = Number(lastCell[0].dataset.row)
                        lastCell[0].classList.remove("start");
                        cords[lastY][lastX] = 0

                        target.classList.add("start");
                        cords[row][col] = 2;
                        startCords.x = col;
                        startCords.y = row;
                        console.log(startCords.x + "  " + startCords.y)
                    } else {
                        isMouseDown = false;
                        alert("This is the wall!");
                    }
                }
                break;
            case "Finish":
                target.classList.remove("currentCell")
                target.classList.remove("path")
                if (!isFinisButtonPressed) {
                    if (cords[row][col] !== 1 && cords[row][col] !== 2) {
                        isFinisButtonPressed = true;
                        target.classList.add("finish");
                        cords[row][col] = 3;
                        finishCords.x = col;
                        finishCords.y = row;
                    } else {
                        isMouseDown = false;
                        alert("This is the wall!");
                    }
                } else {
                    if (cords[row][col] !== 1 && cords[row][col] !== 2) {
                        let lastCell = document.getElementsByClassName("finish");
                        let lastX = Number(lastCell[0].dataset.col)
                        let lastY = Number(lastCell[0].dataset.row)
                        lastCell[0].classList.remove("finish");
                        cords[lastY][lastX] = 0
                        aStarMatrix[lastY][lastX].value = 0;
                        target.classList.add("finish");
                        cords[row][col] = 3;
                        finishCords.x = col;
                        finishCords.y = row;
                    } else {
                        isMouseDown = false;
                        alert("This is the wall!");
                    }
                }
                break;
            case "Delete wall":
                if (cords[row][col] === 1 || cords[row][col] === 0) {
                    target.classList.remove("wall");
                    cords[row][col] = 0;
                    aStarMatrix[row][col].value = 0;
                } else {
                    isMouseDown = false;
                    alert("Yo can't do it!");
                }
                break;
            case "Create wall":
                target.classList.remove("currentCell")
                target.classList.remove("path")
                if (cords[row][col] === 0 || cords[row][col] === 1) {
                    event.target.classList.add("wall");
                    cords[row][col] = 1;
                    aStarMatrix[row][col].value = 1;
                } else {
                    isMouseDown = false;
                    alert("You can't do it!");
                }
                break;
        }
    }
}

function changeButtonsEnabling(mode) {
    let buttons = document.querySelectorAll("button")
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = !!mode;

    }
    let ranges = document.querySelectorAll("input")
    for (let i = 0; i < ranges.length; i++) {
        if (ranges[i].id != "speedRange") {
            ranges[i].disabled = !!mode;
        }
    }
}

function metricsDetermination() {
    let radios = document.querySelectorAll('input[type=radio]');
    for (let i = 0; i < radios.length; i++) {
        radios[i].addEventListener("click", function() {
            if (radios[i].checked) {
                metrics = radios[i].value;
                console.log(metrics);
            }
        })
    }
}

// Создание лабиринта
function mazeCreation() {
    cords = createMaze(cords, matrixSize)
    drawMaze()
}

function drawMaze() {
    let check = false;
    if (matrixSize % 2 === 0) {
        check = true;
    }
    for (let i = 0; i < matrixSize; i++) {
        let elements = document.querySelectorAll('td[data-row = "' + i + '"]');
        for (let j = 0; j < matrixSize; j++) {
            if (cords[i][j] === 1) {
                aStarMatrix[i][j].value = 1;
                elements[j].classList.add("wall");
            }
            if (check) {
                if (j === matrixSize - 1) {
                    const random = Math.floor(Math.random() * 100);
                    if (cords[i][j - 2] === 0 && cords[i][j - 1] === 0) {
                        if (random < 80) {
                            cords[i][j] = 0;
                            aStarMatrix[i][j].value = 0;
                            elements[j].classList.remove("wall");
                        }
                    }
                }
                if (i === matrixSize - 1) {
                    const random = Math.floor(Math.random() * 100);
                    if (cords[i - 2][j] === 0 && cords[i - 1][j] === 0) {
                        if (random < 80) {
                            cords[i][j] = 0;
                            aStarMatrix[i][j].value = 0;
                            elements[j].classList.remove("wall");
                        }
                    }
                }
            }
        }
    }
}



//Алгоритм
let index = 0;
let breakFlag = false;
let openList = [];
let closeList = [];
let changeList = [];

function getDistance(firstPosition, secondPosition) {
    let dist;
    if (metrics === "Euclidean") {
        dist = Math.sqrt(Math.pow(firstPosition.x - secondPosition.x, 2) + Math.pow(firstPosition.y - secondPosition.y, 2));
    } else if (metrics === "Manhattan") {
        dist = Math.abs(firstPosition.x - secondPosition.x) + Math.abs(firstPosition.y - secondPosition.y);
    } else {
        dist = Math.max(Math.abs(firstPosition.x - secondPosition.x), Math.abs(firstPosition.y - secondPosition.y));
    }
    return dist;
}

function isClosed(temp) {
    for (let i = 0; i < closeList.length; i++) {
        if (temp.x === closeList[i].x && temp.y === closeList[i].y) {
            return true;
        }
    }
    return false;
}

function isOpened(temp) {
    for (let i = 0; i < openList.length; i++) {
        if (temp.x === openList[i].x && temp.y === openList[i].y) {
            return true;
        }
    }
    return false;
}

function getMinCell() {
    let min = 9999999;
    let temp = new Cell(0, 0);

    for (let i = 0; i < openList.length; i++) {
        const dx = openList[i].x;
        const dy = openList[i].y;

        if (aStarMatrix[dy][dx].f < min) {
            min = aStarMatrix[dy][dx];
            index = i;
            temp = new Cell(dx, dy);
        }
    }
    return temp;
}

function checkNeighbours(current) {
    const x = current.x;
    const y = current.y;

    openList.splice(index, 1);
    closeList.push(current);
    if (y - 1 >= 0 && aStarMatrix[y - 1][x].value !== 1 && !isClosed(new Cell(x, y - 1))) {
        if (!isOpened(new Cell(x, y - 1))) {
            aStarMatrix[y - 1][x].parentX = x;
            aStarMatrix[y - 1][x].parentY = y;
            aStarMatrix[y - 1][x].h = getDistance(new Cell(x, y - 1), finishCords);
            aStarMatrix[y - 1][x].g = 10 + aStarMatrix[y][x].g;
            aStarMatrix[y - 1][x].f = aStarMatrix[y - 1][x].h + aStarMatrix[y - 1][x].g;
            openList.push(new Cell(x, y - 1));
            document.querySelector('td[data-row = "' + (y - 1) + '"][data-col = "' + x + '"]').classList.add("currentCell")
            if (x === finishCords.x && y - 1 === finishCords.y) {
                breakFlag = true;
                return 0;
            }
        } else if (aStarMatrix[y - 1][x].g > aStarMatrix[y][x].g) {
            aStarMatrix[y - 1][x].parentX = x;
            aStarMatrix[y - 1][x].parentY = y;
            aStarMatrix[y - 1][x].g = 10 + aStarMatrix[y][x].g;
            aStarMatrix[y - 1][x].f = aStarMatrix[y - 1][x].h + aStarMatrix[y - 1][x].g;
        }
    }
    //down
    if (y + 1 < matrixSize && aStarMatrix[y + 1][x].value !== 1 && !isClosed(new Cell(x, y + 1))) {
        if (!isOpened(new Cell(x, y + 1))) {
            aStarMatrix[y + 1][x].parentX = x;
            aStarMatrix[y + 1][x].parentY = y;
            aStarMatrix[y + 1][x].h = getDistance(new Cell(x, y + 1), finishCords);
            aStarMatrix[y + 1][x].g = 10 + aStarMatrix[y][x].g;
            aStarMatrix[y + 1][x].f = aStarMatrix[y + 1][x].h + aStarMatrix[y + 1][x].g;
            openList.push(new Cell(x, y + 1));
            document.querySelector('td[data-row = "' + (y + 1) + '"][data-col = "' + x + '"]').classList.add("currentCell")
            if (x === finishCords.x && y + 1 === finishCords.y) {
                breakFlag = true;
                return 0;
            }
        } else if (aStarMatrix[y + 1][x].g > aStarMatrix[y][x].g) {
            aStarMatrix[y + 1][x].parentX = x;
            aStarMatrix[y + 1][x].parentY = y;
            aStarMatrix[y + 1][x].g = 10 + aStarMatrix[y][x].g;
            aStarMatrix[y + 1][x].f = aStarMatrix[y + 1][x].h + aStarMatrix[y + 1][x].g;
        }
    }
    //left
    if (x - 1 >= 0 && aStarMatrix[y][x - 1].value !== 1 && !isClosed(new Cell(x - 1, y))) {
        if (!isOpened(new Cell(x - 1, y))) {
            aStarMatrix[y][x - 1].parentX = x;
            aStarMatrix[y][x - 1].parentY = y;
            aStarMatrix[y][x - 1].h = getDistance(new Cell(x - 1, y), finishCords);
            aStarMatrix[y][x - 1].g = 10 + aStarMatrix[y][x].g;
            aStarMatrix[y][x - 1].f = aStarMatrix[y][x - 1].h + aStarMatrix[y][x - 1].g;
            openList.push(new Cell(x - 1, y));
            document.querySelector('td[data-row = "' + y + '"][data-col = "' + (x - 1) + '"]').classList.add("currentCell")
            if (x - 1 === finishCords.x && y === finishCords.y) {
                breakFlag = true;
                return 0;
            }
        } else if (aStarMatrix[y][x - 1].g > aStarMatrix[y][x].g) {
            aStarMatrix[y][x - 1].parentX = x;
            aStarMatrix[y][x - 1].parentY = y;
            aStarMatrix[y][x - 1].g = 10 + aStarMatrix[y][x].g;
            aStarMatrix[y][x - 1].f = aStarMatrix[y][x - 1].h + aStarMatrix[y][x - 1].g;
        }
    }
    //right
    if (x + 1 < matrixSize && aStarMatrix[y][x + 1].value !== 1 && !isClosed(new Cell(x + 1, y))) {
        if (!isOpened(new Cell(x + 1, y))) {
            aStarMatrix[y][x + 1].parentX = x;
            aStarMatrix[y][x + 1].parentY = y;
            aStarMatrix[y][x + 1].h = getDistance(new Cell(x + 1, y), finishCords);
            aStarMatrix[y][x + 1].g = 10 + aStarMatrix[y][x].g;
            aStarMatrix[y][x + 1].f = aStarMatrix[y][x + 1].h + aStarMatrix[y][x + 1].g;
            openList.push(new Cell(x + 1, y));
            document.querySelector('td[data-row = "' + y + '"][data-col = "' + (x + 1) + '"]').classList.add("currentCell")
            if (x + 1 === finishCords.x && y === finishCords.y) {
                breakFlag = true;
                return 0;
            }
        } else if (aStarMatrix[y][x + 1].g > aStarMatrix[y][x].g) {
            aStarMatrix[y][x + 1].parentX = x;
            aStarMatrix[y][x + 1].parentY = y;
            aStarMatrix[y][x + 1].g = 10 + aStarMatrix[y][x].g;
            aStarMatrix[y][x + 1].f = aStarMatrix[y][x - 1].h + aStarMatrix[y][x + 1].g;
        }
    }
}

async function drawPath() {
    let x = finishCords.x;
    let y = finishCords.y;
    let cell = document.querySelector('td[data-col = "' + x + '"][data-row = "' + y + '"]')
    cell.classList.remove("currentCell")
    while (x !== startCords.x || y !== startCords.y) {
        let temp = x;
        x = aStarMatrix[y][temp].parentX;
        y = aStarMatrix[y][temp].parentY;
        cell = document.querySelector('td[data-col = "' + x + '"][data-row = "' + y + '"]');
        cell.classList.add("path");
        await new Promise(resolve => setTimeout(resolve, delay))
    }
    cell.classList.remove("path");
    cell.classList.remove("currentCell");

}

async function aStar() {
    let flag = false
    openList.push(startCords);
    checkNeighbours(startCords)
    while (!breakFlag) {
        const min = getMinCell();
        checkNeighbours(min);
        if (openList.length <= 0) {
            flag = true
            alert("No path found")
            break;
        }
        await new Promise(resolve => setTimeout(resolve, delay / 3))
    }
    if (!flag) {
        await drawPath()
    }
    changeButtonsEnabling(false)

    openList.splice(0, openList.length);
    changeList.splice(0, changeList.length);
    closeList.splice(0, closeList.length);
    index = 0;
    breakFlag = false;
}

async function startFindingPath() {
    document.getElementById("beginButton").addEventListener("mousedown", async function () {
        if (isFinisButtonPressed && isStartButtonPressed) {
            changeButtonsEnabling(true)
            const elements = document.querySelectorAll("td");
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove("currentCell")
                elements[i].classList.remove("path")
            }
            await aStar()
        } else {
            alert("please, input start and finish cells")
        }
    })

}












