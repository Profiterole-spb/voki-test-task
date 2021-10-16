import RoomState from "../../js/game/RoomState.js";
import Core from "../../js/Core/Core.js";
import UiState from "../../js/game/UIState.js";
import FinalState from "../../js/game/FinalState.js";

export default class Game {
  constructor() {
    this.stage = Core.get().stage
    this.states = {
      room: new RoomState(this),
      ui: new UiState(),
      final: new FinalState(),
    }

    this.stage.addChild(this.states.room, this.states.final, this.states.ui);
    this.states.room.create()
    this.states.ui.create()
  }
}
