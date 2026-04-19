varying vec2 fUv;

void main()
{
    float strength = mod(fUv.y * 10.0, 1.0);
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}