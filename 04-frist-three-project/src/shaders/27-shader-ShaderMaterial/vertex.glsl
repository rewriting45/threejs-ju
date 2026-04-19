uniform float uTime;

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