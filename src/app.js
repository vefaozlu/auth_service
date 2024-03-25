import server from "./server.js";
import client from "../redis/config.js";

async function main() {
  console.log("Connecting to redis...");

  await client.connect();
  console.log("Connected to the client");

  server.listen(7000, () => {
    console.log("Server on port 7000");
  });
}

main();
