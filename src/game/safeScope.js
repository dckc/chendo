// @ts-check

/**
 * @file porting aids from the Monte safe scope
 */

/** @typedef {{ print: (s: string) => void }} Printer */

export const traceln = (...args) => console.warn(...args);

/**
 * @param {Set} setA
 * @param {Set} setB
 */
export const setDiff = (setA, setB) => {
  const diff = new Set(setA);

  for (const elem of setB) {
    diff.delete(elem);
  }

  return diff;
};

export const showMap = (m) =>
  "<Map:" + [...m.entries()].map((e) => JSON.stringify(e)).join(", ") + ">";
