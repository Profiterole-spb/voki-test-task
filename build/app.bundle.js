(function () {
  'use strict';

  class Core {
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
      this.view.style.backgroundColor = '#ff0000';
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

  class State extends createjs.Container {
    constructor(game) {
      super();
      this.game = game;
    }

    create() {
      console.log('a content doesn\'t exist');
    }
  }

  class Option extends createjs.Container {
    constructor(index, key) {
      super();
      this.index = index;
      const loader = Core.get().loader;
      this.backgroundRes = loader.getResult('option_back');
      this.selectRes = loader.getResult('option_select');
      this.background = new createjs.Bitmap(this.backgroundRes);
      this.handleClick = this.handleClick.bind(this);
      this.background.addEventListener('click', this.handleClick);
      this.item = new createjs.Bitmap(loader.getResult(key));
      this.okBtn = new createjs.Bitmap(loader.getResult('ok'));
      this.okBtn.visible = false;
      this.handleAccept = this.handleAccept.bind(this);
      this.okBtn.addEventListener('click', this.handleAccept);
      // this.background.image = this.selectRes
      this.addChild(this.background, this.item, this.okBtn);
      this.adjust();
    }

    adjust() {
      this.background.x = -this.background.getBounds().width / 2;
      this.background.y = -this.background.getBounds().height / 2;
      this.item.x = -this.item.getBounds().width / 2;
      this.item.y = -this.item.getBounds().height / 2;
      this.okBtn.x = -this.okBtn.getBounds().width / 2;
      this.okBtn.y = 40;
    }

    handleClick() {
      this.dispatchEvent('select', {index: this.index, target: this});
    }

    handleAccept() {
      this.dispatchEvent('accept');
    }

    get select() {
      return this._select;
    }

    set select(value) {
      this._select = value;
      if (this._select) {
        this.background.image = this.selectRes;
        this.okBtn.visible = true;
      }
      if (!this._select) {
        this.background.image = this.backgroundRes;
        this.okBtn.visible = false;
      }
      this.adjust();
    }

    fadeIn(callback) {
      createjs.Tween.get(this, {loop: false})
          .to({scaleX: 1, scaleY: 1}, 200, createjs.Ease.getBackOut(3))
          .call(() => {
            if (callback) callback();
          });
    }

    fade(callback) {
      this.okBtn.visible = false;
      createjs.Tween.get(this, {loop: false})
          .to({scaleX: 0, scaleY: 0}, 200, createjs.Ease.getBackIn(3))
          .call(() => {
            if (callback) callback();
          });
    }
  }

  class RoomState extends State {
    create() {
      const loader = Core.get().loader;
      this.background = new createjs.Bitmap(loader.getResult('background'));

      this.globe = new createjs.Bitmap(loader.getResult('globe'));
      this.globe.x = 100;
      this.globe.y = 107;

      this.table = new createjs.Bitmap(loader.getResult('table'));
      this.table.x = 210;
      this.table.y = 196;

      this.sofa = new createjs.Bitmap(loader.getResult('sofa'));
      this.sofa.x = 126;
      this.sofa.y = 319;

      this.char = new createjs.Bitmap(loader.getResult('char'));
      this.char.x = 695;
      this.char.y = 107;

      this.hammerIcon = new createjs.Bitmap(loader.getResult('hammer_icon'));
      this.hammerIcon.x = 1087;
      this.hammerIcon.y = 180;
      this.hammerIcon.alpha = 0;
      this.handleHammerIconClick = this.handleHammerIconClick.bind(this);

      this.hand = new createjs.Bitmap(loader.getResult('hand'));
      this.hand.x = 1010;
      this.hand.y = 300;
      this.hand.rotation = 45;
      this.hand.alpha = 0;

      this.plant = new createjs.Bitmap(loader.getResult('plant'));
      this.plant.x = 1100;
      this.plant.y = 438;

      this.plant1 = new createjs.Bitmap(loader.getResult('plant_2'));
      this.plant1.x = 455;
      this.plant1.y = -40;

      this.plant2 = new createjs.Bitmap(loader.getResult('plant_2'));
      this.plant2.x = 1123;
      this.plant2.y = 175;

      const optionsConfig = [
        {key: 'stairs_1_icon', x: 870, y: 300},
        {key: 'stairs_2_icon', x: 1020, y: 200},
        {key: 'stairs_3_icon', x: 1200, y: 180},
      ];

      this.options = optionsConfig.map((config, index) => {
        const option = new Option(index, config.key);
        option.x = config.x;
        option.y = config.y;
        option.scaleX = 0;
        option.scaleY = 0;
        this.handleSelectOption = this.handleSelectOption.bind(this);
        option.addEventListener('select', this.handleSelectOption);
        this.handleAccept = this.handleAccept.bind(this);
        option.addEventListener('accept', this.handleAccept);
        return option;
      });

      this.stairs = [
        {key: 'old_stairs', x: 835, y: 130},
        {key: 'new_stair_01', x: 910, y: 25},
        {key: 'new_stair_02', x: 910, y: 25},
        {key: 'new_stair_03', x: 910, y: 25},
      ].map((config, index) => {
        const stairs = new createjs.Bitmap(loader.getResult(config.key));
        stairs.x = config.x;
        stairs.y = config.y;
        stairs.alpha = index === 0 ? 1 : 0;
        return stairs;
      });

      this.currentStairs = this.stairs[0];

      this.addChild(
          this.background,
          this.globe,
          this.table,
          this.sofa,
          this.plant1,
          this.plant2,
          this.char,
          ...this.stairs,
          this.plant,
          this.hammerIcon,
          this.hand,
          ...this.options,
      );


      createjs.Tween.get(this.hammerIcon, {loop: false})
          .to({alpha: 1}, 400);
      createjs.Tween.get(this.hammerIcon, {loop: false})
          .to({y: 258}, 600, createjs.Ease.getBackOut(3))
          .call(() => {
            this.hammerIcon.addEventListener('click', this.handleHammerIconClick);
            createjs.Tween.get(this.hand, {loop: false})
                .to({alpha: 1}, 400);
            createjs.Tween.get(this.hand, {loop: true})
                .to({x: 1030, y: 280}, 600, createjs.Ease.getPowInOut(2))
                .to({x: 1010, y: 300}, 600, createjs.Ease.getPowInOut(2));
          });
    }

    handleHammerIconClick() {
      console.log('Click on hammer icon', this.hammerIcon);
      this.hammerIcon.removeEventListener('click', this.handleHammerIconClick);
      createjs.Tween.get(this.hammerIcon, {loop: false})
          .to({alpha: 0}, 300);
      createjs.Tween.get(this.hand, {loop: false})
          .to({alpha: 0}, 300)
          .call(this.showOptions.bind(this));
    }

    showOptions() {
      let index = 0;
      const optionsFade = () => {
        this.options[index].fadeIn(() => {
          index += 1;
          if (index === this.options.length) return;
          optionsFade();
        });
      };
      optionsFade();
    }

    handleSelectOption(event) {
      this.options.forEach((option) => {
        option.select = false;
      });
      event.target.select = true;
      const index = this.options.indexOf(event.target);
      createjs.Tween.get(this.currentStairs, {loop: false})
          .to({alpha: 0}, 200)
          .call(() => {
            this.stairs[index + 1].y = this.stairs[index + 1].y - 80;
            createjs.Tween.get(this.stairs[index + 1], {loop: false})
                .to({alpha: 1, y: this.stairs[index + 1].y + 80}, 200);
            this.currentStairs = this.stairs[index + 1];
          });
    }

    handleAccept() {
      const hideOptionsQueue = this.options.map((option) => {
        return new Promise((resolve) => {
          option.fade(resolve);
        });
      });

      Promise.all(hideOptionsQueue)
          .then(() => {
            this.game.states.final.create();
          });
    }
  }

  class UiState extends State {
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

  class FinalState extends State {
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

  class Game {
    constructor() {
      this.stage = Core.get().stage;
      this.states = {
        room: new RoomState(this),
        ui: new UiState(),
        final: new FinalState(),
      };

      this.stage.addChild(this.states.room, this.states.final, this.states.ui);
      this.states.room.create();
      this.states.ui.create();
    }
  }

  const preloadPack = [
    {src: 'back.jpg', id: 'background'},
    {src: 'sofa.png', id: 'sofa'},
    {src: 'plant_2.png', id: 'plant_2'},
    {src: 'table.png', id: 'table'},
    {src: 'globe.png', id: 'globe'},
    {src: 'char.png', id: 'char'},
    {src: 'icon_hammer.png', id: 'hammer_icon'},
    {src: 'hand.png', id: 'hand'},
    {src: 'old_stair.png', id: 'old_stairs'},
    {src: 'plant.png', id: 'plant'},
    {src: 'ok.png', id: 'ok'},
    {src: 'option_back.png', id: 'option_back'},
    {src: 'option_select.png', id: 'option_select'},
    {src: 'stairs_1_icon.png', id: 'stairs_1_icon'},
    {src: 'stairs_2_icon.png', id: 'stairs_2_icon'},
    {src: 'stairs_3_icon.png', id: 'stairs_3_icon'},
    {src: 'new_stair_01.png', id: 'new_stair_01'},
    {src: 'new_stair_02.png', id: 'new_stair_02'},
    {src: 'new_stair_03.png', id: 'new_stair_03'},
    {src: 'logo.png', id: 'logo'},
    {src: 'btn.png', id: 'btn'},
    {src: 'window.png', id: 'window'},
  ];

  window.addEventListener('load', init);

  function init() {
    const core = Core.get();

    core.loader.addEventListener('complete', () => new Game());
    core.loader.loadManifest(preloadPack, true, './assets/');
  }

})();
