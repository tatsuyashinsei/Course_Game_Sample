import { AnimationAction, AnimationMixer, Group, Mesh, AnimationUtils } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export default class MarkerMan extends Group {
  mixer?: AnimationMixer;
  glTFLoader: GLTFLoader;

  constructor() {
    super();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('jsm/libs/draco/');

    this.glTFLoader = new GLTFLoader();
    this.glTFLoader.setDRACOLoader(dracoLoader);
  }

  async init(animationActions: { [key: string]: AnimationAction }) {
    const [markerMan, idle, run, jump, pose] = await Promise.all([
      this.glTFLoader.loadAsync('models/markerMan$@walk_compressed.glb'),
      this.glTFLoader.loadAsync('models/markerMan@idle.glb'),
      this.glTFLoader.loadAsync('models/markerMan@run.glb'),
      this.glTFLoader.loadAsync('models/markerMan@jump.glb'),
      this.glTFLoader.loadAsync('models/markerMan@pose.glb'),
    ]);

    markerMan.scene.traverse((m) => {
      if ((m as Mesh).isMesh) {
        m.castShadow = true;
      }
    });

    this.mixer = new AnimationMixer(markerMan.scene);
    animationActions['idle'] = this.mixer.clipAction(idle.animations[0]);
    animationActions['walk'] = this.mixer.clipAction(markerMan.animations[0]);
    animationActions['run'] = this.mixer.clipAction(run.animations[0]);
    animationActions['jump'] = this.mixer.clipAction(jump.animations[0]);
    animationActions['pose'] = this.mixer.clipAction(pose.animations[0]);

    animationActions['idle'].play();

    this.add(markerMan.scene);
  }

  update(delta: number) {
    this.mixer?.update(delta);
  }
}
