import { ConstantClock, createEngine } from "@clockwyrks/simple-2d";
import { createCanvas } from "@napi-rs/canvas";
import { describe, expect, it } from "vitest";
import {
  BALL_R,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  P1_X1,
  SERVE_SPEED,
} from "./constants";
import { BACKGROUND, game } from "./game";
import type { CaromDebugApi, CaromState } from "./game";

function makeEngine(stepMs = 16) {
  const canvas = createCanvas(FIELD_W, FIELD_H);
  const events = new EventTarget();
  return createEngine<CaromState, CaromDebugApi>({
    canvas: canvas as unknown as HTMLCanvasElement,
    width: FIELD_W,
    height: FIELD_H,
    game,
    background: BACKGROUND,
    clock: new ConstantClock(stepMs),
    surface: {
      cssWidth: () => FIELD_W,
      cssHeight: () => FIELD_H,
      dpr: () => 1,
      events: () => events,
    },
  });
}

describe("Carom simulation", () => {
  it("serves from countdown on the frame the hold expires", async () => {
    const engine = makeEngine(500);
    await engine.initialize();

    engine.apply((state) => engine.debug.setScreen(state, "countdown"));
    engine.apply((state) => engine.debug.setReceiver(state, "right"));
    engine.apply((state) => engine.debug.setBallServeSign(state, 1));
    engine.apply((state) => engine.debug.setBallHoldTimer(state, 0.25));

    await engine.advance(1);

    const shot = engine.debug.snapshot(engine.state).ball;
    expect(engine.state.screen).toBe("playing");
    expect(shot).not.toBeNull();
    expect(shot?.held).toBe(false);
    expect(shot?.holdTimer).toBe(0);
    expect(shot?.vx).toBeGreaterThan(0);
    expect(shot?.vy).toBeGreaterThan(0);
    expect(shot?.speed).toBeCloseTo(SERVE_SPEED, 5);
    expect(shot?.trail).toHaveLength(0);
  });

  it("scores and ends the match when the win rule is met", async () => {
    const engine = makeEngine(16);
    await engine.initialize();

    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setScore(state, 10, 9));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, FIELD_W + BALL_R + 2, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, 0, 0));
    engine.apply((state) => engine.debug.setBallHeld(state, false));

    await engine.advance(1);

    expect(engine.state.screen).toBe("matchover");
    expect(engine.state.score).toEqual({ p1: 11, p2: 9 });
    expect(engine.state.winner).toBe("left");
  });

  it("uses a driven paddle velocity to add spin on contact", async () => {
    const engine = makeEngine(16);
    await engine.initialize();

    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setPaddleDriven(state, "left", true));
    engine.apply((state) => engine.debug.setPaddleVy(state, "left", 300));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, P1_X1 + BALL_R - 1, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, -260, 0));
    engine.apply((state) => engine.debug.setBallHeld(state, false));

    await engine.advance(1);

    const shot = engine.debug.snapshot(engine.state).ball;
    expect(engine.state.paddles.left.vy).toBeCloseTo(300, 5);
    expect(shot?.vx).toBeGreaterThan(0);
    expect(shot?.spin).toBeGreaterThan(0);
  });

  it("poses and reports the world through the debug surface", async () => {
    const engine = makeEngine();
    await engine.initialize();

    engine.apply((state) => engine.debug.clearWorld(state));
    let snap = engine.debug.snapshot(engine.state);
    expect(snap.ball).toBeNull();
    expect(snap.obstacles).toHaveLength(0);

    engine.apply((state) => engine.debug.spawnBall(state));
    engine.apply((state) => engine.debug.spawnObstacle(state, 1));
    engine.apply((state) => engine.debug.setMuted(state, true));
    await engine.advance(1);
    snap = engine.debug.snapshot(engine.state);

    expect(snap.ball?.held).toBe(true);
    expect(snap.obstacles).toEqual([{ index: 1, cx: 790, cy: 500 }]);
    expect(snap.muted).toBe(true);
    expect(engine.debug.menuItemRect(engine.state, 0)).toMatchObject({
      w: 360,
      h: 58,
    });
  });
});
