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
        // {
        //     id: "light_point_01",
        //     type: 'point',
        //     params: {
        //         color: 0xffffff,
        //         intensity: 100,
        //     },
        //     position: [10, 10, 10],
        // },
        // {
        //     id: "light_ambient_01",
        //     type: 'ambient',
        //     params: {
        //         color: 0xffffff,
        //         intensity: 1,
        //     },
        //     position: [10, -10, 10],
        // },
        // {
        //     id: "light_directional_01",
        //     type: 'directional',
        //     params: {
        //         color: 0xffffff,
        //         intensity: 1,
        //     },
        //     position: [10, -10, 10],
        // },
        // {
        //     id: "light_hemisphereLight_01",
        //     type: 'hemisphereLight',
        //     params: {
        //         skyColor: 0xffffff,
        //         groundColor: 0xff0000,
        //         intensity: 1,
        //     },
        //     position: [10, -10, 10],
        // },
        // {
        //     id: "light_rect_area_01",
        //     type: 'rectArea',
        //     params: {
        //         color: 0xffffff,
        //         width: 2,
        //         height: 2,
        //         intensity: 100,
        //     },
        //     position: [5, 10, 5],
        // },
        {
            id: "light_spot_01",
            type: 'spot',
            params: {
                color: 0x00ff00,
                intensity: 500,
                distance: 100,
                angle:0.5
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
            config: {roughness: 0.4, side: THREE.DoubleSide}
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

function animation() {
    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
