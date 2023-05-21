var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
var image = new Image();
image.src = "car.png";
class Road {
    constructor(width, count, options = { stripeColor: "white" }) {
        this.width = width;
        this.count = count;
        this.SPACE_BEETWEEN_STRIPE = 400;
        Object.assign(this, options);
        this.stripes = new Array(3).fill(null).map((_, i) => i * -this.SPACE_BEETWEEN_STRIPE);
    }
    move(canvas, speed = .2) {
        this.stripes.forEach((positionY, index) => {
            this.stripes[index] = positionY > canvas.height ? 0 : positionY + speed;
        });
    }
}
var ROAD = new Road(100, 5, { stripeColor: "rgba(255, 255, 255, 0.5)" });
var POSITION = 1;
var MOVE_SPEED = {
    horizontal: 5,
    vertical: 10,
};
var PLAYER = {
    positionX: 0,
    positionY: 0,
    width: ROAD.width,
    height: 0,
};
var SPACE_BEETWEEN_NEIGHBOR_CAR = {
    min: 100,
    max: 200,
};
var NEIGHBOR = new Array(4)
    .fill(null).map((_, index) => {
    return {
        positionY: index *
            -randomIntBetween(SPACE_BEETWEEN_NEIGHBOR_CAR.min, SPACE_BEETWEEN_NEIGHBOR_CAR.max),
        positionX: randomIntBetween(0, ROAD.count),
    };
});
var AVAILABLE_CONTROL = [
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
];
const KEY_PRESSED = {
    ArrowLeft: { pressed: false, action: () => moveCarLeft(PLAYER, MOVE_SPEED) },
    ArrowRight: {
        pressed: false,
        action: () => moveCarRight(PLAYER, MOVE_SPEED),
    },
    ArrowUp: { pressed: false, action: () => moveCarUp(PLAYER, MOVE_SPEED) },
    ArrowDown: { pressed: false, action: () => moveCarDown(PLAYER, MOVE_SPEED) },
};
canvas.width = ROAD.count * ROAD.width;
canvas.height = window.innerHeight;
image.onload = () => {
    const ASPECT_RATIO = image.width / image.height;
    const CAR_HEIGHT = ROAD.width / ASPECT_RATIO;
    PLAYER.positionY = canvas.height - CAR_HEIGHT;
    PLAYER.height = CAR_HEIGHT;
    let start = window.requestAnimationFrame(() => game(canvas, context, PLAYER, image, KEY_PRESSED, ROAD, NEIGHBOR));
};
window.onkeyup = ({ key }) => {
    if (!validKeyPressed(key))
        return;
    KEY_PRESSED[key].pressed = false;
};
window.onkeydown = ({ key }) => {
    if (!validKeyPressed(key))
        return;
    KEY_PRESSED[key].pressed = true;
};
function validKeyPressed(key, availableControl = window.AVAILABLE_CONTROL) {
    return (typeof availableControl.find((_) => _ === key) !== "undefined");
}
function multiKeyPressed(keyPressed) {
    Object.keys(keyPressed).forEach((key) => {
        keyPressed[key].pressed && keyPressed[key].action();
    });
}
function moveCarDown(player, moveSpeed) {
    player.positionY = Math.min(player.positionY + moveSpeed.vertical, canvas.height - player.height);
}
function moveCarUp(player, moveSpeed) {
    player.positionY = Math.max(player.positionY - moveSpeed.vertical, 0);
}
function moveCarRight(player, moveSpeed) {
    player.positionX = Math.min(player.positionX + moveSpeed.horizontal, canvas.width - player.width);
}
function moveCarLeft(player, moveSpeed) {
    player.positionX = Math.max(player.positionX - moveSpeed.horizontal, 0);
}
function game(canvas, context, player, image, keyPressed, road, neighbor, neighborImage = null) {
    clearCanvas(context, canvas);
    !neighborImage && (neighborImage = image);
    multiKeyPressed(keyPressed);
    drawRoad(context, road, canvas);
    drawCar(context, player, image);
    drawNeighborCar(context, road, neighbor, neighborImage);
    window.requestAnimationFrame(() => game(canvas, context, player, image, keyPressed, road, neighbor, neighborImage));
}
function drawNeighborCar(context, road, neighborCar, image) {
    neighborCar.forEach((car) => {
        context.beginPath();
        context.drawImage(image, car.positionX * road.width, car.positionY, road.width, PLAYER.height);
        context.closePath();
        let speed = 5;
        if (car.positionY > canvas.height) {
            car.positionX = randomIntBetween(0, road.count);
            car.positionY = -PLAYER.height;
        }
        car.positionY += speed;
    });
}
function drawRoad(context, road, canvas) {
    for (let index = 0; index <= road.count; index++) {
        const LINE_ROAD = road.width / 50;
        context.fillStyle = road.stripeColor;
        context.beginPath();
        context.rect(index * road.width - LINE_ROAD / 2, 0, LINE_ROAD, canvas.height);
        context.closePath();
        context.fill();
        road.stripes.forEach((stripPositionX) => {
            const stripWidth = 10;
            const stripHeight = 20;
            context.beginPath();
            context.rect(index * road.width - road.width / 2, stripPositionX, stripWidth, stripHeight);
            context.closePath();
            context.fill();
            road.move(canvas);
        });
    }
}
function drawCar(context, player, image) {
    const [x, y, dx, dy] = [
        player.positionX,
        player.positionY,
        player.width,
        player.height,
    ];
    context.drawImage(image, x, y, dx, dy);
}
function clearCanvas(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
