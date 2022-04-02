let matrix = document.getElementById("matrix");
let isMouseDown = false;
let mouseCounter = 0;
let lastCellClass = "empty";

document.addEventListener("mouseup", function () {
    isMouseDown = false;
    mouseCounter = 0;
});

export function createMatrix(matrixSize, cords) {
    matrix.innerHTML = "";
    matrix.visibility = false;
    let cellSize = matrix.width / matrixSize;

    for (let i = 0; i < matrixSize; i++) {
        cords[i] = new Array(matrixSize)
        let row = document.createElement('tr');
        for (let j = 0; j < matrixSize; j++) {
            cords[i][j] = 0;
            let element = document.createElement('td');

            element.style.width = cellSize.toString();
            element.style.height = cellSize.toString();
            element.className = "elem";
            element.name = "cell";
            element.dataset.row = i.toString();
            element.dataset.col = j.toString();

            let elemsToDraw = []


            element.addEventListener("mousedown", function() {
                mouseCounter++;
                if (mouseCounter === 1) {
                    lastCellCheck(Number(element.dataset.row), Number(element.dataset.col));
                }
                let startRow = Number(element.dataset.row)
                let startCol = Number(element.dataset.col)
                elemsToDraw = findRightElement(startRow, startCol, matrixSize);

                if (lastCellClass === "empty") {
                    for (let k = 0; k < elemsToDraw.length; k++) {
                        elemsToDraw[k].classList.add("wall")
                        cords[Number(elemsToDraw[k].dataset.row)][Number(elemsToDraw[k].dataset.col)] = 1;
                    }
                    // element.classList.add("wall")
                    // cords[Number(element.dataset.row)][Number(element.dataset.col)] = 1;
                } else {
                    for (let k = 0; k < elemsToDraw.length; k++) {
                        elemsToDraw[k].classList.remove("wall")
                        cords[Number(elemsToDraw[k].dataset.row)][Number(elemsToDraw[k].dataset.col)] = 0;
                    }
                    // element.classList.remove("wall")
                    // cords[Number(element.dataset.row)][Number(element.dataset.col)] = 0;
                }
                isMouseDown = true;
            });

            element.addEventListener("mouseover", function() {
                if (isMouseDown) {
                    mouseCounter++;
                    let startRow = Number(element.dataset.row)
                    let startCol = Number(element.dataset.col)
                    elemsToDraw = findRightElement(startRow, startCol, matrixSize);
                    if (lastCellClass === "empty") {
                        for (let k = 0; k < elemsToDraw.length; k++) {
                            elemsToDraw[k].classList.add("wall")
                            cords[Number(elemsToDraw[k].dataset.row)][Number(elemsToDraw[k].dataset.col)] = 1;
                        }
                        // element.classList.add("wall")
                        // cords[Number(element.dataset.row)][Number(element.dataset.col)] = 1;
                    } else {
                        for (let k = 0; k < elemsToDraw.length; k++) {
                            elemsToDraw[k].classList.remove("wall")
                            cords[Number(elemsToDraw[k].dataset.row)][Number(elemsToDraw[k].dataset.col)] = 0;
                        }
                        // element.classList.remove("wall")
                        // cords[Number(element.dataset.row)][Number(element.dataset.col)] = 0;
                    }
                    document.getElementById("startButton").click()
                }
            });


            row.append(element);
        }
        matrix.append(row);
    }
    return cords;
}

function findRightElement(row, col, matrixSize) {
    let elementsRow = document.querySelectorAll('td[data-row = "' + row + '"]');
    let elementsCol = document.querySelectorAll('td[data-col = "' + col + '"]');

    let data = []
    if (row + 1 === matrixSize && col + 1 !== matrixSize) {
        let elementsRowAbove = document.querySelectorAll('td[data-row = "' + (row - 1) + '"]');

        data.push(elementsRow[col]);
        data.push(elementsRow[col + 1]);
        data.push(elementsRowAbove[col]);
        data.push(elementsRowAbove[col + 1])
    } else if (col + 1 === matrixSize && row + 1 !== matrixSize) {
        let elementsColLeft = document.querySelectorAll('td[data-col = "' + (col - 1) + '"]');

        data.push(elementsRow[col]);
        data.push(elementsCol[row + 1])
        data.push(elementsColLeft[row]);
        data.push(elementsColLeft[row + 1]);
    } else if(row + 1 === matrixSize && col + 1 === matrixSize) {
        let elementsRowAbove = document.querySelectorAll('td[data-row = "' + (row - 1) + '"]');

        data.push(elementsRow[col]);
        data.push(elementsRow[col - 1]);
        data.push(elementsCol[row - 1]);
        data.push(elementsRowAbove[col - 1]);

    } else {
        let elementsRowAbove = document.querySelectorAll('td[data-row = "' + (row + 1) + '"]');
        data.push(elementsRow[col]);
        data.push(elementsRow[col + 1]);
        data.push(elementsCol[row + 1])
        data.push(elementsRowAbove[col + 1]);
    }

    return data;
}

function lastCellCheck(row, col) {
    let elements = document.querySelectorAll('td[data-row = "' + row + '"]');
    if (elements[col].classList.contains("wall")) {
        lastCellClass = "wall";
    } else {
        lastCellClass = "empty"
    }
}