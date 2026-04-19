uniform mat4 projectionMatrix; // 投影矩阵：
uniform mat4 viewMatrix; // 视图矩阵：相机的属性
uniform mat4 modelMatrix; // 模型矩阵：模型的位置，缩放等属性
uniform float uTime;


attribute vec3 position;
attribute vec2 uv;

varying vec2 fUv;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.z += sin(modelPosition.x * 2.0 + uTime) * 0.2;
    modelPosition.z += sin(modelPosition.y * 2.0 + uTime) * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectPosition = projectionMatrix * viewPosition;

    gl_Position = projectPosition;
    fUv = uv;
}