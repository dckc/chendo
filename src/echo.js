// @ts-check
import { E, Far } from "@endo/far";
import { makePromiseKit } from "@endo/promise-kit";

export const main0 = (powers) => {
  return Far("EchoService", {
    // TODO: type for wss
    make(wss) {
      const { promise: senderP, resolve } = makePromiseKit();
      const onConnection = Far("onConnection", (sender) => {
        resolve(sender);
        return Far("socket", {
          error: (err) => console.error(err),
          message: (msg) => E(senderP).send(msg),
        });
      });
      E(wss).listen(onConnection);
    },
  });
};
