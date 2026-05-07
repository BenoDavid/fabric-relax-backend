const WebSocket = require("ws");

let wss = null;

function initWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.broadcast = function (data) {
    const msg = JSON.stringify(data);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  };

  console.log("✅ WebSocket initialized");
}

function getWss() {
  return wss;
}

module.exports = { initWebSocket, getWss };
