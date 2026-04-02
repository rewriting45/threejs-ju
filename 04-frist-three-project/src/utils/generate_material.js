export class GenerateMaterial {
  THREE = null;
  materialTypes = {
    lineBasic: {
      createFn: "LineBasicMaterial",
    },
    lineDashed: {
      createFn: "LineDashedMaterial",
    },
    meshBasic: {
      createFn: "MeshBasicMaterial",
    },
    meshDepth: {
      createFn: "MeshDepthMaterial",
    },
    meshDistance: {
      createFn: "MeshDistanceMaterial",
    },
    meshLambert: {
      createFn: "MeshLambertMaterial",
    },
    meshMatcap: {
      createFn: "MeshMatcapMaterial",
    },
    meshNormal: {
      createFn: "MeshNormalMaterial",
    },
    meshPhong: {
      createFn: "MeshPhongMaterial",
    },
    meshPhysical: {
      createFn: "MeshPhysicalMaterial",
    },
    meshStandard: {
      createFn: "MeshStandardMaterial",
    },
    meshToon: {
      createFn: "MeshToonMaterial",
    },
    points: {
      createFn: "PointsMaterial",
    },
    rawShader: {
      createFn: "RawShaderMaterial",
    },
  };
  constructor(THREE) {
    this.THREE = THREE;
  }

  generate(type, params) {
    const currentMaterial = this.materialTypes[type];
    return new this.THREE[currentMaterial.createFn](params);
  }
}
