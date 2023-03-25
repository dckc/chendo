const makePromiseKit = () => {
  let resolve;
  let reject;
  const promise = new Promise((win, lose) => {
    resolve = win;
    reject = lose;
  });
  return { promise, resolve, reject };
};

export const attach = ({ querySelector, makeWebSocket }) => {
  const msgBox = querySelector('input[name="msg"]');
  const historyBox = querySelector('textarea[name="history"]');

  // TODO: host, port config
  // TODO: represent authority to connect using sparsecap / webkey
  const url = "ws://localhost:8080";
  const socket = makeWebSocket(url);

  const { promise: senderP, resolve: resolveSender } = makePromiseKit();

  socket.addEventListener("open", (ev) => {
    console.log("socket is open:", socket);
    resolveSender(socket.send.bind(socket));
  });
  socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
    historyBox.value += event.data + "\n";
  });

  querySelector('input[name="send"]').addEventListener("click", (ev) => {
    ev.preventDefault();
    const txt = msgBox.value;
    console.log("queueing...", txt);
    senderP.then((send) => {
      console.log("sending...", txt);
      send(txt);
    });
  });
};
