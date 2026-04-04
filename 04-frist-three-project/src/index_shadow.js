import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';
import {Clock} from 'three';

const textureLoader = new THREE.TextureLoader();
const backd = await textureLoader.loadAsync("/textures/bakedShadow.jpg");
const simple = await textureLoader.loadAsync("/textures/simpleShadow.jpg");

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
            position: [10, 10, -10],
        },
        {
            id: "light_directional_01",
            type: 'directional',
            params: {
                color: 0xffffff,
                intensity: 1,
            },
            position: [-10, 10, 10],
        },
        {
            id: "light_ambient_01",
            type: 'ambient',
            params: {
                color: 0xffffff,
                intensity: 1,
            },
            position: [10, 10, 10],
        },
        {
            id: "light_spot_01",
            type: 'spot',
            params: {
                color: 0x00ff00,
                intensity: 100,
                distance: 100,
                angle:0.5
            },
            position: [10, 10, 10],
        }
    ],
    meshes: [
        // {
        //     id: "meshes_01",
        //     params: {
        //         geometryId: "geometry_box_01",
        //         materialId: "material_standard_01"
        //     },
        //     position: [0, 0, 0],
        //     rotation: [0, 0, 0]
        // },
        {
            id: "meshes_02",
            params: {
                geometryId: "geometry_plane_01",
                materialId: "material_standard_01"
            },
            position: [0, 0, 0],
            rotation: [-Math.PI / 2, 0, 0]
        },
        // {
        //     id: "meshes_03",
        //     params: {
        //         geometryId: "geometry_torus_01",
        //         materialId: "material_standard_01"
        //     },
        //     position: [-5, 0, 0],
        //     rotation: [0, 0, 0]
        // },
        {
            id: "meshes_04",
            params: {
                geometryId: "geometry_sphere_01",
                materialId: "material_standard_01"
            },
            position: [5, 1.5, 0],
            rotation: [0, 0, 0]
        },
        {
            id: "meshes_05",
            params: {
                geometryId: "geometry_plane_02",
                materialId: "material_basic_02"
            },
            position: [5, 0.1, 0],
            rotation: [-Math.PI/2, 0, 0]
        }
    ],
    materials: [
        {
            id: 'material_standard_01',
            type: 'meshStandard',
            config: {roughness: 0.4, side: THREE.DoubleSide}
        },
        {
            id: 'material_basic_01',
            type: 'meshBasic',
            config: {
                map: backd
            }
        },
        {
            id: 'material_basic_02',
            type: 'meshBasic',
            config: {
                color: 0x000000,
                transparent: true,
                alphaMap: simple
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
            id: 'geometry_plane_02',
            type: 'plane',
            config: {
                width: 3,
                height: 3,
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

// region meshes
// const meshes_01 = threeGlobal.getAllMesh("meshes_01");
const meshes_02 = threeGlobal.getAllMesh("meshes_02");
// const meshes_03 = threeGlobal.getAllMesh("meshes_03");
const meshes_04 = threeGlobal.getAllMesh("meshes_04");
const meshes_05 = threeGlobal.getAllMesh("meshes_05");
// endregion

// region lights
// 平行光
const light_directional_01 = threeGlobal.getAllLight("light_directional_01");
// 聚光灯
const light_spot_01 = threeGlobal.getAllLight("light_spot_01");
const light_point_01 = threeGlobal.getAllLight("light_point_01");
// endregion

// region renderer
const renderer = threeGlobal.getRender();
// renderer.shadowMap.enabled = true; // 这个属性一定要开启，不然不会显示shadow
// endregion

const scene = threeGlobal.getScene();


// region mesh open shadow
// 启动光照投影
// meshes_01.castShadow = true;
// meshes_03.castShadow = true;
meshes_04.castShadow = true;
// 启动映射投影
meshes_02.receiveShadow = true;

console.log(meshes_02);
// endregion

// region directional actions
light_directional_01.castShadow = true;
//阴影分辨率
light_directional_01.shadow.mapSize.width = 1024;
light_directional_01.shadow.mapSize.height = 1024;
light_directional_01.shadow.camera.near = 1;
light_directional_01.shadow.camera.far = 30;
light_directional_01.shadow.radius = 10;
// endregion

// region spot actions
light_spot_01.castShadow = true;
light_spot_01.shadow.camera.near = 1;
light_spot_01.shadow.camera.far = 30;
// endregion

// region point actions
light_point_01.castShadow = true;
light_point_01.shadow.camera.near = 1;
light_point_01.shadow.camera.far = 30;
// endregion
// scene.add(
//     new THREE.CameraHelper(light_spot_01.shadow.camera),
//     new THREE.CameraHelper(light_point_01.shadow.camera),
//     new THREE.CameraHelper(light_directional_01.shadow.camera)
// );

const clock = new THREE.Clock();
function animation() {

    const elapsedTime = clock.getElapsedTime();

    meshes_04.position.x = Math.cos(elapsedTime) * 8;
    meshes_04.position.z = Math.sin(elapsedTime) * 10;
    meshes_04.position.y = Math.abs(Math.sin(elapsedTime * 10)) + 1.5;

    meshes_05.position.x = meshes_04.position.x;
    meshes_05.position.z = meshes_04.position.z;
    meshes_05.material.opacity = 2.5 - meshes_04.position.y;

    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
