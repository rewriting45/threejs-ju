import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';

const canvas = document.querySelector('canvas');

// texture
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/haunted-house/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/haunted-house/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load("/haunted-house/door/ambientOcclusion.jpg");
const doorHeightTexture = textureLoader.load("/haunted-house/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/haunted-house/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("/haunted-house/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/haunted-house/door/roughness.jpg");

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
            position: [5, 5, 5]
        }
    ],
    lights: [
        {
            id: "light_directional_01",
            type: 'directional',
            params: {
                color: 0xb9d5ff,
                intensity: 0.12,
            },
            position: [4, 5, -2],
        },
        {
            id: "light_ambient_01",
            type: 'ambient',
            params: {
                color: 0xb9d5ff,
                intensity: 0.12,
            },
            position: [10, -10, 10],
        },
        {
            id: "light_door_01",
            type: 'point',
            params: {
                color: 0xff7d46,
                intensity: 1,
                distance: 7
            },
            position: [0, 2.2, 2.7],
        },
        {
            id: "light_ghost_01",
            type: 'point',
            params: {
                color: 0xff00ff,
                intensity: 2,
                distance: 3
            },
            position: [0, 2.2, 2.7],
        },
        {
            id: "light_ghost_02",
            type: 'point',
            params: {
                color: 0x00ffff,
                intensity: 2,
                distance: 3
            },
            position: [0, 2.2, 2.7],
        },
        {
            id: "light_ghost_03",
            type: 'point',
            params: {
                color: 0xffff00,
                intensity: 2,
                distance: 3
            },
            position: [0, 2.2, 2.7],
        },
    ],
    meshes: [
        {
            id: "floor",
            params: {
                geometryId: "geometry_plane_01",
                materialId: "material_floor_01"
            },
            position: [0, 0, 0],
            rotation: [-Math.PI / 2, 0, 0]
        },
        {
            id: "walls",
            params: {
                geometryId: "geometry_walls",
                materialId: "material_walls_01",

            },
            position: [0, 1.26, 0],
            rotation: [0, 0, 0]
        },
        {
            id: "roof",
            params: {
                geometryId: "geometry_roof",
                materialId: "material_roof_01",

            },
            position: [0, 3, 0],
            rotation: [0, Math.PI / 4, 0]
        },
        {
            id: "door",
            params: {
                geometryId: "geometry_door",
                materialId: "material_door_01",
            },
            position: [0, 1, 2.01],
            rotation: [Math.PI, 0, 0]
        },
        {
            id: "bush1",
            params: {
                geometryId: "geometry_bush",
                materialId: "material_bush_01",
            },
            position: [0.8, 0.2, 2.2],
            scale: [0.5, 0.5, 0.5]
        },
        {
            id: "bush2",
            params: {
                geometryId: "geometry_bush",
                materialId: "material_bush_01",
            },
            position: [1.4, 0.1, 2.1],
            scale: [0.25, 0.25, 0.25]
        },
        {
            id: "bush3",
            params: {
                geometryId: "geometry_bush",
                materialId: "material_bush_01",
            },
            position: [-0.8, 0.1, 2.2],
            scale: [0.4, 0.4, 0.4]
        },
        {
            id: "bush3",
            params: {
                geometryId: "geometry_bush",
                materialId: "material_bush_01",
            },
            position: [-1, 0.05, 2.6],
            scale: [0.15, 0.15, 0.15]
        },
        {
            id: "grave",
            params: {
                geometryId: "geometry_graves",
                materialId: "material_graves_01",
            },
            position: [4, 0.4, 4],
        }
    ],
    materials: [
        {
            id: 'material_standard_01',
            type: 'meshStandard',
            config: {roughness: 0.4}
        },
        {
            id: 'material_walls_01',
            type: 'meshStandard',
            config: {
                color: 0xac8e82
            }
        },
        {
            id: 'material_floor_01',
            type: 'meshStandard',
            config: {
                color: 0xa9c388,
                side: THREE.DoubleSide
            }
        },
        {
            id: 'material_roof_01',
            type: 'meshStandard',
            config: {
                color: 0xb35f45
            }
        },
        {
            id: 'material_door_01',
            type: 'meshStandard',
            config: {
                color: 0xaa7b7b,
                side: THREE.DoubleSide,
                map: doorColorTexture,
                alphaMap: doorAlphaTexture,
                transparent: true,
                aoMap: doorAmbientOcclusionTexture,
                displacementMap: doorHeightTexture,
                displacementScale: 0.1,
                normalMap: doorNormalTexture,
                metalnessMap: doorMetalnessTexture,
                roughnessMap: doorRoughnessTexture
            }
        },
        {
            id: 'material_bush_01',
            type: 'meshStandard',
            config: {
                color: 0x89c854,
                side: THREE.DoubleSide
            }
        },
        {
            id: 'material_graves_01',
            type: 'meshStandard',
            config: {
                color: 0xb2b6b1,
                side: THREE.DoubleSide
            }
        }
    ],
    geometries: [
        {
            id: 'geometry_plane_01',
            type: 'plane',
            config: {
                width: 20,
                height: 20,
            }
        },
        {
            id: 'geometry_walls',
            type: 'box',
            config: {
                width: 4,
                height: 2.5,
                depth: 4
            }
        },
        {
            id: 'geometry_roof',
            type: 'cone',
            config: {
                radius: 3.5,
                height: 1,
                radialSegments: 4
            }
        },
        {
            id: 'geometry_door',
            type: 'plane',
            config: {
                width: 2,
                height: 2,
            }
        },
        {
            id: 'geometry_bush',
            type: 'sphere',
            config: {
                radius: 1,
                widthSegments: 16,
                heightSegments: 16,
            }
        },
        {
            id: 'geometry_graves',
            type: 'box',
            config: {
                width: 0.6,
                height: 0.8,
                depth: 0.2
            }
        }
    ],
    fogs: [
        {
            id: "fog",
            type: "basic",
            config: {
                color: 0x262837,
                near: 1,
                far: 15
            }
        }
    ]
});

const scene = threeGlobal.getScene();

// Group
const house = new THREE.Group();
scene.add(house);

// Walls
const door = threeGlobal.getAllMesh("door");
const floor = threeGlobal.getAllMesh("floor");
const walls = threeGlobal.getAllMesh("walls");
const bush1 = threeGlobal.getAllMesh("bush1");
const bush2 = threeGlobal.getAllMesh("bush2");
const bush3 = threeGlobal.getAllMesh("bush3");
door.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))


// Graves
const graves = new THREE.Group();
const grave = threeGlobal.getAllMesh("grave");
grave.castShadow = true;
scene.add(graves);

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 6 + 4;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    
    const graveClone = threeGlobal.clone(grave);
    graveClone.castShadow = true;
    graveClone.position.x = x;
    graveClone.position.z = z;
    graveClone.rotation.y = (Math.random() - 0.5) * 0.4;
    graveClone.rotation.z = (Math.random() - 0.5) * 0.4;
    graves.add(graveClone);
}

// renderer

const renderer = threeGlobal.getRender();
renderer.setClearColor(0x262837);
renderer.shadowMap.enabled = true;

// ghosts
const ghost1 = threeGlobal.getAllLight("light_ghost_01");
const ghost2 = threeGlobal.getAllLight("light_ghost_02");
const ghost3 = threeGlobal.getAllLight("light_ghost_03");
const light_directional_01 = threeGlobal.getAllLight("light_directional_01");
const light_door_01 = threeGlobal.getAllLight("light_door_01");

light_directional_01.castShadow = true;
light_door_01.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;

floor.receiveShadow = true;
walls.receiveShadow = true;

const clock = new THREE.Clock();
function animation() {
    const elapsedTime = clock.getElapsedTime();

    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3);

    const ghost2Angle = -elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = -elapsedTime * 0.18;
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.y = Math.sin(elapsedTime * 0.5) + Math.sin(elapsedTime * 2.5);


    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
