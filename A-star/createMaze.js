let tractor = {
    x: 0,
    y: 0
};

let counter = 0

export function createMaze(cords, matrixSize) {
    correctMatrix(cords, matrixSize)
    let size = matrixSize
    tractor = {
        x: 0,
        y: 0,
    };
    counter = 0

    if (matrixSize % 2 === 0) {
        size--
    }
    let breaker = (size / 2 + 0.5) * (size / 2 + 0.5) - 1
    while (counter !== breaker) {
        moveTractor(size, cords)
    }
    return cords
}

function correctMatrix(cords, matrixSize) {
    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            cords[i][j] = 1;
        }
    }
    cords[0][0] = 0;
}
function moveTractor(size, cords) {
    const directions = []


    if (tractor.x > 0) {
        directions.push([-2, 0]);
    }
    if (tractor.x < size - 1) {
        directions.push([2, 0]);
    }
    if (tractor.y > 0) {
        directions.push([0, -2]);
    }
    if (tractor.y < size - 1) {
        directions.push([0, 2]);
    }

    const index = Math.floor(Math.random() * directions.length);
    const [dx, dy] = directions[index];

    tractor.x += +dx;
    tractor.y += +dy;
    if (cords[tractor.y][tractor.x] === 1) {
        counter++
        cords[tractor.y][tractor.x] = 0
        cords[tractor.y - dy / 2][tractor.x - dx / 2] = 0
    }


}