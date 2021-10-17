import State from '../../js/Core/State.js';
import Core from '../../js/Core/Core.js';

export default class UiState extends State {
  create() {
    const loader = Core.get().loader;
    this.logo = new createjs.Bitmap(loader.getResult('logo'));
    this.logo.x = 40;
    this.logo.y = 10;

    this.cta = new createjs.Bitmap(loader.getResult('btn'));
    this.cta.x = 1390 / 2;
    this.cta.y = 570;
    this.cta.regX = this.cta.getBounds().width / 2;
    this.cta.regY = this.cta.getBounds().height / 2;
    this.addChild(this.logo, this.cta);

    createjs.Tween.get(this.cta, {loop: true})
        .to({scaleX: 1.05, scaleY: 1.05}, 400)
        .to({scaleX: 1, scaleY: 1}, 400);
  }
}
