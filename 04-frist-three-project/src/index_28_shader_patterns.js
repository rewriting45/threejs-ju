import * as THREE from 'three';
import {GenerateObject} from '@/utils/generate_object';
import {GUI} from 'dat.gui';
import vertexShader from "@/shaders/28-shader-patterns/vertex.glsl";
import fragmentShader from "@/shaders/28-shader-patterns/fragment.glsl";
import fragment01Shader from "@/shaders/28-shader-patterns/fragment01.glsl";
import fragment02Shader from "@/shaders/28-shader-patterns/fragment02.glsl";
import fragment03Shader from "@/shaders/28-shader-patterns/fragment03.glsl";
import fragment04Shader from "@/shaders/28-shader-patterns/fragment04.glsl";
import fragment05Shader from "@/shaders/28-shader-patterns/fragment05.glsl";
import fragment06Shader from "@/shaders/28-shader-patterns/fragment06.glsl";
import fragment07Shader from "@/shaders/28-shader-patterns/fragment07.glsl";

const gui = new GUI();

const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/flag/ChineseFlag.png");

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
            position: [0, 0, 30]
        }
    ],
    lights: [
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
                width: 5,
                height: 5,
                widthSegments: 64,
                heightSegments: 64
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
    controls: true,
    axesHelper: true
});

const geometry_plane_01 = threeGlobal.getAllGeometry("geometry_plane_01");

const materialCount = new Float32Array(geometry_plane_01.attributes.position.count);

for (let i = 0; i < materialCount.length; i++) {
    materialCount[i] = Math.random() - 0.5;
}

geometry_plane_01.setAttribute("aRandom", new THREE.BufferAttribute(materialCount, 1));

const shaderMaterial = threeGlobal.generateMaterial({
    id: "shader",
    type: "shader",
    config: {
        vertexShader, // 顶点着色器
        fragmentShader, // 片元着色器
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0,
            },
            fTexture: {
                value: flagTexture
            }
        }
    }
});

threeGlobal.generateMaterial({
    id: "shader_01",
    type: "shader",
    config: {
        vertexShader, // 顶点着色器
        fragmentShader: fragment01Shader, // 片元着色器
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0,
            },
            fTexture: {
                value: flagTexture
            }
        }
    }
});

threeGlobal.generateMaterial({
    id: "shader_02",
    type: "shader",
    config: {
        vertexShader, // 顶点着色器
        fragmentShader: fragment02Shader, // 片元着色器
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0,
            },
            fTexture: {
                value: flagTexture
            }
        }
    }
});
threeGlobal.generateMaterial({
    id: "shader_03",
    type: "shader",
    config: {
        vertexShader, // 顶点着色器
        fragmentShader: fragment03Shader, // 片元着色器
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0,
            },
            fTexture: {
                value: flagTexture
            }
        }
    }
});
threeGlobal.generateMaterial({
    id: "shader_04",
    type: "shader",
    config: {
        vertexShader, // 顶点着色器
        fragmentShader: fragment04Shader, // 片元着色器
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0,
            },
            fTexture: {
                value: flagTexture
            }
        }
    }
});
threeGlobal.generateMaterial({
    id: "shader_05",
    type: "shader",
    config: {
        vertexShader, // 顶点着色器
        fragmentShader: fragment05Shader, // 片元着色器
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0,
            },
            fTexture: {
                value: flagTexture
            }
        }
    }
});
threeGlobal.generateMaterial({
    id: "shader_06",
    type: "shader",
    config: {
        vertexShader, // 顶点着色器
        fragmentShader: fragment06Shader, // 片元着色器
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0,
            },
            fTexture: {
                value: flagTexture
            }
        }
    }
});
const shader_07 = threeGlobal.generateMaterial({
    id: "shader_07",
    type: "shader",
    config: {
        vertexShader, // 顶点着色器
        fragmentShader: fragment07Shader, // 片元着色器
        side: THREE.DoubleSide,
        uniforms: {
            uStep: {
                value: 0.5,
            },
        }
    }
});

const mesh = threeGlobal.generateMesh({
    id: "meshes_00",
    params: {
        geometryId: "geometry_plane_01",
        materialId: "shader"
    },
});

const mesh_01 = threeGlobal.generateMesh({
    id: "meshes_01",
    params: {
        geometryId: "geometry_plane_01",
        materialId: "shader_01"
    },
});

const mesh_02 = threeGlobal.generateMesh({
    id: "meshes_02",
    params: {
        geometryId: "geometry_plane_01",
        materialId: "shader_02"
    },
});
const mesh_03 = threeGlobal.generateMesh({
    id: "meshes_03",
    params: {
        geometryId: "geometry_plane_01",
        materialId: "shader_03"
    },
});
const mesh_04 = threeGlobal.generateMesh({
    id: "meshes_04",
    params: {
        geometryId: "geometry_plane_01",
        materialId: "shader_04"
    },
});
const mesh_05 = threeGlobal.generateMesh({
    id: "meshes_05",
    params: {
        geometryId: "geometry_plane_01",
        materialId: "shader_05"
    },
});
const mesh_06 = threeGlobal.generateMesh({
    id: "meshes_06",
    params: {
        geometryId: "geometry_plane_01",
        materialId: "shader_06"
    },
});
const mesh_07 = threeGlobal.generateMesh({
    id: "meshes_07",
    params: {
        geometryId: "geometry_plane_01",
        materialId: "shader_07"
    },
});

mesh_01.position.x = -6;
mesh_02.position.x = -12;
mesh_03.position.x = -18;
mesh_04.position.x = -24;
mesh_05.position.x = -30;
mesh_06.position.x = -36;
mesh_07.position.x = -42;

threeGlobal.addMesh(mesh);
threeGlobal.addMesh(mesh_01);
threeGlobal.addMesh(mesh_02);
threeGlobal.addMesh(mesh_03);
threeGlobal.addMesh(mesh_04);
threeGlobal.addMesh(mesh_05);
threeGlobal.addMesh(mesh_06);
threeGlobal.addMesh(mesh_07);

gui.add(mesh_07.material.uniforms.uStep, "value").min(0.1).max(1.0).step(0.1).name("shader07");

const clock = new THREE.Clock();
function animation() {
    const elapsedTime = clock.getElapsedTime();

    mesh.material.uniforms.uTime.value = elapsedTime;

    threeGlobal.update();
    requestAnimationFrame(animation);
}

animation();
