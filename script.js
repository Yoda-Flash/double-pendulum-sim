const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

const resizeCanvas = () => {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
}

const centerShapeCoords = () => {
    rod1Coord = [
        [origin[0] - width1/2, origin[1]],
        [origin[0] + width1/2, origin[1]],
        [origin[0] + width1/2, origin[1] + length1],
        [origin[0] - width1/2, origin[1] + length1]
    ];
    sphere1Coord = [canvas.width/2, canvas.height/2 + radius1];
    origin = [canvas.width/2, canvas.height/2 - length1];
}

// Clockwise, starting from top left corner
const drawRod1 = ([x1, y1], [x2, y2], [x3, y3], [x4, y4]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill();
}

const drawSphere1 = (x, y, r) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, true);
    let gradient = ctx.createRadialGradient(x, y, r, x - (r/2), y, r/4);
    gradient.addColorStop(0, "#66deff");
    gradient.addColorStop(1, "#62acf5");
    ctx.fillStyle = gradient;
    ctx.fill();
}

const drawOrigin = () => {
    ctx.beginPath();
    ctx.arc(origin[0], origin[1], 5, 0, 2*Math.PI, true);
    ctx.fillStyle = 'black';
    ctx.fill();
}

const drawShapes = () => {
    drawRod1(rod1Coord[0], rod1Coord[1], rod1Coord[2], rod1Coord[3])
    drawSphere1(sphere1Coord[0], sphere1Coord[1], radius1);
    drawOrigin();
}

resizeCanvas();

let length1 = 200;
let width1 = 5;
let radius1 = 25;
let theta1 = 0;
let origin = [canvas.width/2, canvas.height/2 - length1];
let rod1Coord = [
    [origin[0] - width1/2, origin[1]],
    [origin[0] + width1/2, origin[1]],
    [origin[0] + width1/2, origin[1] + length1],
    [origin[0] - width1/2, origin[1] + length1]
];
let sphere1Coord = [origin[0], origin[1] + length1 + radius1];
let time = 0;

let isMouseDownOnShape = false;
let initialMouseX = 0;
let initialMouseY = 0;

drawShapes();

window.addEventListener('resize', (event) => {
    resizeCanvas();
    centerShapeCoords();
    drawShapes();
});

canvas.addEventListener('mousedown', (event) => {
    initialMouseX = event.offsetX;
    initialMouseY = event.offsetY;
    let mouseDistanceFromCenter1 = Math.sqrt(
        Math.pow(initialMouseX - sphere1Coord[0], 2) +
        Math.pow(initialMouseY - sphere1Coord[1], 2)
    );
    if (mouseDistanceFromCenter1 <= radius1) {
        isMouseDownOnShape = true;
        canvas.style.cursor = 'pointer';
    } else {
        isMouseDownOnShape = false;
        canvas.style.cursor = 'default';
    }
});

canvas.addEventListener('mouseup', (event) => {
    isMouseDownOnShape = false;
})

canvas.addEventListener('mousemove', (event) => {
    if (isMouseDownOnShape) {
        let mouseX = event.offsetX;
        let mouseY = event.offsetY;
        let mouseXFinal = mouseX - origin[0];
        let mouseYFinal = mouseY - origin[1];
        let mouseXInitial = initialMouseX - origin[0];
        let mouseYInitial = initialMouseY - origin[1];
        let dTheta1 = Math.asin(
            (mouseYInitial*mouseXFinal - mouseXInitial*mouseYFinal)/
            (Math.sqrt(Math.pow(mouseXFinal, 2) + Math.pow(mouseYFinal, 2))*
            Math.sqrt(Math.pow(mouseXInitial, 2) + Math.pow(mouseYInitial, 2)))
        )

        if (isNaN(dTheta1)) dTheta1 = 0;
        console.log(dTheta1);
        theta1 += dTheta1;
        if (Math.abs(theta1) > Math.PI/2) {
            theta1 = theta1 > 0 ? Math.PI/2 : -Math.PI/2;
        }
        initialMouseX = event.offsetX;
        initialMouseY = event.offsetY;
        sphere1Coord = [
            origin[0] + (length1+radius1)*Math.sin(theta1),
            origin[1] + (length1+radius1)*Math.cos(theta1)
        ];
        rod1Coord = [
            [
                origin[0] - (width1/2)*Math.cos(theta1),
                origin[1] + (width1/2)*Math.sin(theta1)
            ], [
                origin[0] + (width1/2)*Math.cos(theta1),
                origin[1] - (width1/2)*Math.sin(theta1)
            ], [
                origin[0] + length1*Math.sin(theta1) + (width1/2)*Math.cos(theta1),
                origin[1] + length1*Math.cos(theta1) - (width1/2)*Math.sin(theta1)
            ], [origin[0] + length1*Math.sin(theta1) - (width1/2)*Math.cos(theta1),
                origin[1] + length1*Math.cos(theta1) + (width1/2)*Math.sin(theta1)
            ]
        ]

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawShapes();
    }
})