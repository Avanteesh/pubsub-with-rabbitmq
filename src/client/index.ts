import amqp from "amqplib";
import { clientWelcome, commandStatus, getInput, printClientHelp, printQuit }from "../internal/gamelogic/gamelogic.js";
import {declareAndBind,SimpleQueueType} from "../internal/pubsub/consume.js";  
import { ExchangePerilDirect, PauseKey } from "../internal/routing/routing.js";
import { GameState } from "../internal/gamelogic/gamestate.js";
import { commandSpawn } from "../internal/gamelogic/spawn.js";
import { commandMove } from "../internal/gamelogic/move.js";

async function main() {
  const connectionString = "amqp://guest:guest@localhost:5672/";
  const conn = await amqp.connect(connectionString);
    console.log("Peril game client connected to RabbitMQ!");

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      } finally {
        process.exit(0);
      }
    })
  });
    const username = await clientWelcome();

  await declareAndBind(conn,ExchangePerilDirect,`${PauseKey}.${username}`,PauseKey,SimpleQueueType.Transient);
  while (true) {  
    const command = await getInput();
    switch (command[0]) { 
      case "spawn":
        commandSpawn(new GameState(username), command.slice(1, -1));
        break;
      case "move":
        commandMove(new GameState(username), command.slice(1, -1));
        break;
      case "status":
        commandStatus(new GameState(username));
        break;
      case "help":
        printClientHelp();
        break;
      case "quit":
        printQuit();
        process.exit(0);
      default:
        console.log("Error: unknown command");
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
