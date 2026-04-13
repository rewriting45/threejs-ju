import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';
import {GUI} from 'dat.gui';

const cubeTextureLoader = new THREE.CubeTextureLoader();

const cubeTexture = cubeTextureLoader.load([
    "/textures/evmap/suburban-garden/px.png",
    "/textures/evmap/suburban-garden/nx.png",
    "/textures/evmap/suburban-garden/py.png",
    "/textures/evmap/suburban-garden/ny.png",
    "/textures/evmap/suburban-garden/pz.png",
    "/textures/evmap/suburban-garden/nz.png",
]);

cubeTexture.colorSpace = THREE.SRGBColorSpace;

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
            position: [3, 3, 3]
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
        {
            id: "torus_knot",
            params: {
                geometryId: "geometry_torus_knot_01",
                materialId: "material_standard_01"
            },
            position: [-5, 0, 0],
            rotation: [0, 0, 0],
            scale: [0.5, 0.5, 0.5]
        },
    ],
    materials: [
        {
            id: 'material_standard_01',
            type: 'meshStandard',
            config: {
                roughness: 0.2,
                metalness: 1,
                color: "#aaaaaa"
            }
        }
    ],
    geometries: [
        {
            id: 'geometry_torus_knot_01',
            type: 'torusKnot',
            config: {
                radius: 1,
                tube: 0.4,
                tubularSegments: 100,
                radialSegments: 16
            }
        }
    ],
    models: [
        {
            id: "flight_helmet_01",
            url: "/models/FlightHelmet/glTF/FlightHelmet.gltf",
            type: "gltf",
            position: {
                x: 0,
                y: 0,
                z: 0
            }
        },
    ],
    controls: true
});


// scene
const scene = threeGlobal.getScene();

scene.environment = cubeTexture;
scene.background = cubeTexture;



const renderer = threeGlobal.getRender();

// 1. 设置色彩输出空间
renderer.outputColorSpace = THREE.SRGBColorSpace;

// 2. 设置色调映射（会让反射看起来更自然、更有金属质感）
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const global = {
    envMapIntensity: 10,
}

const gui = new GUI();
gui.add(global, "envMapIntensity").min(0).max(10).step(0.001).onChange(() => {
    threeGlobal.updateAllMaterialsEnvMapIntensity(global.envMapIntensity);
})


function animation() {

    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
