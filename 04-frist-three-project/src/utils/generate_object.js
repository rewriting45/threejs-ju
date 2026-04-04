import {OrbitControls} from 'three/addons';
import * as THREE from 'three';
import {createRenderer, renderResize} from '@/utils/common';
import {GenerateCamera} from '@/utils/generate_camera';
import {GenerateMesh} from '@/utils/generate_mesh';
import {GenerateGeometry} from '@/utils/generate_geometry';
import {GenerateMaterial} from '@/utils/generate_material';
import {GenerateLight} from '@/utils/generate_light';
import Stats from 'three/addons/libs/stats.module';
import {GenerateFog} from "@/utils/generate_fog";

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
  // endregion
  // region all element list
  materialList = new Map();
  geometryList = new Map();
  meshList = new Map();
  cameraList = new Map();
  lightList = new Map();
  fogList = new Map();
  // endregion
  // region current camera
  currentCamera = null;
  // endregion
  constructor(THREE, canvas,{materials, geometries, meshes, cameras, lights, fogs}) {
    this.canvas = canvas;
    this.generateScene();

    this.meshFactory = new GenerateMesh(THREE);
    this.geometryFactory = new GenerateGeometry(THREE);
    this.materialFactory = new GenerateMaterial(THREE);
    this.cameraFactory = new GenerateCamera(THREE);
    this.lightFactory = new GenerateLight(THREE);
    this.fogFactory = new GenerateFog(THREE);

    this.generateStats();

    this.generateCamera(cameras);
    this.addAxesHelper(1000);
    materials && this.generateMaterial(materials);
    geometries && this.generateGeometry(geometries);
    meshes && this.generateMesh(meshes);
    fogs && this.generateFog(fogs);

    lights && this.generateLight(lights);

    this.generateRender(canvas);
    this.resizeRender(canvas);
    this.generateControls();
  }

  addAxesHelper(size = 10) {
    this.scene.add(new THREE.AxesHelper(size));
  }

  resizeRender(canvas) {
    renderResize(canvas, this.currentCamera, this.renderer);
  }

  generateMaterial(materials) {
    materials.forEach(({id, type, config}) => {
      this.materialList.set(id, this.materialFactory.generate(type, config))
    })
  }

  generateGeometry(geometries) {
    geometries.forEach(({id, type, config}) => {
      this.geometryList.set(id, this.geometryFactory.generate(type, config));
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

  generateFog(fogs) {
    fogs.forEach(({id, type,config}) => {
      const fog = this.fogFactory.generate(type,config);
      console.log(fog)
      this.fogList.set(id, fog);
      this.scene.fog = fog;
    })
  }

  generateMesh(meshes) {
    meshes.forEach(({id,params: {geometryId, materialId}, position, rotation, scale}) => {
      const mesh = this.meshFactory.generate(
          this.geometryList.get(geometryId),
          this.materialList.get(materialId)
      );
      position && mesh.position.set(...position);
      rotation && mesh.rotation.set(...rotation);
      scale && mesh.scale.set(...scale);
      this.meshList.set(id, mesh);
      this.addMesh(mesh);
    })
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
    this.updateControls();
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
