varying vec2 fUv;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    fUv = uv;
}