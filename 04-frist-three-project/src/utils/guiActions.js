export function guiTextureAction(
  gui,
  texture,
  { wrapping, magFilter, minFilter },
) {
  const textureFolder = gui.addFolder("texture");
  textureFolder.add(texture.repeat, "x", 0, 5).name("重复-x方向");
  textureFolder.add(texture.repeat, "y", 0, 5).name("重复-y方向");
  textureFolder.add(texture.offset, "x", 0, 1).name("偏移量-x方向");
  textureFolder.add(texture.offset, "y", 0, 1).name("偏移量-y方向");
  textureFolder.add(texture, "rotation", 0, Math.PI).name("旋转");
  // region set texture center
  textureFolder.add(texture.center, "x", 0, 1).name("中心点x").step(0.5);
  textureFolder.add(texture.center, "y", 0, 1).name("中心点y").step(0.5);
  // endregion
  // region 包裹模式
  textureFolder
    .add(texture, "wrapS", wrapping)
    .name("水平包裹")
    .onChange(() => {
      texture.needsUpdate = true;
    });
  textureFolder
    .add(texture, "wrapT", wrapping)
    .name("垂直包裹")
    .onChange(() => {
      texture.needsUpdate = true;
    });
  // endregion
  // region 过滤模式
  textureFolder
    .add(texture, "magFilter", magFilter)
    .name("放大过滤")
    .onChange(() => {
      texture.needsUpdate = true;
    });

  textureFolder
    .add(texture, "minFilter", minFilter)
    .name("缩小过滤")
    .onChange(() => {
      texture.needsUpdate = true;
    });
  // endregion
  textureFolder.add(texture, "generateMipmaps").name("MIP映射");
  textureFolder.open();
}

export function guiAction(gui, mesh, camera) {
  const cubeFolder = gui.addFolder("cube");
  cubeFolder.add(mesh.rotation, "x", 0, Math.PI * 2).step(Math.PI / 16);
  cubeFolder.add(mesh.rotation, "y", 0, Math.PI * 2).step(Math.PI / 16);
  cubeFolder.add(mesh.rotation, "z", 0, Math.PI * 2).step(Math.PI / 16);
  cubeFolder.open();

  const cameraFolder = gui.addFolder("camera");
  cameraFolder.add(camera.position, "z", 0, 10);
  cameraFolder.open();

  const debugParams = {
    color: "#ff0000",
    spin: () => {
      gsap.to(mesh.rotation, {
        duration: 1,
        y: mesh.rotation.y + Math.PI * 2,
      });
    },
  };

  const materialFolder = gui.addFolder("material");
  materialFolder.add(mesh.material, "wireframe");
  materialFolder.addColor(debugParams, "color").onChange(() => {
    material.color.set(debugParams.color);
  });
  materialFolder.open();
  const animationFolder = gui.addFolder("animation");
  animationFolder.add(debugParams, "spin");
  animationFolder.open();
}
