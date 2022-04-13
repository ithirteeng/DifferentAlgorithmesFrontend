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
            


            element.addEventListener("mousedown", function() {
                mouseCounter++;
                if (mouseCounter === 1) {
                    lastCellCheck(Number(element.dataset.row), Number(element.dataset.col));
                }

                if (lastCellClass === "empty") {
                    element.classList.add("wall")
                    cords[Number(element.dataset.row)][Number(element.dataset.col)] = 1;
                } else {
                    element.classList.remove("wall")
                    cords[Number(element.dataset.row)][Number(element.dataset.col)] = 0;
                }
                isMouseDown = true;
                document.getElementById("startButton").click()
            });
            element.addEventListener("mouseover", function() {
                if (isMouseDown) {
                    mouseCounter++;
                    if (lastCellClass === "empty") {
                        element.classList.add("wall")
                        cords[Number(element.dataset.row)][Number(element.dataset.col)] = 1;
                    } else {
                        element.classList.remove("wall")
                        cords[Number(element.dataset.row)][Number(element.dataset.col)] = 0;
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


function lastCellCheck(row, col) {
    let elements = document.querySelectorAll('td[data-row = "' + row + '"]');
    if (elements[col].classList.contains("wall")) {
        lastCellClass = "wall";
    } else {
        lastCellClass = "empty"
    }
}