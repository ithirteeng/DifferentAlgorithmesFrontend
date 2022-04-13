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
        console.log(`CANVAS PROPERTIES\n    Width: ${canvas.width}\n    Height: ${canvas.height}`)
    }

    drawCirclePoint(point, color, map) {
        console.log(map);
        let ctx = map.context;
        ctx.beginPath();
        ctx.strokeStyle = myColor;
        ctx.lineWidth = 8;
        ctx.fillStyle = color;
        let radius = 10;
        ctx.arc(point.x + 3, point.y + 4, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = 'black';
    }
    drawCirclePoint(point, color) {
        let ctx = this.context;
        ctx.beginPath();
        ctx.strokeStyle = myColor;
        ctx.lineWidth = 8;
        ctx.fillStyle = color;
        let radius = 10;
        ctx.arc(point.x + 3, point.y + 4, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = 'black';
    }

    drawRightHalfCirclePoint(point, color) {
        let ctx = this.context;
        ctx.beginPath();
        ctx.strokeStyle = myColor;
        ctx.lineWidth = 8;
        ctx.fillStyle = color;
        let radius = 10;
        ctx.arc(point.x + 3, point.y + 4, radius, Math.PI * 3 / 2, Math.PI / 2);
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = 'black';
    }

    drawLeftHalfCirclePoint(point, color) {
        let ctx = this.context;
        ctx.beginPath();
        ctx.strokeStyle = myColor;
        ctx.lineWidth = 8;
        ctx.fillStyle = color;
        let radius = 10;
        ctx.arc(point.x + 3, point.y + 4, radius, Math.PI * 1 / 2, Math.PI * -1 / 2);
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = 'black';
    }

    drawTrianglePoint(point, color) {
        let ctx = this.context;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(point.x - 7, point.y + 10);
        ctx.lineTo(point.x + 3, point.y - 7);
        ctx.lineTo(point.x + 13, point.y + 10);
        ctx.fill();
        ctx.fillStyle = 'black';
    }

}

class Silhouette {
    // Silhouette Coefficient Method. Based on K-means
    constructor(dataArray) {
        this.pointsArr = JSON.parse(JSON.stringify(dataArray));
    }

    solve() {
        for (let i = 2; i <= 12; i++) {
            let k_means = new KMeans(i, this.pointsArr, false);
            k_means.identify_clusters();
            k_means.clustering();

        }
    }
}

class KMeans {
    // In constructor independence means which way you use algorithm.
    // False, if inside another algorithm(like Silhouette)
    constructor(dataArray, clusters_number, independence = true) {
        this.points = JSON.parse(JSON.stringify(dataArray));
        this.clusters_number = clusters_number;
        this.centroids = [];
        this.prevCentroids = [];
        this.independence = independence;
        this.identify_clusters();
    }

    change_points_cluster() {
        for (let i = 0; i < this.points.length; i++) {
            for (let j = 0; j < this.clusters_number; j++) {
                let distance = computeEuclidDistance(this.points[i], this.centroids[j])
                if (distance < this.points[i].minDistance) {
                    this.points[i].minDistance = distance;
                    this.points[i].cluster = j;
                    if (this.independence) {
                        canvas.drawCirclePoint(this.points[i], this.centroids[j].color) // redraws point with new color
                    }
                }
            }
        }
    }

    identify_clusters() {

        for (let i = 0; i < this.clusters_number; i++) {
            let centroid = {
                x: Math.round((canvas.width - 40) * Math.random() + 1),
                y: Math.round((canvas.height - 40) * Math.random() + 1),
                color: colorsKMeans[i],
                pointsAmount: 0,
                meanDistance: -1,
            };
            this.centroids.push(centroid);
            if (this.independence) {
                canvas.drawTrianglePoint(centroid, colorsKMeans[i]);
            }
        }
        this.change_points_cluster();
    }

    clustering() {
        const MAX_ITERATIONS = 100;
        let counter = 0;
        while (!compareArr(this.prevCentroids, this.centroids) && counter++ <= MAX_ITERATIONS) {
            this.prevCentroids = JSON.parse(JSON.stringify(this.centroids))
            restore();
            this.centroids.forEach(item => {
                item.x = 0;
                item.y = 0;
                item.pointsAmount = 0;
                item.meanDistance = 0;
            });
            this.points.forEach(item => {
                let currentCent = this.centroids[item.cluster];
                currentCent.pointsAmount++;
                currentCent.x += item.x;
                currentCent.y += item.y;
            }, this);
            this.centroids.forEach(item => {
                if (item.pointsAmount === 0) {
                    item.x = Math.round((canvas.width - 40) * Math.random() + 1);
                    item.y = Math.round((canvas.height - 40) * Math.random() + 1)
                } else {
                    item.x = Math.round(item.x / item.pointsAmount);
                    item.y = Math.round(item.y / item.pointsAmount);
                }
                if (this.independence) {
                    canvas.drawTrianglePoint(item, item.color);
                }
            });

            this.points.forEach(item => {
                item.minDistance = 999999999;
            })
            this.change_points_cluster();
        }

    }

}

class AGNES {
    constructor(dataArray, clusters_number, distMethod) {
        this.points = dataArray.map(item => {
            return {x: item.x, y: item.y}
        });
        this.centroids = [];
        this.clusters_number = clusters_number;
        this.distances = [];
        this.dist = distMethod;
        this.initialize_clusters();
        this.clustering();
        console.log(canvas.drawCirclePoint);
        this.drawPoints(k_means_is_started? canvas.drawRightHalfCirclePoint.bind(canvas) : canvas.drawCirclePoint.bind(canvas));
    }

    initialize_clusters() {
        this.points.forEach(item => {
            this.centroids.push([item,]);
        })
        this.fill_distances();
    }

    fill_distances() {
        this.centroids.forEach(item_i => {
            let distances_i = [];
            this.centroids.forEach(item_j => {
                distances_i.push(this.dist(item_i, item_j));
            })
            this.distances.push(distances_i);
        })
    }

    clustering() { // Возможно можно вставить сюда инициализацию кластеров и вызывать методы прямо в конструкторе? Но хз
        let N = this.points.length;
        while (N > this.clusters_number) {
            let result = this.find_min(this.distances)
            let i = result.min_i;
            let j = result.min_j;
            let min = result.min;
            this.centroids[i].push(...this.centroids[j]);
            this.centroids.splice(j, 1);
            this.distances = [];
            this.fill_distances()
            N--;
        }
    }

    find_min(arr) {
        let min = 99999999;
        let min_i = 0;
        let min_j = 0;
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (i !== j && arr[i][j] < min) {
                    min = arr[i][j];
                    min_i = i;
                    min_j = j;
                }
            }
        }
        return {min_i, min_j, min};
    }

    drawPoints(drawPointFunction) {
        console.log(this.centroids);
        this.centroids.forEach(function (item, index) {
            console.log(this.width);
            let centroid = {x: 0, y: 0, pointsNumber: 0, color: colorsShiftMeans[index]}
            item.forEach(point => {
                console.log("Ширина равна = " + this.width);
                drawPointFunction(point, centroid.color, this);
                centroid.x += point.x;
                centroid.y += point.y;
                centroid.pointsNumber++;
            }, this);
            centroid.x /= centroid.pointsNumber;
            centroid.y /= centroid.pointsNumber;
            drawPointFunction(centroid, centroid.color, this);
        }, canvas);
    }


}

function dist_min(arri, arrj) {
    let min = 99999999999;
    for (let i = 0; i < arri.length; i++) {
        for (let j = 0; j < arrj.length; j++) {
            let distance = computeEuclidDistance(arri[i], arrj[j]);
            if (distance < min) {
                min = distance;
            }
        }
    }
    return min;
}

function dist_max(arri, arrj) {
    let max = -99999999999;
    for (let i = 0; i < arri.length; i++) {
        for (let j = 0; j < arrj.length; j++) {
            let distance = computeEuclidDistance(arri[i], arrj[j]);
            if (distance > max) {
                max = distance;
            }
        }
    }
    return max;
}

function dist_avg(arri, arrj) {
    let avg = 0;
    for (let i = 0; i < arri.length; i++) {
        for (let j = 0; j < arrj.length; j++) {
            let distance = computeEuclidDistance(arri[i], arrj[j]);
            avg += distance;
        }
    }
    return avg / (arrj.length * arri.length);
}

function compareArr(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2)
}

function computeEuclidDistance(point1, point2) {
    return (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2
}

function putPointByClick(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    canvas.drawCirclePoint({x, y}, 'white');
    dataArray.push({x, y, minDistance: 99999999, cluster: -1, color: 'white'});
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

function inputColor() {
    let color = document.getElementById('color');
    myColor = color.value;
}

function checkPoints() {
    // if CanvasField is clear raises alert
    if (dataArray.length === 0) {
        console.log("Точек нет!");
        alert("Поставьте точки!");
        return true;
    }
}

function startKMeans() {
    if (checkPoints()) {
        return;
    }
    document.getElementById('Start K-means').textContent = "Restart";
    if (k_means_is_started) {
        restore();
    }
    console.log("Старт K-means");
    let k_means = new KMeans(dataArray, clusters_number);
    k_means.clustering();
    k_means_is_started = true;

}

function startAGNES() {
    if (checkPoints()) {
        return;
    }
    document.getElementById('Start AGNES').textContent = "Restart";
    if (agnes_is_started) {
        restore();
    }
    console.log("Старт AGNES");
    let agnes = new AGNES(dataArray, clusters_number, dist_min);
    // agnes.clustering();
    agnes.agnes_is_started = true;
}

function restore() {
    // Saves points but removes centroids;
    canvas.clearField();
    dataArray.forEach(item => {
        canvas.drawCirclePoint(item, 'white');
    })
}

function clearAll() {
    // Clears canvas and data. Creates standard solve with current amount of clusters
    console.log("CLEEEEEAR!")
    dataArray = [];
    canvas.clearField();
    document.getElementById('Start K-means').textContent = "Start"
    document.getElementById('Start AGNES').textContent = "Start"
    k_means_is_started = false;
    agnes_is_started = false;
}


let canvas = new Canvas('canvas_1', 'container-canvas');
canvas.canvas.addEventListener('mousedown', function (event) {
    putPointByClick(event, canvas);
    if (k_means_is_started) {
        startKMeans();
    }
    if (agnes_is_started) {
        startAGNES();
    }
})
window.addEventListener('resize', function () {
    canvas.resize();
    clearAll();
}, false);
canvas.resize();

let clusters_number = 2;
let dataArray = [];
let k_means_is_started = false;
let agnes_is_started = false;
let myColor = 'black';
const colorsKMeans = ['#ff0000', 'orange', 'yellow', '#00ff00', 'lightskyblue', '#0000ff', 'blueviolet', '#6c9edc', '#9e16a2', '#9c83ff', '#1e62d1', '#deb3b5', '#d69e88', '#af8f47', '#843aaa', '#6a61d6', '#ac2de0', '#b475b7', '#624d4f', '#9eb838'];
const colorsShiftMeans = ['#5c50f7', '#758d2f', '#3afba3', '#90e031', '#189c57', '#afc08d', '#7212d5', '#49b666', '#1131e5', '#8a9f9a', '#7ab94d', '#ce15d0', '#4777d9', '#1f5b10', '#c724a0', '#974f3a', '#9a2040', '#e13124', '#9ea22f', '#a26860']