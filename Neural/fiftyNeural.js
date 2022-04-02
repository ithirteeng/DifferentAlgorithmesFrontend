import {createMatrix} from "./drawMatrixForFifty.js";
import {correctFiftyBias} from "./src/fiftyBiasFile.js";
import {weightsBruh} from "./src/weigthsForFifty.js";


let expected = 0;
let matrixSize = 50;

let vectorSize = []
let inputVectorSize = matrixSize * matrixSize;
let hiddenVectorSize = 150;
let outputVectorSize = 10;
let layersCount = 3;
let cords = [];

let neuronValues = []
let neuronErrors = []


let bias = []
let weights = []

initialization();
cords = createMatrix(matrixSize, cords);
clearMatrixButtonEvent();
startButtonEvent();

bias = correctFiftyBias;
weights = weightsBruh;


//buttons events
function clearMatrixButtonEvent() {
    document.getElementById("clearButton").addEventListener("mousedown", function () {
        clearMatrix();
    })
}

function startButtonEvent() {
    document.getElementById("startButton").addEventListener("click", function () {

        inputLayerInit();
        let number = forwardFeed();
        let string = document.getElementById("updateNumber").textContent;
        if (string[string.length - 1] >= '0' && string[string.length - 1] <= '9') {
            document.getElementById("updateNumber").textContent = string.substring(0, string.length - 1) + number.toString();
        } else {
            document.getElementById("updateNumber").textContent += number.toString();
        }


    })
}


// activation functions
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x))
}


function derivative(x) {
    return sigmoid(x) * (1 - sigmoid(x))
}

//matrix actions
function transparentMatrixMultiply(firstMatrix, neuronLayer) {
    const col = firstMatrix[0].length;
    const row = firstMatrix.length
    let temp = new Array(row)
    if (row !== neuronLayer.length) {
        alert("It doesn't works well (transparent matrix size exception)");
    } else {
        for (let i = 0; i < col; i++) {
            let c = 0.0;
            for (let j = 0; j < row; j++) {
                c += Number(firstMatrix[j][i]) * neuronLayer[j]
            }
            temp[i] = c;
        }
    }
    return temp;
}

function matrixMultiply(firstMatrix, neuronLayer) {
    const col = firstMatrix[0].length;
    const row = firstMatrix.length
    let temp = new Array(row)
    if (col !== neuronLayer.length) {
        alert("It doesn't works well (matrix size exception)");
    } else {
        for (let i = 0; i < row; i++) {
            let c = 0.0;
            for (let j = 0; j < col; j++) {
                c += Number(firstMatrix[i][j]) * neuronLayer[j]
            }
            temp[i] = c;
        }
    }
    return temp;
}

function sumVector(firstVector, secondVector, size) {
    let temp = firstVector
    for (let i = 0; i < size; i++) {
        temp[i] += secondVector[i];
    }
    return temp
}


//initialization
function initialization() {
    //sizes init
    vectorSize[0] = inputVectorSize;
    vectorSize[1] = hiddenVectorSize;
    vectorSize[2] = outputVectorSize;
    //weights init
    weights = new Array(layersCount - 1);
    setWeights();
    //bias init
    bias = new Array(layersCount - 1);
    setBiasValues();
    //errors and normal neuron layers init
    layersInit();
}

function setWeights() {
    for (let i = 0; i < layersCount - 1; i++) {
        weights[i] = new Array(vectorSize[i + 1]);
        for (let j = 0; j < vectorSize[i + 1]; j++) {
            weights[i][j] = new Array(vectorSize[i]);
            for (let k = 0; k < vectorSize[i]; k++) {
                weights[i][j][k] = getRandom(-1, 1);
            }
        }
    }
}

function setBiasValues() {
    for (let i = 0; i < layersCount - 1; i++) {
        bias[i] = new Array(vectorSize[i + 1]);
        for (let j = 0; j < vectorSize[i + 1]; j++) {
            bias[i][j] = getRandom(-1, 1)
        }
    }
}

function layersInit() {
    neuronValues = new Array(layersCount);
    neuronErrors = new Array(layersCount)
    for (let i = 0; i < layersCount; i++) {
        neuronValues[i] = new Array(vectorSize[i]);
        neuronErrors[i] = new Array(vectorSize[i]);
    }
}

function inputLayerInit() {
    let counter = 0;
    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            neuronValues[0][counter] = cords[i][j];
            counter++;
        }
    }
}

function layerUpdating() {
    let temp = []
    let counter = 0;
    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            temp[counter] = cords[i][j];
            counter++;
        }
    }
    return temp;
}


// helpful functions
function checkMatrix() {
    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            if (cords[i][j] !== 0) {
                return true;
            }
        }
    }
    return false;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function getMaxIndex(vector) {
    let max = vector[0];
    let maxIndex = 0;
    let temp;

    for (let i = 1; i < vectorSize[layersCount - 1]; i++) {
        temp = vector[i];
        if (temp > max) {
            maxIndex = i;
            max = temp;
        }
    }
    return maxIndex;
}

function clearMatrix() {
    let string = document.getElementById("updateNumber").textContent;
    if (string[string.length - 1] >= '0' && string[string.length - 1] <= '9') {
        string = string.slice(0, -1)
    }

    document.getElementById("updateNumber").textContent = string
    for (let i = 0; i < matrixSize; i++) {
        let elements = document.querySelectorAll('td[data-row = "' + i + '"]');
        for (let j = 0; j < matrixSize; j++) {
            elements[j].classList.remove("wall");
            cords[i][j] = 0;
        }
    }
}

// main algorithms
function forwardFeed() {
    for (let i = 1; i < layersCount; i++) {
        let temp = matrixMultiply(weights[i - 1], neuronValues[i - 1]);
        neuronValues[i] = sumVector(temp, bias[i - 1], vectorSize[i]);
        for (let j = 0; j < vectorSize[i]; j++) {
            neuronValues[i][j] = sigmoid(neuronValues[i][j])
        }
    }
    return getMaxIndex(neuronValues[layersCount - 1]);
    //console.log(prediction)
}

function backPropagation(expect) {
    for (let i = 0; i < vectorSize[layersCount - 1]; i++) {
        if (i !== Math.trunc(expect)) {
            neuronErrors[layersCount - 1][i] = -neuronValues[layersCount - 1][i] * derivative(neuronValues[layersCount - 1][i])
        } else {
            neuronErrors[layersCount - 1][i] = (1.0 - neuronValues[layersCount - 1][i]) * derivative(neuronValues[layersCount - 1][i])
        }
    }
    for (let i = layersCount - 2; i > 0; i--) {
        neuronErrors[i] = transparentMatrixMultiply(weights[i], neuronErrors[i + 1]);
        for (let j = 0; j < vectorSize[i]; j++) {
            neuronErrors[i][j] *= derivative(neuronValues[i][j]);
        }
    }
}

function weightsUpdate(learningRate) {
    for (let i = 0; i < layersCount - 1; i++) {
        for (let j = 0; j < vectorSize[i + 1]; j++) {
            for (let k = 0; k < vectorSize[i]; k++) {
                weights[i][j][k] += neuronValues[i][k] * neuronErrors[i + 1][j] * learningRate;
            }
        }
    }
    for (let i = 0; i < layersCount - 1; i++) {
        for (let j = 0; j < vectorSize[i + 1]; j++) {
            bias[i][j] += neuronErrors[i + 1][j] * learningRate;
        }
    }
}

function learning() {
    backPropagation(+expected);
    weightsUpdate(0.003)
}



