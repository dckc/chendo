// @ts-check
/* global assert */
import { Far } from "@endo/far";
// import { assert } from "ses/src/error/assert.js";
import { WebSocketServer } from "ws";

/**
 * @typedef {string | Uint8Array} OutMessage
 * @typedef {Buffer | ArrayBuffer | Buffer[]} InMessage
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
      assert.typeof(port, "number");
      return Far("WebSocketServer", {
        /**
         * @param {(sender: SocketSender) => SocketReceiver} onConnection
         */
        async listen(onConnection) {
          const wss = new WebSocketServer({ port });
          wss.on("connection", (ws) => {
            const sender = Far("SocketSender", {
              send: (msg) => ws.send(msg),
            });
            const extSocket = onConnection(sender);
            ws.on("error", (err) => extSocket.error(err));
            ws.on("message", (msg) => extSocket.message(msg));
          });
        },
      });
    },
  });
