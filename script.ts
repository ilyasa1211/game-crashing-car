var canvas = document.querySelector("canvas") as HTMLCanvasElement;
var context = canvas.getContext("2d") as CanvasRenderingContext2D;
var image = new Image();
image.src = "car.png";

type Position = 0 | 1 | 2;
type Player = {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
};
interface Lane {
  width: number;
  count: number;
  stripes: Array<number>;
  stripeColor: string;
}
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
class Road implements Lane {
  public stripes: number[];
  public SPACE_BEETWEEN_STRIPE: number = 400;
  public stripeColor: string;
  constructor(
    public width: number,
    public count: number,
    options: { stripeColor: string } = { stripeColor: "white" },
  ) {
    Object.assign(this, options);
    this.stripes = new Array(3).fill(null).map((_, i) =>
      i * -this.SPACE_BEETWEEN_STRIPE
    );
  }
  public move(canvas: HTMLCanvasElement, speed: number = .2) {
    this.stripes.forEach((positionY: number, index: number) => {
      this.stripes[index] = positionY > canvas.height ? 0 : positionY + speed;
    });
  }
}
var ROAD: Road = new Road(100, 5, { stripeColor: "rgba(255, 255, 255, 0.5)" });
var POSITION: Position = 1;
var MOVE_SPEED: Move = {
  horizontal: 5,
  vertical: 10,
};
var PLAYER: Player = {
  positionX: 0,
  positionY: 0,
  width: ROAD.width,
  height: 0,
};
var SPACE_BEETWEEN_NEIGHBOR_CAR: { min: number; max: number } = {
  min: 100,
  max: 200,
};
var NEIGHBOR: Array<{ positionX: number; positionY: number }> = new Array(4)
  .fill(null).map((_: null, index: number) => {
    return {
      positionY: index *
        -randomIntBetween(
          SPACE_BEETWEEN_NEIGHBOR_CAR.min,
          SPACE_BEETWEEN_NEIGHBOR_CAR.max,
        ),
      positionX: randomIntBetween(0, ROAD.count),
    };
  });
var AVAILABLE_CONTROL: Array<string> = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
];

const KEY_PRESSED: Control = {
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
  let start = window.requestAnimationFrame(() =>
    game(canvas, context, PLAYER, image, KEY_PRESSED, ROAD, NEIGHBOR)
  );
};
window.onkeyup = ({ key }: KeyboardEvent) => {
  if (!validKeyPressed(key)) return;
  KEY_PRESSED[key].pressed = false;
};
window.onkeydown = ({ key }: KeyboardEvent) => {
  if (!validKeyPressed(key)) return;
  KEY_PRESSED[key].pressed = true;
};

function validKeyPressed(
  key: string,
  availableControl: Array<string> = window.AVAILABLE_CONTROL,
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
  keyPressed: Control,
  road: Road,
  neighbor: Array<{ positionX: number; positionY: number }>,
  neighborImage: HTMLImageElement | null = null,
): void {
  clearCanvas(context, canvas);
  !neighborImage && (neighborImage = image);
  multiKeyPressed(keyPressed);
  drawRoad(context, road, canvas);
  drawCar(context, player, image);
  drawNeighborCar(context, road, neighbor, neighborImage!);
  window.requestAnimationFrame(() =>
    game(
      canvas,
      context,
      player,
      image,
      keyPressed,
      road,
      neighbor,
      neighborImage,
    )
  );
}

function drawNeighborCar(
  context: CanvasRenderingContext2D,
  road: Road,
  neighborCar: Array<{ positionX: number; positionY: number }>,
  image: HTMLImageElement,
): void {
  neighborCar.forEach(
    (car: { positionX: number; positionY: number }) => {
      context.beginPath();
      context.drawImage(
        image,
        car.positionX * road.width,
        car.positionY,
        road.width,
        PLAYER.height,
      );
      context.closePath();
      let speed = 5;
      if (car.positionY > canvas.height) {
        car.positionX = randomIntBetween(0, road.count);
        car.positionY = -PLAYER.height;
      }
      car.positionY += speed;
    },
  );
}

function drawRoad(
  context: CanvasRenderingContext2D,
  road: Road,
  canvas: HTMLCanvasElement,
): void {
  for (let index = 0; index <= road.count; index++) {
    const LINE_ROAD = road.width / 50;
    context.fillStyle = road.stripeColor;
    context.beginPath();
    context.rect(
      index * road.width - LINE_ROAD / 2,
      0,
      LINE_ROAD,
      canvas.height,
    );
    context.closePath();
    context.fill();

    road.stripes.forEach((stripPositionX: number) => {
      const stripWidth = 10;
      const stripHeight = 20;
      context.beginPath();
      context.rect(
        index * road.width - road.width / 2,
        stripPositionX,
        stripWidth,
        stripHeight,
      );
      context.closePath();
      context.fill();

      road.move(canvas);
    });
  }
}

function drawCar(
  context: CanvasRenderingContext2D,
  player: Player,
  image: HTMLImageElement,
): void {
  const [x, y, dx, dy] = [
    player.positionX,
    player.positionY,
    player.width,
    player.height,
  ];
  context.drawImage(image, x, y, dx, dy);
}

function clearCanvas(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
): void {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function randomIntBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}
