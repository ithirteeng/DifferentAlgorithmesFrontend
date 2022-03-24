function putPoint(event, canvas) {
    let x = event.offsetX;
    let y = event.offsetY;
    ctx.fillRect(x, y, 10, 10);
    console.log(`Цвет: ${myColor} x: ${x} y: ${y}`)
    ctx.fillStyle = myColor;
    ctx.fill();
    return {x,y}
}


const canvas = document.querySelector("#c1")
const ctx = canvas.getContext('2d');
let myColor = 'black';
// Цвет сначала myColor и только потом меняется на измененнный. Как исправить?
document.getElementById('color').oninput = function () {
    myColor = this.value;
}


let dataArray = [];

canvas.addEventListener('mousedown', function (event) {
    dataArray.push(putPoint(event, canvas))
    console.log(dataArray)
})

