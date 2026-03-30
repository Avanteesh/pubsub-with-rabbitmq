import type { GameState, PlayingState } from "../internal/gamelogic/gamestate.js";

function handlePause(hs: GameState): (ps: PlayingState) => void  {
   return (_ps: PlayingState) => {}
}