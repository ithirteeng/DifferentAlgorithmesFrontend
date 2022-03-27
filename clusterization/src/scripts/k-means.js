class KMeans {
    constructor(clusters_number, dataArray) {
        this.pointsArr = JSON.parse(JSON.stringify(dataArray));
        this.clusters_number = clusters_number;
        this.centroids = [];
        this.prevCentroids = [];

    }

    change_points_cluster() {
        for (let i = 0; i < this.pointsArr.length; i++) {
            for (let j = 0; j < this.clusters_number; j++) {
                let distance = computeSquareDistance(this.pointsArr[i], this.centroids[j])
                if (distance < this.pointsArr[i].minDistance) {
                    this.pointsArr[i].minDistance = distance;
                    this.pointsArr[i].cluster = j;
                    changeCirclePointColor(this.pointsArr[i], this.centroids[j].color)
                }
            }
        }
    }

    identify_clusters() {
        for (let i = 0; i < this.clusters_number; i++) {
            let centroid = {
                x: Math.round((canvas_width - 40) * Math.random() + 1),
                y: Math.round((canvas_height - 40) * Math.random() + 1),
                color: colors[i],
                pointsAmount: 0,
            };
            drawTrianglePoint(centroid, colors[i]);
            this.centroids.push(centroid);
        }
        this.change_points_cluster();
    }

    clustering() {
        const MAX_ITERATIONS = 100;
        let counter = 0;
        while (this.prevCentroids !== this.centroids) {
            if (counter++ >= MAX_ITERATIONS) {
                break;
            }
            this.prevCentroids = JSON.parse(JSON.stringify(this.centroids))
            clearCanvas();
            restorePointsAfterRestart(this.pointsArr);
            // Обнуление, чтобы потом сложить все координаты точек сразу внутри центроиды и так же для каждого поделить
            this.centroids.forEach(item => {
                item.x = 0;
                item.y = 0;
                item.pointsAmount = 0;
            });
            this.pointsArr.forEach(item => {
                let currentCent = this.centroids[item.cluster];
                currentCent.pointsAmount++;
                currentCent.x += item.x;
                currentCent.y += item.y;
            }, this);

            this.centroids.forEach(item => {
                console.log(`itemX = ${item.x}, itemY = ${item.y}, points = ${item.pointsAmount}`);
                if (item.pointsAmount === 0) {
                    item.x = Math.round((canvas_width - 40) * Math.random() + 1);
                    item.y = Math.round((canvas_height - 40) * Math.random() + 1)
                } else {
                    item.x = Math.round(item.x / item.pointsAmount);
                    item.y = Math.round(item.y / item.pointsAmount);
                    drawTrianglePoint(item, item.color);
                }
            });
            this.pointsArr.forEach(item => {
                item.minDistance = 999999999;
            })
            this.change_points_cluster();

        }

    }

}

function drawTrianglePoint(point, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(point.x - 7, point.y + 10);
    ctx.lineTo(point.x + 3, point.y - 7);
    ctx.lineTo(point.x + 13, point.y + 10);
    ctx.fill();
    ctx.fillStyle = 'black'

}

function drawCirclePoint(point, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(point.x + 3, point.y + 4, 10, 0, 2 * Math.PI);
    ctx.fill()
    //
    ctx.fillStyle = 'black';
}

function changeCirclePointColor(point, newColor) {
    drawCirclePoint(point, newColor);
}

function computeSquareDistance(point1, point2) {
    return (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2
}

function putPointByClick(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    drawCirclePoint({x, y}, myColor);
    return {x, y, minDistance: 99999999, cluster: -1}
}

function restorePointsAfterRestart(pointsArray, color = 'black') {
    pointsArray.forEach(item => {
        drawCirclePoint(item, colors[item.cluster]);
    });
}

function inputRangeByText() {
    let rng = document.getElementById("clustersNumber");
    let counter = document.getElementById('clusterCounter');
    rng.value = counter.value;
    clusters_number = parseInt(counter.value);
    console.log("Изменен range input через text");
}

function inputRange() {
    let rng = document.getElementById("clustersNumber");
    let counter = document.getElementById('clusterCounter');
    counter.value = rng.value;
    clusters_number = parseInt(rng.value);
    console.log("Изменен range input");
}

function clearCanvas() {
    // Just clears Canvas. DO NOT USE OUTSIDE CORRECT FUNCTIONS!
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function startAlgorithm() {
    if (dataArray.length === 0) {
        console.log("Точек нет!");
        alert("Поставьте точки!");
        return
    }
    document.getElementById('buttonStart').textContent = "Restart"
    if (is_started) {
        clearCanvas();
        restorePointsAfterRestart(dataArray, myColor);
    }
    console.log("Старт алгоритма");
    solve = new KMeans(clusters_number, dataArray);
    solve.identify_clusters();
    solve.clustering();
    is_started = 1;
}

function clearAll() {
    // Clears canvas and data. Creates standard solve with current amount of clusters
    dataArray = [];
    solve = new KMeans(clusters_number, dataArray);
    clearCanvas();
    document.getElementById('buttonStart').textContent = "Start"
    is_started = 0;
}

const canvas = document.querySelector("#canvas_1")
const ctx = canvas.getContext('2d');
document.getElementById('color').oninput = function () {
    myColor = this.value;
}
canvas.addEventListener('mousedown', function (event) {
    dataArray.push(putPointByClick(event, canvas))
    if (is_started) {
        startAlgorithm();
    }
})

let containerCanvas = document.getElementById("container-canvas")


window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas (){
    canvas.width = containerCanvas.offsetWidth
    canvas.height = containerCanvas.offsetHeight
}

resizeCanvas()
const canvas_width = ctx.canvas.width;
const canvas_height = ctx.canvas.height;
let dataArray = [];
let clusters_number = 2;
let is_started = 0;
let myColor = 'black';
let solve = new KMeans(clusters_number, dataArray);
const colors = ['red', 'orange', 'yellow', 'green', 'lightskyblue', 'blue', 'blueviolet',]