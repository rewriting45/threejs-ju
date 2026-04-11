import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';

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
        },
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
            position: [0, 0, 0],
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
                radius: 1.5,
            }
        }
    ],
    models: [
        {
            id: "duck_01",
            url: "/models/Duck/glTF/Duck.gltf",
            type: "gltf",
            position: {
                x: 10,
                y: 0,
                z: 5
            }
        },
        {
            id: "duck_02",
            url: "/models/Duck/glTF-Binary/Duck.glb",
            type: "binary",
            position: {
                x: 5,
                y: 0,
                z: 5
            }
        },
        {
            id: "duck_03",
            url: "/models/Duck/glTF-Embedded/Duck.gltf",
            type: "embedded",
            position: {
                x: 0,
                y: 0,
                z: 5
            }
        },
        {
            id: "duck_04",
            url: "/models/Duck/glTF-Draco/Duck.gltf",
            type: "draco",
            position: {
                x: -5,
                y: 0,
                z: 5
            }
        },
        {
            id: "flight_helmet_01",
            url: "/models/FlightHelmet/glTF/FlightHelmet.gltf",
            type: "gltf",
            position: {
                x: 2,
                y: 0,
                z: 5
            }
        },
        {
            id: "fox_01",
            url: "/models/Fox/glTF/Fox.gltf",
            type: "gltf",
            position: {
                x: -10,
                y: 0,
                z: 5
            },
            scale:{
                x: 0.025,
                y: 0.025,
                z: 0.025
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
    threeGlobal.updateMixerList(delta);
    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
