import State from '../../js/Core/State.js';
import Core from '../../js/Core/Core.js';
import Option from '../../js/game/components/Option.js';

export default class RoomState extends State {
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


    // createjs.Tween.get(this.hammerIcon, {loop: false})
    //     .to({alpha: 1}, 400);
    // createjs.Tween.get(this.hammerIcon, {loop: false})
    //     .to({y: 258}, 600, createjs.Ease.getBackOut(3))
    //     .call(() => {
    //       this.hammerIcon.addEventListener('click', this.handleHammerIconClick);
    //       createjs.Tween.get(this.hand, {loop: false})
    //           .to({alpha: 1}, 400);
    //       createjs.Tween.get(this.hand, {loop: true})
    //           .to({x: 1030, y: 280}, 600, createjs.Ease.getPowInOut(2))
    //           .to({x: 1010, y: 300}, 600, createjs.Ease.getPowInOut(2));
    //     });
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
