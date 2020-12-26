import { IS_CLIENT } from "../config";
import * as io from "socket.io-client";

if (DEBUG && IS_CLIENT()) {
  // const loc = window.location;
  // const devSocket = (io as any).default(`${loc.origin}`, {
  //   path: "/_dev",
  //   transports: ["websocket"],
  // });
  // devSocket.on("connect", () => {
  //   console.info("%cConnected to dev-server", "color: #007bff");
  // });
  // devSocket.on("reload", () => {
  //   window.location.reload();
  // });
}
