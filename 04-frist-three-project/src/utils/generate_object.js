import {OrbitControls} from 'three/addons';
import * as THREE from 'three';
import {createRenderer, renderResize} from '@/utils/common';
import {GenerateCamera} from '@/utils/generate_camera';
import {GenerateMesh} from '@/utils/generate_mesh';
import {GenerateGeometry} from '@/utils/generate_geometry';
import {GenerateMaterial} from '@/utils/generate_material';
import {GenerateLight} from '@/utils/generate_light';

export class GenerateObject {
  scene = null;
  canvas = null;
  renderer = null;
  control = null;
  // region factory
  meshFactory = null;
  geometryFactory = null;
  materialFactory = null;
  cameraFactory = null;
  lightFactory = null;
  // endregion
  // region all element list
  materialList = new Map();
  geometryList = new Map();
  meshList = new Map();
  cameraList = new Map();
  lightList = new Map();
  // endregion
  // region current camera
  currentCamera = null;
  // endregion
  constructor(THREE, canvas,{materials, geometrys, meshes, cameras, lights}) {
    this.canvas = canvas;
    this.generateScene();

    this.meshFactory = new GenerateMesh(THREE);
    this.geometryFactory = new GenerateGeometry(THREE);
    this.materialFactory = new GenerateMaterial(THREE);
    this.cameraFactory = new GenerateCamera(THREE);
    this.lightFactory = new GenerateLight(THREE);

    this.generateCamera(cameras);
    this.addAxesHelper(1000);
    this.generateMaterial(materials);
    this.generateGeometry(geometrys);
    this.generateMesh(meshes);

    this.generateLight(lights);

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

  generateGeometry(geometrys) {
    geometrys.forEach(({id, type, config}) => {
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

  generateMesh(meshes) {
    meshes.forEach(({id,params: {geometryId, materialId}, position, rotation}) => {
      const mesh = this.meshFactory.generate(
          this.geometryList.get(geometryId),
          this.materialList.get(materialId)
      );
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      this.meshList.set(id, mesh);
      this.addMesh(mesh);
    })
  }

  generateLight(lights) {
    lights.forEach(({id,type, params, position}) => {
      const pointLight = this.lightFactory.generate(type, params);
      pointLight.position.set(...position);
      this.addLight(pointLight);
      this.lightList.set(id, pointLight);
    })
  }

  updateRender() {
    this.renderer.render(this.scene, this.currentCamera);
  }

  updateControls() {
    this.control.update();
  }

  update() {
    this.updateControls();
    this.updateRender();
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

  getRender() {
    return this.renderer;
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
