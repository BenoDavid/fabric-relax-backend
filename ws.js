const WebSocket = require("ws");
const { getDashboardSnapshot } = require("./services/frDashboardService");

let wss = null;
let dashboardRefreshTimer = null;

function scheduleDashboardRefresh(nextUpdateAt) {
  if (dashboardRefreshTimer) {
    clearTimeout(dashboardRefreshTimer);
    dashboardRefreshTimer = null;
  }
  if (nextUpdateAt === null || !wss?.clients.size) return;

  const delay = Math.min(Math.max(nextUpdateAt - Date.now(), 0), 2147483647);
  dashboardRefreshTimer = setTimeout(() => {
    dashboardRefreshTimer = null;
    wss.broadcastDashboardCounts();
  }, delay);
}

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

  wss.broadcastDashboardCounts = async function () {
    if (!this.clients.size) {
      scheduleDashboardRefresh(null);
      return;
    }

    try {
      const snapshot = await getDashboardSnapshot();
      this.broadcast({
        event: "FabricRelaxationDashboardCounts",
        data: snapshot.counts,
      });
      this.broadcast({ event: "FabricRelaxationDashboardRefresh" });
      scheduleDashboardRefresh(snapshot.nextUpdateAt);
    } catch (error) {
      console.error("Failed to publish Fabric Relaxation dashboard counts:", error);
    }
  };

  wss.on("connection", (socket) => {
    getDashboardSnapshot()
      .then((snapshot) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              event: "FabricRelaxationDashboardCounts",
              data: snapshot.counts,
            }),
          );
        }
        scheduleDashboardRefresh(snapshot.nextUpdateAt);
      })
      .catch((error) => {
        console.error("Failed to send Fabric Relaxation dashboard counts:", error);
      });

    socket.on("message", (message) => {
      try {
        const request = JSON.parse(message.toString());
        if (request?.event === "FabricRelaxationDashboardSnapshotRequest") {
          getDashboardSnapshot()
            .then((snapshot) => {
              if (socket.readyState === WebSocket.OPEN) {
                socket.send(
                  JSON.stringify({
                    event: "FabricRelaxationDashboardCounts",
                    data: snapshot.counts,
                  }),
                );
              }
              scheduleDashboardRefresh(snapshot.nextUpdateAt);
            })
            .catch((error) => {
              console.error(
                "Failed to refresh Fabric Relaxation dashboard counts:",
                error,
              );
            });
        }
      } catch (error) {
        console.error("Unable to parse Fabric Relaxation WebSocket request:", error);
      }
    });

    socket.on("close", () => {
      if (!wss.clients.size) {
        scheduleDashboardRefresh(null);
      }
    });
  });

  console.log("✅ WebSocket initialized");
}

function getWss() {
  return wss;
}

module.exports = { initWebSocket, getWss };
