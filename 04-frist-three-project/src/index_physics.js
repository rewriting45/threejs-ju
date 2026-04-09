import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';
import CANNON from "cannon";

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
            id: "meshes_02",
            params: {
                geometryId: "geometry_plane_01",
                materialId: "material_standard_01",
                physicsId: "physics_plane_01",
            },
            position: [0, -3, 0],
            rotation: [-Math.PI / 2, 0, 0]
        },
        {
            id: "meshes_04",
            params: {
                geometryId: "geometry_sphere_01",
                materialId: "material_standard_01",
                physicsId: "physics_sphere_01",
            },
            position: [5, 0, 0],
            rotation: [0, 0, 0],
        },
        {
            id: "meshes_05",
            params: {
                geometryId: "geometry_box_01",
                materialId: "material_standard_01",
                physicsId: "physics_box_01",
            },
            position: [5, 0, 0],
            rotation: [0, 0, 0],
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
    physics: [
        {
            id: "physics_sphere_01",
            config: {
                mass: 1
            }
        },
        {
            id: "physics_plane_01",
            config: {
                mass: 0
            }
        },
        {
            id: "physics_box_01",
            config: {
                mass: 1
            }
        }
    ],
    controls: true
});

const clock = new THREE.Clock();
let oldElapsedTime = 0;

function animation() {

    const elapsedTime = clock.getElapsedTime();
    const delta = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    threeGlobal.updateWorld(delta);
    threeGlobal.updateMeshPhysics("meshes_04");
    threeGlobal.updateMeshPhysics("meshes_05");

    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
