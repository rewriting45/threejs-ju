import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';
import {GUI} from 'dat.gui';

const gui = new GUI();
const debugObject = {
    envMapIntensity: 10
}

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
            position: [10, 10, 10]
        }
    ],
    lights: [
        {
            id: "light_directional_01",
            type: 'directional',
            params: {
                color: 0xffffff,
                intensity: 3,
            },
            position: [5, 5, 5],
        },
    ],
    meshes: [
        {
            id: "meshes_04",
            params: {
                geometryId: "geometry_sphere_01",
                materialId: "material_standard_01"
            },
            position: [0, 0, 0],
            rotation: [0, 0, 0]
        }
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
                radius: 1,
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
                y: -4,
                z: 0
            },
            scale: {
                x: 10,
                y: 10,
                z: 10
            },
            rotation: {
                x: 0,
                y: Math.PI / 2,
                z: 0
            }
        },
    ],
    controls: true
});

const meshes_04 = threeGlobal.getAllMesh("meshes_04");
const light_directional_01 = threeGlobal.getAllLight("light_directional_01");
const lightFolder = gui.addFolder("light");
lightFolder.add(light_directional_01, "intensity").min(0).max(10).step(0.001).name("lightIntensity");
lightFolder.add(light_directional_01.position, "x").min(-5).max(5).step(0.001).name("lightX");
lightFolder.add(light_directional_01.position, "y").min(-5).max(5).step(0.001).name("lightY");
lightFolder.add(light_directional_01.position, "z").min(-5).max(5).step(0.001).name("lightZ");

const scene = threeGlobal.getScene();
scene.background = cubeTexture;


const flightHelmetFolder = gui.addFolder("flight_helmet");

threeGlobal.addEventListener("models-loaded", () => {
    const flight_helmet_01 = threeGlobal.getAllMesh("flight_helmet_01");
    flightHelmetFolder.add(flight_helmet_01.rotation, "y").min(- Math.PI).max(Math.PI).step(0.001).name("rotationY");
    flightHelmetFolder.add(flight_helmet_01.rotation, "x").min(- Math.PI).max(Math.PI).step(0.001).name("rotationX");
    flightHelmetFolder.add(flight_helmet_01.rotation, "z").min(- Math.PI).max(Math.PI).step(0.001).name("rotationZ");
    // scene.environment = cubeTexture;
    threeGlobal.updateAllMaterialsEnvMap(cubeTexture);
});

const envMapFolder = gui.addFolder("envMap");
envMapFolder.add(debugObject, "envMapIntensity").min(0).max(10).step(0.001).name("环境贴图强度").onFinishChange((value) => {
    threeGlobal.updateAllMaterialsEnvMapIntensity(value);
})




const render = threeGlobal.getRender();
render.physicallyCorrectLights = true;
render.colorSpace  = THREE.SRGBColorSpace;

console.log(THREE.SRGBColorSpace);



function animation() {

    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
