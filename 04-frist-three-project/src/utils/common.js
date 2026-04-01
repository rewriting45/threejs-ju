import { GUI } from "dat.gui";

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
            console.log(
                target,
                targetParam,
                options,
                optionsCallback,
                name,
                range,
                step,
            );

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
