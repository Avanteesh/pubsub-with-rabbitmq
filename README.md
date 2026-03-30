# Pub/Sub Model with RabbitMQ TypeScript 

## Overview

Peril is a turn-based strategy game where players control armies on a world map. This implementation demonstrates pub/sub architecture by using RabbitMQ to handle game state updates, army movements, and server-client communication asynchronously.

## Features

- **Multiplayer Game Logic**: Spawn units, move armies, and manage game state
- **Pub/Sub Messaging**: Uses RabbitMQ exchanges (direct and topic) for decoupled communication
- **Server-Client Architecture**: Separate server for game control and clients for players
- **Real-time Updates**: Asynchronous message handling for game events
- **Docker Support**: Containerized setup for easy deployment

## Architecture

The application follows a publish-subscribe pattern with the following components:

### Components

- **Server** (`src/server/index.ts`): Game controller that publishes pause/resume commands to all clients
- **Client** (`src/client/index.ts`): Player interface for issuing commands (spawn, move, status)
- **Pub/Sub Layer** (`src/internal/pubsub/`):
  - `publishJSON.ts`: Utility for publishing JSON messages to RabbitMQ
  - `consume.ts`: Queue declaration and binding utilities
- **Game Logic** (`src/internal/gamelogic/`):
  - `gamelogic.ts`: Core game functions and input handling
  - `gamestate.ts`: Game state management
  - `spawn.ts`, `move.ts`, `pause.ts`, etc.: Specific game actions
- **Routing** (`src/internal/routing/routing.ts`): Defines exchanges and routing keys

### Message Flow

```
Server --publishes--> RabbitMQ Exchange (peril_topic/peril_direct) --delivers--> Clients
Clients --publishes--> RabbitMQ Exchange --delivers--> Other Clients/Server
```

**Exchanges:**
- `peril_direct`: Direct exchange for targeted messages (e.g., pause to specific user)
- `peril_topic`: Topic exchange for broadcast messages (e.g., game logs, war declarations)

**Routing Keys:**
- `pause`: Game pause/resume notifications
- `army_moves.*`: Army movement updates
- `war.*`: War declarations
- `game_logs`: General game logging

## Prerequisites

- Node.js (v16 or higher)
- Docker (for RabbitMQ)
- TypeScript

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd learn-pub-sub-typescript-starter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start RabbitMQ using Docker:
   ```bash
   npm run rabbit:start
   ```

## Usage

### Running the Server

The server controls global game state (pause/resume):

```bash
npm run server
```

Available server commands:
- `pause`: Pause the game for all clients
- `resume`: Resume the game
- `quit`: Exit the server

### Running a Client

Each client represents a player:

```bash
npm run client
```

Enter a username when prompted. Available client commands:
- `spawn <location> <rank>`: Spawn a unit (e.g., `spawn europe infantry`)
- `move <location> <unitID> ...`: Move units to a location
- `status`: View current game state
- `help`: Show available commands
- `quit`: Exit the client

### Managing RabbitMQ

```bash
# Start RabbitMQ
npm run rabbit:start

# View logs
npm run rabbit:logs

# Stop RabbitMQ
npm run rabbit:stop
```

## Development

### Building

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Project Structure

```
src/
├── client/          # Client application entry point
├── server/          # Server application entry point
├── internal/
│   ├── gamelogic/   # Game mechanics and state
│   ├── pubsub/      # RabbitMQ publish/consume utilities
│   └── routing/     # Exchange and routing key definitions
└── scripts/         # Shell scripts for RabbitMQ management
```

## Docker

Build and run the application in a container:

```bash
docker build -t peril-pubsub .
docker run -p 5672:5672 peril-pubsub
```
