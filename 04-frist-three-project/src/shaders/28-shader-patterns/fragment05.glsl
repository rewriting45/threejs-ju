varying vec2 fUv;

void main()
{
    float strength = fUv.y * 10.0;
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}