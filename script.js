const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

const playPauseButton = document.getElementById("play-pause");

const resizeCanvas = () => {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
}

const centerShapeCoords = () => {
    origin = [canvas.width/2, canvas.height/2 - length1*lengthPixelMultiplier];
    moveShapes();
}

// Clockwise, starting from top left corner
const drawRod = (coord) => {
    ctx.beginPath();
    ctx.moveTo(coord[0][0], coord[0][1]);
    ctx.lineTo(coord[1][0], coord[1][1]);
    ctx.lineTo(coord[2][0], coord[2][1]);
    ctx.lineTo(coord[3][0], coord[3][1]);
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill();
}

const drawSphere = (coord, r) => {
    ctx.beginPath();
    ctx.arc(coord[0], coord[1], r, 0, 2*Math.PI, true);
    // ctx.rect(0, 0, canvas.width, canvas.height); // To test gradient
    // let gradient = ctx.createRadialGradient(x, y, r, x - (r/2), y, r/4); // Individual circle gradient
    let gradient = ctx.createRadialGradient(origin[0], origin[1] + origin[1]/8, r/4, origin[0] + origin[0]/4, origin[1], canvas.width)
    gradient.addColorStop(0, "#66deff");
    gradient.addColorStop(0.025, "#3abce0");
    gradient.addColorStop(0.05, "#66deff");
    gradient.addColorStop(0.25, "#e198ff");
    gradient.addColorStop(0.3, "#f198ff");
    gradient.addColorStop(0.5, "#024eab");
    gradient.addColorStop(0.6, "rgb(5,1,131)");
    gradient.addColorStop(0.65, "#170567");
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
    drawOrigin();
    drawRod(rod1Coord);
    drawRod(rod2Coord);
    drawSphere(sphere1Coord, radius1);
    drawSphere(sphere2Coord, radius2);
}

const moveShapes = () => {
    sphere1Coord = [
        origin[0] + length1*lengthPixelMultiplier*Math.sin(theta1),
        origin[1] + length1*lengthPixelMultiplier*Math.cos(theta1)
    ];
    rod1Coord = [
        [
            origin[0] - (width1/2)*Math.cos(theta1),
            origin[1] + (width1/2)*Math.sin(theta1)
        ], [
            origin[0] + (width1/2)*Math.cos(theta1),
            origin[1] - (width1/2)*Math.sin(theta1)
        ], [
                origin[0] + length1*lengthPixelMultiplier*Math.sin(theta1) + (width1/2)*Math.cos(theta1),
                origin[1] + length1*lengthPixelMultiplier*Math.cos(theta1) - (width1/2)*Math.sin(theta1)
        ], [
            origin[0] + length1*lengthPixelMultiplier*Math.sin(theta1) - (width1/2)*Math.cos(theta1),
            origin[1] + length1*lengthPixelMultiplier*Math.cos(theta1) + (width1/2)*Math.sin(theta1)
        ]
    ];
    rod2Coord = [
        [
            sphere1Coord[0] - (width2/2)*Math.cos(theta2),
            sphere1Coord[1] + (width2/2)*Math.sin(theta2)
        ], [
            sphere1Coord[0] + (width2/2)*Math.cos(theta2),
            sphere1Coord[1] - (width2/2)*Math.sin(theta2)
        ], [
                sphere1Coord[0] + length2*lengthPixelMultiplier*Math.sin(theta2) + (width2/2)*Math.cos(theta2),
                sphere1Coord[1] + length2*lengthPixelMultiplier*Math.cos(theta2) - (width2/2)*Math.sin(theta2)
        ], [
            sphere1Coord[0] + length2*lengthPixelMultiplier*Math.sin(theta2) - (width2/2)*Math.cos(theta2),
            sphere1Coord[1] + length2*lengthPixelMultiplier*Math.cos(theta2) + (width2/2)*Math.sin(theta2)
        ]
    ];
    sphere2Coord = [
        sphere1Coord[0] + length2*lengthPixelMultiplier*Math.sin(theta2),
        sphere1Coord[1] + length2*lengthPixelMultiplier*Math.cos(theta2)
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShapes();
}

const getMouseAngle = (event, origin) => {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;
    let mouseXFinal = mouseX - origin[0];
    let mouseYFinal = mouseY - origin[1];
    let mouseXInitial = initialMouseX - origin[0];
    let mouseYInitial = initialMouseY - origin[1];

    let dTheta = Math.asin(
        (mouseYInitial*mouseXFinal - mouseXInitial*mouseYFinal)/
        (
            Math.sqrt(mouseXFinal**2 + mouseYFinal**2)*
            Math.sqrt(mouseXInitial**2 + mouseYInitial**2)
        )
    )
    if (isNaN(dTheta)) dTheta = 0;
    return dTheta;
}

const eulerStep = (DOMHighResTimeStamp, dt= 0.025) => {
    if (!play) {
        return;
    }
    alpha1 = (
        -gravity*(2*mass1 + mass2)*Math.sin(theta1) -
        mass2*gravity*Math.sin(theta1 - 2*theta2) -
        2*Math.sin(theta1 - theta2)*mass2*(omega2**2*length2 + omega1**2*length1*Math.cos(theta1 - theta2))
    )/(length1*(2*mass1 + mass2 - mass2*Math.cos(2*theta1 - 2*theta2)));

    alpha2 = (2*Math.sin(theta1 - theta2)*
        (
            omega1**2*length1*(mass1 + mass2) +
            gravity*(mass1 + mass2)*Math.cos(theta1) +
            omega2**2*length2*mass2*Math.cos(theta1 - theta2)
        )
    )/(length2*(2*mass1 + mass2 - mass2*Math.cos(2*theta1 - 2*theta2)));

    omega1 += (alpha1*dt);
    omega2 += (alpha2*dt);
    theta1 += (omega1*dt);
    theta2 += (omega2*dt);
    // console.log(omega1, omega2)
    moveShapes();
    requestAnimationFrame(eulerStep);
    if (theta1 === theta2 === omega1 === omega2 === alpha1 === alpha2 === 0) {
        cancelAnimationFrame(eulerStep);
    }
}

resizeCanvas();

let play = false;

let time = 0;
let gravity = 9.8;
let lengthPixelMultiplier = 100;

let length1 = 2;
let width1 = 5;
let radius1 = 25;
let mass1 = 2;
let theta1 = 0;
let omega1 = 0;
let alpha1 = 0;

let length2 = 2;
let width2 = 5;
let radius2 = 25;
let mass2 = 2;
let theta2 = 0;
let omega2 = 0;
let alpha2 = 0;

let origin = [canvas.width/2, canvas.height/2 - length1*lengthPixelMultiplier];

let rod1Coord = [];
let sphere1Coord = [];

let rod2Coord = [];
let sphere2Coord = [];

let isMouseDownOnShape1 = false;
let isMouseDownOnShape2 = false;
let initialMouseX = 0;
let initialMouseY = 0;

centerShapeCoords();
drawShapes();

window.addEventListener('resize', (event) => {
    resizeCanvas();
    centerShapeCoords();
});

canvas.addEventListener('mousedown', (event) => {
    initialMouseX = event.offsetX;
    initialMouseY = event.offsetY;
    let mouseDistanceFromCenter1 = Math.sqrt(
        Math.pow(initialMouseX - sphere1Coord[0], 2) +
        Math.pow(initialMouseY - sphere1Coord[1], 2)
    );
    let mouseDistanceFromCenter2 = Math.sqrt(
        Math.pow(initialMouseX - sphere2Coord[0], 2) +
        Math.pow(initialMouseY - sphere2Coord[1], 2)
    );
    if (mouseDistanceFromCenter1 <= radius1) {
        isMouseDownOnShape1 = true;
        isMouseDownOnShape2 = false;
        canvas.style.cursor = 'pointer';
    } else if (mouseDistanceFromCenter2 <= radius2) {
        isMouseDownOnShape1 = false;
        isMouseDownOnShape2 = true;
        canvas.style.cursor = 'pointer';
    } else {
        isMouseDownOnShape1 = false;
        isMouseDownOnShape2 = false;
        canvas.style.cursor = 'default';
    }
});

canvas.addEventListener('mouseup', (event) => {
    if (isMouseDownOnShape1 || isMouseDownOnShape2) {
        isMouseDownOnShape1 = false;
        isMouseDownOnShape2 = false;
        canvas.style.cursor = 'default';
        play = true;
        playPauseButton.src = "assets/pause.png";
        requestAnimationFrame(eulerStep);
    }
    isMouseDownOnShape1 = false;
    isMouseDownOnShape2 = false;
    canvas.style.cursor = 'default';
})

canvas.addEventListener('mousemove', (event) => {
    if (isMouseDownOnShape1) {
        theta1 += getMouseAngle(event, origin);
        if (Math.abs(theta1) > Math.PI/2) {
            theta1 = theta1 > 0 ? Math.PI/2 : -Math.PI/2;
        }
        moveShapes();
    }
    if (isMouseDownOnShape2) {
        theta2 += getMouseAngle(event, sphere1Coord);
        if (Math.abs(theta2) > Math.PI/2) {
            theta2 = theta2 > 0 ? Math.PI/2 : -Math.PI/2;
        }
        moveShapes();
    }
    initialMouseX = event.offsetX;
    initialMouseY = event.offsetY;
})

playPauseButton.onclick = () => {
    if (play) {
        playPauseButton.src = "assets/play.png";
        play = false;
    } else {
        playPauseButton.src = "assets/pause.png";
        play = true;
        requestAnimationFrame(eulerStep);
    }
}