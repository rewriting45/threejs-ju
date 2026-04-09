import CANNON from "cannon";

export class GeneratePhysics {
    world = null;
    types = {
        box: {
            params: ["halfExtents"],
            createFn: "Box",
            bodyParams: ["mass", "position"]
        },
        sphere: {
            params: ["radius"],
            createFn: "Sphere",
            bodyParams: ["mass", "position"]
        },
        plane: {
            params: [],
            createFn: "Plane",
            bodyParams: ["mass", "position", "quaternion"]
        }
    }

    constructor({gravity = [0, -9.82, 0], friction = 0.1, restitution = 0.7}) {
        this.world = new CANNON.World();
        this.world.gravity.set(...gravity);
        this.addDefaultMaterial({
            friction, restitution
        });
    }

    getWorld() {
        return this.world;
    }

    worldStep(delta, dt = 1 / 60, maxSubSteps = 3) {
        this.world.step(dt, delta, maxSubSteps);
    }

    addDefaultMaterial({type = "default", friction, restitution}) {
        const defaultMaterial = new CANNON.Material(type);
        const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
            friction: 0.1,
            restitution: 0.7
        });
        this.world.defaultContactMaterial = defaultContactMaterial;
        this.world.addContactMaterial(defaultContactMaterial);
    }

    generateMesh(type, config) {
        const {params, createFn, bodyParams} = this.types[type];
        const paramsValues = params.forEach(item => {
            return config[item];
        });
        const bodyParamsValues = bodyParams.reduce((prev, next) => {
            if (next === "position") {
                prev[next] = new CANNON.Vec3(...config[next]);
            } else {
                prev[next] = config[next];
            }

            return prev;
        }, {})
        bodyParamsValues.shape = new CANNON[createFn](paramsValues);
        return this.generateBody(bodyParamsValues);
    }

    generateBody(params) {
        const body = new CANNON.Body(params);
        this.addBody(body);
        return body;
    }

    addBody(body) {
        this.world.addBody(body);
    }
}