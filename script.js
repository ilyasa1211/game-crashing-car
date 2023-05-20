var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
var ROAD_WIDTH = 100;
var ROAD_COUNT = 3;
var POSITION = 1;
var MOVE_SPEED = {
    horizontal: 5,
    vertical: 10,
};
var PLAYER = {
    positionX: 0,
    positionY: 0,
    width: ROAD_WIDTH,
    height: 0,
};
var AVAILABLE_CONTROL = [
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
];
canvas.width = ROAD_COUNT * ROAD_WIDTH;
canvas.height = window.innerHeight;
var image = new Image();
image.src = "./car.png";
image.onload = function () {
    var ASPECT_RATIO = image.width / image.height;
    var CAR_HEIGHT = ROAD_WIDTH / ASPECT_RATIO;
    PLAYER.positionY = canvas.height - CAR_HEIGHT;
    PLAYER.height = CAR_HEIGHT;
    var start = window.requestAnimationFrame(function () {
        return game(canvas, context, PLAYER, image);
    });
};
var KEY_PRESSED = {
    ArrowLeft: { pressed: false, action: function () { return moveCarLeft(PLAYER, MOVE_SPEED); } },
    ArrowRight: {
        pressed: false,
        action: function () { return moveCarRight(PLAYER, MOVE_SPEED); },
    },
    ArrowUp: { pressed: false, action: function () { return moveCarUp(PLAYER, MOVE_SPEED); } },
    ArrowDown: { pressed: false, action: function () { return moveCarDown(PLAYER, MOVE_SPEED); } },
};
window.addEventListener("keyup", function (_a) {
    var key = _a.key;
    if (!validKeyPressed(key))
        return;
    KEY_PRESSED[key].pressed = false;
});
window.addEventListener("keydown", function (_a) {
    var key = _a.key;
    if (!validKeyPressed(key))
        return;
    KEY_PRESSED[key].pressed = true;
});
function validKeyPressed(key, availableControl) {
    if (availableControl === void 0) { availableControl = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
    ]; }
    return (typeof availableControl.find(function (_) { return _ === key; }) !== "undefined");
}
function multiKeyPressed(keyPressed) {
    Object.keys(keyPressed).forEach(function (key) {
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
function game(canvas, context, player, image) {
    clearCanvas(context, canvas);
    multiKeyPressed(KEY_PRESSED);
    drawCar(context, player, image);
    window.requestAnimationFrame(function () { return game(canvas, context, player, image); });
}
function drawCar(context, player, image) {
    context.drawImage(image, player.positionX, player.positionY, player.width, player.height);
}
function clearCanvas(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
