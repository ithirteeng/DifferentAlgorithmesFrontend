let matrixSize = 5;
let matrix = document.getElementById("matrix");
let cords = []

let trainingCords = []

createMatrix()

function createMatrix() {
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
            element.dataset.clicked = "0";
            element.dataset.row = i.toString();
            element.dataset.col = j.toString();
            element.addEventListener("click", function() {
                if (element.dataset.clicked === "0") {
                    element.classList.add("wall")
                    element.dataset.clicked = "1";
                    cords[Number(element.dataset.row)][Number(element.dataset.col)] = 1;
                } else {
                    element.classList.remove("wall")
                    element.dataset.clicked = "0";
                    cords[Number(element.dataset.row)][Number(element.dataset.col)] = 0;
                }
            });
            row.append(element);

        }
        matrix.append(row);
    }
}

function clearMatrix() {
    document.getElementById("clearButton").addEventListener("mousedown", function() {
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                
            }
        }
    })
}