import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "three/addons";

const canvas = document.querySelector("#app");
// 获取上下文，可以理解为贯穿整个canvas的操作
const context = canvas.getContext("3d");
const { clientWidth, clientHeight } = canvas;

// 场景
const scene = new THREE.Scene();

class CreateGroup {
  group = null;
  constructor() {
    this.group = new THREE.Group();
  }

  getGroup() {
    return this.group;
  }

  push(mesh) {
    if (this.group) {
      this.group.add(mesh);
    }
  }
}

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
  // 创建基础材质
  const material = new THREE.MeshBasicMaterial({
    color,
  });
  // 网格模型 立方体
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(position.x, position.y, position.z);

  // 把之前的立方体加到场景中去
  return mesh;
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
const mesh = createCube("blue", new THREE.Vector3(0, 0, 0));
const axesHelper = createAxesHelper();

camera.position.set(2, 2, 2);
camera.lookAt(mesh.position);

scene.add(mesh);
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
  mesh.rotation.y = Math.sin(elapsedTime) * 2 * Math.PI;

  // update camera
  // camera.position.x = cursor.x * 3;
  // camera.position.y = cursor.y * 3;

  // camera.position.x = Math.sin(cursor.x * Math.PI * 2);
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2);

  // camera.lookAt(mesh.position);
  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}

animation();
