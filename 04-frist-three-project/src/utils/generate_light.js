export class GenerateLight {
    THREE = null;
    lightTypes = {
        // 环境光
        ambient: {
            params: ["color", "intensity"], // 颜色，光照强度
            createFn: "AmbientLight",
        },
        // 平行光
        directional: {
            params: ["color", "intensity"],
            createFn: "DirectionalLight",
        },
        // 半球光,放置在场景上面，光照颜色从天空光线颜色到地面光线颜色的渐变
        hemisphereLight: {
            params: ["skyColor", "groundColor", "intensity"], // 天空光线颜色，地面光线颜色，光照强度
            createFn: "HemisphereLight",
        },
        // 点光源
        point: {
            params: ["color", "intensity", "distance", "decay"], // 颜色，光照强度，照射最大距离，衰退量
            createFn: "PointLight",
        },
        // 平面光，从一个矩形上均匀的发光，可以模拟灯条
        reatArea: {
            params: ["color", "intensity", "width", "height"], // 颜色，光照强度，光照宽度，光照高度
            createFn: "RectAreaLight",
        },
        // 聚光灯
        spot: {
            params: [
                "color",
                "intensity",
                "distance",
                "angle",
                "penumbra",
                "decay",
            ], // 颜色，光照强度，照射最大距离，照射范围，半影衰减比例，衰退量
            createFn: "SpotLight",
        },
    };
    constructor(THREE, GUI) {
        this.THREE = THREE;
    }

    generate(type, params) {
        const currentLight = this.lightTypes[type];
        const lightConstructor = this.THREE[currentLight.createFn];
        const currentParams = currentLight.params.map((item) =>
            typeof params[item] === "number" ? params[item] : undefined,
        );

        return new lightConstructor(...currentParams);
    }
}
