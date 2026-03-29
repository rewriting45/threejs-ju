import * as THREE from 'three';
import {gsap} from "gsap";

const canvas = document.querySelector("#app");
// 获取上下文，可以理解为贯穿整个canvas的操作
const context = canvas.getContext("3d");
const {clientWidth, clientHeight} = canvas;

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

function createCube(color = 'red', position) {
  // red cube
  // 创建一个长宽高1，1，1的立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 创建基础材质
  const material = new THREE.MeshBasicMaterial({
    color
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
  camera.position.z = 10;
  // 把相机添加到场景中去

  return camera;
}

// 创建渲染器
function createRenderer(scene, camera, canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);

  return renderer;
}

// 创建可视化坐标轴, 轴辅助工具
function createAxesHelper(size = 10) {
  return new THREE.AxesHelper(size);
}


const group = new CreateGroup();
group.push(createCube('red', new THREE.Vector3(1, 2, 3)));
group.push(createCube('green', new THREE.Vector3(3, 2, 1)));
group.push(createCube('blue', new THREE.Vector3(0, 0, 0)));

const camera = createCamera(scene,75, clientWidth / clientHeight, 1, 200);
const renderer = createRenderer(scene, camera, canvas);
const axesHelper = createAxesHelper();
scene.add(camera);
scene.add(group.getGroup());
scene.add(axesHelper);

// 位置变化
// cube.position.set(1, 1, 1);
// // scale 缩放
// // rotation 旋转
// // 旋转排序
// cube.rotation.reorder("YXZ");
// // 向量长度,计算的应该是坐标系原点到cube中心点的距离
// console.log(cube.position.length());
// // 物体到指定目标的距离
// console.log(cube.position.distanceTo(camera.position));
// // 归一化
// cube.position.normalize(); // 把 position 的向量长度变为1，暂时不知道有什么用
// console.log(cube.position.length());
//
// // 摄像机朝向坐标
// camera.lookAt(cube.position);

// const clock = new THREE.Clock();
gsap.to(group.getGroup().position, {
  x: 2,
  duration: 1,
  delay: 1,
})

function animation() {

  // const elapsedTime = clock.getElapsedTime();
  //
  // group.getGroup().rotation.y = elapsedTime;
  // group.getGroup().position.y = Math.sin(elapsedTime);
  // group.getGroup().position.x = Math.cos(elapsedTime);
  // group.getGroup().position.z = Math.cos(elapsedTime);

  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}

animation();


