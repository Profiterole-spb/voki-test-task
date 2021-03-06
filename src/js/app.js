import Core from '../js/Core/Core.js';
import Game from '../js/game/Game.js';
import {preloadPack} from '../js/game/preloadPack.js';

window.addEventListener('load', init);

function init() {
  const core = Core.get();

  core.loader.addEventListener('complete', () => new Game());
  core.loader.loadManifest(preloadPack, true, 'assets/');
}


