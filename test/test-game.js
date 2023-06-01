// @ts-check
import test from "ava";

import { XorShift } from "xorshift";
import { makeMafia } from "../src/game/mafia.js";

const makeEntropy = () => {
  const rng = new XorShift([1, 2, 3, 4]);

  return Object.freeze({
    nextInt: (max = Number.MAX_SAFE_INTEGER) => {
      if (max !== undefined && (!Number.isSafeInteger(max) || max < 1)) {
        throw new RangeError("max must be a positive integer");
      }
      const [x] = rng.randomint();
      const i = x % max;
      return i;
    },
  });
};

test("makeMafia simulates game with 7 players", (assert) => {
  const names = ["Alice", "Bob", "Charlie", "Doris", "Eileen", "Frank", "Gary"];
  const rng = makeEntropy();
  const randName = () => names[rng.nextInt(names.length)];
  const { game, mafiosos } = makeMafia(new Set(names), rng);
  assert.is(`${game}`, "<Mafia: 7 players, night 0>");
  assert.deepEqual(mafiosos, new Set(["Eileen", "Gary"]));

  const steps = [game.advance()];
  while (game.getWinner() == null) {
    // Rather than keep track of who is still in the game,
    // just catch the guard failure.
    try {
      game.vote(randName(), randName());
    } catch (oops) {
      console.warn(oops);
      continue;
    }
    const step = game.advance();
    if (!step.match(/^\d+ votes cast\.$/)) {
      steps.push(step);
      steps.push(`${game}`);
    }
  }
  assert.deepEqual(steps, [
    "It's morning on the first day.",
    "With 4 votes, mafioso Eileen was killed.",
    "<Mafia: 6 players, night 1>",
    "With 1 votes, mafioso Gary was killed.",
    "<Mafia: 5 players, winner village>",
  ]);
});
