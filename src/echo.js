// @ts-check
import { E, Far } from "@endo/far";

export const main0 = (powers) => {
  return Far("EchoService", {
    // TODO: type for wss
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
