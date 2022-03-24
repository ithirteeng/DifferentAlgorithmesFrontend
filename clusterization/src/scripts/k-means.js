function drawTrianglePoint(point, color) {
    ctx.beginPath();
    ctx.fillStyle = color
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

function putPointByClick(event, canvas) {
    let x = event.offsetX;
    let y = event.offsetY;
    drawCirclePoint({x, y}, myColor);
    console.log(`Цвет: ${myColor} x: ${x} y: ${y}`);
    return {x, y, minDistance: 99999999, cluster: -1}
}


const canvas = document.querySelector("#canvas_1")
const ctx = canvas.getContext('2d');
let myColor = 'blue';
document.getElementById('color').oninput = function () {
    myColor = this.value;
}


canvas.addEventListener('mousedown', function (event) {
    dataArray.push(putPointByClick(event, canvas))
    console.log(dataArray)
})
canvas.addEventListener('mousedown', function (event) {
    dataArray.push(putPointByClick(event, canvas))
    console.log(dataArray)
})


let dataArray = [];
// Опрос сколько будет кластеров
// const cluster_number = Number(prompt("Enter a number of clusters: "));
cluster_number = 3;

class KMeans {
    constructor(q_clusters, dataArray) {
        this.pointsArr = dataArray;
        this.clusterPoints = [];
        this.q_cluster = q_clusters;
        this.centroids = [];

    }

    identify_clusters() {
        for (let i = 0; i < this.q_cluster; i++) {
            let centroid = {x: 360 * Math.random(), y: 150 * Math.random()};
            this.centroids.push(centroid);
            drawTrianglePoint(centroid, 'gray')
        }
        this.lastCentroids = [...this.centroids];
    }

    clustering() {
        // do {
            // Кластерам приделываем точки
            for (let j = 0; j < this.centroids.length; j++) {
                for (let i = 0; i < this.pointsArr.length; i++) {
                    let minDistance = 999999999999;
                    let distance = computeSquareDistance(this.pointsArr[i], this.centroids[j])
                    if (distance < this.pointsArr[i].minDistance) {
                        this.pointsArr[i].minDistance = distance;
                        this.clusterPoints[j].push(this.pointsArr[i]);
                    }
                }
            }
            // тут дальше какую-то хуйню надо делать


        // } while (this.lastCentroids != this.centroids)
    }

}

let solve = new KMeans(cluster_number, dataArray)
solve.identify_clusters()
solve.clustering()