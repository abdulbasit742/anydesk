import ws from "k6/ws";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 50 },
    { duration: "3m", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 0 },
  ],
};

const WS_URL = __ENV.WS_URL || "ws://localhost:4000";

export default function () {
  const res = ws.connect(WS_URL, {}, (socket) => {
    socket.on("open", () => {
      socket.send(JSON.stringify({ event: "device:register", data: { remoteDeskId: "123456789", name: "load-test" } }));
    });
    socket.on("message", (msg) => {
      check(msg, { "received message": (m) => m.length > 0 });
    });
    sleep(5);
    socket.close();
  });
  check(res, { "status is 101": (r) => r && r.status === 101 });
}
