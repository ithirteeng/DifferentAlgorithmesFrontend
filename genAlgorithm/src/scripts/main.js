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

    restorePoints(arrayOfPoints) {
        // Redraw points from arrayOfPoints;
        arrayOfPoints.forEach(item => {
            canvas.drawCirclePoint(item, 'white');
        })
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

    drawWay(array, color) {
        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.strokeStyle = color;
        this.context.moveTo(array[0].x, array[0].y);
        for (let i = 0; i < array.length; i++) {
            this.context.lineTo(dataArray[array[i]].x, dataArray[array[i]].y);
        }
        this.context.lineTo(dataArray[array[0]].x, dataArray[array[0]].y);
        this.context.stroke();
    }
}

class GeneticAlgorithm {
    constructor(dataArray) {
        this.arrayOfGens = dataArray; // just link to dataArray
        this.first_chromosome = Array.from(Array(this.arrayOfGens.length).keys()) // Contain number of every gen from 0 to N gens. It needs to create populations
        this.bestEver = [];
        this.bestDistance = Infinity;
        this.mutationTypes = {
            "swap": this.swapMutation,
            "inversion": this.inversionMutation,
            "scramble": this.scrambleMutation,
            "random": this.randomMutation.bind(this)
        }
        this.distancesBtwGens = [[/*variable for matrix of distances between gens*/]];
        checkRadioButtons("metric");
        this.createMatrixOfDistances(metricTypes[distanceMetric]);
        console.log(metricTypes[distanceMetric])
        this.population = [[/*variable for array of population arrays*/]]
        this.createFirstPopulation();
        this.algorithm();
    }

    createMatrixOfDistances(distanceMetric) {
        // matrix of distances between gens(towns)

        this.distancesBtwGens = [];
        for (let i = 0; i < this.arrayOfGens.length; i++) {
            let interimArray = [];
            for (let j = 0; j < this.arrayOfGens.length; j++) {
                let x = distanceMetric(this.arrayOfGens[i], this.arrayOfGens[j]);
                interimArray.push(x);
            }
            this.distancesBtwGens.push(interimArray);
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
            sum += this.distancesBtwGens[townA][townB];
        }
        sum += this.distancesBtwGens[order[0]][order[order.length - 1]]; // way is looped;
        return sum;
    }

    createFirstPopulation() {
        // shuffling array of numbers to create population with (population_length) individuals

        this.population = [];
        this.population.push(this.first_chromosome)
        for (let i = 0; i < population_length -1; i++) {
            let new_chromosome = this.shuffle(this.first_chromosome);
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

    swapMutation(array, index1, index2) {
        // swaps index1 and index2 gens in current chromosome
        [array[index1], array[index2]] = [array[index2], array[index1]]
    }

    inversionMutation(array, index1, index2) {
        // inverse elements between index1 and index2
        for (let i = index1, j = index2; j >= i; i++, j--) {
            [array[j], array[i]] = [array[i], array[j]]
        }
    }

    scrambleMutation(array, index1, index2) {
        // shuffle elements between index1 and index2
        let currentIndex = index2, randomIndex;
        while (currentIndex != index1) {
            randomIndex = index1 + Math.floor(Math.random() * (currentIndex - index1));
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
    }

    randomMutation(array, index1, index2) {
        // choose with random chance swap, inversion or scramble mutation
        let random = Math.random();
        if (random < 0.333333334) {
            this.swapMutation(array, index1, index2);
        } else if (random < 0.666666667) {
            this.scrambleMutation(array, index1, index2);
        } else {
            this.inversionMutation(array, index1, index2);
        }
    }

    mutations(typeOfMutation) {
        for (let i = 0; i < this.population.length; i++) {
            if (Math.random() > mutation_rate) {
                continue;
            }
            let index1, index2;
            while ((index2 === index1)) {
                index1 = Math.floor(Math.random() * this.population[i].length)
                index2 = Math.floor(Math.random() * this.population[i].length)
            }
            if (index1 > index2) {
                [index2, index1] = [index1, index2];
            }
            typeOfMutation(this.population[i], index1, index2);
        }
    }

    selection() {
        // selection by sorting
        let arrayOfChromosomeDistances = Array.from(this.population, this.calcDistance, this);
        let arrayOfPopulationIndexes = Array.from(Array(this.population.length).keys());
        arrayOfPopulationIndexes = arrayOfPopulationIndexes.sort((a, b) => {
            if (arrayOfChromosomeDistances[a] < arrayOfChromosomeDistances[b]) {
                return -1;

            } else if (arrayOfChromosomeDistances[a] > arrayOfChromosomeDistances[b]) {
                return 1;
            } else {
                return 0;
            }
        })
        let populationTemp = Array.from(arrayOfPopulationIndexes, item => this.population[item], this);
        this.population = populationTemp.slice(0, population_length)
    }

    async algorithm() {
        canvas.drawWay(this.first_chromosome, 'brown')
        let currentGeneration = 1;
        let conditionToStop = (currentGeneration) => { // тут можно добавить различных условий, помимо текущего поколения
            return (currentGeneration > generation_number)
        }
        while (!conditionToStop(currentGeneration)) {
            this.crossing();
            this.mutations(this.mutationTypes[mutationType]);
            this.selection();
            let bestPopulationDistance = this.calcDistance(this.population[0]);
            if (bestPopulationDistance < this.bestDistance) {
                this.bestEver = this.population[0];
                this.bestDistance = bestPopulationDistance;
                await (10)

                canvas.clearField();
                canvas.drawWay(this.bestEver, 'brown')
                canvas.restorePoints(dataArray);
            }
            currentGeneration++;
        }
    }
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
    canvas.drawCirclePoint({x, y}, 'white');
    dataArray.push({x, y});
}

function inputRange(id) {
    let rng = document.getElementById(`${id}Range`);
    let counter = document.getElementById(`${id}Counter`);
    counter.textContent = counter.textContent.replace(/\d+/, `${rng.value}`);
    switch (id) {
        case 'population':
            population_length = parseInt(rng.value);
            break;
        case 'generation':
            generation_number = parseInt(rng.value);
            break;
        case 'mutation':
            mutation_rate = parseInt(rng.value) / 100;
            break;
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

function checkRadioButtons(name) {
    let radioButtons = document.getElementsByName(name)
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            switch (name) {
                case "mutation" :
                    mutationType = radioButton.value;
                    break;
                case "metric":
                    distanceMetric = radioButton.value;
                    break;
            }
            break;
        }
    }
}


function startGenAlgorithm() {
    if (checkPoints()) {
        return;
    }
    checkRadioButtons("mutationType")
    document.getElementById('Start').textContent = "Restart";
    if (is_started) {
        canvas.clearField();
        canvas.restorePoints(dataArray);
        console.log("Restart GA");
    } else {
        console.log("Start Genetic algorithm");
        is_started = true;
    }
    let solve = new GeneticAlgorithm(dataArray, generation_number);
}

function clearAll() {
    // Clears canvas and data. Creates standard solve with current amount of clusters
    console.log('CLEAR ALL!')
    dataArray = [];
    canvas.clearField();
    document.getElementById('Start').textContent = "Start"
    is_started = false;
}
function showSettings(id) {
    let block = document.getElementById(`${id}-Drop-settings`)
    if (block.style.display === "block") {
        block.style.display = "none";
    } else {
        block.style.display = "block";
    }
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
let is_started = false;
let dataArray = [];
metricTypes = {
    "euclid": computeSquareEuclidDistance,
    "chebyshev": computeChebyshevDistance,
    "manhattan": computeManhattanDistance,
}
let distanceMetric = "euclid"
let mutationType = "random"
let mutation_rate = 0.2;
let population_length = 20;
let generation_number = 20;


