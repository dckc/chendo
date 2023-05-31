// @ts-check
import { E, Far } from "@endo/far";

if (!("console" in globalThis)) {
  globalThis.console = {
    log: (...args) => {},
    error: () => {},
  };
}

export const main0 = (powers) => {
  return Far("EchoService", {
    // TODO: static type for wss
    async startOn(wss) {
      const handler = Far("handler", {
        connect: (sender) => {
          console.log("connect:", sender);
          return Far("socket", {
            error: (err) => console.error(err),
            message: (msg) => {
              console.log("handling msg by echo:", msg);
              return E(sender).send(msg);
            },
          });
        },
      });
      await E(wss).listen(handler);
      return true;
    },
  });
};
