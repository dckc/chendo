import { E, Far } from "@endo/far";

/** @file from https://github.com/endojs/endo/pull/1427#issue-1518356363  */

export const main0 = (powers) => {
  return Far("Service", {
    answer() {
      return E(powers).request(
        "the meaning of life, the universe, everything",
        "answer"
      );
    },
  });
};
