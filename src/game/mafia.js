// Copyright (C) 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { assert, harden } from "./SESstuff.js";
import { makeEnum } from "./libEnum.js";
import { setDiff, showMap } from "./safeScope.js";

// An implementation of the Mafia party game state machine.

// @ts-check

const [MafiaState, DAY, NIGHT] = makeEnum(["day", "night"]);

/**
 * @param {Set<string>} players
 * @param {{nextInt: (max?: number) => number}} rng
 */
export const makeMafia = (players, rng) => {
  //  Intial mafioso count.
  const mafiosoCount = Math.round(players.size / 3);

  /**
   * @template T
   * @param {T[]} population
   * @param {number} k
   */
  const sample = (population, k) => {
    const n = population.length;
    const ixs = [];
    while (ixs.length < k) {
      const ix = rng.nextInt(n);
      if (!ixs.includes(ix)) {
        ixs.push(ix);
      }
    }
    return ixs.map((ix) => population[ix]);
  };

  let mafiosos = new Set(sample([...players], mafiosoCount));
  let innocents = setDiff(players, mafiosos);

  let state = NIGHT;
  let day = 0;
  let votes = new Map();

  const mafia = harden({
    /** @param {import('./safeScope.js').Printer} out */
    printOn(out) {
      const mafiaSize = mafiosos.size;
      const playerSize = players.size;
      out.print(`<Mafia: ${playerSize} players, `);
      const winner = mafia.getWinner();
      if (winner == null) {
        out.print(`${state} ${day}>`);
      } else {
        out.print(`winner ${winner}>`);
      }
    },
    toString() {
      const parts = [];
      const printer = { print: (s) => parts.push(s) };
      this.printOn(printer);
      return parts.join("");
    },

    getState() {
      return state;
    },

    getQuorum() {
      switch (state) {
        case DAY: {
          return Math.round((mafiosos.size + innocents.size + 1) / 2);
        }
        case NIGHT: {
          return mafiosos.size;
        }
      }
      throw Error(`bad state: ${state}`);
    },
    getMafiaCount() {
      return mafiosoCount;
    },

    getWinner() {
      if (mafiosos.size == 0) {
        return "village";
      }
      if (mafiosos.size >= innocents.size) {
        return "mafia";
      }
      return null;
    },
    advance() {
      const outcome = mafia.getWinner();
      if (outcome != null) {
        return outcome;
      }
      if (state === NIGHT && day === 0) {
        state = DAY;
        day += 1;
        return "It's morning on the first day.";
      }
      const note = mafia.lynch();
      if (note != null) {
        switch (state) {
          case DAY: {
            state = NIGHT;
            break;
          }
          case NIGHT: {
            day += 1;
            state = DAY;
            break;
          }
        }
        votes = new Map();
        return note;
      }
      return `${votes.size} votes cast.`;
    },

    /**
     *
     * @param {string} player  ? (players.contains(player))
     * @param {string} choice  ? (players.contains(choice))
     */
    vote(player, choice) {
      assert(players.has(player));
      assert(players.has(choice));

      switch (state) {
        case DAY:
          votes.set(player, choice);
          break;
        case NIGHT:
          if (mafiosos.has(player)) {
            votes.set(player, choice);
          }
      }
      // traceln(`${player} voted for ${choice}: ${showMap(votes)}`);
    },

    /**
     * @returns {string | null}
     */
    lynch() {
      const quorum = mafia.getQuorum();
      const counter = new Map();
      for (const v of votes.values()) {
        if (counter.has(v)) {
          counter.set(v, counter.get(v) + 1);
        } else {
          counter.set(v, 1);
        }
      }

      //   traceln(`Counted votes as ${showMap(counter)}`);

      const [victim] = [...counter.entries()]
        .filter(([_k, v]) => v >= quorum)
        .map(([k, _v]) => k);
      if (!victim) {
        return null;
      }
      const count = counter.get(victim);
      const side = mafiosos.has(victim) ? "mafioso" : "innocent";
      players.delete(victim);
      mafiosos.delete(victim);
      innocents.delete(victim);
      return `With ${count} votes, ${side} ${victim} was killed.`;
    },
  });

  return { game: mafia, mafiosos };
};
