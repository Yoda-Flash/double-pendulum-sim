const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

const resizeCanvas = () => {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
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

resizeCanvas();

let length1 = 400;
let width1 = 5;
let radius1 = 25;
let rod1Coord = [
    [canvas.width/2 - width1/2, canvas.height/2 - length1/2],
    [canvas.width/2 + width1/2, canvas.height/2 - length1/2],
    [canvas.width/2 + width1/2, canvas.height/2],
    [canvas.width/2 - width1/2, canvas.height/2]
];
let sphere1Coord = [canvas.width/2, canvas.height/2 + radius1];
let time = 0;

drawRod1(rod1Coord[0], rod1Coord[1], rod1Coord[2], rod1Coord[3])
drawSphere1(sphere1Coord[0], sphere1Coord[1], radius1);

// Make current x and current y var's, and a t var to check if it's just started or not


window.addEventListener('resize', (event) => {
    resizeCanvas();

});

canvas.addEventListener('mousedown', (event) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

})