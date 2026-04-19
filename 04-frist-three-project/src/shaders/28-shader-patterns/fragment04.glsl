varying vec2 fUv;

void main()
{
    float strength = 1.0 - fUv.y;
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}