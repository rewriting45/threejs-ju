## 怎么在three.js中使用shader
```javascript
// 1. 需要更换材质为 RawShaderMaterial

// 2. vertexShader, // 顶点着色器 fragmentShader, // 片元着色器

// 顶点着色器
const vertexShader = `
uniform mat4 projectionMatrix; // 投影矩阵
uniform mat4 viewMatrix; // 视图矩阵：相机的属性
uniform mat4 modelMatrix; // 模型矩阵：模型的位置，缩放等属性

attribute vec3 position; // 顶点数据

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
` 
// 片元着色器
const fragmentShader = `
precision mediump float;

void main() {
    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
}
`
```

## 怎么给shader中传入自定义属性
```javascript
// 1. 获取 geometry

const materialCount = new Float32Array(geometry_plane_01.attributes.position.count);

for (let i = 0; i < materialCount.length; i++) {
    materialCount[i] = Math.random() - 0.5;
}

// 2. 设置 geometry 的属性
geometry_plane_01.setAttribute("aRandom", new THREE.BufferAttribute(materialCount, 1));

// 3. 在 vertexShader 中获取
const vertexShader = `
其他代码看上面看标题1
attribute float aRandom; // 这里的类型一定要与传入的数据类型一致
varying float fRandom;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.z += sin(modelPosition.x + aRandom); // 要改的是模型的顶点位置
    modelPosition.z += sin(modelPosition.y + aRandom);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectPosition = projectionMatrix * viewPosition;

    gl_Position = projectPosition;
    fRandom = aRandom;
}
`

// 片元着色器
const fragmentShader = `
precision mediump float;
varying float fRandom;

void main() {
    gl_FragColor = vec4(1.0, fRandom, 1.0, 1.0);
}
`

// 4. 传入 uniforms
const material = new RawShaderMaterial({
  vertexShader, // 顶点着色器
  fragmentShader, // 片元着色器
  side: THREE.DoubleSide,
  uniforms: { // 在创建的时候传入
      uTime: {
          value: 0.0,
      }
  }
});

// 5. vartexShader 中接收
`
uniform float uTime;

void main(){
    modelPosition.z += sin(modelPosition.x + aRandom + uTime); // 要改的是模型的顶点位置
    modelPosition.z += sin(modelPosition.y + aRandom + uTime);
}
`

// 6. 实时更新
mesh.material.uniforms.uTime.value = elapsedTime;
```

## 怎么传入纹理贴图
```javascript
// 1. 在材质中传入texture
const material = new RawShaderMaterial({
  vertexShader, // 顶点着色器
  fragmentShader, // 片元着色器
  side: THREE.DoubleSide,
  uniforms: { // 在创建的时候传入
    uTime: {
      value: 0.0,
    },
    fTexture: {
      value: flagTexture
    }
  }
});

// 2. 把 uv 信息传递给 fragmentShader
const vertexShader = `
  attribute vec2 uv;

  varying vec2 fUv;

  void main() {

    /**其他代码如上**/
    fUv = uv;
}
`

// 3. fragmentShader 中更新
const fragmentShader = `
precision mediump float;

varying vec2 fUv;
uniform sampler2D fTexture;

void main() {
    vec4 textureColor = texture2D(fTexture, fUv);
    gl_FragColor = textureColor;
}`
```

