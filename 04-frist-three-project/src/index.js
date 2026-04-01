import * as THREE from "three";
import { gsap } from "gsap";
import { FontLoader, OrbitControls, TextGeometry } from "three/addons";
import MatcapsTexture from "@/asserts/textures/matcaps/8.png";
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

async function createCube(color = "red", position) {
  // font
  const fontLoader = new FontLoader();
  const font = await fontLoader.loadAsync(
    "/fonts/helvetiker_regular.typeface.json",
  );
  const textGeometry = new TextGeometry("Hello Three.js", {
    font,
    size: 0.5,
    height: 0.2,
    depth: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  const textureLoader = new THREE.TextureLoader();
  const textrues = {
    matcaps: textureLoader.load(MatcapsTexture),
    gradients: textureLoader.load(GradientsTexture),
  };

  textGeometry.computeBoundingBox();
  const { x, y, z } = textGeometry.boundingBox.max;

  //   textGeometry.translate(-(x - 0.02) * 0.5, -(y + 0.02) * 0.5, -z * 0.5);
  textGeometry.center();
  console.log(textGeometry.boundingBox);

  // red cube
  // 创建一个长宽高1，1，1的立方体
  //   const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 创建基础材质
  const material = new THREE.MeshMatcapMaterial({
    matcap: textrues.matcaps,
  });
  //   material.wireframe = true;
  // 网格模型 立方体
  const mesh = new THREE.Mesh(textGeometry, material);

  mesh.position.set(position.x, position.y, position.z);

  const dountMeshSet = [];

  for (let index = 0; index < 100; index++) {
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    const donutMesh = new THREE.Mesh(donutGeometry, material);
    donutMesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
    );
    // donutMesh.rotation.set(
    //   Math.random() * Math.PI,
    //   Math.random() * Math.PI,
    //   Math.random() * Math.PI,
    // );
    const scale = Math.random();
    donutMesh.scale.set(scale, scale, scale);
    dountMeshSet.push(donutMesh);
  }

  // 把之前的立方体加到场景中去
  return {
    mesh,
    dountMeshSet,
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

const camera = createCamera(scene, 75, clientWidth / clientHeight, 0.01, 200);
const renderer = createRenderer(scene, camera, canvas);
const { mesh, dountMeshSet } = await createCube(
  "withe",
  new THREE.Vector3(0, 0, 0),
);
const axesHelper = createAxesHelper();

camera.position.set(2, 2, 2);
camera.lookAt(mesh.position);

scene.add(mesh, ...dountMeshSet);
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
const clock = new THREE.Clock();

function animation() {
  const elapsedTime = clock.getElapsedTime();
  dountMeshSet.forEach((item) => {
    // item.rotation.y = Math.sin(elapsedTime) * Math.PI;
    if (Math.random() > 0.5) {
      item.rotation.y = Math.sin(elapsedTime) * Math.PI;
      item.rotation.x = Math.sin(elapsedTime) * Math.PI;
    } else {
      item.rotation.y = Math.sin(elapsedTime) * Math.PI;
      item.rotation.z = Math.sin(elapsedTime) * Math.PI;
    }
  });
  //   mesh.rotation.y = Math.sin(elapsedTime) * 2 * Math.PI;

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}

animation();
