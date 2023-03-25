// @ts-check
/* global assert */
import { E, Far } from "@endo/far";
// import { assert } from "ses/src/error/assert.js";
import { WebSocketServer } from "ws";

/**
 * @typedef {string | Uint8Array} OutMessage
 * @typedef {string} InMessage
 * @typedef {{ send: (data: OutMessage) => void }} SocketSender
 * @typedef {{
 *   message: (msg: InMessage) => void,
 *   error: (err: Error) => void,
 * }} SocketReceiver
 * @param {unknown} _powers
 */
export const main0 = (_powers) =>
  Far("WebSockets", {
    /** @param {number} port */
    makeServer: (port) => {
      console.log("makeServer", port);
      assert.typeof(port, "number");
      return Far("WebSocketServer", {
        /**
         * @param {{ connect: (sender: SocketSender) => SocketReceiver }} handler
         */
        async listen(handler) {
          console.log("listen", handler);
          const wss = new WebSocketServer({ port });
          wss.on("connection", (ws) => {
            const sender = Far("SocketSender", {
              send: (msg) => {
                console.log("SocketSender: send", msg);
                ws.send(msg);
              },
            });
            const extSocket = E(handler).connect(sender);
            ws.on("error", (err) => E(extSocket).error(err));
            ws.on("message", (msg) => {
              const txt = msg.toString();
              console.log("@@@ws message:", msg, "as", txt);
              return E(extSocket).message(txt);
            });
          });
        },
      });
    },
  });
