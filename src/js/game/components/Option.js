import Core from "../../../js/Core/Core.js";

export  default class Option extends createjs.Container {
  constructor(index, key) {
    super();
    this.index = index
    const loader = Core.get().loader
    this.backgroundRes = loader.getResult('option_back')
    this.selectRes = loader.getResult('option_select')
    this.background = new createjs.Bitmap(this.backgroundRes)
    this.handleClick = this.handleClick.bind(this)
    this.background.addEventListener('click', this.handleClick)
    this.item = new createjs.Bitmap(loader.getResult(key))
    this.okBtn = new createjs.Bitmap(loader.getResult('ok'))
    this.okBtn.visible = false
    this.handleAccept = this.handleAccept.bind(this)
    this.okBtn.addEventListener('click', this.handleAccept)
    // this.background.image = this.selectRes
    this.addChild(this.background, this.item, this.okBtn)
    this.adjust()
  }

  adjust() {
    this.background.x = -this.background.getBounds().width / 2
    this.background.y = -this.background.getBounds().height / 2
    this.item.x = -this.item.getBounds().width / 2
    this.item.y = -this.item.getBounds().height / 2
    this.okBtn.x = -this.okBtn.getBounds().width / 2;
    this.okBtn.y = 40
  }

  handleClick() {
    this.dispatchEvent('select', {index: this.index, target: this})
  }

  handleAccept() {
    this.dispatchEvent('accept')
  }

  get select() {
    return this._select
  }

  set select(value) {
    this._select = value
    if (this._select) {
      this.background.image = this.selectRes
      this.okBtn.visible = true
    }
    if (!this._select) {
      this.background.image = this.backgroundRes
      this.okBtn.visible = false
    }
    this.adjust()
  }

  fadeIn(callback) {
    createjs.Tween.get(this, { loop: false })
      .to({ scaleX: 1, scaleY: 1 }, 200, createjs.Ease.getBackOut(3))
      .call(() => {
        if (callback) callback();
      })
  }

  fade(callback) {
    this.okBtn.visible = false
    createjs.Tween.get(this, { loop: false })
      .to({ scaleX: 0, scaleY: 0 }, 200, createjs.Ease.getBackIn(3))
      .call(() => {
        if (callback) callback();
      })
  }
}
