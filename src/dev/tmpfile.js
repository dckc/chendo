import { E, Far } from "@endo/far";
import fsp from "fs/promises";

/** @file from https://github.com/endojs/endo/pull/1427#issue-1518356363  */

export const main0 = (powers) => {
  return Far("Files", {
    async readTmp(name) {
      const txt = await fsp.readFile(`/tmp/${name}`, "utf-8");
      return harden(txt); // noop for strings; just habit
    },
  });
};
