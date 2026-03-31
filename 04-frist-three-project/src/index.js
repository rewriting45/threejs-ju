import * as THREE from "three";
import { gsap } from "gsap";
import {GUI} from "dat.gui";
import { OrbitControls } from "three/addons";
import ColorTexture from "@/asserts/textures/door/color.jpg";
import AmbientOcclusionTexture from "@/asserts/textures/door/ambientOcclusion.jpg";
import HeightTexture from "@/asserts/textures/door/height.jpg";
import AlphaTexture from "@/asserts/textures/door/alpha.jpg";
import MetalnessTexture from "@/asserts/textures/door/metalness.jpg";
import NormalTexture from "@/asserts/textures/door/normal.jpg";
import RoughnessTexture from "@/asserts/textures/door/roughness.jpg";
import ColorTextureBig from "@/asserts/textures/checkerboard-1024x1024.png";
import MinecraftTexture from "@/asserts/textures/minecraft.png";
import MatcapsTexture from "@/asserts/textures/matcaps/6.png";
import GradientsTexture from "@/asserts/textures/gradients/3.jpg";

const canvas = document.querySelector("#app");
// 获取上下文，可以理解为贯穿整个canvas的操作
const context = canvas.getContext("3d");
const { clientWidth, clientHeight } = canvas;

// 场景
const scene = new THREE.Scene();

const cursor = {
  x: 0,
  y: 0,
};

function getCursor() {
  window.addEventListener("mousemove", (event) => {
    cursor.x = -(event.clientX / canvas.clientWidth - 0.5);
    cursor.y = -(event.clientY / canvas.clientHeight - 0.5);
  });
}

function createCube(color = "red", position) {
  // red cube
  // 创建一个长宽高1，1，1的立方体
  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  const textureLoader = new THREE.TextureLoader();


  const textrues = {
    color: textureLoader.load(ColorTexture),
    metalness: textureLoader.load(MetalnessTexture),
    height: textureLoader.load(HeightTexture),
    alpha: textureLoader.load(AlphaTexture),
    ambientOcclusion: textureLoader.load(AmbientOcclusionTexture),
    normal: textureLoader.load(NormalTexture),
    roughness: textureLoader.load(RoughnessTexture),
    colorBig: textureLoader.load(ColorTextureBig),
    minecraft: textureLoader.load(MinecraftTexture),
    matcaps: textureLoader.load(MatcapsTexture),
    gradients: textureLoader.load(GradientsTexture)
  }

  const sides = {
    front: THREE.FrontSide,
    double: THREE.DoubleSide,
    back: THREE.BackSide
  }

  const debugParams = {
    color: "#ff0000"
  }
  // 创建基础材质
  // const material = new THREE.MeshBasicMaterial({
  //   map: textrues.color,
  //   alphaMap: textrues.alpha,
  //   transparent: true,
  //   color: "#ff0000"
  // });

  // 创建法线
  // const material = new THREE.MeshNormalMaterial({
  //   map: textrues.normal,
  //   alphaMap: textrues.alpha,
  //   transparent: true,
  //   color: "#ff0000",
  //   side: sides.double
  // });

  const material = new THREE.MeshMatcapMaterial({
    map: textrues.matcaps,
    transparent: true,

  });

  const gui = new GUI();

  const materialFolder = gui.addFolder('material');
  gui.addColor(debugParams, 'color').onChange(() => {
    material.color.set(debugParams.color);
  }).name("颜色");
  materialFolder.add(material, 'wireframe').name("是否网格");
  materialFolder.add(material, 'opacity', 0, 1).name("透明度").step(0.1);
  materialFolder.add(material, 'transparent').name("是否透明");
  materialFolder.add(material, 'flatShading').name("平面着色");
  materialFolder.open();

  // 网格模型 立方体
  const shape = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), material);


  shape.position.set(position.x, position.y, position.z);
  shape.position.set(position.x - 1.5, position.y, position.z);
  torus.position.set(position.x + 1.5, position.y, position.z);

  // 把之前的立方体加到场景中去
  return {
    shape,
    plane,
    torus
  };
}

// 创建相机
function createCamera(scene, fov = 75, aspect, near, far) {
  /**
   * 创建一个透视相机 (fov, aspect, near, far)
   * fov: 视野，全视野范围是360度，默认50
   * aspect: 长宽比，一般说的是映射到屏幕的长宽比 比如：16：9， 默认是1：1
   * near: 最近距离，可以看到的最近的距离，默认0.1
   * far: 最远距离，可以看到的最远的距离，默认2000
   */
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  /**
   * 创建一个正交相机 (left, right, top, bottom, near, far)
   * 可以理解为平行投影，跟透视相机的视锥结构不一样，正交相机的视锥就是一个立方体，设置的窗口大小就是投影到你可以看见的
   */
  // const camera = new THREE.OrthographicCamera(-1 * aspect, 1 * aspect, 1, -1, 0.1, 1000);
  camera.position.z = 30;
  // 把相机添加到场景中去

  return camera;
}

// 创建渲染器
function createRenderer(scene, camera, canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });

  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  return renderer;
}

// 创建可视化坐标轴, 轴辅助工具
function createAxesHelper(size = 10) {
  return new THREE.AxesHelper(size);
}

const camera = createCamera(scene, 75, clientWidth / clientHeight, 1, 200);
const renderer = createRenderer(scene, camera, canvas);
const {shape, plane, torus} = createCube("red", new THREE.Vector3(0, 0, 0));
const axesHelper = createAxesHelper();

camera.position.set(2, 2, 2);
camera.lookAt(shape.position);

scene.add(shape, plane, torus);
scene.add(camera);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

getCursor();
window.addEventListener("resize", (event) => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
});
const clock = new THREE.Clock();
function animation() {
  const elapsedTime = clock.getElapsedTime();

  shape.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  shape.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}

animation();
