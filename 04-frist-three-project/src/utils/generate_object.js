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
  // region factory
  meshFactory = null;
  geometryFactory = null;
  materialFactory = null;
  cameraFactory = null;
  lightFactory = null;
  // endregion
  materialList = [];
  geometryList = [];
  meshList = [];
  cameraList = [];
  lightList = [];

  elements = {

  };
  constructor(THREE, canvas,{generate, materials, geometrys, meshs, cameras, lights}) {
    this.canvas = canvas;
    this.generateScene();

    this.meshFactory = new GenerateMesh(THREE);
    this.geometryFactory = new GenerateGeometry(THREE);
    this.materialFactory = new GenerateMaterial(THREE);
    this.cameraFactory = new GenerateCamera(THREE);
    this.lightFactory = new GenerateLight(THREE);

    this.addAxesHelper(1000);
    this.generateMaterial(materials);
    this.generateGeometry(geometrys);
    this.generateMesh(meshs);
    this.generateCamera(cameras);
    this.generateLight(lights);

    this.generateRender(canvas);
    this.resizeRender(canvas);
    this.generateControls();
  }

  addAxesHelper(size = 10) {
    this.scene.add(new THREE.AxesHelper(size));
  }

  resizeRender(canvas) {
    renderResize(canvas, this.cameraList[0], this.elements.renderer);
  }

  generateMaterial(materials) {
    materials.forEach(({type, config}) => {
      this.materialList.push(this.materialFactory.generate(type, config))
    })
  }

  generateGeometry(geometrys) {
    geometrys.forEach(({type, config}) => {
      this.geometryList.push(this.geometryFactory.generate(type, config))
    })
  }

  generateControls() {
    const controls = new OrbitControls(this.cameraList[0], this.elements.renderer.domElement);
    controls.enableDamping = true;
    this.elements["controls"] = controls;
  }

  generateScene() {
    this.scene = new THREE.Scene();
  }

  generateRender(canvas) {
    const renderer = createRenderer(canvas);
    this.elements["renderer"] = renderer;
  };

  generateCamera(cameras) {
    cameras.forEach(({type, params, position}) => {
      const camera = this.cameraFactory.generate(type, params);
      camera.position.set(...position);
      this.addCamera(camera);
      this.cameraList.push(camera);
    })
  }

  generateMesh(meshs) {
    meshs.forEach(({params: {geometryIndex, materialIndex}, position, rotation}) => {
      const mesh = this.meshFactory.generate(
          this.geometryList[geometryIndex],
          this.materialList[materialIndex]
      );
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      this.meshList.push(mesh);
      this.addMesh(mesh);
    })
  }

  generateLight(lights) {
    lights.forEach(({type, params, position}) => {
      const pointLight = this.lightFactory.generate(type, params);
      pointLight.position.set(...position);
      this.addLight(pointLight);
      this.lightList.push(pointLight);
    })
  }

  updateRender() {
    this.elements.renderer.render(this.scene, this.cameraList[0]);
  }

  updateControls() {
    this.elements.controls.update();
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

  getAllElement() {
    return this.elements;
  }
}
