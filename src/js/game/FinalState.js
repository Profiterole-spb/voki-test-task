import State from '../../js/Core/State.js';
import Core from '../../js/Core/Core.js';

export default class FinalState extends State {
  create() {
    const loader = Core.get().loader;

    this.background = new createjs.Shape();
    this.background.graphics.beginFill('Black').drawRect(0, 0, 1390, 640);
    this.background.alpha = 0;
    this.window = new createjs.Bitmap(loader.getResult('window'));
    this.window.x = 1390 / 2;
    this.window.y = 640 / 2;
    this.window.scale = 0;
    this.window.regX = this.window.getBounds().width / 2;
    this.window.regY = 2 * this.window.getBounds().height / 3;

    this.addChild(this.background, this.window);

    createjs.Tween.get(this.background, {loop: false})
        .to({alpha: 0.7}, 300)
        .call(() => {
          createjs.Tween.get(this.window, {loop: false})
              .to({scaleX: 1, scaleY: 1}, 300, createjs.Ease.getBackOut(2));
        });
  }
}
