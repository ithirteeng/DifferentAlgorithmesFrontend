alert("Настройте громкость звука");
playMusic();

function playMusic() {
    let music = document.createElement("audio");
    music.src = "./src/music/clustMusic.m4a";
    music.autoplay = true;

}

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

    drawCirclePoint(point, color, startR = 0, endR = 2) {
        // draw Circle or arc from startR to endR with current color
        // to draw full circle startR = 0, endR = 2
        // to draw left half startR = 1/2, endR = -1/2
        // to draw right half startR = 3/2, endR = 1/2
        let ctx = this.context;
        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 8;
        ctx.fillStyle = color;
        let radius = 10;
        ctx.arc(point.x + 3, point.y + 4, radius, startR * Math.PI, endR * Math.PI);
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


class KMeans {
    constructor(dataArray) {
        this.points = JSON.parse(JSON.stringify(dataArray));
        this.centroids = [];
        this.prevCentroids = [];
        this.showCentroids = (document.getElementById("KMeansShowCentroids").checked)
        this.computeDistanceFunction = distanceMetrics[checkRadioButtons("KMeansMetric")]
        this.identify_clusters();
        this.clustering();
    }

    change_points_cluster() {
        for (let i = 0; i < this.points.length; i++) {
            for (let j = 0; j < clusters_number_KMeans; j++) {
                let distance = this.computeDistanceFunction(this.points[i], this.centroids[j])
                if (distance < this.points[i].minDistance) {
                    this.points[i].minDistance = distance;
                    this.points[i].cluster = j;
                    // if agnes is started this draws left half else full circle
                    agnes_is_started ? canvas.drawCirclePoint(this.points[i], this.centroids[j].color, 1 / 2, -1 / 2) : canvas.drawCirclePoint(this.points[i], this.centroids[j].color)
                }
            }
        }
    }

    identify_clusters() {

        for (let i = 0; i < clusters_number_KMeans; i++) {
            let centroid = {
                x: Math.round((canvas.width - 40) * Math.random() + 1),
                y: Math.round((canvas.height - 40) * Math.random() + 1),
                color: colorsKMeans[i],
                pointsAmount: 0,
                meanDistance: -1,
            };
            this.centroids.push(centroid);
            if (this.showCentroids) {
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
            agnes_is_started ? startAGNES() : 0;
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
                if (this.showCentroids) {
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
    constructor(dataArray) {
        this.points = dataArray.map(item => {
            return {x: item.x, y: item.y}
        });
        this.computeDistanceBtwClustersFunctions = {"Min": dist_min, "Max": dist_max, "Average": dist_avg}
        this.showCentroids = (document.getElementById("AGNESShowCentroids").checked)
        this.centroids = [];
        this.distances = [];
        this.computeDistanceFunction = distanceMetrics[checkRadioButtons("AGNESMetric")];
        this.computeDistanceBtwClustersFunction = this.computeDistanceBtwClustersFunctions[checkRadioButtons("AGNESDistanceBtwClusters")];
        this.initialize_clusters();
        this.clustering();
        this.drawPoints();
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
                distances_i.push(this.computeDistanceBtwClustersFunction(item_i, item_j, this.computeDistanceFunction));
            }, this)
            this.distances.push(distances_i);
        }, this)
    }

    clustering() { // Возможно можно вставить сюда инициализацию кластеров и вызывать методы прямо в конструкторе? Но хз
        let N = this.points.length;
        while (N > clusters_number_AGNES) {
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
        let min = Infinity;
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

    drawPoints() {
        this.centroids.forEach(function (item, index) {
            let centroid = {x: 0, y: 0, pointsNumber: 0, color: colorsShiftMeans[index]}
            item.forEach(point => {
                // if k_means is started this draws right half else full circle
                k_means_is_started ? canvas.drawCirclePoint(point, centroid.color, 3 / 2, 1 / 2) : canvas.drawCirclePoint(point, centroid.color);
                centroid.x += point.x;
                centroid.y += point.y;
                centroid.pointsNumber++;
            }, this);
            centroid.x /= centroid.pointsNumber;
            centroid.y /= centroid.pointsNumber;
            if (this.showCentroids) {
                canvas.drawTrianglePoint(centroid, centroid.color);
            }
        }, this);
    }


}


function dist_min(arrI, arrJ, distMetric) {
    let min = Infinity;
    for (let i = 0; i < arrI.length; i++) {
        for (let j = 0; j < arrJ.length; j++) {
            let distance = distMetric(arrI[i], arrJ[j]);
            if (distance < min) {
                min = distance;
            }
        }
    }
    return min;
}

function dist_max(arrI, arrJ, distMetric) {
    let max = -Infinity;
    for (let i = 0; i < arrI.length; i++) {
        for (let j = 0; j < arrJ.length; j++) {
            let distance = distMetric(arrI[i], arrJ[j]);
            if (distance > max) {
                max = distance;
            }
        }
    }
    return max;
}

function dist_avg(arrI, arrJ, distMetric) {
    let avg = 0;
    for (let i = 0; i < arrI.length; i++) {
        for (let j = 0; j < arrJ.length; j++) {
            let distance = distMetric(arrI[i], arrJ[j]);
            avg += distance;
        }
    }
    return avg / (arrJ.length * arrI.length);
}

function compareArr(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2)
}

function computeSquareEuclidDistance(point1, point2) {
    return (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2
}

function computeManhattanDistance(point1, point2) {
    return (Math.abs(point1.x - point2.x) + Math.abs(point2.y - point1.y))
}

function computeChebyshevDistance(point1, point2) {
    return (Math.max(Math.abs(point1.x - point2.x), Math.abs(point2.y - point1.y)))
}

function putPointByClick(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    canvas.drawCirclePoint({x, y}, 'white', 0, 2);
    dataArray.push({x, y, minDistance: 99999999, cluster: -1, color: 'white'});
}

function inputRange(id) {
    let rng = document.getElementById(`${id}Range`);
    let counter = document.getElementById(`${id}Counter`);
    counter.textContent = counter.textContent.replace(/\d+/, `${rng.value}`);
    switch (id) {
        case 'KMeans-cluster-number':
            clusters_number_KMeans = parseInt(rng.value);
            break;
        case 'AGNES-cluster-number':
            clusters_number_AGNES = parseInt(rng.value);
            break;
    }

}

function checkPoints() {
    // if CanvasField is clear raise alert
    if (dataArray.length === 0) {

        alert("Поставьте точки!");
        return true;
    }
    return false;
}

function checkRadioButtons(name) {
    // returns checked radiobutton value of "name" group
    let radioButtons = document.getElementsByName(name)
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            return radioButton.value;
        }
    }
}

function startKMeans() {
    if (checkPoints()) {
        return;
    }
    document.getElementById('Start K-means').textContent = "Restart";
    if (k_means_is_started) {
        if (!agnes_is_started) {
            canvas.clearField();
            restore();
        }
    }

    let k_means = new KMeans(dataArray);
    k_means_is_started = true;

}

function startAGNES() {
    if (checkPoints()) {
        return;
    }
    document.getElementById('Start AGNES').textContent = "Restart";
    if (agnes_is_started) {
        if (!k_means_is_started) {
            canvas.clearField();
            restore();
        }
    }

    let agnes = new AGNES(dataArray, dist_min);
    agnes_is_started = true;
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

    dataArray = [];
    canvas.clearField();
    document.getElementById('Start K-means').textContent = "Start"
    document.getElementById('Start AGNES').textContent = "Start"
    k_means_is_started = false;
    agnes_is_started = false;
}

function showSettings(id) {
    let block = document.getElementById(`${id}-Drop-settings`)
    if (block.style.display === "block") {
        block.style.display = "none";
    } else {
        block.style.display = "block";
    }
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
window.onload = canvas.resize.bind(canvas);

let distanceMetrics = {
    "euclid": computeSquareEuclidDistance,
    "manhattan": computeManhattanDistance,
    "chebyshev": computeChebyshevDistance,
}
let clusters_number_AGNES = 2;
let clusters_number_KMeans = 2;
let dataArray = [];
let k_means_is_started = false;
let agnes_is_started = false;
let strokeColor = 'black';
const colorsKMeans = ['#ff0000', 'orange', 'yellow', '#00ff00', 'lightskyblue', '#0000ff', 'blueviolet', '#6c9edc', '#9e16a2', '#9c83ff', '#1e62d1', '#deb3b5', '#d69e88', '#af8f47', '#843aaa', '#6a61d6', '#ac2de0', '#b475b7', '#624d4f', '#9eb838'];
const colorsShiftMeans = ['#5c50f7', '#758d2f', '#3afba3', '#90e031', '#189c57', '#afc08d', '#7212d5', '#49b666', '#1131e5', '#8a9f9a', '#7ab94d', '#ce15d0', '#4777d9', '#1f5b10', '#c724a0', '#974f3a', '#9a2040', '#e13124', '#9ea22f', '#a26860']