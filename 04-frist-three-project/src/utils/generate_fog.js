export class GenerateFog {
  THREE = null;
  fogTypes = {
    basic: {
      params: ["color", "near", "far"],
      createFn: "Fog",
    }
  };
  constructor(THREE) {
    this.THREE = THREE;
  }

  generate(type = 'basic', params) {
    const currentFog = this.fogTypes[type];
    const fogConstructor = this.THREE[currentFog.createFn];
    const currentParams = currentFog.params.map((item) =>
        typeof params[item] === "number" ? params[item] : undefined,
    );
    return new fogConstructor(...currentParams);
  }
}
