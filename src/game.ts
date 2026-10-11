import type {
  Game,
  InitApi,
  PointerSample,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MATCHOVER_ITEMS,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLE_H,
  OBSTACLE_HH,
  OBSTACLE_W,
  OBSTACLE_HW,
  OBSTACLES,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  PADDLE_HALF,
  PADDLE_H,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  PAUSE_ITEMS,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPEED_CAP,
  SPEED_MULT,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";

export type Mode = "solo" | "versus";

export type Side = "left" | "right";

export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}

export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}

export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}

export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}

export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
}

export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";

  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;

  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;

  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];

  readonly simTime: number;
  readonly muted: boolean;
}

export interface BallSnapshot extends BallState {
  readonly speed: number;
}

export interface CaromSnapshot {
  readonly version: number;
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;
  readonly muted: boolean;
  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball: BallSnapshot | null;
  readonly obstacles: readonly ObstacleState[];
  readonly simTime: number;
}

export interface MenuItemRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface CaromDebugApi {
  readonly version: number;
  clearWorld(state: DeepReadonly<CaromState>): CaromState;
  spawnBall(state: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(state: DeepReadonly<CaromState>, index: number): CaromState;
  reset(state: DeepReadonly<CaromState>): CaromState;
  reconcile(state: DeepReadonly<CaromState>): CaromState;
  setScreen(state: DeepReadonly<CaromState>, screen: Screen): CaromState;
  setMode(state: DeepReadonly<CaromState>, mode: Mode): CaromState;
  setMenuIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setTitleIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setResumeScreen(
    state: DeepReadonly<CaromState>,
    screen: "countdown" | "playing",
  ): CaromState;
  setScore(state: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(state: DeepReadonly<CaromState>, side: Side | null): CaromState;
  setReceiver(state: DeepReadonly<CaromState>, side: Side): CaromState;
  setPaddleCy(
    state: DeepReadonly<CaromState>,
    side: Side,
    cy: number,
  ): CaromState;
  setPaddleVy(
    state: DeepReadonly<CaromState>,
    side: Side,
    vy: number,
  ): CaromState;
  setPaddleDriven(
    state: DeepReadonly<CaromState>,
    side: Side,
    driven: boolean,
  ): CaromState;
  setBallPosition(
    state: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    state: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(state: DeepReadonly<CaromState>, spin: number): CaromState;
  setBallHeld(state: DeepReadonly<CaromState>, held: boolean): CaromState;
  setBallHoldTimer(
    state: DeepReadonly<CaromState>,
    seconds: number,
  ): CaromState;
  setBallServeSign(state: DeepReadonly<CaromState>, sign: 1 | -1): CaromState;
  drawBallServeSign(state: DeepReadonly<CaromState>): CaromState;
  setAiTracking(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setAiMovement(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setMuted(state: DeepReadonly<CaromState>, muted: boolean): CaromState;
  snapshot(state: DeepReadonly<CaromState>): CaromSnapshot;
  menuItemRect(
    state: DeepReadonly<CaromState>,
    index: number,
  ): MenuItemRect | null;
}

export const BACKGROUND = "#07151b";

const LEFT_COLOR = "#37d7ff";
const RIGHT_COLOR = "#ff4f8b";
const BALL_COLOR = "#f7ff6a";
const OBSTACLE_COLOR = "#4df0a0";
const TEXT_COLOR = "#e9fbff";
const MUTED_COLOR = "#93a8ad";
const PANEL = "rgba(3, 13, 17, 0.72)";
const HIGHLIGHT = "#ffe66d";
const SHADOW = "rgba(0, 0, 0, 0.28)";
const HOWTO_COPY = [
  "Move your paddle as you strike to bend the ball.",
  "Bank through the green bumpers to open sharp angles.",
  "First to 11, win by 2.",
  "Solo: W/S or arrows. Versus: W/S and arrows.",
  "P pauses. M mutes.",
] as const;
const HOWTO_ITEMS = ["BACK"] as const;
const MENU_W = 360;
const MENU_H = 58;
const MENU_GAP = 18;

type CueFlags = {
  paddle: boolean;
  wall: boolean;
  obstacle: boolean;
  score: boolean;
};

type MenuAction =
  | "solo"
  | "versus"
  | "howto"
  | "resume"
  | "restart"
  | "quit"
  | "play-again"
  | "menu"
  | "back";

type MenuInput = {
  up: boolean;
  down: boolean;
  confirm: boolean;
  pointerIndex: number | null;
  pointerConfirm: boolean;
};

type CollisionFace = "left" | "right" | "top" | "bottom";

interface Rect {
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
}

interface WorkingBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
  held: boolean;
  holdTimer: number;
  serveSign: 1 | -1;
  trail: TrailSample[];
}

function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${String(value)}`);
}

function cloneState(state: DeepReadonly<CaromState>): CaromState {
  return {
    screen: state.screen,
    mode: state.mode,
    menuIndex: state.menuIndex,
    titleIndex: state.titleIndex,
    resumeScreen: state.resumeScreen,
    score: { p1: state.score.p1, p2: state.score.p2 },
    winner: state.winner,
    paddles: {
      left: { ...state.paddles.left },
      right: { ...state.paddles.right },
    },
    ai: { ...state.ai },
    receiver: state.receiver,
    ball: state.ball === null ? null : cloneBall(state.ball),
    obstacles: state.obstacles.map((obstacle) => ({ ...obstacle })),
    simTime: state.simTime,
    muted: state.muted,
  };
}

function cloneBall(ball: DeepReadonly<BallState>): BallState {
  return {
    x: ball.x,
    y: ball.y,
    vx: ball.vx,
    vy: ball.vy,
    spin: ball.spin,
    held: ball.held,
    holdTimer: ball.holdTimer,
    serveSign: ball.serveSign,
    trail: ball.trail.map((sample) => ({ ...sample })),
  };
}

function workingBall(ball: DeepReadonly<BallState>): WorkingBall {
  return {
    x: ball.x,
    y: ball.y,
    vx: ball.vx,
    vy: ball.vy,
    spin: ball.spin,
    held: ball.held,
    holdTimer: ball.holdTimer,
    serveSign: ball.serveSign,
    trail: ball.trail.map((sample) => ({ ...sample })),
  };
}

function freezeBall(ball: WorkingBall): BallState {
  return {
    x: ball.x,
    y: ball.y,
    vx: ball.vx,
    vy: ball.vy,
    spin: ball.spin,
    held: ball.held,
    holdTimer: ball.holdTimer,
    serveSign: ball.serveSign,
    trail: ball.trail.map((sample) => ({ ...sample })),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randomServeSign(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

function parkedBall(): BallState {
  return {
    x: FIELD_CX,
    y: FIELD_CY,
    vx: 0,
    vy: 0,
    spin: 0,
    held: true,
    holdTimer: HOLD_TIME,
    serveSign: randomServeSign(),
    trail: [],
  };
}

function initialPaddle(): PaddleState {
  return { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 };
}

function initialObstacles(): ObstacleState[] {
  return OBSTACLE_CENTERS.map((center, index) => ({
    index,
    cx: center.x,
    cy: center.y,
  }));
}

function titleState(muted: boolean, titleIndex = 0, simTime = 0): CaromState {
  return {
    screen: "title",
    mode: "solo",
    menuIndex: titleIndex,
    titleIndex,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    paddles: { left: initialPaddle(), right: initialPaddle() },
    ai: { tracking: true, movement: true },
    receiver: "left",
    ball: parkedBall(),
    obstacles: initialObstacles(),
    simTime,
    muted,
  };
}

function startMatch(state: DeepReadonly<CaromState>, mode: Mode): CaromState {
  const next = cloneState(state);
  return {
    ...next,
    screen: "countdown",
    mode,
    menuIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    receiver: "left",
    ball: parkedBall(),
    paddles: {
      left: { ...next.paddles.left, cy: FIELD_CY, vy: 0 },
      right: { ...next.paddles.right, cy: FIELD_CY, vy: 0 },
    },
  };
}

function returnToTitle(state: DeepReadonly<CaromState>): CaromState {
  return titleState(state.muted, state.titleIndex, state.simTime);
}

function integratePaddle(
  paddle: DeepReadonly<PaddleState>,
  requestedVy: number,
  dt: number,
): PaddleState {
  const nextCy = clamp(
    paddle.cy + requestedVy * dt,
    PADDLE_MIN_CY,
    PADDLE_MAX_CY,
  );
  const vy = dt > 0 ? (nextCy - paddle.cy) / dt : 0;
  return { ...paddle, cy: nextCy, vy };
}

function humanPaddleVy(up: number, down: number): number {
  return (down - up) * PADDLE_SPEED;
}

function updatePaddles(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): { left: PaddleState; right: PaddleState } {
  const leftInput =
    state.mode === "solo"
      ? humanPaddleVy(
          Math.max(api.input.value("p1-up"), api.input.value("p2-up")),
          Math.max(api.input.value("p1-down"), api.input.value("p2-down")),
        )
      : humanPaddleVy(api.input.value("p1-up"), api.input.value("p1-down"));
  const rightInput =
    state.mode === "versus"
      ? humanPaddleVy(api.input.value("p2-up"), api.input.value("p2-down"))
      : aiVelocity(state, dt);

  const leftVy = state.paddles.left.driven
    ? state.paddles.left.drivenVy
    : leftInput;
  const rightVy = state.paddles.right.driven
    ? state.paddles.right.drivenVy
    : rightInput;

  return {
    left: integratePaddle(state.paddles.left, leftVy, dt),
    right: integratePaddle(state.paddles.right, rightVy, dt),
  };
}

function aiVelocity(state: DeepReadonly<CaromState>, dt: number): number {
  if (!state.ai.movement || dt <= 0) return 0;
  let target = AI_HOME_Y;
  let deadzone = AI_HOME_DEADZONE;
  if (
    state.ai.tracking &&
    state.screen === "playing" &&
    state.ball !== null &&
    state.ball.vx > 0
  ) {
    target = state.ball.y - state.ball.vy * AI_REACT;
    deadzone = AI_DEADZONE;
  }
  const diff = target - state.paddles.right.cy;
  if (Math.abs(diff) <= deadzone) return 0;
  return Math.sign(diff) * Math.min(AI_SPEED, Math.abs(diff) / dt);
}

function menuItems(screen: Screen): readonly string[] {
  switch (screen) {
    case "title":
      return TITLE_ITEMS;
    case "howto":
      return HOWTO_ITEMS;
    case "paused":
      return PAUSE_ITEMS;
    case "matchover":
      return MATCHOVER_ITEMS;
    case "countdown":
    case "playing":
      return [];
    default:
      return assertNever(screen);
  }
}

function menuRectFor(screen: Screen, index: number): MenuItemRect | null {
  const items = menuItems(screen);
  if (index < 0 || index >= items.length) return null;
  const totalH = items.length * MENU_H + (items.length - 1) * MENU_GAP;
  const y =
    screen === "howto" ? 558 : screen === "title" ? 372 : FIELD_CY - totalH / 2;
  return {
    x: FIELD_CX - MENU_W / 2,
    y: y + index * (MENU_H + MENU_GAP),
    w: MENU_W,
    h: MENU_H,
  };
}

function pointInRect(x: number, y: number, rect: MenuItemRect): boolean {
  return (
    x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
  );
}

function menuIndexAt(screen: Screen, x: number, y: number): number | null {
  const items = menuItems(screen);
  for (let index = 0; index < items.length; index += 1) {
    const rect = menuRectFor(screen, index);
    if (rect !== null && pointInRect(x, y, rect)) return index;
  }
  return null;
}

function pointerPressIndex(
  screen: Screen,
  samples: readonly PointerSample[],
): number | null {
  for (const sample of samples) {
    if (
      (sample.type === "down" || sample.type === "move") &&
      sample.buttons.includes("primary")
    ) {
      const index = menuIndexAt(screen, sample.x, sample.y);
      if (index !== null) return index;
    }
  }
  return null;
}

function pointerConfirmIndex(
  screen: Screen,
  samples: readonly PointerSample[],
): number | null {
  let downIndex: number | null = null;
  let upIndex: number | null = null;
  for (const sample of samples) {
    if (sample.type === "down" && sample.button === "primary") {
      downIndex = menuIndexAt(screen, sample.x, sample.y);
    }
    if (sample.type === "up" && sample.button === "primary") {
      upIndex = menuIndexAt(screen, sample.x, sample.y);
    }
  }
  return downIndex !== null && downIndex === upIndex ? downIndex : null;
}

function readMenuInput(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): MenuInput {
  const up = api.input.pressed("p1-up") || api.input.pressed("p2-up");
  const down = api.input.pressed("p1-down") || api.input.pressed("p2-down");
  const confirm = api.input.pressed("confirm");
  const samples = api.input.pointerSamples();
  const hover = api.input.pointer();
  const hoverIndex = menuIndexAt(state.screen, hover.x, hover.y);
  const sampleIndex = pointerPressIndex(state.screen, samples);
  const confirmIndex = pointerConfirmIndex(state.screen, samples);
  return {
    up,
    down,
    confirm,
    pointerIndex: confirmIndex ?? sampleIndex ?? hoverIndex,
    pointerConfirm: confirmIndex !== null,
  };
}

function menuMovedIndex(
  current: number,
  count: number,
  input: Pick<MenuInput, "up" | "down">,
): number {
  if (count <= 0) return 0;
  if (input.up) return (current - 1 + count) % count;
  if (input.down) return (current + 1) % count;
  return current;
}

function applyMenuAction(
  state: DeepReadonly<CaromState>,
  action: MenuAction,
): CaromState {
  switch (action) {
    case "solo":
      return startMatch({ ...state, titleIndex: 0 }, "solo");
    case "versus":
      return startMatch({ ...state, titleIndex: 1 }, "versus");
    case "howto":
      return {
        ...cloneState(state),
        screen: "howto",
        menuIndex: 0,
        titleIndex: 2,
      };
    case "resume":
      return { ...cloneState(state), screen: state.resumeScreen };
    case "restart":
    case "play-again":
      return startMatch(state, state.mode);
    case "quit":
    case "menu":
    case "back":
      return returnToTitle(state);
    default:
      return assertNever(action);
  }
}

function confirmCurrentMenu(state: DeepReadonly<CaromState>): CaromState {
  if (state.screen === "title") {
    if (state.menuIndex === 0) return applyMenuAction(state, "solo");
    if (state.menuIndex === 1) return applyMenuAction(state, "versus");
    return applyMenuAction(state, "howto");
  }
  if (state.screen === "howto") return applyMenuAction(state, "back");
  if (state.screen === "paused") {
    if (state.menuIndex === 0) return applyMenuAction(state, "resume");
    if (state.menuIndex === 1) return applyMenuAction(state, "restart");
    return applyMenuAction(state, "quit");
  }
  if (state.screen === "matchover") {
    if (state.menuIndex === 0) return applyMenuAction(state, "play-again");
    return applyMenuAction(state, "menu");
  }
  return cloneState(state);
}

function updateMenuScreen(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): CaromState {
  const input = readMenuInput(state, api);
  const items = menuItems(state.screen);
  let next = cloneState(state);
  const moved = input.up || input.down;
  if (moved) {
    next = {
      ...next,
      menuIndex: menuMovedIndex(next.menuIndex, items.length, input),
    };
  }
  if (!moved && input.confirm) {
    return confirmCurrentMenu(next);
  }
  if (input.pointerIndex !== null) {
    next = { ...next, menuIndex: input.pointerIndex };
    if (state.screen === "title")
      next = { ...next, titleIndex: input.pointerIndex };
  }
  if (!input.confirm && input.pointerConfirm) return confirmCurrentMenu(next);
  return next;
}

function rectForPaddle(side: Side, cy: number): Rect {
  return {
    x0: side === "left" ? P1_X0 : P2_X0,
    x1: side === "left" ? P1_X1 : P2_X1,
    y0: cy - PADDLE_HALF,
    y1: cy + PADDLE_HALF,
  };
}

function obstacleRect(obstacle: DeepReadonly<ObstacleState>): Rect {
  return (
    OBSTACLES[obstacle.index] ?? {
      x0: obstacle.cx - OBSTACLE_HW,
      y0: obstacle.cy - OBSTACLE_HH,
      x1: obstacle.cx + OBSTACLE_HW,
      y1: obstacle.cy + OBSTACLE_HH,
    }
  );
}

function resolveCircleRect(
  ball: WorkingBall,
  rect: Rect,
): CollisionFace | null {
  if (
    ball.x <= rect.x0 - BALL_R ||
    ball.x >= rect.x1 + BALL_R ||
    ball.y <= rect.y0 - BALL_R ||
    ball.y >= rect.y1 + BALL_R
  ) {
    return null;
  }
  const depths = [
    { face: "left" as const, value: ball.x - (rect.x0 - BALL_R) },
    { face: "right" as const, value: rect.x1 + BALL_R - ball.x },
    { face: "top" as const, value: ball.y - (rect.y0 - BALL_R) },
    { face: "bottom" as const, value: rect.y1 + BALL_R - ball.y },
  ];
  let struck = depths[0];
  for (const depth of depths.slice(1)) {
    if (depth.value < struck.value) struck = depth;
  }
  switch (struck.face) {
    case "left":
      ball.x = rect.x0 - BALL_R;
      if (ball.vx > 0) ball.vx = -ball.vx;
      break;
    case "right":
      ball.x = rect.x1 + BALL_R;
      if (ball.vx < 0) ball.vx = -ball.vx;
      break;
    case "top":
      ball.y = rect.y0 - BALL_R;
      if (ball.vy > 0) ball.vy = -ball.vy;
      break;
    case "bottom":
      ball.y = rect.y1 + BALL_R;
      if (ball.vy < 0) ball.vy = -ball.vy;
      break;
  }
  return struck.face;
}

function paddleBounce(
  ball: WorkingBall,
  side: Side,
  paddle: DeepReadonly<PaddleState>,
): void {
  const offset = clamp((ball.y - paddle.cy) / PADDLE_HALF, -1, 1);
  const theta = offset * MAX_BOUNCE_ANGLE;
  const speed = Math.min(Math.hypot(ball.vx, ball.vy) * SPEED_MULT, SPEED_CAP);
  const dir = side === "left" ? 1 : -1;
  ball.vx = dir * speed * Math.cos(theta);
  ball.vy = speed * Math.sin(theta);
  ball.spin = clamp(
    ball.spin + paddle.vy * SPIN_FROM_PADDLE,
    -SPIN_CLAMP,
    SPIN_CLAMP,
  );
  ball.x = side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R;
}

function advanceFlyingBall(
  inputBall: DeepReadonly<BallState>,
  paddles: DeepReadonly<CaromState["paddles"]>,
  obstacles: readonly DeepReadonly<ObstacleState>[],
  dt: number,
): { ball: BallState; cues: CueFlags } {
  const ball = workingBall(inputBall);
  const cues = { paddle: false, wall: false, obstacle: false, score: false };
  const speed = Math.hypot(ball.vx, ball.vy);
  const steps = Math.max(1, Math.ceil((speed * dt) / MAX_SUBSTEP));
  const h = dt / steps;
  for (let i = 0; i < steps; i += 1) {
    const subSpeed = Math.hypot(ball.vx, ball.vy);
    if (subSpeed > 0) {
      const angle = (ball.spin / subSpeed) * h;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const vx = ball.vx * cos - ball.vy * sin;
      const vy = ball.vx * sin + ball.vy * cos;
      ball.vx = vx;
      ball.vy = vy;
    }
    ball.spin *= 0.5 ** (h / SPIN_HALFLIFE);
    ball.x += ball.vx * h;
    ball.y += ball.vy * h;

    if (ball.y - BALL_R < 0 && ball.vy < 0) {
      ball.y = BALL_R;
      ball.vy = -ball.vy;
      cues.wall = true;
    } else if (ball.y + BALL_R > FIELD_H && ball.vy > 0) {
      ball.y = FIELD_H - BALL_R;
      ball.vy = -ball.vy;
      cues.wall = true;
    }

    const leftFace = resolveCircleRect(
      ball,
      rectForPaddle("left", paddles.left.cy),
    );
    if (leftFace === "left" || leftFace === "right") {
      paddleBounce(ball, "left", paddles.left);
      cues.paddle = true;
    } else if (leftFace === "top" || leftFace === "bottom") {
      cues.wall = true;
    }

    const rightFace = resolveCircleRect(
      ball,
      rectForPaddle("right", paddles.right.cy),
    );
    if (rightFace === "left" || rightFace === "right") {
      paddleBounce(ball, "right", paddles.right);
      cues.paddle = true;
    } else if (rightFace === "top" || rightFace === "bottom") {
      cues.wall = true;
    }

    for (const obstacle of obstacles) {
      const face = resolveCircleRect(ball, obstacleRect(obstacle));
      if (face !== null) cues.obstacle = true;
    }
  }
  return { ball: freezeBall(ball), cues };
}

function serveBall(ball: DeepReadonly<BallState>, receiver: Side): BallState {
  const dir = receiver === "left" ? -1 : 1;
  return {
    ...cloneBall(ball),
    held: false,
    holdTimer: 0,
    vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
    vy: ball.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
    trail: [],
  };
}

function appendTrail(ball: BallState, simTime: number): BallState {
  const trail = [...ball.trail, { x: ball.x, y: ball.y, t: simTime }].filter(
    (sample) => simTime - sample.t <= TRAIL_TIME,
  );
  return { ...ball, trail };
}

function scoreState(
  state: CaromState,
  scorer: Side,
): { state: CaromState; scored: boolean } {
  const score = {
    p1: state.score.p1 + (scorer === "left" ? 1 : 0),
    p2: state.score.p2 + (scorer === "right" ? 1 : 0),
  };
  const leftWins = score.p1 >= WIN_SCORE && score.p1 - score.p2 >= WIN_LEAD;
  const rightWins = score.p2 >= WIN_SCORE && score.p2 - score.p1 >= WIN_LEAD;
  if (leftWins || rightWins) {
    return {
      scored: true,
      state: {
        ...state,
        score,
        winner: leftWins ? "left" : "right",
        screen: "matchover",
        menuIndex: 0,
      },
    };
  }
  return {
    scored: true,
    state: {
      ...state,
      score,
      receiver: scorer === "left" ? "right" : "left",
      ball: parkedBall(),
      screen: "countdown",
    },
  };
}

function advanceActiveScreen(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
  simTime: number,
): { state: CaromState; cues: CueFlags } {
  const cues = { paddle: false, wall: false, obstacle: false, score: false };
  const paddles = updatePaddles(state, api, dt);
  let next: CaromState = { ...cloneState(state), paddles, simTime };
  if (next.ball === null) return { state: next, cues };

  if (next.screen === "countdown") {
    const holdTimer = Math.max(0, next.ball.holdTimer - dt);
    let ball = { ...next.ball, x: FIELD_CX, y: FIELD_CY, holdTimer };
    if (holdTimer <= 0) {
      ball = serveBall(ball, next.receiver);
      next = { ...next, screen: "playing", ball };
    } else {
      next = { ...next, ball: appendTrail(ball, simTime) };
    }
    return { state: next, cues };
  }

  const advanced = advanceFlyingBall(next.ball, paddles, next.obstacles, dt);
  const ball = appendTrail(advanced.ball, simTime);
  next = { ...next, ball };
  Object.assign(cues, advanced.cues);
  if (ball.x - BALL_R > FIELD_W) {
    cues.score = true;
    return { state: scoreState(next, "left").state, cues };
  }
  if (ball.x + BALL_R < 0) {
    cues.score = true;
    return { state: scoreState(next, "right").state, cues };
  }
  return { state: { ...next, ball }, cues };
}

function playCues(api: UpdateApi, cues: CueFlags): void {
  if (cues.paddle) api.audio.play(CUES.paddleHit);
  if (cues.wall) api.audio.play(CUES.wallBounce);
  if (cues.obstacle) api.audio.play(CUES.obstacleBounce);
  if (cues.score) api.audio.play(CUES.score);
}

function updateInput(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): CaromState {
  let next = cloneState(state);
  if (api.input.pressed("mute")) {
    api.audio.setMuted(!api.audio.muted());
    next = { ...next, muted: api.audio.muted() };
  }
  if (state.screen === "countdown" || state.screen === "playing") {
    if (api.input.pressed("pause")) {
      return {
        ...next,
        screen: "paused",
        resumeScreen: state.screen,
        menuIndex: 0,
      };
    }
    return next;
  }
  if (state.screen === "howto") {
    const back = api.input.pressed("back");
    next = updateMenuScreen(next, api);
    return back ? returnToTitle(next) : next;
  }
  if (state.screen === "paused") {
    const pause = api.input.pressed("pause");
    const back = api.input.pressed("back");
    if (pause || back) return { ...next, screen: next.resumeScreen };
    return updateMenuScreen(next, api);
  }
  if (state.screen === "matchover") {
    const back = api.input.pressed("back");
    next = updateMenuScreen(next, api);
    return back ? returnToTitle(next) : next;
  }
  if (state.screen === "title") {
    api.input.pressed("back");
    return updateMenuScreen(next, api);
  }
  return next;
}

function snapshot(state: DeepReadonly<CaromState>): CaromSnapshot {
  return {
    version: CAROM_DEBUG_VERSION,
    screen: state.screen,
    mode: state.mode,
    menuIndex: state.menuIndex,
    titleIndex: state.titleIndex,
    resumeScreen: state.resumeScreen,
    score: { p1: state.score.p1, p2: state.score.p2 },
    winner: state.winner,
    muted: state.muted,
    paddles: {
      left: { ...state.paddles.left },
      right: { ...state.paddles.right },
    },
    ai: { ...state.ai },
    receiver: state.receiver,
    ball:
      state.ball === null
        ? null
        : {
            ...cloneBall(state.ball),
            speed: Math.hypot(state.ball.vx, state.ball.vy),
          },
    obstacles: state.obstacles.map((obstacle) => ({ ...obstacle })),
    simTime: state.simTime,
  };
}

function requireBall(state: DeepReadonly<CaromState>): BallState {
  if (state.ball === null) throw new Error("Carom: no ball is present");
  return cloneBall(state.ball);
}

function assertObstacleIndex(index: number): void {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= OBSTACLE_CENTERS.length
  ) {
    throw new Error(`Carom: obstacle ${index} does not exist`);
  }
}

function debugSurface(): CaromDebugApi {
  return {
    version: CAROM_DEBUG_VERSION,
    clearWorld: (state) => ({
      ...cloneState(state),
      ball: null,
      obstacles: [],
    }),
    spawnBall: (state) => ({ ...cloneState(state), ball: parkedBall() }),
    spawnObstacle: (state, index) => {
      assertObstacleIndex(index);
      const next = cloneState(state);
      const center = OBSTACLE_CENTERS[index];
      return {
        ...next,
        obstacles: [
          ...next.obstacles.filter((obstacle) => obstacle.index !== index),
          { index, cx: center.x, cy: center.y },
        ].sort((a, b) => a.index - b.index),
      };
    },
    reset: (state) => titleState(state.muted),
    reconcile: (state) => cloneState(state),
    setScreen: (state, screen) => ({ ...cloneState(state), screen }),
    setMode: (state, mode) => ({ ...cloneState(state), mode }),
    setMenuIndex: (state, index) => ({
      ...cloneState(state),
      menuIndex: index,
    }),
    setTitleIndex: (state, index) => ({
      ...cloneState(state),
      titleIndex: index,
    }),
    setResumeScreen: (state, screen) => ({
      ...cloneState(state),
      resumeScreen: screen,
    }),
    setScore: (state, p1, p2) => ({ ...cloneState(state), score: { p1, p2 } }),
    setWinner: (state, side) => ({ ...cloneState(state), winner: side }),
    setReceiver: (state, side) => ({ ...cloneState(state), receiver: side }),
    setPaddleCy: (state, side, cy) => ({
      ...cloneState(state),
      paddles: {
        ...cloneState(state).paddles,
        [side]: { ...state.paddles[side], cy },
      },
    }),
    setPaddleVy: (state, side, vy) => ({
      ...cloneState(state),
      paddles: {
        ...cloneState(state).paddles,
        [side]: { ...state.paddles[side], drivenVy: vy },
      },
    }),
    setPaddleDriven: (state, side, driven) => ({
      ...cloneState(state),
      paddles: {
        ...cloneState(state).paddles,
        [side]: { ...state.paddles[side], driven },
      },
    }),
    setBallPosition: (state, x, y) => ({
      ...cloneState(state),
      ball: { ...requireBall(state), x, y },
    }),
    setBallVelocity: (state, vx, vy) => ({
      ...cloneState(state),
      ball: { ...requireBall(state), vx, vy },
    }),
    setBallSpin: (state, spin) => ({
      ...cloneState(state),
      ball: { ...requireBall(state), spin },
    }),
    setBallHeld: (state, held) => ({
      ...cloneState(state),
      ball: { ...requireBall(state), held },
    }),
    setBallHoldTimer: (state, seconds) => ({
      ...cloneState(state),
      ball: { ...requireBall(state), holdTimer: seconds },
    }),
    setBallServeSign: (state, sign) => ({
      ...cloneState(state),
      ball: { ...requireBall(state), serveSign: sign },
    }),
    drawBallServeSign: (state) => ({
      ...cloneState(state),
      ball: { ...requireBall(state), serveSign: randomServeSign() },
    }),
    setAiTracking: (state, enabled) => ({
      ...cloneState(state),
      ai: { ...state.ai, tracking: enabled },
    }),
    setAiMovement: (state, enabled) => ({
      ...cloneState(state),
      ai: { ...state.ai, movement: enabled },
    }),
    setMuted: (state, muted) => ({ ...cloneState(state), muted }),
    snapshot,
    menuItemRect: (state, index) => menuRectFor(state.screen, index),
  };
}

function defineDiagnostics(api: InitApi<CaromState>): void {
  api.diagnostics.register("screen", (state) => state.screen);
  api.diagnostics.register("mode", (state) => state.mode);
  api.diagnostics.register(
    "score",
    (state) => `${state.score.p1}-${state.score.p2}`,
  );
  api.diagnostics.register("ball pos", (state) =>
    state.ball === null
      ? "none"
      : `${state.ball.x.toFixed(1)}, ${state.ball.y.toFixed(1)}`,
  );
  api.diagnostics.register("ball vel", (state) =>
    state.ball === null
      ? "none"
      : `${state.ball.vx.toFixed(1)}, ${state.ball.vy.toFixed(1)}`,
  );
  api.diagnostics.register("ball speed", (state) =>
    state.ball === null ? 0 : Math.hypot(state.ball.vx, state.ball.vy),
  );
  api.diagnostics.register("ball spin", (state) =>
    state.ball === null ? 0 : state.ball.spin,
  );
  api.diagnostics.register(
    "left paddle",
    (state) =>
      `${state.paddles.left.cy.toFixed(1)}, ${state.paddles.left.vy.toFixed(1)}`,
  );
  api.diagnostics.register(
    "right paddle",
    (state) =>
      `${state.paddles.right.cy.toFixed(1)}, ${state.paddles.right.vy.toFixed(1)}`,
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawGlowCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
): void {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawField(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  const gradient = ctx.createLinearGradient(0, 0, FIELD_W, FIELD_H);
  gradient.addColorStop(0, BACKGROUND);
  gradient.addColorStop(1, "#0c2025");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  ctx.save();
  ctx.strokeStyle = "rgba(233, 251, 255, 0.18)";
  ctx.lineWidth = 4;
  ctx.setLineDash([18, 20]);
  ctx.beginPath();
  ctx.moveTo(NET_X, 48);
  ctx.lineTo(NET_X, FIELD_H - 48);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = "rgba(233, 251, 255, 0.16)";
  ctx.lineWidth = 3;
  ctx.strokeRect(26, 24, FIELD_W - 52, FIELD_H - 48);
  drawObstacles(state, ctx);
  drawPaddle(ctx, "left", state.paddles.left.cy);
  drawPaddle(ctx, "right", state.paddles.right.cy);
  if (state.ball !== null) drawBall(state.ball, ctx);
}

function drawPaddle(
  ctx: CanvasRenderingContext2D,
  side: Side,
  cy: number,
): void {
  const x = side === "left" ? P1_X0 : P2_X0;
  const color = side === "left" ? LEFT_COLOR : RIGHT_COLOR;
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fillStyle = color;
  roundRect(ctx, x, cy - PADDLE_HALF, PADDLE_W, PADDLE_H, 8);
  ctx.fill();
  ctx.restore();
}

function drawObstacles(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  for (const obstacle of state.obstacles) {
    ctx.save();
    ctx.shadowColor = OBSTACLE_COLOR;
    ctx.shadowBlur = 16;
    ctx.fillStyle = OBSTACLE_COLOR;
    roundRect(
      ctx,
      obstacle.cx - OBSTACLE_HW,
      obstacle.cy - OBSTACLE_HH,
      OBSTACLE_W,
      OBSTACLE_H,
      10,
    );
    ctx.fill();
    ctx.restore();
  }
}

function drawBall(
  ball: DeepReadonly<BallState>,
  ctx: CanvasRenderingContext2D,
): void {
  if (ball.trail.length > 1) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(247, 255, 106, 0.45)";
    ctx.lineWidth = BALL_R * 1.3;
    ctx.beginPath();
    for (const [index, sample] of ball.trail.entries()) {
      if (index === 0) ctx.moveTo(sample.x, sample.y);
      else ctx.lineTo(sample.x, sample.y);
    }
    ctx.stroke();
    ctx.restore();
  }
  drawGlowCircle(ctx, ball.x, ball.y, BALL_R, BALL_COLOR);
}

function drawHud(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "700 52px Inter, system-ui, sans-serif";
  ctx.fillStyle = LEFT_COLOR;
  ctx.fillText(String(state.score.p1), FIELD_CX - 110, 34);
  ctx.fillStyle = RIGHT_COLOR;
  ctx.fillText(String(state.score.p2), FIELD_CX + 110, 34);
  ctx.font = "700 18px Inter, system-ui, sans-serif";
  ctx.fillStyle = MUTED_COLOR;
  ctx.fillText(
    state.mode === "solo" ? "SOLO DUEL" : "VERSUS DUEL",
    FIELD_CX,
    38,
  );
  if (state.muted) ctx.fillText("MUTED", FIELD_CX, 62);
  ctx.restore();
}

function drawMenu(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
  title: string,
  subtitle: string | null,
): void {
  ctx.save();
  ctx.fillStyle = PANEL;
  roundRect(ctx, FIELD_CX - 250, 118, 500, 490, 8);
  ctx.fill();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = SHADOW;
  ctx.shadowBlur = 10;
  ctx.font = "900 86px Inter, system-ui, sans-serif";
  ctx.fillStyle = TEXT_COLOR;
  ctx.fillText(title, FIELD_CX, 188);
  if (subtitle !== null) {
    ctx.font = "600 22px Inter, system-ui, sans-serif";
    ctx.fillStyle = MUTED_COLOR;
    ctx.fillText(subtitle, FIELD_CX, 258);
  }
  drawMenuItems(state, ctx);
  ctx.restore();
}

function drawMenuItems(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  const items = menuItems(state.screen);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 24px Inter, system-ui, sans-serif";
  for (const [index, item] of items.entries()) {
    const rect = menuRectFor(state.screen, index);
    if (rect === null) continue;
    const selected = index === state.menuIndex;
    ctx.fillStyle = selected ? HIGHLIGHT : "rgba(233, 251, 255, 0.12)";
    ctx.strokeStyle = selected
      ? "rgba(255, 230, 109, 0.9)"
      : "rgba(233, 251, 255, 0.22)";
    ctx.lineWidth = 2;
    roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = selected ? "#182024" : TEXT_COLOR;
    ctx.fillText(item, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
  }
}

function drawHowTo(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.save();
  ctx.fillStyle = PANEL;
  roundRect(ctx, 300, 82, 680, 560, 8);
  ctx.fill();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 56px Inter, system-ui, sans-serif";
  ctx.fillStyle = TEXT_COLOR;
  ctx.fillText("HOW TO PLAY", FIELD_CX, 152);
  ctx.font = "600 25px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#cbe6eb";
  for (const [index, line] of HOWTO_COPY.entries()) {
    ctx.fillText(line, FIELD_CX, 238 + index * 52);
  }
  drawMenuItems(state, ctx);
  ctx.restore();
}

function drawPause(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  drawMenu(
    state,
    ctx,
    "PAUSED",
    "Catch your breath, then carve the next angle.",
  );
  ctx.restore();
}

function drawCountdown(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  if (state.ball === null) return;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 84px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(233, 251, 255, 0.88)";
  ctx.fillText(
    Math.ceil(state.ball.holdTimer).toString(),
    FIELD_CX,
    FIELD_CY - 86,
  );
  ctx.font = "700 24px Inter, system-ui, sans-serif";
  ctx.fillStyle = MUTED_COLOR;
  ctx.fillText("READY", FIELD_CX, FIELD_CY - 24);
  ctx.restore();
}

function drawMatchOver(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  const winner = state.winner === "left" ? "LEFT WINS" : "RIGHT WINS";
  drawMenu(
    state,
    ctx,
    winner,
    `Final score ${state.score.p1}-${state.score.p2}`,
  );
}

export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>): [CaromState, CaromDebugApi] {
    for (const action of ACTIONS) {
      api.input.register(action, { keys: [...BINDINGS[action]] });
    }
    api.audio.define(CUES.paddleHit, {
      wave: "triangle",
      freq: 560,
      freqTo: 860,
      gain: 0.16,
      durationMs: 60,
    });
    api.audio.define(CUES.wallBounce, {
      wave: "sine",
      freq: 310,
      freqTo: 210,
      gain: 0.14,
      durationMs: 70,
    });
    api.audio.define(CUES.obstacleBounce, {
      wave: "square",
      freq: 420,
      freqTo: 760,
      gain: 0.11,
      durationMs: 55,
    });
    api.audio.define(CUES.score, {
      wave: "sawtooth",
      freq: 180,
      freqTo: 620,
      gain: 0.18,
      durationMs: 160,
    });
    defineDiagnostics(api);
    return [titleState(false), debugSurface()];
  },

  update(
    state: DeepReadonly<CaromState>,
    api: UpdateApi,
    dt: number,
  ): CaromState {
    if (state.muted !== api.audio.muted()) api.audio.setMuted(state.muted);
    const withTime = { ...cloneState(state), simTime: state.simTime + dt };
    let next = updateInput(withTime, api);
    let cues = { paddle: false, wall: false, obstacle: false, score: false };
    if (next.screen === "countdown" || next.screen === "playing") {
      const advanced = advanceActiveScreen(next, api, dt, withTime.simTime);
      next = advanced.state;
      cues = advanced.cues;
    }
    playCues(api, cues);
    return { ...next, muted: api.audio.muted(), simTime: withTime.simTime };
  },

  render(state: DeepReadonly<CaromState>, api: RenderApi): void {
    const { ctx } = api;
    drawField(state, ctx);
    if (state.screen === "playing" || state.screen === "countdown")
      drawHud(state, ctx);
    if (state.screen === "countdown") drawCountdown(state, ctx);
    if (state.screen === "title") {
      drawMenu(state, ctx, TITLE_TEXT, "Spin the rally. Own the angle.");
    } else if (state.screen === "howto") {
      drawHowTo(state, ctx);
    } else if (state.screen === "paused") {
      drawHud(state, ctx);
      drawPause(state, ctx);
    } else if (state.screen === "matchover") {
      drawHud(state, ctx);
      drawMatchOver(state, ctx);
    }
  },
};
