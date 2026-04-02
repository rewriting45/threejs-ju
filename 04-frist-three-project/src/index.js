import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';

const canvas = document.querySelector('canvas');
const threeGlobal = new GenerateObject(THREE, canvas, {
    cameras: [
        {
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
            type: 'point',
            params: {
                color: 0xffffff,
                intensity: 100,
            },
            position: [10, 10, 10],
        }
    ],
    meshs: [
        {
            params: {
                geometryIndex: 0,
                materialIndex: 0
            },
            position: [0, 0, 0],
            rotation: [0, 0, 0]
        },
        {
            params: {
                geometryIndex: 1,
                materialIndex: 0
            },
            position: [0, -3, 0],
            rotation: [-Math.PI / 2, 0, 0]
        },
        {
            params: {
                geometryIndex: 2,
                materialIndex: 0
            },
            position: [-5, 0, 0],
            rotation: [0, 0, 0]
        },
        {
            params: {
                geometryIndex: 3,
                materialIndex: 0
            },
            position: [5, 0, 0],
            rotation: [0, 0, 0]
        }
    ],
    materials: [
        {
            type: 'meshStandard',
            config: {roughness: 0.4}
        }
    ],
    geometrys: [
        {
            type: 'box',
            config: {
                width: 3,
                height: 3,
                depth: 3
            }
        },
        {
            type: 'plane',
            config: {
                width: 100,
                height: 100,
            }
        },
        {
            type: 'torus',
            config: {
                radius: 1,
                tube: 0.5,
            }
        },
        {
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
