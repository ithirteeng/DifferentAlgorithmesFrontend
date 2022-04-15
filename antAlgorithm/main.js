startButtonEvent();

class Canvas {
    // Class for my own canvas field with methods and so on
    constructor(canvas_id, container_id) {
        this.canvas = document.getElementById(canvas_id);
        this.context = this.canvas.getContext('2d');
        this.width = this.context.canvas.width;
        this.height = this.context.canvas.height;
        this.container = document.getElementById(container_id);
    }

    clearField() {
        // Just clears Canvas.
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    resize() {
        // Resizes canvas if event == 'resize'
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
        this.width = this.context.canvas.width;
        this.height = this.context.canvas.height;
    }


    drawCirclePoint(point) {
        let ctx = this.context;
        ctx.beginPath();
        ctx.arc(point.x + 3, point.y + 4, 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    drawPath(point1, point2, color) {
        let ctx = this.context;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(point1.x + 3, point1.y + 4);
        ctx.lineTo(point2.x + 3, point2.y + 4);
        ctx.stroke();
    }
}


function putPointByClick(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    canvas.drawCirclePoint({x, y});
    points.push({x, y, num});
    num++;
}


function checkPoints() {
    // if CanvasField is clear raises alert
    if (num === 0) {
        console.log("Точек нет!");
        alert("Поставьте точки!");
        return true;
    }
}


function computeSquareEuclidDistance(point1, point2) {
    return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));
}

function computeManhattanDistance(point1, point2) {
    return (Math.abs(point1.x - point2.x) + Math.abs(point2.y - point1.y))
}

function computeChebyshevDistance(point1, point2) {
    return (Math.max(Math.abs(point1.x - point2.x), Math.abs(point2.y - point1.y)))
}

function drawPoints() {
    for (let i = 0; i < points.length; i++) {
        canvas.drawCirclePoint(points[i]);
    }
}

function Draw(arrNumbers) {
    for (let i = 0; i < num - 1; i++) {
        canvas.drawPath(points[arrNumbers[i]], points[arrNumbers[i + 1]]);
    }

    canvas.drawPath(points[arrNumbers[0]], points[arrNumbers[arrNumbers.length - 2]]); // т.к путь замкнутый
}


function createMatrixWeigh(distanceMetric) {
    // заполнение матрицы весов
    let arrive = [];
    for (let i = 0; i < num; i++) {
        let arr = []
        for (let j = 0; j < num; j++) {
            if (i === j) {
                arr.push(0);
            } else {
                arr.push(distanceMetric(points[i], points[j]));
            }
        }
        arrive.push(arr);
    }
    return arrive;
}

function createMatrixPheromone() {
    // заполнение матрицы фермонов
    let arrive = [];
    for (let i = 0; i < num; i++) {
        let arr = [];
        for (let j = 0; j < num; j++) {
            if (i === j) {
                arr.push(0);
            } else {
                arr.push(0.5);
            }
        }
        arrive.push(arr)
    }

    return arrive;
}

function createAvaiblePoints(currPoint) {
    let arr = [];
    for (let n = 0; n < num; n++) {
        if (n === currPoint) {
            arr.push(false);
        } else {
            arr.push(true);
        }
    }
    return arr;
}


function nextPoint(mWeight, mPheromone, avPoints, currPoint) {
    // случайный выбор новой вершины
    let desireToMove = [];
    let desireSum = 0;
    let probabilityToMove = [];

    for (let i = 0; i < avPoints.length; i++) {
        if (avPoints[i]) {
            let disire = Math.pow(200 / mWeight[currPoint][i], beta) * Math.pow(mPheromone[currPoint][i], alfa);
            desireToMove.push(disire);
            desireSum += disire;
        } else {
            desireToMove.push(0);
        }
    }
    probabilityToMove.push(desireToMove[0] / desireSum);

    for (let i = 1; i < desireToMove.length; i++) {
        probabilityToMove.push(probabilityToMove[i - 1] + (desireToMove[i] / desireSum));
    }

    let randomValue = Math.random();
    for (let i = 0; i < probabilityToMove.length; i++) {
        if (randomValue <= probabilityToMove[i]) {
            return i;
        }
    }
}


function plusPheromone(mPheromone, path) {
    // функция увеличивает кол-во фкромона
    for (let i = 0; i < path.length - 2; i++) {
        mPheromone[i][i + 1] += (Q / path[path.length - 1]);
        mPheromone[i + 1][i] += (Q / path[path.length - 1]);
    }

    mPheromone[path[0]][path[path.length - 2]] += (Q / path[path.length - 1]);
    mPheromone[path[path.length - 2]][path[0]] += (Q / path[path.length - 1]);

    return mPheromone;
}


function minusPheromone(mPheromone) {
    // функция уменьшает кол-во феромона
    for (let i = 0; i < mPheromone.length; i++) {
        for (let j = 0; j < mPheromone.length; j++) {
            mPheromone[i][j] *= pheromoneResidue;
        }
    }

    return mPheromone;
}

function startButtonEvent() {
    document.getElementById("Start").addEventListener("click", function () {

        canvas.clearField();
        drawPoints();
        if (checkPoints()) {
            return;
        } else {
            document.getElementById("Start").disabled = true;
            canvas.clearField();
            for (let i = 0; i < num; i++) {
                canvas.drawCirclePoint(points[i]);
            }

            console.log('start')

            checkRadioButtons("metric");
            let matrixWeight = createMatrixWeigh(metricTypes[distanceMetric]);
            let matrixPheromone = createMatrixPheromone();
            let minPathLength = Infinity;
            let minPath = [];


            for (let x = 0; x < iterationsNum; x++) {


                let allPath = [];

                for (let j = 0; j < num; j++) {

                    let availablePoints = createAvaiblePoints(j);
                    let currPath = [];
                    let lenghtCurrPath = 0;
                    currPath.push(j);

                    for (let i = 0; i < num - 1; i++) {
                        let newPoint = nextPoint(matrixWeight, matrixPheromone, availablePoints, currPath[i]);
                        currPath.push(newPoint);
                        availablePoints[newPoint] = false;
                        lenghtCurrPath += metricTypes[distanceMetric](points[currPath[currPath.length - 2]], points[currPath[currPath.length - 1]]);
                    }

                    lenghtCurrPath += metricTypes[distanceMetric](points[currPath[0]], points[currPath[currPath.length - 1]]);
                    if (lenghtCurrPath < minPathLength) {
                        minPathLength = lenghtCurrPath;
                        minPath = currPath;
                    }

                    currPath.push(lenghtCurrPath);
                    allPath.push(currPath);

                }
                matrixPheromone = minusPheromone(matrixPheromone);

                for (let i = 0; i < allPath.length; i++) {
                    matrixPheromone = plusPheromone(matrixPheromone, allPath[i]);
                }
            }
            drawAll(minPath);

            document.getElementById("Start").disabled = false;

        }
    });
}

function drawAll(minPath) {
    canvas.clearField();
    drawPoints();
    Draw(minPath);
}

function inputRange(id) {
    let rng = document.getElementById(`${id}Range`);
    let counter = document.getElementById(`${id}Counter`);
    counter.textContent = counter.textContent.replace(/\d+/, `${rng.value}`);
    switch (id) {
        case 'iterations':
            iterationsNum = parseInt(rng.value);
            break;
        case 'pheramoneQ':
            Q = parseInt(rng.value);
            break;
        case 'pheramoneR':
            pheromoneResidue = parseInt(rng.value) / 100;
            break;
        case 'beta':
            beta = parseInt(rng.value);
            break;
        case 'alfa':
            alfa = parseInt(rng.value);
            break;
    }
}


function checkRadioButtons(name) {
    let radioButtons = document.getElementsByName(name)
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            switch (name) {
                case "metric":
                    distanceMetric = radioButton.value;
                    break;
            }
            break;
        }
    }
}


function clearAll() {
    // Clears canvas and data. Creates standard solve with current amount of clusters
    document.getElementById("Start").disabled = false;
    points = [];
    canvas.clearField();
    num = 0;
}


let canvas = new Canvas('canvas_1', 'container-canvas');
canvas.canvas.addEventListener('mousedown', function (event) {
    putPointByClick(event, canvas);

})
window.addEventListener('resize', function () {
    canvas.resize();
    clearAll();
}, false);
window.onload = canvas.resize.bind(canvas);


let points = [];
let num = 0;
let iterationsNum = 2000;
let pheromoneResidue = 0.65;
let Q = 4;
let beta = 3;
let alfa = 1;
metricTypes = {
    "euclid": computeSquareEuclidDistance,
    "chebyshev": computeChebyshevDistance,
    "manhattan": computeManhattanDistance,
}
let distanceMetric = "euclid"