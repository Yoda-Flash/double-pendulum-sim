const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

const playPauseButton = document.getElementById("play-pause");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const resetButton = document.getElementById("reset");

const toggleButton = document.getElementById("arrow");
const menu = document.getElementById("menu");
const canvasDiv = document.getElementById("canvas");
const toggleArrowDiv = document.getElementById("toggle-arrow");

const modeButton = document.getElementById("mode");
const trailButton = document.getElementById("trail");
const gravitySlider = document.getElementById("gravity-slider");
const gravityValue = document.getElementById("gravity");
const length1Slider = document.getElementById("length1-slider");
const length1Value = document.getElementById("length1");
const length2Slider = document.getElementById("length2-slider");
const length2Value = document.getElementById("length2");
const radius1Slider = document.getElementById("radius1-slider");
const radius1Value = document.getElementById("radius1");
const radius2Slider = document.getElementById("radius2-slider");
const radius2Value = document.getElementById("radius2");
const mass1Slider = document.getElementById("mass1-slider");
const mass1Value = document.getElementById("mass1");
const mass2Slider = document.getElementById("mass2-slider");
const mass2Value = document.getElementById("mass2");
const theta1Slider = document.getElementById("theta1-slider");
const theta1Value = document.getElementById("theta1");
const theta2Slider = document.getElementById("theta2-slider");
const theta2Value = document.getElementById("theta2");
const omega1Slider = document.getElementById("omega1-slider");
const omega1Value = document.getElementById("omega1");
const omega2Slider = document.getElementById("omega2-slider");
const omega2Value = document.getElementById("omega2");

const food1Image = new Image();
food1Image.src = "assets/food1.png";
const food2Image = new Image();
food2Image.src = "assets/food2.png";
const food3Image = new Image();
food3Image.src = "assets/food3.png";
const food4Image = new Image();
food4Image.src = "assets/food4.png";
const food5Image = new Image();
food5Image.src = "assets/food5.png";
const food6Image = new Image();
food6Image.src = "assets/food6.png";
const planet1Image = new Image();
planet1Image.src = "assets/planet1.png";
const planet2Image = new Image();
planet2Image.src = "assets/planet2.png";
const planet3Image = new Image();
planet3Image.src = "assets/planet3.png";
const planet4Image = new Image();
planet4Image.src = "assets/planet4.png";

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
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    // ctx.rect(0, 0, canvas.width, canvas.height); // To test gradient
    // let gradient = ctx.createRadialGradient(x, y, r, x - (r/2), y, r/4); // Individual circle gradient
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
}

const drawOrigin = () => {
    ctx.beginPath();
    ctx.arc(origin[0], origin[1], radiusOrigin, 0, 2*Math.PI, true);
    ctx.fillStyle = 'black';
    ctx.fill();
}

const drawTrail = () => {
    ctx.globalCompositeOperation = 'destination-over';
    trailStreakSize.unshift(Math.random() * 2 + 0.1);
    trailStreakSpeed.unshift([Math.random() * 2 - 1, Math.random() * 2 - 1]);
    trail.unshift(sphere2Coord);
    if (trail.length > trailLength) {
        trail.pop();
        trailStreakSize.pop();
        trailStreakSpeed.pop();
    }
    if (trailButton.textContent === "Particle") {
        // One-line Particle trail:
        for (const particle of trail) {
            ctx.beginPath();
            ctx.arc(particle[0], particle[1], trailRadius, 0, 2*Math.PI, true);
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.globalAlpha -= 0.005;
        }
    } else if (trailButton.textContent === "Streak") {
        // Smooth fading curve trail:
        for (let i = 0; i < trail.length - 1; i++) {
            ctx.beginPath();
            ctx.quadraticCurveTo(trail[i][0], trail[i][1], trail[i + 1][0], trail[i + 1][1]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = gradient;
            ctx.stroke();
            ctx.globalAlpha -= 0.005;
        }
    } else if (trailButton.textContent === "Particles") {
        // Bunch of particles trail
        for (let i = 0; i < trail.length - 1; i++) {
            trail[i][0] += trailStreakSpeed[i][0];
            trail[i][1] += trailStreakSpeed[i][1];
            ctx.beginPath();
            ctx.arc(trail[i][0], trail[i][1], trailStreakSize[i], 0, 2*Math.PI, true);
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.globalAlpha -= 0.005;
        }
    } else if (trailButton.textContent === "Streaks") {
        // Bunch of streaks trail
        for (let i = 0; i < trail.length - 1; i++) {
            trail[i][0] += trailStreakSpeed[i][0];
            trail[i][1] += trailStreakSpeed[i][1];
            ctx.beginPath();
            ctx.arc(trail[i][0], trail[i][1], trailStreakSize[i], 0, 2*Math.PI, true);
            ctx.fillStyle = gradient;
            ctx.fill();

            for (let j = i; (j < trail.length); j++) {
                let dx = trail[i][0] - trail[j][0];
                let dy = trail[i][1] - trail[j][1];
                let distance = Math.sqrt(dx**2 + dy**2);
                if (distance < 90) {
                    ctx.beginPath();
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = trailStreakSize[i]/10;
                    ctx.moveTo(trail[i][0], trail[i][1]);
                    ctx.lineTo(trail[j][0], trail[j][1]);
                    ctx.stroke();
                }
            }
            ctx.globalAlpha -= 0.005;
        }
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
}

const drawFood = () => {
    ctx.drawImage(
        image1,
        sphere1Coord[0] - radius1,
        sphere1Coord[1] - radius1,
        2*radius1,
        2*radius1
    );
    ctx.drawImage(
        image2,
        sphere2Coord[0] - radius2,
        sphere2Coord[1] - radius2,
        2*radius2,
        2*radius2
    )
}

const drawGalactic = () => {
    ctx.drawImage(
        image1,
        sphere1Coord[0] - radius1,
        sphere1Coord[1] - radius1,
        2*radius1,
        2*radius1
    );
    ctx.drawImage(
        image2,
        sphere2Coord[0] - radius2,
        sphere2Coord[1] - radius2,
        2*radius2,
        2*radius2
    )
}

const drawShapes = () => {
    drawOrigin();
    drawRod(rod1Coord);
    drawRod(rod2Coord);
    if (modeButton.textContent === "Normal") {
        drawSphere(sphere1Coord, radius1);
        drawSphere(sphere2Coord, radius2);
    } else if (modeButton.textContent === "Food") {
        drawFood();
    } else if (modeButton.textContent === "Galactic") {
        drawGalactic();
    }
// ctx.drawImage(food1Image, sphere1Coord[0] - radius1, sphere1Coord[1] - radius1, 2*radius1, 2*radius1);
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
    // ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; //Experiment with trail using transparency
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
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

const preventNaN = () => {
    console.log("Resetting to random omega's!");
//     Display message here that the omega is being randomly reset to avoid infinity...
}

const eulerStep = (DOMHighResTimeStamp, dt= 0.01) => {
    if (!play) {
        return;
    }
    time += dt;
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

    previousAlpha1.unshift(alpha1);
    if (previousAlpha1.length > 10) {
        previousAlpha1.pop();
    }

    previousAlpha2.unshift(alpha2);
    if (previousAlpha2.length > 10) {
        previousAlpha2.pop();
    }

    omega1 += alpha1*dt;
    omega2 += alpha2*dt;
    theta1 += omega1*dt;
    theta2 += omega2*dt;

    // Prevent NaN!
    if (isNaN(omega1)) {
        omega1 = Math.random();
        theta1 = omega1*dt;
        preventNaN();
    }
    if (isNaN(omega2)) {
        omega2 = Math.random();
        theta2 = omega2*dt;
        preventNaN();
    }
    // Help keep theta's within a circle
    theta1 %= 2*Math.PI;
    theta2 %= 2*Math.PI;
    // console.log(omega1, omega2)
    setSlidersAndValuesToVariables();
    moveShapes();
    drawTrail();
    requestAnimationFrame(eulerStep);
    if (theta1 === theta2 === omega1 === omega2 === alpha1 === alpha2 === 0) {
        cancelAnimationFrame(eulerStep);
    }
}

const previousStep = (dt = 0.01) => {
    if (stepCounter > -previousAlpha1.length + 1) {
        stepCounter -= 1;
        let i = -stepCounter;

        alpha1 = previousAlpha1[i];
        alpha2 = previousAlpha2[i];
        omega1 -= alpha1*dt;
        omega2 -= alpha2*dt;
        theta1 -= omega1*dt;
        theta2 -= omega2*dt;
        moveShapes();
        drawTrail();
    }
}

const nextStep = (dt = 0.01) => {
    if (stepCounter < 0) {
        stepCounter += 1;
        let i = -stepCounter;

        alpha1 = previousAlpha1[i];
        alpha2 = previousAlpha2[i];
        omega1 += alpha1*dt;
        omega2 += alpha2*dt;
        theta1 += omega1*dt;
        theta2 += omega2*dt;
        moveShapes();
        drawTrail();
    }
}

const togglePlayPause = () => {
    if (play) {
        playPauseButton.src = "assets/play.png";
        play = false;
    } else if (!play && (theta1 !== 0 || theta2 !== 0)) {
        playPauseButton.src = "assets/pause.png";
        play = true;
        requestAnimationFrame(eulerStep);
    }
}

const reset = () => {
    gravity = 9.8;
    length1 = 5;
    length2 = 5;
    radius1 = 25;
    radius2 = 25;
    mass1 = 2;
    mass2 = 2;
    theta1 = 0;
    theta2 = 0;
    omega1 = 0;
    omega2 = 0;
    alpha1 = 0;
    alpha2 = 0;
    setSlidersAndValuesToVariables();
    trail = [];
    origin = [canvas.width/2, canvas.height/2 - length1*lengthPixelMultiplier];
    play = false;
    playPauseButton.src = "assets/play.png";
    moveShapes();
}

const setSlidersAndValuesToVariables = () => {
    gravitySlider.value = gravity;
    gravityValue.value = gravity;
    length1Slider.value = length1;
    length1Value.value = length1;
    length2Slider.value = length2;
    length2Value.value = length2;
    radius1Slider.value = radius1;
    radius1Value.value = radius1;
    radius2Slider.value = radius2;
    radius2Value.value = radius2;
    mass1Slider.value = mass1;
    mass1Value.value = mass1;
    mass2Slider.value = mass2;
    mass2Value.value = mass2;
    theta1Slider.value = theta1*180/Math.PI;
    theta1Value.value = theta1*180/Math.PI;
    theta2Slider.value = theta2*180/Math.PI;
    theta2Value.value = theta2*180/Math.PI;
    omega1Slider.value = omega1;
    omega1Value.value = omega1;
    omega2Slider.value = omega2;
    omega2Value.value = omega2;
}

const nextItem = (index, length) => {
    index += 1;
    if (index >= length) {
        index = 0;
    }
    return index;
}

resizeCanvas();

let play = false;
let currentScale = 1;

let time = 0;
let gravity = 9.8;
let lengthPixelMultiplier = canvas.height/20;

let radiusOrigin = 5;

let length1 = 5;
let width1 = 5;
let radius1 = 25;
let mass1 = 2;
let theta1 = 0;
let omega1 = 0;
let alpha1 = 0;

let length2 = 5;
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

let previousAlpha1 = [0];
let previousAlpha2 = [0];
let stepCounter = 0;

let isPointerDownOnShape1 = false;
let isPointerDownOnShape2 = false;
let isPointerDownOnOrigin = false;
let initialMouseX = 0;
let initialMouseY = 0;

let gradient = ctx.createRadialGradient(origin[0], origin[1] + origin[1]/8, radius1/4, origin[0] + origin[0]/4, origin[1], canvas.width)
gradient.addColorStop(0, "#66deff");
gradient.addColorStop(0.025, "#3abce0");
gradient.addColorStop(0.05, "#66deff");
gradient.addColorStop(0.25, "#e198ff");
gradient.addColorStop(0.3, "#f198ff");
gradient.addColorStop(0.5, "#024eab");
gradient.addColorStop(0.6, "rgb(5,1,131)");
gradient.addColorStop(0.65, "#170567");

let trail = [];
let trailLength = 200;
let trailRadius = 1;
let trailStreakSize = [];
let trailStreakSpeed = [];

let modes = ["Normal", "Food", "Galactic"];
let trails = ["None", "Particle", "Particles", "Streak", "Streaks"];

let foodImages = [food1Image, food2Image, food3Image, food4Image, food5Image, food6Image];
let planetImages = [planet1Image, planet2Image, planet3Image, planet4Image];
let image1 = food1Image;
let image2 = food2Image;

centerShapeCoords();
drawShapes();

window.addEventListener('resize', (event) => {
    resizeCanvas();
    centerShapeCoords();
});

canvas.addEventListener('pointerdown', (event) => {
    initialMouseX = event.offsetX;
    initialMouseY = event.offsetY;
    let pointerDistanceFromCenter1 = Math.sqrt(
        Math.pow(initialMouseX - sphere1Coord[0], 2) +
        Math.pow(initialMouseY - sphere1Coord[1], 2)
    );
    let pointerDistanceFromCenter2 = Math.sqrt(
        Math.pow(initialMouseX - sphere2Coord[0], 2) +
        Math.pow(initialMouseY - sphere2Coord[1], 2)
    );
    let pointerDistanceFromOrigin = Math.sqrt(
        Math.pow(initialMouseX - origin[0], 2) +
        Math.pow(initialMouseY - origin[1], 2)
    );
    if (pointerDistanceFromCenter1 <= radius1) {
        isPointerDownOnOrigin = false;
        isPointerDownOnShape1 = true;
        isPointerDownOnShape2 = false;
        canvas.style.cursor = 'pointer';
    } else if (pointerDistanceFromCenter2 <= radius2) {
        isPointerDownOnOrigin = false;
        isPointerDownOnShape1 = false;
        isPointerDownOnShape2 = true;
        canvas.style.cursor = 'pointer';
    } else if (isPointerDownOnOrigin <= radiusOrigin) {
        isPointerDownOnOrigin = true;
        isPointerDownOnShape1 = false;
        isPointerDownOnShape2 = false;
        canvas.style.cursor = 'pointer';
    } else {
        isPointerDownOnOrigin = false;
        isPointerDownOnShape1 = false;
        isPointerDownOnShape2 = false;
        canvas.style.cursor = 'default';
    }
});

canvas.addEventListener('pointerup', (event) => {
    if (isPointerDownOnShape1 || isPointerDownOnShape2) {
        isPointerDownOnShape1 = false;
        isPointerDownOnShape2 = false;
        canvas.style.cursor = 'default';
        play = true;
        playPauseButton.src = "assets/pause.png";
        requestAnimationFrame(eulerStep);
    } else if (isPointerDownOnOrigin) {
        isPointerDownOnOrigin = false;
        canvas.style.cursor = 'default';
    }
    isPointerDownOnShape1 = false;
    isPointerDownOnShape2 = false;
    isPointerDownOnOrigin = false;
    canvas.style.cursor = 'default';
})

canvas.addEventListener('pointermove', (event) => {
    if (isPointerDownOnShape1) {
        theta1 += getMouseAngle(event, origin);
        // if (Math.abs(theta1) > Math.PI/2) {
        //     theta1 = theta1 > 0 ? Math.PI/2 : -Math.PI/2;
        // }
        moveShapes();
    }
    if (isPointerDownOnShape2) {
        theta2 += getMouseAngle(event, sphere1Coord);
        // if (Math.abs(theta2) > Math.PI/2) {
        //     theta2 = theta2 > 0 ? Math.PI/2 : -Math.PI/2;
        // }
        moveShapes();
    }
    if (isPointerDownOnOrigin) {
        origin[0] += event.offsetX - initialMouseX;
        origin[1] += event.offsetY - initialMouseY;
        drawOrigin();
        moveShapes();
    }
    initialMouseX = event.offsetX;
    initialMouseY = event.offsetY;
})

document.addEventListener('keydown', (event) => {
    if (event.key === " ") {
        togglePlayPause();
    } else if (event.key === "ArrowLeft") {
        previousStep();
    } else if (event.key === "ArrowRight") {
        nextStep();
    } else if (event.key === "r") {
        reset();
    }
})

playPauseButton.onclick = () => togglePlayPause();

previousButton.onclick = () => previousStep();

nextButton.onclick = () => nextStep();

resetButton.onclick = () => reset();

toggleButton.onclick = () => {
    if (toggleButton.src.includes("assets/left-arrow.png")) {
        toggleButton.src = "assets/right-arrow.png";
        menu.style.marginLeft = "0";
        menu.style.width = "0";
        menu.style.border = "0";
        menu.hidden = true;
        toggleArrowDiv.style.marginLeft = '-4vw';
        canvasDiv.style.width = "100vw";
    } else {
        toggleButton.src = "assets/left-arrow.png";
        menu.style.marginLeft = "-24.9vw";
        menu.style.border = "0.1vh;"
        menu.style.width = "24.8vw";
        menu.hidden = false;
        toggleArrowDiv.style.marginLeft = '-29.8vw';
        canvasDiv.style.width = "100vw";
    }
}

modeButton.onclick = () => {
    modeButton.textContent = modes[nextItem(modes.indexOf(modeButton.textContent), modes.length)];
    if (modeButton.textContent === "Food") {
        image1 = foodImages[Math.ceil(Math.random()*foodImages.length - 1)];
        image2 = foodImages[Math.ceil(Math.random()*foodImages.length - 1)];
        if (image1 === image2) {
            image2 = foodImages[Math.ceil(Math.random()*foodImages.length - 1)];
        }
    } else if (modeButton.textContent === "Galactic") {
        image1 = planetImages[Math.ceil(Math.random()*planetImages.length - 1)];
        image2 = planetImages[Math.ceil(Math.random()*planetImages.length - 1)];
        if (image1 === image2) {
            image2 = planetImages[Math.ceil(Math.random()*planetImages.length - 1)];
        }
    }
}

trailButton.onclick = () => {
    trailButton.textContent = trails[nextItem(trails.indexOf(trailButton.textContent), trails.length)];
}

gravitySlider.oninput = () => {
    gravity = gravitySlider.value;
    gravityValue.value = gravity;
}

gravityValue.oninput = () => {
    gravity = gravityValue.value;
    gravitySlider.value = gravity;
}

length1Slider.oninput = () => {
    length1 = length1Slider.value;
    length1Value.value = length1;
    moveShapes();
}

length1Value.oninput = () => {
    length1 = length1Value.value;
    length1Slider.value = length1;
    moveShapes();
}

length2Slider.oninput = () => {
    length2 = length2Slider.value;
    length2Value.value = length2;
    moveShapes();
}

length2Value.oninput = () => {
    length2 = length2Value.value;
    length2Slider.value = length2;
    moveShapes();
}

radius1Slider.oninput = () => {
    radius1 = radius1Slider.value;
    radius1Value.value = radius1;
    moveShapes();
}

radius1Value.oninput = () => {
    radius1 = radius1Value.value;
    radius1Slider.value = radius1;
    moveShapes();
}

radius2Slider.oninput = () => {
    radius2 = radius2Slider.value;
    radius2Value.value = radius2;
    moveShapes();
}

radius2Value.oninput = () => {
    radius2 = radius2Value.value;
    radius2Slider.value = radius2;
    moveShapes();
}

mass1Slider.oninput = () => {
    mass1 = +mass1Slider.value; //"+" typecasts from string to number
    mass1Value.value = mass1;
    moveShapes();
}

mass1Value.oninput = () => {
    mass1 = +mass1Value.value;
    mass1Slider.value = mass1;
    moveShapes();
}

mass2Slider.oninput = () => {
    mass2 = +mass2Slider.value;
    mass2Value.value = mass2;
    moveShapes();
}

mass2Value.oninput = () => {
    mass2 = +mass2Value.value;
    mass2Slider.value = mass2;
    moveShapes();
}

theta1Slider.oninput = () => {
    theta1 = +theta1Slider.value*(Math.PI/180); //"+" typecasts from string to number
    theta1Value.value = theta1Slider.value;
    moveShapes();
}

theta1Value.oninput = () => {
    theta1 = +theta1Value.value*(Math.PI/180);
    theta1Slider.value = theta1Value.value;
    moveShapes();
}

theta2Slider.oninput = () => {
    theta2 = +theta2Slider.value*(Math.PI/180);
    theta2Value.value = theta2Slider.value;
    moveShapes();
}

theta2Value.oninput = () => {
    theta2 = +theta2Value.value*(Math.PI/180);
    theta2Slider.value = theta2Value.value;
    moveShapes();
}

omega1Slider.oninput = () => {
    omega1 = +omega1Slider.value; //"+" typecasts from string to number
    omega1Value.value = omega1Slider.value;
    moveShapes();
}

omega1Value.oninput = () => {
    omega1 = +omega1Value.value;
    omega1Slider.value = omega1Value.value;
    moveShapes();
}

omega2Slider.oninput = () => {
    omega2 = +omega2Slider.value;
    omega2Value.value = omega2Slider.value;
    moveShapes();
}

omega2Value.oninput = () => {
    omega2 = +omega2Value.value;
    omega2Slider.value = omega2Value.value;
    moveShapes();
}

