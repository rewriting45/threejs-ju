varying vec2 fUv;

void main()
{
    gl_FragColor = vec4(fUv.y, fUv.y, fUv.y, 1.0);
}