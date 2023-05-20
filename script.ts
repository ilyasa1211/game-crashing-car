var canvas = document.querySelector("canvas") as HTMLCanvasElement;
var context = canvas.getContext("2d") as CanvasRenderingContext2D;

type Position = 0 | 1 | 2;
type Player = {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
};
type Move = {
  horizontal: number;
  vertical: number;
};
type Control = {
  ArrowLeft: { pressed: boolean; action: () => void };
  ArrowRight: { pressed: boolean; action: () => void };
  ArrowUp: { pressed: boolean; action: () => void };
  ArrowDown: { pressed: boolean; action: () => void };
};
var ROAD_WIDTH: number = 100;
var ROAD_COUNT: number = 3;
var POSITION: Position = 1;
var MOVE_SPEED: Move = {
  horizontal: 5,
  vertical: 10,
};
var PLAYER: Player = {
  positionX: 0,
  positionY: 0,
  width: ROAD_WIDTH,
  height: 0,
};
var AVAILABLE_CONTROL: Array<string> = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
];
canvas.width = ROAD_COUNT * ROAD_WIDTH;
canvas.height = window.innerHeight;

var image = new Image();
image.src = "./car.png";

image.onload = () => {
  const ASPECT_RATIO = image.width / image.height;
  const CAR_HEIGHT = ROAD_WIDTH / ASPECT_RATIO;
  PLAYER.positionY = canvas.height - CAR_HEIGHT;
  PLAYER.height = CAR_HEIGHT;
  let start = window.requestAnimationFrame(() =>
    game(canvas, context, PLAYER, image)
  );
};

const KEY_PRESSED: Control = {
  ArrowLeft: { pressed: false, action: () => moveCarLeft(PLAYER, MOVE_SPEED) },
  ArrowRight: {
    pressed: false,
    action: () => moveCarRight(PLAYER, MOVE_SPEED),
  },
  ArrowUp: { pressed: false, action: () => moveCarUp(PLAYER, MOVE_SPEED) },
  ArrowDown: { pressed: false, action: () => moveCarDown(PLAYER, MOVE_SPEED) },
};
window.addEventListener("keyup", ({ key }: KeyboardEvent) => {
  if (!validKeyPressed(key)) return;
  KEY_PRESSED[key].pressed = false;
});
window.addEventListener("keydown", ({ key }: KeyboardEvent) => {
  if (!validKeyPressed(key)) return;
  KEY_PRESSED[key].pressed = true;
});

function validKeyPressed(
  key: string,
  availableControl: Array<string> = [
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
  ],
): boolean {
  return (
    typeof availableControl.find(
      (_) => _ === key,
    ) !== "undefined"
  );
}

function multiKeyPressed(keyPressed: Control): void {
  Object.keys(keyPressed).forEach((key) => {
    keyPressed[key].pressed && keyPressed[key].action();
  });
}

function moveCarDown(player: Player, moveSpeed: Move): void {
  player.positionY = Math.min(
    player.positionY + moveSpeed.vertical,
    canvas.height - player.height,
  );
}

function moveCarUp(player: Player, moveSpeed: Move): void {
  player.positionY = Math.max(player.positionY - moveSpeed.vertical, 0);
}

function moveCarRight(player: Player, moveSpeed: Move): void {
  player.positionX = Math.min(
    player.positionX + moveSpeed.horizontal,
    canvas.width - player.width,
  );
}

function moveCarLeft(player: Player, moveSpeed: Move): void {
  player.positionX = Math.max(player.positionX - moveSpeed.horizontal, 0);
}

function game(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  player: Player,
  image: HTMLImageElement,
): void {
  clearCanvas(context, canvas);
  multiKeyPressed(KEY_PRESSED);
  drawCar(context, player, image);

  window.requestAnimationFrame(() => game(canvas, context, player, image));
}

function drawCar(
  context: CanvasRenderingContext2D,
  player: Player,
  image: HTMLImageElement,
): void {
  context.drawImage(
    image,
    player.positionX,
    player.positionY,
    player.width,
    player.height,
  );
}

function clearCanvas(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
): void {
  context.clearRect(0, 0, canvas.width, canvas.height);
}
