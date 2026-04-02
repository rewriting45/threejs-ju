export class GenerateMesh {
  THREE = null;
  constructor(THREE) {
    this.THREE = THREE;
  }

  generate(geometry, material) {
    return new this.THREE.Mesh(geometry, material);
  }
}
