export class GenerateGeometry {
  THREE = null;
  geometryTypes = {
    box: { // 立方体
      params: [
        "width",
        "height",
        "depth",
        "widthSegments",
        "heightSegments",
        "depthSegments",
      ],
      createFn: "BoxGeometry",
    },
    circle: { // 圆形
      params: ["radius", "segments", "thetaStart", "thetaLength"],
      createFn: "CircleGeometry",
    },
    cone: { // 圆锥
      params: [
        "radius",
        "height",
        "radialSegments",
        "heightSegments",
        "openEnded",
        "thetaStart",
        "thetaLength",
      ],
      createFn: "ConeGeometry",
    },
    cylinder: { // 圆柱
      params: [
        "radiusTop",
        "radiusBottom",
        "height",
        "radialSegments",
        "heightSegments",
        "openEnded",
        "thetaStart",
        "thetaLength",
      ],
      createFn: "CylinderGeometry",
    },
    dodecahedron: { // 十二面体
      params: ["radius", "detail"],
      createFn: "DodecahedronGeometry",
    },
    edges: {
      params: ["geometry", "thresholdAngle"],
      createFn: "EdgesGeometry",
    },
    tube: {
      params: ["path", "tubularSegments", "radius", "radialSegments", "closed"],
      createFn: "TubeGeometry",
    },
    torus: { // 环型
      params: ["radius", "tube", "radialSegments", "tubularSegments", "arc"],
      createFn: "TorusGeometry",
    },
    torusKnot: {
      params: ["radius", "tube", "tubularSegments", "radialSegments", "p", "q"],
      createFn: "TorusKnotGeometry",
    },
    sphere: { // 球体
      params: ["radius", "widthSegments", "heightSegments", "phiStart", "phiLength", "thetaStart", "thetaLength"],
      createFn: "SphereGeometry",
    },
    plane: { // 平面
      params: ["width", "height", "widthSegments", "heightSegments"],
      createFn: "PlaneGeometry",
    }
  };

  constructor(THREE) {
    this.THREE = THREE;
  }

  generate(type, params) {
    const currentGeometry = this.geometryTypes[type];

    if (!currentGeometry) {
      console.warn(`[GenerateGeometry]: Type "${type}" is not registered.`);
      return null;
    }

    // 检查 THREE 中是否存在对应的类
    const GeometryConstructor = this.THREE[currentGeometry.createFn];
    if (!GeometryConstructor) {
      console.error(
        `[GenerateGeometry]: ${currentGeometry.createFn} not found in THREE.`,
      );
      return null;
    }

    const currentParams = currentGeometry.params.map((item) =>
      typeof params[item] === "number" ? params[item] : undefined,
    );

    return new GeometryConstructor(...currentParams);
  }
}
