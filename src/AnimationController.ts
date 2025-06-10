import { AnimationAction, Scene } from "three";
import Keyboard from "./Keyboard";
import Eve from "./Eve";

export default class AnimationController {
  scene: Scene;
  wait = false;
  animationActions: { [key: string]: AnimationAction } = {};
  activeAction?: AnimationAction;
  speed = 0;
  keyboard: Keyboard;
  model?: Eve;

  constructor(scene: Scene, keyboard: Keyboard) {
    this.scene = scene;
    this.keyboard = keyboard;
  }

  async init() {
    this.model = new Eve();
    await this.model.init(this.animationActions);
    this.activeAction = this.animationActions["idle"];
    this.scene.add(this.model);
  }

  setAction(action: AnimationAction) {
    if (this.activeAction != action) {
      this.activeAction?.fadeOut(0.1);
      action.reset().fadeIn(0.1).play();
      this.activeAction = action;

      switch (action) {
        case this.animationActions["walk"]:
          this.speed = 5.25;
          break;
        case this.animationActions["run"]:
          this.speed = 16;
          break;
        case this.animationActions["jump"]:
          this.speed = 0;
          break;
        case this.animationActions["dance"]:
        case this.animationActions["idle"]:
          this.speed = 0;
          break;
      }
    }
  }

  update(delta: number) {
    if (!this.wait) {
      let actionAssigned = false;

      if (this.keyboard.keyMap["Space"]) {
        console.log("Jump triggered");
        this.setAction(this.animationActions["jump"]);
        actionAssigned = true;
        this.wait = true;
        setTimeout(() => {
          this.wait = false;
          this.setAction(this.animationActions["idle"]);
        }, 1000);
      }

      if (
        !actionAssigned &&
        this.keyboard.keyMap["KeyW"] &&
        this.keyboard.keyMap["ShiftLeft"]
      ) {
        this.setAction(this.animationActions["run"]);
        actionAssigned = true;
      }

      if (!actionAssigned && this.keyboard.keyMap["KeyW"]) {
        this.setAction(this.animationActions["walk"]);
        actionAssigned = true;
      }

      if (!actionAssigned && this.keyboard.keyMap["KeyQ"]) {
        console.log("Dance triggered");
        this.setAction(this.animationActions["dance"]);
        actionAssigned = true;
      }

      if (!actionAssigned) {
        this.setAction(this.animationActions["idle"]);
      }
    }

    this.model?.update(delta);
  }
}
