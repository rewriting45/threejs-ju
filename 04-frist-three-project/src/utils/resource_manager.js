import {GenerateMesh} from '@/utils/generate_mesh';
import {GenerateGeometry} from '@/utils/generate_geometry';
import {GenerateMaterial} from '@/utils/generate_material';
import {GenerateCamera} from '@/utils/generate_camera';
import {GenerateLight} from '@/utils/generate_light';
import {GenerateFog} from '@/utils/generate_fog';
import {DRACOLoader, GLTFLoader} from 'three/addons';
import * as THREE from 'three';

export class ResourceManager {


    meshFactory = null;
    geometryFactory = null;
    materialFactory = null;
    cameraFactory = null;
    lightFactory = null;
    fogFactory = null;

    materialList = new Map();
    geometryList = new Map();
    meshList = new Map();
    cameraList = new Map();
    lightList = new Map();
    fogList = new Map();

    constructor(THREE, scene, {
        cameras, models, materials, geometries, meshes, fogs, lights
    }) {
        this.meshFactory = new GenerateMesh(THREE);
        this.geometryFactory = new GenerateGeometry(THREE);
        this.materialFactory = new GenerateMaterial(THREE);
        this.cameraFactory = new GenerateCamera(THREE);
        this.lightFactory = new GenerateLight(THREE);
        this.fogFactory = new GenerateFog(THREE);

        cameras && this.generateCamera(cameras);
        models && this.generateModels(models);
        materials && this.generateMaterials(materials);
        geometries && this.generateGeometries(geometries);
        meshes && this.generateMeshes(meshes);
        fogs && this.generateFog(fogs);
        lights && this.generateLight(lights);
    }

    // region cameras
    generateCamera(cameras) {
        cameras.forEach(({id,type, params, position}, index) => {
            const camera = this.cameraFactory.generate(type, params);
            camera.position.set(...position);
            this.addCamera(camera);
            this.cameraList.set(id, camera)
            // 设置第一个camera为默认相机
            if (index === 0) {
                this.currentCamera = camera;
            }
        })
    }

    switchCamera(id) {
        const targetCamera = this.cameraList.get(id);
        if (targetCamera) {
            this.currentCamera = targetCamera;
            this.control.object = this.currentCamera;
            this.updateControls();
        }
        this.resizeRender(this.canvas);
    }

    addCamera(camera) {
        this.scene.add(camera);
        return this;
    }
    // endregion

    // region models
    generateModels(models) {
        models.forEach(model => {
            this.generateModelGltf(model);
        })
    }

    generateModelGltf({id, url, position, scale, type, animationIndex}) {
        const gltfLoader = new GLTFLoader();
        if (type === "draco") {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath("/draco/");
            gltfLoader.setDRACOLoader(dracoLoader);
        }
        gltfLoader.load(url, (gltf) => {
            if (gltf.animations.length > 0 && gltf.animations.length - 1 >= animationIndex) {
                const mixer = new THREE.AnimationMixer(gltf.scene);
                const action = mixer.clipAction(gltf.animations[animationIndex]);
                action.play();
                this.mixerList.set(id, mixer);
            }
            // 因为每移动一个mesh，他就会从之前的scene移除
            const group = new THREE.Group();
            while (gltf.scene.children.length > 0) {
                group.add(gltf.scene.children[0]);
            }
            position && group.position.copy(position);
            scale && group.scale.copy(scale);
            this.addMesh(group);
            this.meshList.set(id, group);
        }, () => {
            console.log("progress");
        }, (error) => {
            console.log("error", error);
        });
    }

    generateMeshes(meshes) {
        meshes.forEach((params) => {
            const mesh = this.generateMesh(params);
            this.addMesh(mesh);
        })
    }

    generateMesh({id, params:{geometryId, materialId, physicsId, geometry: geometryConfig, audioId}, position, rotation, scale}) {
        const geometry = geometryId ? this.geometryList.get(geometryId) : this.generateGeometry(geometryConfig);
        const mesh = this.meshFactory.generate(
            geometry,
            this.materialList.get(materialId)
        );
        position && mesh.position.set(...position);
        rotation && mesh.rotation.set(...rotation);
        scale && mesh.scale.set(...scale);
        this.meshList.set(id, mesh);

        if (physicsId) {
            const {type} = geometry.otherConfig;
            const config = {
                ...geometry.otherConfig,
                ...this.worldMeshList.get(physicsId),
                position,
                quaternion:mesh.quaternion,
            };
            if (type === "box") {
                config.halfExtents = [geometry.otherConfig.width * 0.5, geometry.otherConfig.height * 0.5, geometry.otherConfig.depth * 0.5]
            }
            const physics = this.worldFactory.generateMesh(type,config);
            physics.addEventListener("collide", (collision) => {
                const impactVelocityAlongNormal = collision.contact.getImpactVelocityAlongNormal();
                if (Math.abs(impactVelocityAlongNormal) > 10) {
                    audioId && this.playAudio(audioId);
                }
            })
            this.physicsList.set(id, physics);
        }
        return mesh;
    }

    addMesh(mesh) {
        this.scene.add(mesh);
        return this;
    }
    // endregion
}