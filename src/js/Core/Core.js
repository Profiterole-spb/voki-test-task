export default class Core {
  static get() {
    if (!this._instance) {
      this._instance = new Core();
    }
    return this._instance;
  }

  constructor() {
    this.view = document.createElement('canvas');
    this.view.id = 'view';
    this.view.width = 1390;
    this.view.height = 640;
    this.view.style.backgroundColor = '#000000';
    document.body.appendChild(this.view);

    this.stage = new createjs.Stage('view');
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', () => this.stage.update());

    this.loader = new createjs.LoadQueue(false);

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  handleResize() {
    this.view.width = window.innerWidth;
    this.view.height = window.innerWidth / 1390 * 640;
    this.stage.scale = window.innerWidth / 1390;
  }
}
