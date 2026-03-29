import * as THREE from 'three';

const canvas = document.querySelector("#app");
// 获取上下文，可以理解为贯穿整个canvas的操作
const context = canvas.getContext("3d");
const {clientWidth, clientHeight} = canvas;

// 场景
const scene = new THREE.Scene();

function createRedCube(scene) {
  // red cube
  // 创建一个长宽高1，1，1的立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 创建基础材质
  const material = new THREE.MeshBasicMaterial({
    color: 'red'
  });
  // 网格模型 立方体
  const mesh = new THREE.Mesh(geometry, material);

  // 把之前的立方体加到场景中去
  scene.add(mesh);
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
  camera.position.z = 3;
  // 把相机添加到场景中去
  scene.add(camera);

  return camera;
}

function createRenderer(scene, camera, canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas
  });

  renderer.render(scene, camera);
}

createRedCube(scene);
const camera = createCamera(scene,75, clientWidth / clientHeight, 1, 200);
createRenderer(scene, camera, canvas);

