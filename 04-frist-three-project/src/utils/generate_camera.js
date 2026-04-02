export class GenerateCamera {
  THREE = null;
  cameraTypes = {
    cube: {
      params: ["near", "far", "renderTarget"],
      createFn: "CubeCamera",
    },
    orthographic: {
      params: ["left", "right", "top", "bottom", "near", "far"],
      createFn: "OrthographicCamera",
    },
    perspective: {
      params: ["fov", "aspect", "near", "far"],
      createFn: "PerspectiveCamera",
    },
  };
  constructor(THREE) {
    this.THREE = THREE;
  }

  generate(type, params) {
    const currentCamera = this.cameraTypes[type];
    const CameraConstructor = this.THREE[currentCamera.createFn];
    const currentParams = currentCamera.params.map((item) =>
      typeof params[item] === "number" ? params[item] : undefined,
    );

    return new CameraConstructor(...currentParams);
  }
}
