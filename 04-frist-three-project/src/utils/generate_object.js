import {OrbitControls, GLTFLoader, DRACOLoader} from 'three/addons';
import * as THREE from 'three';
import {createRenderer, renderResize} from '@/utils/common';
import {GenerateCamera} from '@/utils/generate_camera';
import {GenerateMesh} from '@/utils/generate_mesh';
import {GenerateGeometry} from '@/utils/generate_geometry';
import {GenerateMaterial} from '@/utils/generate_material';
import {GenerateLight} from '@/utils/generate_light';
import Stats from 'three/addons/libs/stats.module';
import {GenerateFog} from "@/utils/generate_fog";
import {GeneratePhysics} from "@/utils/generate_physics";
import {mix} from "three/tsl";



export class GenerateObject {
  scene = null;
  canvas = null;
  renderer = null;
  control = null;
  stats = null;
  // region factory
  meshFactory = null;
  geometryFactory = null;
  materialFactory = null;
  cameraFactory = null;
  lightFactory = null;
  fogFactory = null;
  worldFactory = null;
  // endregion
  // region all element list
  materialList = new Map();
  geometryList = new Map();
  meshList = new Map();
  cameraList = new Map();
  lightList = new Map();
  fogList = new Map();
  worldMeshList = new Map();
  physicsList = new Map();
  audioList = new Map();
  mixerList = new Map();
  // endregion
  // region current camera
  currentCamera = null;
  // endregion
  // region rayCaster
  rayCaster = null;
  // endregion
  constructor(THREE, canvas,{materials, geometries, meshes, cameras, lights, fogs, axesHelper,basicPhysics, controls, physics, audios, models}) {
    this.canvas = canvas;
    this.generateScene();

    this.meshFactory = new GenerateMesh(THREE);
    this.geometryFactory = new GenerateGeometry(THREE);
    this.materialFactory = new GenerateMaterial(THREE);
    this.cameraFactory = new GenerateCamera(THREE);
    this.lightFactory = new GenerateLight(THREE);
    this.fogFactory = new GenerateFog(THREE);
    this.worldFactory = new GeneratePhysics(basicPhysics);

    this.manager = new THREE.LoadingManager();
    this.manager.onLoad = () => {
      console.log("load");
      this.updateAllMaterialsEnvMapIntensity();
    }

    this.generateStats();

    this.generateCamera(cameras);
    models && this.generateModels(models);
    audios && this.generateAudioList(audios);
    physics && this.generateWorldMeshes(physics);
    axesHelper && this.addAxesHelper(1000);
    materials && this.generateMaterials(materials);
    geometries && this.generateGeometries(geometries);
    meshes && this.generateMeshes(meshes);
    fogs && this.generateFog(fogs);

    lights && this.generateLight(lights);

    this.generateRender(canvas);
    this.resizeRender(canvas);



    controls && this.generateControls();
  }

  addAxesHelper(size = 10) {
    this.scene.add(new THREE.AxesHelper(size));
  }

  resizeRender(canvas) {
    renderResize(canvas, this.currentCamera, this.renderer);
  }

  generateModels(models) {
    models.forEach(model => {
      this.generateModelGltf(model);
    })
  }

  generateRayCaster(origin, direction) {
    if (this.rayCaster) return;
    const rayOrigin = new THREE.Vector3(...origin);
    const rayDirection = new THREE.Vector3(...direction);
    rayDirection.normalize();
    this.rayCaster = new THREE.Raycaster(rayOrigin, rayDirection);
  }

  rayIntersect(ids) {
    const intersectObjects = this.rayCaster.intersectObjects(this.getMeshByIds(ids));
    return intersectObjects;
  }

  rayIntersectObject(object) {
    const intersectObjects = this.rayCaster.intersectObjects([object]);
    return intersectObjects;
  }

  setRayFromCamera(mouse, cameraId) {
    this.rayCaster.setFromCamera(mouse, this.getAllCamera(cameraId));
  }

  async generateModelGltf({id, url, position, scale, type, animationIndex}) {
    const gltfLoader = new GLTFLoader(this.manager);
    if (type === "draco") {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      gltfLoader.setDRACOLoader(dracoLoader);
    }
    gltfLoader.load(url, (gltf) => {
      if (gltf.animations.length > 0 && gltf.animations.length - 1 >= animationIndex) {
        const mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[animationIndex]);
        action.play();
        this.mixerList.set(id, mixer);
      }
      // 因为每移动一个mesh，他就会从之前的scene移除
      const group = new THREE.Group();
      while (gltf.scene.children.length > 0) {
        group.add(gltf.scene.children[0]);
      }
      position && group.position.copy(position);
      scale && group.scale.copy(scale);
      this.addMesh(group);
      this.meshList.set(id, group);
    }, () => {
      console.log("progress");
    }, (error) => {
      console.log("error", error);
    });
  }

  generateMaterials(materials) {
    materials.forEach((material) => {
      this.generateMaterial(material);
    })
  }

  generateMaterial({id, type, config}) {
    const material = this.materialFactory.generate(type, config)
    this.materialList.set(id, material);
    return material;
  }

  generateGeometry({id, type, config}) {
    const geometry = this.geometryFactory.generate(type, config);
    this.geometryList.set(id, geometry);
    return geometry;
  }

  generateGeometries(geometries) {
    geometries.forEach((geometry) => {
      this.generateGeometry(geometry);
    })
  }

  generateControls() {
    const control = new OrbitControls(this.currentCamera, this.renderer.domElement);
    control.enableDamping = true;
    this.control = control;
  }

  generateScene() {
    this.scene = new THREE.Scene();
  }

  generateRender(canvas) {
    const renderer = createRenderer(canvas);
    this.renderer = renderer;
  };

  generateCamera(cameras) {
    cameras.forEach(({id,type, params, position}, index) => {
      const camera = this.cameraFactory.generate(type, params);
      camera.position.set(...position);
      this.addCamera(camera);
      this.cameraList.set(id, camera)
      // 设置第一个camera为默认相机
      if (index === 0) {
        this.currentCamera = camera;
      }
    })
  }

  switchCamera(id) {
    const targetCamera = this.cameraList.get(id);
    if (targetCamera) {
      this.currentCamera = targetCamera;
      this.control.object = this.currentCamera;
      this.updateControls();
    }
    this.resizeRender(this.canvas);
  }

  generateAudioList(audios) {
    audios.forEach(audio => this.generateAudio(audio));
  }

  generateAudio({id, url}) {
    const audio = new Audio(url);
    this.audioList.set(id, audio);
  }

  playAudio(id) {
    this.audioList.get(id)?.play();
  }

  generateFog(fogs) {
    fogs.forEach(({id, type,config}) => {
      const fog = this.fogFactory.generate(type,config);
      console.log(fog)
      this.fogList.set(id, fog);
      this.scene.fog = fog;
    })
  }

  generateMeshes(meshes) {
    meshes.forEach((params) => {
      const mesh = this.generateMesh(params);
      this.addMesh(mesh);
    })
  }

  generateMesh({id, params:{geometryId, materialId, physicsId, geometry: geometryConfig, audioId}, position, rotation, scale}) {
    const geometry = geometryId ? this.geometryList.get(geometryId) : this.generateGeometry(geometryConfig);
    const mesh = this.meshFactory.generate(
        geometry,
        this.materialList.get(materialId)
    );
    position && mesh.position.set(...position);
    rotation && mesh.rotation.set(...rotation);
    scale && mesh.scale.set(...scale);
    this.meshList.set(id, mesh);

    if (physicsId) {
      const {type} = geometry.otherConfig;
      const config = {
        ...geometry.otherConfig,
        ...this.worldMeshList.get(physicsId),
        position,
        quaternion:mesh.quaternion,
      };
      if (type === "box") {
        config.halfExtents = [geometry.otherConfig.width * 0.5, geometry.otherConfig.height * 0.5, geometry.otherConfig.depth * 0.5]
      }
      const physics = this.worldFactory.generateMesh(type,config);
      physics.addEventListener("collide", (collision) => {
        const impactVelocityAlongNormal = collision.contact.getImpactVelocityAlongNormal();
        if (Math.abs(impactVelocityAlongNormal) > 10) {
          audioId && this.playAudio(audioId);
        }
      })
      this.physicsList.set(id, physics);
    }
    return mesh;
  }

  generateWorldMeshes(meshes) {
    meshes.forEach(item => {
      this.generateWorldMesh(item);
    });
  }

  generateWorldMesh({id, config}) {
    this.worldMeshList.set(id, config);
  }

  generateLight(lights) {
    lights.forEach(({id,type, params, position}) => {
      const pointLight = this.lightFactory.generate(type, params);
      position && pointLight.position.set(...position);
      this.addLight(pointLight);
      this.lightList.set(id, pointLight);
    })
  }

  generateStats() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.domElement);
  }

  updateAllMaterialsEnvMapIntensity(intensity = 10) {
    this.scene.traverse(child => {
      if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.envMapIntensity = intensity;
        child.material.needsUpdate = true;
      }
    })
  }

  updateMixerList(delta) {
    this.mixerList.forEach(mixer => {
      mixer.update(delta);
    });
  }

  updateMeshPhysics(id) {
    const mesh = this.meshList.get(id);
    const physics = this.physicsList.get(id);
    mesh.position.copy(physics.position);
    mesh.quaternion.copy(physics.quaternion);
  }

  updateMeshPhysicsByIds(ids) {
    ids.forEach(id => this.updateMeshPhysics(id));
  }

  updateWorld(delta, dt, maxSubSteps) {
    this.worldFactory.worldStep(delta);
  }

  updateRender() {
    this.renderer.render(this.scene, this.currentCamera);
  }

  updateStats() {
    this.stats.update();
  }

  updateControls() {
    this.control.update();
  }

  update() {
    this.control && this.updateControls();
    this.updateRender();
    this.updateStats();
  }

  addMesh(mesh) {
    this.scene.add(mesh);
    return this;
  }
  addLight(light) {
    this.scene.add(light);
    return this;
  }
  addCamera(camera) {
    this.scene.add(camera);
    return this;
  }

  getAllMesh(id) {
    return id ? this.meshList.get(id) : this.meshList;
  }

  getMeshByIds(ids) {
    return ids.map((id) => {
      return this.getAllMesh(id);
    })
  }

  getAllLight(id) {
    return id ? this.lightList.get(id) : this.lightList;
  }

  getAllCamera(id) {
    return id ? this.cameraList.get(id) :  this.cameraList;
  }

  getAllGeometry(id) {
    return id ? this.geometryList.get(id) : this.geometryList;
  }

  getAllMaterial(id) {
    return id ? this.materialList.get(id) : this.materialList;
  }

  getAllFog(id) {
    return id ? this.fogList.get(id) : this.fogList;
  }

  getRender() {
    return this.renderer;
  }

  getScene() {
    return this.scene;
  }

  clone(object) {
    return object.clone();
  }

  getAllElement() {
    return {
      meshes: this.getAllMesh(),
      lights: this.getAllLight(),
      camera: this.getAllCamera(),
      geometry: this.getAllGeometry(),
      materail: this.getAllMaterial(),
    };
  }
}
