import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';
import {GUI} from 'dat.gui';
import vertexShader from "@/shaders/28-shader-patterns/vertex.glsl";
import fragmentShader from "@/shaders/28-shader-patterns/fragment.glsl";

const gui = new GUI();

const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/flag/ChineseFlag.png");

const canvas = document.querySelector('canvas');
const threeGlobal = new GenerateObject(THREE, canvas, {
    basicPhysics: {},
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
            position: [0, 0, 10]
        }
    ],
    lights: [
        {
            id: "light_ambient_01",
            type: 'ambient',
            params: {
                color: 0xffffff,
                intensity: 1,
            },
            position: [10, -10, 10],
        },
    ],
    meshes: [
    ],
    materials: [
        {
            id: 'material_standard_01',
            type: 'meshStandard',
            config: {roughness: 0.4}
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
                width: 5,
                height: 5,
                widthSegments: 64,
                heightSegments: 64
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
    ],
    controls: true,
    axesHelper: true
});

const geometry_plane_01 = threeGlobal.getAllGeometry("geometry_plane_01");

const materialCount = new Float32Array(geometry_plane_01.attributes.position.count);

for (let i = 0; i < materialCount.length; i++) {
    materialCount[i] = Math.random() - 0.5;
}

geometry_plane_01.setAttribute("aRandom", new THREE.BufferAttribute(materialCount, 1));

const shaderMaterial = threeGlobal.generateMaterial({
    id: "shader",
    type: "shader",
    config: {
        vertexShader, // 顶点着色器
        fragmentShader, // 片元着色器
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0,
            },
            fTexture: {
                value: flagTexture
            },
            uCurrent: {
                value: 22
            }
        }
    }
});

const mesh = threeGlobal.generateMesh({
    id: "meshes_00",
    params: {
        geometryId: "geometry_plane_01",
        materialId: "shader"
    },
});

threeGlobal.addMesh(mesh);

const shaderMap = {};
for (let i = 1; i < 100; i++) {
    shaderMap[`shader${i}`] = i;
}

gui.add(mesh.material.uniforms.uCurrent, "value", shaderMap).name("shader");

const clock = new THREE.Clock();
function animation() {
    const elapsedTime = clock.getElapsedTime();

    mesh.material.uniforms.uTime.value = elapsedTime;

    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
