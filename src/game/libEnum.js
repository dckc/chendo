import { harden } from "./SESstuff.js";

/** @param {string[]} names */
export const makeEnum = (names) => {
  const values = names.map((name) => harden({ toString: () => name }));
  const guard = (specimen) => values.includes(specimen);
  return [guard, ...values];
};
