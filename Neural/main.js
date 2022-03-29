import {createMatrix} from "./drawMatrix.js";
import {correct} from "./weightsFile.js";
import {correctBias} from "./biasFile.js";

let expected = 0;
let matrixSize = 5;

let vectorSize = []
let inputVectorSize = matrixSize * matrixSize;
let hiddenVectorSize = 17;
let outputVectorSize = 10;
let layersCount = 3;
export let cords = [];

let neuronValues = []
let neuronErrors = []


let bias = []
let weights = []

initialization();
createMatrix(matrixSize)
clearMatrix();
startButtonEvent();
trainButtonEvent();
weights = correct;
bias = correctBias;

function clearMatrix() {
    document.getElementById("clearButton").addEventListener("mousedown", function () {
        for (let i = 0; i < matrixSize; i++) {
            let elements = document.querySelectorAll('td[data-row = "' + i + '"]');
            for (let j = 0; j < matrixSize; j++) {
                elements[j].classList.remove("wall");
                cords[i][j] = 0;
            }
        }
    })
}

function startButtonEvent() {
    document.getElementById("startButton").addEventListener("click", function () {
        inputLayerInit();
        let number = forwardFeed();
        document.getElementById("updateNumber").textContent = number.toString();
    })
}

function trainButtonEvent() {
    document.getElementById("trainButton").addEventListener("click", function () {
        let mass = JSON.parse(stringA);
        for (let k = 0; k < 10; k++) {
            for (let j = 0; j < 100; j++) {
                for (let i = 0; i < 100; i++) {
                    let index = Math.floor(getRandom(0, 100));
                    neuronValues[0] = mass[index][0];
                    expected = mass[index][1];
                    forwardFeed();
                    learning();
                }
            }
        }
        console.log("that's all")
    });


}

// activation
function relu(x) {
    if (x < 0) {
        return 0;
    }
    return x;
}

function derivative(x) {
    if (x < 0) {
        return 0;
    }
    return 1;
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

// helpful functions

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


function forwardFeed() {
    for (let i = 1; i < layersCount; i++) {
        let temp = matrixMultiply(weights[i - 1], neuronValues[i - 1]);
        neuronValues[i] = sumVector(temp, bias[i - 1], vectorSize[i]);
        for (let j = 0; j < vectorSize[i]; j++) {
            neuronValues[i][j] = relu(neuronValues[i][j])
        }
    }

    let prediction = getMaxIndex(neuronValues[layersCount - 1]);
    return prediction;
}

function backPropagation(expect) {
    for (let i = 0; i < vectorSize[layersCount - 1]; i++) {
        if (i !== Math.trunc(expect)) {
            neuronErrors[layersCount - 1][i] = -neuronValues[layersCount - 1][i] * derivative(neuronValues[layersCount - 1][i])
        } else {
            neuronErrors[layersCount - 1][i] = (1.0 - neuronValues[layersCount - 1][i]) * derivative(neuronValues[layersCount - 1][i])
        }
    }
    for (let i = layersCount - 2; i > 0 ; i--) {
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
    //let expected = Number(document.getElementById("updateNumber").textContent)
    backPropagation(+expected);
    weightsUpdate(0.01)
}

// train dataset
let stringA = '[[[0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],"1"],[[0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],"1"],[[0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0],"1"],[[0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0],"1"],[[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0],"1"],[[1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,0],"2"],[[0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,0,1,1,1,0],"2"],[[0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,0,1,1,1],"2"],[[0,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,1,1,0],"2"],[[1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,1,1,0,0],"2"],[[1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0],"3"],[[1,1,1,0,0,1,0,1,0,0,1,1,1,1,1,0,0,1,0,1,0,0,1,1,1],"8"],[[1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1,1,1,0,0],"3"],[[0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0],"3"],[[0,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1,1,1,0],"3"],[[0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1],"3"],[[0,0,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1,1,1],"3"],[[1,0,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0],"4"],[[1,0,0,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0],"4"],[[0,1,0,0,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,0],"4"],[[0,1,0,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,0],"4"],[[0,0,1,0,0,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1],"4"],[[0,0,1,0,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1],"4"],[[1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0],"5"],[[1,1,1,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0,1,1,0,0,0],"5"],[[0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0],"5"],[[0,1,1,1,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0,1,1,0,0],"5"],[[0,0,1,1,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0,1,1,0,0],"5"],[[0,0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1],"5"],[[0,0,0,1,1,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0,1,1,0],"5"],[[1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0],"6"],[[1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0],"6"],[[0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0],"6"],[[0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0],"6"],[[0,0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1],"6"],[[1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],"7"],[[0,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0],"7"],[[0,1,1,1,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,1,0],"7"],[[0,0,1,1,1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1],"7"],[[1,1,1,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,1,0,0],"7"],[[0,1,1,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,1,1,0],"0"],[[0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0],"8"],[[0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1],"8"],[[0,0,1,1,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,1,1],"0"],[[1,1,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,1,1,0,0],"0"],[[1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0],"8"],[[0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],"1"],[[0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0],"1"],[[0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,0,1,1,1,0],"2"],[[0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0],"3"],[[0,1,0,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,0],"4"],[[0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0],"5"],[[0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0],"6"],[[0,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0],"7"],[[0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0],"9"],[[0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0],"8"],[[1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0],"9"],[[0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1],"9"],[[1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0],"3"],[[0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1],"3"],[[0,0,1,0,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1],"4"],[[1,0,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0],"4"],[[0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0],"5"],[[0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0],"6"],[[0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0],"8"],[[0,1,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,1],"0"],[[0,1,1,1,1,0,1,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,1,1,1],"8"],[[0,1,1,1,1,0,1,0,0,1,0,1,1,1,1,0,0,0,0,1,0,1,1,1,1],"9"],[[0,1,1,1,1,0,1,0,0,0,0,1,1,1,1,0,0,0,0,1,0,1,1,1,1],"5"],[[0,0,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],"1"],[[0,1,1,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,1,0,0],"7"],[[0,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,1,1,0],"2"],[[0,1,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,0,0,0],"9"],[[0,0,0,1,1,0,0,1,0,1,0,0,0,1,1,0,0,0,0,1,0,0,1,1,0],"9"],[[0,0,1,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,0,1,0,0],"0"],[[0,1,1,1,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,1,1,0],"8"],[[0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,0,1,1,1,0],"2"],[[0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0],"6"],[[0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0],"5"],[[0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0],"9"],[[0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0],"8"],[[0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,0,1,1,1,0],"2"],[[0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],"1"],[[0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0],"1"],[[0,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1,1,0,0],"3"],[[0,1,0,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,0],"4"],[[0,1,0,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,0],"4"],[[0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,0],"9"],[[0,1,1,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,1,1,0],"0"],[[0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],"1"],[[0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],"1"],[[1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0],"5"],[[1,1,1,0,0,1,0,0,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0],"6"],[[1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0],"8"],[[0,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0],"7"],[[0,1,1,1,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,1,0],"7"],[[1,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,1,0],"0"],[[1,1,1,1,0,1,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,1,1,1,0],"8"],[[0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,0,0],"9"],[[0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,1,0,1,0,0,1,1,1,0],"8"],[[0,1,1,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0],"9"]]';





