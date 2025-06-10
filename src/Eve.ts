import { AnimationAction, AnimationMixer, Group, Mesh, Object3D } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

export default class Eve extends Group {
  mixer?: AnimationMixer;
  glTFLoader: GLTFLoader;

  constructor() {
    super();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/jsm/libs/draco/');

    this.glTFLoader = new GLTFLoader();
    this.glTFLoader.setDRACOLoader(dracoLoader);
    this.glTFLoader.setMeshoptDecoder(MeshoptDecoder);
  }

  async init(animationActions: { [key: string]: AnimationAction }) {
    console.log('Loading animations...');
    const [baseModel, idle, run, jump, dance] = await Promise.all([
      this.glTFLoader.loadAsync('models/MarkerMan$@walk_compressed.glb'),
      this.glTFLoader.loadAsync('models/MarkerMan@idle.glb'),
      this.glTFLoader.loadAsync('models/MarkerMan@run.glb'),
      this.glTFLoader.loadAsync('models/MarkerMan@jump.glb'),
      this.glTFLoader.loadAsync('models/MarkerMan@dance.glb'),
    ]);

    console.log('Base model animations:', baseModel.animations);
    console.log('Base model animation names:', baseModel.animations.map(a => a.name));
    console.log('Idle animations:', idle.animations);
    console.log('Run animations:', run.animations);
    console.log('Jump animations:', jump.animations);
    console.log('Dance animations:', dance.animations);

    baseModel.scene.traverse((m: Object3D) => {
      if ((m as Mesh).isMesh) {
        m.castShadow = true;
      }
    });

    this.mixer = new AnimationMixer(baseModel.scene);

    console.log('Idle action:', this.mixer.clipAction(idle.animations[0]));
    animationActions['idle'] = this.mixer.clipAction(idle.animations[0]);

    console.log('Dance action:', this.mixer.clipAction(dance.animations[0]));
    animationActions['dance'] = this.mixer.clipAction(dance.animations[0]);

    console.log('Walk action:', this.mixer.clipAction(baseModel.animations[0]));
    animationActions['walk'] = this.mixer.clipAction(baseModel.animations[0]);

    console.log('Run action:', this.mixer.clipAction(run.animations[0]));
    animationActions['run'] = this.mixer.clipAction(run.animations[0]);

    console.log('Jump action:', this.mixer.clipAction(jump.animations[0]));
    animationActions['jump'] = this.mixer.clipAction(jump.animations[0]);

    console.log('Animation names:');
    console.log('- Idle:', idle.animations[0].name);
    console.log('- Dance (Q key):', dance.animations[0].name);
    console.log('- Walk (W key):', baseModel.animations[0].name);
    console.log('- Run (Shift+W):', run.animations[0].name);
    console.log('- Jump:', jump.animations[0].name);

    animationActions['idle'].play();

    this.add(baseModel.scene);
  }

  update(delta: number) {
    this.mixer?.update(delta);
  }
}
