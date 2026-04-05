import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';
import {GUI} from "dat.gui";

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
            position: [5, 5, 5]
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
            id: 'material_standard_01',
            type: 'meshStandard',
            config: {roughness: 0.4}
        },
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
                // blending: THREE.AdditiveBlending, // 叠加
            }
        }
    ],
    geometries: [
        {
            id: 'geometry_box_01',
            type: 'box',
            config: {
                width: 3,
                height: 3,
                depth: 3
            }
        },
        {
            id: 'geometry_plane_01',
            type: 'plane',
            config: {
                width: 100,
                height: 100,
            }
        },
        {
            id: 'geometry_torus_01',
            type: 'torus',
            config: {
                radius: 1,
                tube: 0.5,
            }
        },
        {
            id: 'geometry_sphere_01',
            type: 'sphere',
            config: {
                radius: 1.5,
            }
        }
    ]
});

const scene = threeGlobal.getScene();
const gui = new GUI();

const params = {};
params.count = 10000;
params.size = 0.02;
params.radius = 5;
params.branches = 3;
params.spin = 1;
params.randomness = 0.2;
params.randomnessPower = 3;
params.insideColor = "#ff6030";
params.outsideColor = "#1b3984";


const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load("/textures/particles/11.png");

let material_points_01 = threeGlobal.getAllMaterial("material_points_01");
material_points_01.alphaMap = starTexture;


let geometry = null;
let points = null;

let positions = new Float32Array(params.count * 3);
let colors = new Float32Array(params.count * 3);

const colorInside = new THREE.Color(params.insideColor);
const colorOutside = new THREE.Color(params.outsideColor);

function generateGalaxy() {

    if (points !== null) {
        geometry.dispose();
        scene.remove(points);
    }

    geometry = new THREE.BufferGeometry();

    positions = new Float32Array(params.count * 3);
    colors = new Float32Array(params.count * 3);

    for (let i = 0; i < params.count; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        const radius = Math.random() * params.radius;
        const spinAngle = radius * params.spin;
        const branchAngle = (i % params.branches) / params.branches * Math.PI * 2;

        const randomX = Math.pow (Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow (Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow (Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);


        positions[ix] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[iy] = randomY;
        positions[iz] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / params.radius);

        colors[ix] = mixedColor.r;
        colors[iy] = mixedColor.g;
        colors[iz] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    points = new THREE.Points(geometry, material_points_01);
    scene.add(points);
}

generateGalaxy();

gui.add(params, "count").min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(params, "size").min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.add(params, "radius").min(0.01).max(20).step(0.001).onFinishChange(generateGalaxy);
gui.add(params, "branches").min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(params, "spin").min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(params, "randomness").min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(params, "randomnessPower").min(1).max(10).step(1).onFinishChange(generateGalaxy);
gui.addColor(params, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(params, "outsideColor").onFinishChange(generateGalaxy);

const clock = new THREE.Clock();

function animation() {
    const elapsedTime = clock.getElapsedTime();

    points.rotation.y = elapsedTime * Math.PI

    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
