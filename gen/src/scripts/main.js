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

class


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
    if (is_started) {
        restore();
    }
    console.log("Старт K-means");
    is_started = true;
    ФУНКЦИЯ СТАРТА //(let solve = new ClassObject(dataArray, чот еще )
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
    document.getElementById('Start').textContent = "Start"
    is_started = false;
}

let canvas = new Canvas('canvas_1', 'container-canvas');
canvas.canvas.addEventListener('mousedown', function (event) {
    putPointByClick(event, canvas);
    if (is_started) {
        startKMeans();
    }
})

window.addEventListener('resize', function () {
    canvas.resize();
    clearAll();
}, false);
canvas.resize();

let dataArray = [];
let is_started = false;