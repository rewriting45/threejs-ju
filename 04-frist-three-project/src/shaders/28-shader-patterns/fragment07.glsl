uniform float uStep;

varying vec2 fUv;

void main()
{
    float strength = mod(fUv.y * 10.0, 1.0);
    strength = step(uStep, strength);
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}