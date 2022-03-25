class KMeans {
    constructor(clusters_number, dataArray) {
        this.pointsArr = dataArray;
        this.clusters_number = clusters_number;
        this.centroids = [];

    }

    identify_clusters() {
        for (let i = 0; i < this.clusters_number; i++) {

            let centroid = {x: (canvas_width - 40) * Math.random(), y: (canvas_height - 40) * Math.random()};
            drawTrianglePoint(centroid, 'black')
            this.centroids.push(centroid);
        }
        this.lastCentroids = [...this.centroids];
    }

    clustering() {
        // do {
        // Кластерам приделываем точки
        for (let j = 0; j < this.centroids.length; j++) {
            for (let i = 0; i < this.pointsArr.length; i++) {
                let distance = computeSquareDistance(this.pointsArr[i], this.centroids[j])
                if (distance < this.pointsArr[i].minDistance) {
                    this.pointsArr[i].minDistance = distance;
                }
            }
        }
        // тут дальше какую-то хуйню надо делать


        // } while (this.lastCentroids != this.centroids)
    }

}

function drawTrianglePoint(point, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(point.x - 7, point.y + 10);
    ctx.lineTo(point.x + 3, point.y - 7);
    ctx.lineTo(point.x + 13, point.y + 10);
    ctx.fill();

}

function drawCirclePoint(point, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
    ctx.fill()
}

function computeSquareDistance(point1, point2) {
    return (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2
}

function putPointByClick(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    drawCirclePoint({x, y}, myColor);
    console.log(`Цвет: ${myColor} x: ${x} y: ${y}`);
    return {x, y, minDistance: 99999999, cluster: -1}
}

function inputRange(){
    let rng = document.getElementById("clustersNumber");
    let counter = document.getElementById('clusterCounter');
    counter.value = rng.value;
    clusters_number = rng.value;
    console.log("Изменен range input");
}

function startAlgo() {
    document.getElementById('buttonStart').textContent = "Restart"
    if (is_started){
        clearCanvas();
    }
    console.log("Старт алгоритма")
    solve = new KMeans(clusters_number, dataArray)
    solve.identify_clusters()
    // solve.clustering()
    is_started = 1;
}

function clearCanvas(){
    dataArray = [];
    solve = new KMeans(clusters_number, dataArray);
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height )
}

const canvas = document.querySelector("#canvas_1")
const ctx = canvas.getContext('2d');
document.getElementById('color').oninput = function () {
    myColor = this.value;
}


canvas.addEventListener('mousedown', function (event) {
    dataArray.push(putPointByClick(event, canvas))
})

const canvas_width = ctx.canvas.width;
const canvas_height = ctx.canvas.height;
let dataArray = [];
let clusters_number = 2;
let is_started = 0;
let myColor = 'blue';
let solve = new KMeans(2, dataArray);
