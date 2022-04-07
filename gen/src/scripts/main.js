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

    drawCirclePoint(point, color) {
        let ctx = this.context;
        ctx.beginPath();
        ctx.strokeStyle = "brown";
        ctx.lineWidth = 8;
        ctx.fillStyle = color;
        let radius = 10;
        ctx.arc(point.x + 3, point.y + 4, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = 'black';
    }
}

class GeneticAlgorithm {
    constructor(dataArray, generations_number) {
        this.first_chromosome = JSON.parse(JSON.stringify(dataArray));
        this.population = [[/*variable for array of population arrays*/]]
        this.distances = [[/*variable for matrix of distances*/]];
        this.recordDistance = Infinity;
        this.bestEver = this.first_chromosome;
        this.createMatrixOfDistances();
        this.createPopulation();
        this.crossing();
    }

    shuffle(arr) {
        // function to shuffle first chromosome for first population
        let array = JSON.parse(JSON.stringify(arr));
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    calcDistance(order) {
        let sum = 0;
        for (let i = 0; i < order.length - 1; i++) {
            let townA = order[i];
            let townB = order[i + 1];
            sum += this.distances[townA][townB];
        }
        sum += this.distances[order[0]][order[order.length]]; // way is looped;
        return sum;
    }

    createMatrixOfDistances() {
        this.distances = [];
        for (let i = 0; i < this.first_chromosome.length; i++) {
            let interimArray = [];
            for (let j = 0; j < this.first_chromosome.length; j++) {
                let x = computeEuclidDistance(this.first_chromosome[i], this.first_chromosome[j]);
                interimArray.push(x);
            }
            this.distances.push(interimArray);
        }
    }

    createPopulation() {
        // shuffle function from p5
        this.population = [];
        for (let i = 0; i < population_length; i++) {
            this.population.push(this.shuffle(this.first_chromosome));
        }
    }

    crossing() {
        // Не доделал!
        let population = this.shuffle(this.population);        // shuffle for random parent pairs distribution
        let separator = Math.ceil(population[0].length / 3);
        for (let i = 0; i < this.population.length; i += 2) {
            let parent1 = population.pop();
            let parent2 = population.pop();
            // console.log("parent 1 = ", parent1)
            // console.log("parent 2 = ", parent2)
            let child1 = [];
            let child2 = [];
            for (let j = 0; j <= separator; j++) { // Fill part in chromosome before separator (inclusive)
                child1.push(parent1[j]);
                child2.push(parent2[j]);
            }
            for (let j = 0; j < parent1.length; j++) {
                let par1jInChild2 = false;
                for (let k = 0; k < child2.length; k++) {
                    if (comparePoints(parent1[j], child2[k])) {
                        par1jInChild2 = true;
                        break;
                    }
                }
                let par2jInChild1 = false;
                for (let k = 0; k < child1.length; k++) {
                    if (comparePoints(parent2[j], child1[k])) {
                        par2jInChild1 = true;
                        break;
                    }
                }
                if (!par1jInChild2) {
                    child2.push(parent1[j]);
                }
                if (!par2jInChild1) {
                    child1.push(parent2[j]);
                }
            }
            // console.log("child 1 = ", child1);
            // console.log("child 2 = ", child2);
            this.population.push(child1);
            this.population.push(child2);
        }
    }
    mutation(){

    }
}

function putPointByClick(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    canvas.drawCirclePoint({x, y}, 'white');
    dataArray.push({x, y});
}

function inputRange(id) {
    let dict = {'population': population_length, 'generation': generations_number}
    let rng = document.getElementById(`${id}Range`);
    let counter = document.getElementById(`${id}Counter`);
    counter.textContent = counter.textContent.replace(/\d+/, `${rng.value}`);
    // НЕ ИЗМЕНЯЮТСЯ ПЕРЕМЕННЫЕ ПО ПЕРЕДАННОМУ ID
    dict[id] = parseInt(rng.value);
    console.log(`Изменен ${id} range`);
}

function checkPoints() {
    // if CanvasField is clear raises alert
    if (dataArray.length === 0) {
        console.log("Точек нет!");
        alert("Поставьте точки!");
        return true;
    }
}

function computeEuclidDistance(point1, point2) {
    return (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2
}

function comparePoints(point1, point2) {
    if (point1.x === point2.x && point1.y === point2.y) {
        return true;
    } else {
        return false;
    }
}

function startGenAlgorithm() {
    if (checkPoints()) {
        return;
    }
    document.getElementById('Start').textContent = "Restart";
    if (is_started) {
        restore();
    }
    console.log("Старт Genetic algorithm");
    is_started = true;
    let solve = new GeneticAlgorithm(dataArray, generations_number);
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
    console.log('CLEEEEEAR!')
    dataArray = [];
    canvas.clearField();
    document.getElementById('Start').textContent = "Start"
    is_started = false;
}

let canvas = new Canvas('canvas_1', 'canvas');
canvas.canvas.addEventListener('mousedown', function (event) {
    putPointByClick(event, canvas);
    if (is_started) {
        startGenAlgorithm();
    }
})
window.addEventListener('resize', function () {
    canvas.resize();
    clearAll();
}, false);
canvas.resize();

let mutation_rate = 0.1;
let population_length = 10;
let generations_number = 2;
let dataArray = [];
let is_started = false;