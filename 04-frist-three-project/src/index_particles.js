import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';

const canvas = document.querySelector('canvas');
const threeGlobal = new GenerateObject(THREE, canvas, {
    cameras: [
        {
            id: "camera_perspective_01",
            type: "perspective",
            params: {
                fov: 75,
                aspect: canvas.clientWidth / canvas.clientHeight,
                near: 0.01,
                far: 1000,
            },
            position: [10, 10, 10]
        }
    ],
    lights: [
        {
            id: "light_point_01",
            type: 'point',
            params: {
                color: 0xffffff,
                intensity: 100,
            },
            position: [10, 10, 10],
        }
    ],
    materials: [
        {
            id: 'material_points_01',
            type: 'points',
            config: {
                size: 0.02,
                sizeAttenuation: true, // 指定点的大小是否因相机深度而衰减。（仅限透视摄像头。）默认为true。
                color: 0xffffff,
                transparent: true,
                depthWrite: false,
                vertexColors: true, // 顶点着色器渲染颜色
            }
        }
    ],
    geometries: [
        {
            id: 'geometry_particles_01',
            type: 'sphere',
            config: {
                radius: 1,
                widthSegments: 32,
                heightSegments: 32
            }
        }
    ]
});

const textureLoader = new THREE.TextureLoader();

const starTexture = textureLoader.load("/textures/Coins/coin_11.png");
starTexture.colorSpace = THREE.SRGBColorSpace;

const scene = threeGlobal.getScene();

const material_points_01 = threeGlobal.getAllMaterial("material_points_01");
material_points_01.map = starTexture;

const particles = new THREE.BufferGeometry();
const count = 50000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}

particles.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
)

particles.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3)
)

scene.add(new THREE.Points(particles, material_points_01));

const renderer = threeGlobal.getRender();
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;

const camera = threeGlobal.getAllCamera("camera_perspective_01");

const clock = new THREE.Clock();
function animation() {

    const elapsedTime = clock.getElapsedTime();

    // camera.position.x = Math.sin(elapsedTime) * camera.position.x;
    // camera.position.z = Math.cos(elapsedTime) * camera.position.z;

    // for (let i = 0; i < count; i++) {
        // const ix = i * 3;
        // const iy = i * 3 + 1;
        // const iz = i * 3 + 2;

        // const [x, y, z] = [particles.attributes.position.array[ix], particles.attributes.position.array[iy], particles.attributes.position.array[iz]];
        // particles.attributes.position.array[ix] = Math.sin(elapsedTime) * x;
        // particles.attributes.position.array[iy] = Math.sin(elapsedTime) * y;
        // particles.attributes.position.array[iz] = Math.cos(elapsedTime) * z;
    // }

    // particles.attributes.position.needsUpdate = true;

    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
