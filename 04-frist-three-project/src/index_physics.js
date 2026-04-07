import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';
import CANNON from "cannon";

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
    meshes: [
        {
            id: "meshes_01",
            params: {
                geometryId: "geometry_box_01",
                materialId: "material_standard_01"
            },
            position: [0, 0, 0],
            rotation: [0, 0, 0]
        },
        {
            id: "meshes_02",
            params: {
                geometryId: "geometry_plane_01",
                materialId: "material_standard_01"
            },
            position: [0, -3, 0],
            rotation: [-Math.PI / 2, 0, 0]
        },
        {
            id: "meshes_03",
            params: {
                geometryId: "geometry_torus_01",
                materialId: "material_standard_01"
            },
            position: [-5, 0, 0],
            rotation: [0, 0, 0]
        },
        {
            id: "meshes_04",
            params: {
                geometryId: "geometry_sphere_01",
                materialId: "material_standard_01"
            },
            position: [5, 0, 0],
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
                radius: 0.5,
            }
        }
    ],
    controls: true
});
const meshes_04 = threeGlobal.getAllMesh("meshes_04");

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);


// 混凝土
const defaultMaterial = new CANNON.Material("default");

const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.1,
    restitution: 0.7
});

world.defaultContactMaterial = defaultContactMaterial;

const sphere = new CANNON.Sphere(0.5);
const sphereBody = new CANNON.Body({
    mass: 1, // 质量
    position: new CANNON.Vec3(0, 3, 3),
    shape: sphere
});

const floor = new CANNON.Plane();
const floorBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, -3, 0),
    shape: floor
});
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI / 2
);
world.addContactMaterial(defaultContactMaterial);
world.addBody(sphereBody);
world.addBody(floorBody);


const clock = new THREE.Clock();
let oldElapsedTime = 0;

function animation() {

    const elapsedTime = clock.getElapsedTime();
    const delta = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    world.step(1 / 60, delta, 3);

    meshes_04.position.copy(sphereBody.position);

    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
