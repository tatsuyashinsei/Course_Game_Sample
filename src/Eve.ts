import { AnimationAction, AnimationMixer, Group, Mesh, AnimationUtils } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

export default class Eve extends Group {
  mixer?: AnimationMixer;
  glTFLoader: GLTFLoader;

  constructor() {
    super();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('jsm/libs/draco/');

    this.glTFLoader = new GLTFLoader();
    this.glTFLoader.setDRACOLoader(dracoLoader);
    this.glTFLoader.setMeshoptDecoder(MeshoptDecoder);
  }

  async init(animationActions: { [key: string]: AnimationAction }) {
    console.log('Loading animations...');
    
    const [markerManWalk, idle, run, jump, dance] = await Promise.all([
      this.glTFLoader.loadAsync('models/MarkerMan$@walk.glb'),
      this.glTFLoader.loadAsync('models/MarkerMan@idle.glb'),
      this.glTFLoader.loadAsync('models/MarkerMan@run.glb'),
      this.glTFLoader.loadAsync('models/MarkerMan@jump.glb'),
      this.glTFLoader.loadAsync('models/MarkerMan@dance.glb'),
    ]);

    console.log('Walk animations:', markerManWalk.animations);
    console.log('Idle animations:', idle.animations);
    console.log('Run animations:', run.animations);
    console.log('Jump animations:', jump.animations);
    console.log('Dance animations:', dance.animations);

    markerManWalk.scene.traverse((m) => {
      if ((m as Mesh).isMesh) {
        m.castShadow = true;
      }
    });

    this.mixer = new AnimationMixer(markerManWalk.scene);
    
    animationActions['idle'] = this.mixer.clipAction(idle.animations[0]);
    console.log('Idle action:', animationActions['idle']);

    animationActions['walk'] = this.mixer.clipAction(markerManWalk.animations[0]);
    console.log('Walk action:', animationActions['walk']);

    animationActions['run'] = this.mixer.clipAction(run.animations[0]);
    console.log('Run action:', animationActions['run']);

    animationActions['jump'] = this.mixer.clipAction(jump.animations[0]);
    console.log('Jump action:', animationActions['jump']);

    animationActions['dance'] = this.mixer.clipAction(dance.animations[0]);
    console.log('Dance action:', animationActions['dance']);

    console.log('Animation names:');
    console.log('- Idle:', idle.animations[0].name);
    console.log('- Walk:', markerManWalk.animations[0].name);
    console.log('- Run:', run.animations[0].name);
    console.log('- Jump:', jump.animations[0].name);
    console.log('- Dance:', dance.animations[0].name);

    animationActions['idle'].play();

    this.add(markerManWalk.scene);
  }

  update(delta: number) {
    this.mixer?.update(delta);
  }
}
