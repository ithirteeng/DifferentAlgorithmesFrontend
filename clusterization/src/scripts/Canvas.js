class Canvas {
    constructor(canvas_id, container_id) {
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        this.container = document.getElementById(container_id);
        this.objects = [];
    }

    clear() {
        // Just clears Canvas. DO NOT USE OUTSIDE FUNCTIONS!
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    restore() {
        this.objects.forEach(item => {
            if (item.type === 'circle') {
                drawCirclePoint(item, item.color, true);
            } else if (item.type === 'triangle') {
                drawTrianglePoint(item, item.color, true);
            }
        })
    }

    resize() {
        // Resizes canvas if event == 'resize'
        this.canvas.width = containerCanvas.offsetWidth;
        this.canvas.height = containerCanvas.offsetHeight;
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        console.log(`CANVAS PROPERTIES\n    Width: ${canvas.width}\n    Height: ${canvas.height}`)
    }

    drawCirclePoint(point, color, is_redraw = false) {
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = myColor;
        ctx.lineWidth = 8;
        ctx.fillStyle = color;
        let radius = 10;
        ctx.arc(point.x + 3, point.y + 4, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = 'black';
        this.objects.push({x: point.x, y: point.y, color, type: 'circle', radius})
    }

    drawTrianglePoint(point, color, is_redraw = false) {
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(point.x - 7, point.y + 10);
        ctx.lineTo(point.x + 3, point.y - 7);
        ctx.lineTo(point.x + 13, point.y + 10);
        ctx.fill();
        ctx.fillStyle = 'black';
        if (!is_redraw) {
            this.objects.push({x: point.x, y: point.y, color, type: 'triangle'})
        }
    }

}
