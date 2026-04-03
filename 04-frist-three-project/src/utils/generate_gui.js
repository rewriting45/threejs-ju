import {GUI} from "dat.gui";
export class GenerateGui {
    gui = null;
    constructor(params) {
        this.gui = new GUI(params);
    }

    addFolder({name, config}) {
        const addFolder = this.gui.addFolder(name);
        this.add(addFolder, config);
    }

    add(addFolder,config) {
        config.forEach(({target, attr, range, step, isColor, color, colorCallback, isObject, name}) => {
            let debugParams = {
                color: 0xffffff
            }
            if (isColor) {
                addFolder.addColor(debugParams, 'color').onChange(colorCallback(debugParams.color));
            } else if (range) {
                addFolder.add(target, attr).min(range[0]).max(range[1]).step(step).name(name);
            } else {
                addFolder.add(target, attr).name(name);
            }
        })
    }

    destroy() {
        this.gui.destroy();
    }
}