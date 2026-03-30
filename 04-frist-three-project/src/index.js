import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "three/addons";
import { GUI } from "dat.gui";
import ColorTexture from "@/asserts/textures/door/color.jpg";
import AmbientOcclusionTexture from '@/asserts/textures/door/ambientOcclusion.jpg';
import HeightTexture from '@/asserts/textures/door/height.jpg';
import AlphaTexture from '@/asserts/textures/door/alpha.jpg';
import MetalnessTexture from '@/asserts/textures/door/metalness.jpg';
import NormalTexture from '@/asserts/textures/door/normal.jpg';
import RoughnessTexture from '@/asserts/textures/door/roughness.jpg';

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
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 创建纹理
  const textureLoader = new THREE.TextureLoader();
  const colorTexture = textureLoader.load(ColorTexture);
  const metalnessTexture = textureLoader.load(MetalnessTexture);
  const heightTexture = textureLoader.load(HeightTexture);
  const alphaTexture = textureLoader.load(AlphaTexture);
  const ambientOcclusionTexture = textureLoader.load(AmbientOcclusionTexture);
  const normalTexture = textureLoader.load(NormalTexture);
  const roughnessTexture = textureLoader.load(RoughnessTexture);
  // 创建基础材质
  const material = new THREE.MeshBasicMaterial({
    map: normalTexture,
  });

  // 网格模型 立方体
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(position.x, position.y, position.z);

  // 把之前的立方体加到场景中去
  return {
    mesh,
    material,
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

function createGui() {
  return new GUI();
}

const camera = createCamera(scene, 75, clientWidth / clientHeight, 1, 200);
const renderer = createRenderer(scene, camera, canvas);
const { mesh, material } = createCube("red", new THREE.Vector3(0, 0, 0));
const axesHelper = createAxesHelper();
const gui = createGui();

function guiAction() {
  const cubeFolder = gui.addFolder("cube");
  cubeFolder.add(mesh.rotation, "x", 0, Math.PI * 2).step(Math.PI / 16);
  cubeFolder.add(mesh.rotation, "y", 0, Math.PI * 2).step(Math.PI / 16);
  cubeFolder.add(mesh.rotation, "z", 0, Math.PI * 2).step(Math.PI / 16);
  cubeFolder.open();

  const cameraFolder = gui.addFolder("camera");
  cameraFolder.add(camera.position, "z", 0, 10);
  cameraFolder.open();

  const debugParams = {
    color: "#ff0000",
    spin: () => {
      gsap.to(mesh.rotation, {
        duration: 1,
        y: mesh.rotation.y + Math.PI * 2,
      });
    },
  };

  const materialFolder = gui.addFolder("material");
  materialFolder.add(mesh.material, "wireframe");
  materialFolder.addColor(debugParams, "color").onChange(() => {
    material.color.set(debugParams.color);
  });
  materialFolder.open();
  const animationFolder = gui.addFolder("animation");
  animationFolder.add(debugParams, "spin");
  animationFolder.open();
}

camera.position.set(2, 2, 2);
camera.lookAt(mesh.position);

scene.add(mesh);
scene.add(camera);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

getCursor();
window.addEventListener("resize", (event) => {
  canvas.width = event.target.innerWidth;
  canvas.height = event.target.innerHeight;

  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.width, canvas.height);
});
// const clock = new THREE.Clock();

function animation() {
  // const elapsedTime = clock.getElapsedTime();
  // mesh.rotation.y = Math.sin(elapsedTime) * 2 * Math.PI;

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}

animation();
