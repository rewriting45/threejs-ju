export class GenerateGeometry {
  THREE = null;
  geometryTypes = {
    box: {
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
    circle: {
      params: ["radius", "segments", "thetaStart", "thetaLength"],
      createFn: "CircleGeometry",
    },
    cone: {
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
    cylinder: {
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
    dodecahedron: {
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
  };

  constructor(THREE) {
    this.THREE = THREE;
  }

  createGeometry(type, params) {
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
