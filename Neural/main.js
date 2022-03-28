import {createMatrix} from "./drawMatrix.js";
let matrixSize = 5;
export let cords = [];

createMatrix(matrixSize)
clearMatrix();


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