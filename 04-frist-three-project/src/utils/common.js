import { GUI } from "dat.gui";
import * as THREE from 'three';

export function generateGui(name = "light", params) {
    const gui = new GUI();
    const folder = gui.addFolder(name);
    params.forEach(
        ({
            target,
            targetParam,
            options,
            optionsCallback,
            name,
            range,
            step,
        }) => {
            if (range) {
                return folder
                    .add(target, targetParam, range[0], range[1])
                    .name(name)
                    .step(step);
            }
            if (options) {
                return folder
                    .add(target, targetParam, options)
                    .name(name)
                    .onChange(optionsCallback);
            }
            if (targetParam === "color") {
                return folder
                    .addColor(target, targetParam)
                    .name(name)
                    .onChange(optionsCallback);
            }
            return folder.add(target, targetParam).name(name);
        },
    );
    folder.open();
}

export function createRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return renderer;
}

export function renderResize(canvas, camera, renderer) {
    window.addEventListener("resize", (event) => {
        canvas.width = event.target.innerWidth;
        canvas.height = event.target.innerHeight;

        camera.aspect = canvas.width / canvas.height;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.width, canvas.height);
    });
}