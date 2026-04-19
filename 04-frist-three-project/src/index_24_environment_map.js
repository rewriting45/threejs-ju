import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';
import {GUI} from 'dat.gui';
import {RGBELoader, EXRLoader} from 'three/addons';

// const cubeTextureLoader = new THREE.CubeTextureLoader();
//
// const cubeTexture = cubeTextureLoader.load([
//     "/textures/evmap/suburban-garden/px.png",
//     "/textures/evmap/suburban-garden/nx.png",
//     "/textures/evmap/suburban-garden/py.png",
//     "/textures/evmap/suburban-garden/ny.png",
//     "/textures/evmap/suburban-garden/pz.png",
//     "/textures/evmap/suburban-garden/nz.png",
// ]);
//
// cubeTexture.colorSpace = THREE.SRGBColorSpace;

const rgbeLoader = new RGBELoader();
const exrLoader = new EXRLoader();


const canvas = document.querySelector('canvas');
const threeGlobal = new GenerateObject(THREE, canvas, {
    basicPhysics: {},
    cameras: [
        {
            id: 'camera_perspective_01',
            type: 'perspective',
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
            id: 'light_ambient_01',
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
            id: 'torus_knot',
            params: {
                geometryId: 'geometry_torus_knot_01',
                materialId: 'material_standard_01'
            },
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [0.5, 0.5, 0.5]
        },{
            id: 'torus',
            params: {
                geometryId: 'geometry_torus_01',
                materialId: 'material_basic_01'
            },
            position: [0, 2, 0],
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
                color: '#aaaaaa'
            }
        },{
            id: 'material_basic_01',
            type: 'meshBasic',
            config: {
                color: '#ffffff'
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
        },
        {
            id: 'geometry_torus_01',
            type: 'torus',
            config: {
                radius: 8,
                tube: 0.5
            }
        }
    ],
    models: [
        {
            id: 'flight_helmet_01',
            url: '/models/FlightHelmet/glTF/FlightHelmet.gltf',
            type: 'gltf',
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

// scene.environment = cubeTexture;
// scene.background = cubeTexture;
scene.backgroundBlurriness = 0.2;
scene.backgroundIntensity = 5;

// HDR (RGBE)
// rgbeLoader.load("/textures/environmentMaps/0/2k.hdr", (envMap) => {
//     envMap.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = envMap;
//     scene.background = envMap;
// })

// HDR (EXR)
exrLoader.load('/textures/environmentMaps/nvidiaCanvas-4k.exr', (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = envMap;
});

const torus = threeGlobal.getAllMesh("torus");

const webGLCubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    type: THREE.FloatType,

});
scene.environment = webGLCubeRenderTarget.texture;

const cubeCamera = new THREE.CubeCamera(0.01, 1000, webGLCubeRenderTarget);
scene.add(cubeCamera);

const renderer = threeGlobal.getRender();

// 1. 设置色彩输出空间
renderer.outputColorSpace = THREE.SRGBColorSpace;

// 2. 设置色调映射（会让反射看起来更自然、更有金属质感）
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const global = {
    envMapIntensity: 10,
};

const gui = new GUI();
gui.add(global, 'envMapIntensity').min(0).max(10).step(0.001).onChange(() => {
    threeGlobal.updateAllMaterialsEnvMapIntensity(global.envMapIntensity);
});

gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001);
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001);


const clock = new THREE.Clock();

function animation() {
    const elapsedTime = clock.getElapsedTime();

    torus.rotation.x = elapsedTime;
    cubeCamera.update(renderer, scene);
    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
