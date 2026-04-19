varying vec2 fUv;

void main()
{
    gl_FragColor = vec4(fUv.x, fUv.x, fUv.x, 1.0);
}