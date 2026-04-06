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
                fov: 35,
                aspect: canvas.clientWidth / canvas.clientHeight,
                near: 0.01,
                far: 1000,
            },
            position: [0, 0, 10]
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
    meshes: [
        {
            id: "meshes_01",
            params: {
                geometryId: "geometry_cone_01",
                materialId: "material_toon_01"
            },
        },
        {
            id: "meshes_02",
            params: {
                geometryId: "geometry_torus_01",
                materialId: "material_toon_01"
            },
        },
        {
            id: "meshes_03",
            params: {
                geometryId: "geometry_torus_knot_01",
                materialId: "material_toon_01"
            },
        }
    ],
    materials: [
        {
            id: 'material_toon_01',
            type: 'meshToon',
            config: {
                color: "#ffeded"
            }
        },
        {
            id: 'material_point_01',
            type: 'points',
            config: {
                color: "#ffeded",
                size: 0.03
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
                tube: 0.4,
                radialSegments: 16,
                tubularSegments: 60
            }
        },
        {
            id: 'geometry_torus_knot_01',
            type: 'torusKnot',
            config: {
                radius: 0.8,
                tube: 0.35,
                tubularSegments: 100,
                radialSegments: 16
            }
        },
        {
            id: 'geometry_sphere_01',
            type: 'sphere',
            config: {
                radius: 1.5,
            }
        },
        {
            id: 'geometry_cone_01',
            type: 'cone',
            config: {
                radius: 1,
                height: 2,
                radialSegments: 32,
            }
        }
    ]
});

const scene = threeGlobal.getScene();

const camera_perspective_01 = threeGlobal.getAllCamera("camera_perspective_01");
camera_perspective_01.lookAt(0,0,0)

const material_toon_01 = threeGlobal.getAllMaterial("material_toon_01");
const material_point_01 = threeGlobal.getAllMaterial("material_point_01");

const gui = new GUI();

const params = {
    color: "#ffeded"
}

gui.addColor(params, "color").onFinishChange(() => {
    material_toon_01.color.set(params.color);
    material_point_01.color.set(params.color);
});

const textureLoader = new THREE.TextureLoader();
const gradientTexture3 = textureLoader.load("/textures/gradients/3.jpg");
const gradientTexture5 = textureLoader.load("/textures/gradients/5.jpg");

material_toon_01.greadientMap = gradientTexture3;
material_toon_01.magFilter = THREE.NearestFilter;

const objectDistance = 6;

const meshes_01 = threeGlobal.getAllMesh("meshes_01");
const meshes_02 = threeGlobal.getAllMesh("meshes_02");
const meshes_03 = threeGlobal.getAllMesh("meshes_03");

meshes_01.position.y = -objectDistance * 0;
meshes_02.position.y = -objectDistance * 1;
meshes_03.position.y = -objectDistance * 2;

const sectionMeshes = [
    meshes_01,
    meshes_02,
    meshes_03,
]

const render = threeGlobal.getRender();
render.setClearAlpha(0);

let scrollY = window.scrollY;

window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
});

const cursor = {
    x: 0,
    y: 0
};

window.addEventListener("mousemove", ({clientX, clientY}) => {
    cursor.x = clientX;
    cursor.y = clientY;
})

const {clientHeight, clientWidth} = document.querySelector("section");

const cameraGroup = new THREE.Group();
cameraGroup.add(camera_perspective_01);
scene.add(cameraGroup);

const bufferGeometry = new THREE.BufferGeometry();
const count = 200;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
    let ix = i * 3;
    let iy = ix + 1;
    let iz = iy + 1;
    positions[ix] = (Math.random() - 0.5) * 10;
    positions[iy] = objectDistance * 0.4 - Math.random() * objectDistance * sectionMeshes.length;
    positions[iz] = (Math.random() - 0.5) * 10;

    console.log(-(Math.random() - 0.5) * 10)
}

bufferGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));


const points = new THREE.Points(bufferGeometry, );
scene.add(points);


const clock = new THREE.Clock();
let timerPre = 0;
function animation() {

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - timerPre;
    timerPre = elapsedTime;

    camera_perspective_01.position.y = - objectDistance * (scrollY / clientHeight);
    const parallaxX = -cursor.x / clientWidth - 0.5;
    const parallaxY = cursor.y / clientHeight -0.5;
    cameraGroup.position.x = -parallaxX;
    cameraGroup.position.y = parallaxY;

    for (let sectionMesh of sectionMeshes) {
        sectionMesh.rotation.x = elapsedTime * 0.1;
        sectionMesh.rotation.y = elapsedTime * 0.12;
        sectionMesh.rotation.z = elapsedTime * 0.15;
    }


    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
