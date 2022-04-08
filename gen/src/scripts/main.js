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
        this.arrayOfGens = JSON.parse(JSON.stringify(dataArray));
        this.first_chromosome = Array.from(Array(dataArray.length).keys()) // Contain number of every gen from 0 to N gens. It needs to create populations
        this.distances = [[/*variable for matrix of distances between gens*/]];
        this.createMatrixOfDistances(computeEuclidDistance); // Can be changed by another metric
        this.population = [[/*variable for array of population arrays*/]]
        this.recordDistance = Infinity;
        this.bestEver = this.arrayOfGens;
        this.createPopulation();
        this.crossing();
        console.log(this.population)
        this.selection();
        console.log(this.population)
    }

    createMatrixOfDistances(computeDistance) {
        // matrix of distances between gens(towns)

        this.distances = [];
        for (let i = 0; i < this.arrayOfGens.length; i++) {
            let interimArray = [];
            for (let j = 0; j < this.arrayOfGens.length; j++) {
                let x = computeDistance(this.arrayOfGens[i], this.arrayOfGens[j]);
                interimArray.push(x);
            }
            this.distances.push(interimArray);
        }
    }

    shuffle(arr) {
        // function to shuffle array. Can be used as Mutation
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
        sum += this.distances[order[0]][order[order.length - 1]]; // way is looped;
        return sum;
    }


    createPopulation() {
        // shuffling array of numbers to create population with (population_length) individuals

        this.population = [];
        for (let i = 0; i < population_length; i++) {
            let new_chromosome = this.shuffle(this.first_chromosome);
            // this.calcDistance(new_chromosome)
            this.population.push(new_chromosome);
        }
    }

    crossing() {
        // after this method population length is doubled

        let population = this.shuffle(this.population);        // shuffle for random parent pairs distribution
        let separator = Math.ceil(population[0].length / 3);
        let popLength = this.population.length;
        for (let i = 0; i < popLength; i += 2) {
            let parent1 = population.pop();
            let parent2 = population.pop();
            let child1 = [];
            let child2 = [];
            for (let j = 0; j <= separator; j++) { // Fill part in chromosome before separator (inclusive)
                child1.push(parent1[j]);
                child2.push(parent2[j]);
            }
            for (let j = 0; j < parent1.length; j++) {
                let par1jInChild2 = false;
                for (let k = 0; k < child2.length; k++) {
                    if (parent1[j] === child2[k]) {
                        par1jInChild2 = true;
                        break;
                    }
                }
                let par2jInChild1 = false;
                for (let k = 0; k < child1.length; k++) {
                    if (parent2[j] === child1[k]) {
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
            this.calcDistance(child1);
            this.calcDistance(child2);
            this.population.push(child1);
            this.population.push(child2);
        }
    }

    swapMutation(array) {
        // swaps random gens in current chromosome
        let index1, index2;
        while (index2 === index1) {
            index1 = Math.floor(Math.random() * array.length)
            index2 = Math.floor(Math.random() * array.length)
        }
        [array[index1], array[index2]] = [array[index2], array[index1]]
    }

    inversionMutation(array) {
        let index1, index2;
        while ((index2 === index1)) {
            index1 = Math.floor(Math.random() * array.length)
            index2 = Math.floor(Math.random() * array.length)
        }
        if (index1 > index2) {
            [index2, index1] = [index1, index2];
        }
        for (let i = index1, j = index2; j >= i; i++, j--) {
            [array[j], array[i]] = [array[i], array[j]]
        }
    }
    // scrambleMutation(){
    //     // I didn't want to code it that's why it's only stub
    // }
    mutations(typeOfMutation) {
        for (let i = 0; i < this.population.length; i++) {
            if (Math.random() > mutation_rate) {
                continue;
            }
            this.population[i] = typeOfMutation(this.population[i]);
        }
    }

    siftUp(array, i, k) {
        // function for K-min
        while (2 * i + 1 < k) {
            let left = 2 * i + 1, right = 2 * i + 2, j = left;
            if ((right < k) && (this.calcDistance(array[right]) > this.calcDistance(array[left]))) j = right;
            if (this.calcDistance(array[i]) >= this.calcDistance(array[j])) break;
            [array[i], array[j]] = [array[j], array[i]];
            i = j;
        }
    }

    selection() {
        // selection by K-min algorithm
        let x, populationTemp = [];
        for (let i = 0; i < population_length; i++) {
            populationTemp.push(this.population[i]);
        }
        for (let i = population_length / 2; i >= 0; i--) {
            this.siftUp(populationTemp, i, population_length);
        }
        for (let i = population_length; i < this.population.length; i++) {
            x = this.population[i]
            if (this.calcDistance(x) < this.calcDistance(populationTemp[0])) {
                populationTemp.push(x);
                populationTemp[0] = x;
                this.siftUp(populationTemp, 0, population_length);
            }
        }
        this.population = populationTemp;
    }


}

function putPointByClick(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    canvas.drawCirclePoint({x, y}, 'white');
    dataArray.push({x, y});
}

function inputRange(id) {
    // let dict = {'population': population_length, 'generation': generations_number, 'mutation': mutation_rate}
    let rng = document.getElementById(`${id}Range`);
    let counter = document.getElementById(`${id}Counter`);
    counter.textContent = counter.textContent.replace(/\d+/, `${rng.value}`);
    // НЕ ИЗМЕНЯЮТСЯ ПЕРЕМЕННЫЕ ПО ПЕРЕДАННОМУ ID
    switch (id) {
        case 'population':
            population_length = parseInt(rng.value);
        case 'generation':
            generations_number = parseInt(rng.value);
        case 'mutation':
            mutation_rate = parseInt(rng.value);
    }
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
    console.log('CLEAR ALL!')
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
window.onload = canvas.resize.bind(canvas);
let mutation_rate = 0.1;
let population_length = 20;
let generations_number = 2;
let dataArray = [];
let is_started = false;

