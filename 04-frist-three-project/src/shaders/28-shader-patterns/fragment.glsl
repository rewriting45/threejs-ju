uniform int uCurrent;

varying vec2 fUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main()
{
    // mod 取余
    // step a < b ? 1 : 0
    vec4 color;
    if (uCurrent == 1) {
        color = vec4(fUv, 1.0, 1.0);
    } else if (uCurrent == 2) {
        color = vec4(fUv, 0.0, 1.0);
    } else if (uCurrent == 3) {
        color = vec4(fUv.x, fUv.x, fUv.x, 1.0);
    } else if (uCurrent == 4) {
        color = vec4(fUv.y, fUv.y, fUv.y, 1.0);
    } else if (uCurrent == 5) {
        float strength = 1.0 - fUv.y;
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 6) {
        float strength = fUv.y * 10.0;
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 7) {
        float strength = mod(fUv.y * 10.0, 1.0);
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 8) {
        float strength = mod(fUv.y * 10.0, 1.0);
        strength = step(0.5, strength);
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 9) {
        float strength = mod(fUv.y * 10.0, 1.0);
        strength = step(0.8, strength);
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 10) {
        float strength = mod(fUv.x * 10.0, 1.0);
        strength = step(0.8, strength);
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 11) {
        float strength = step(0.8, mod(fUv.x * 10.0, 1.0));
        strength += step(0.8, mod(fUv.y * 10.0, 1.0));
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 12) {
        float strength = step(0.8, mod(fUv.x * 10.0, 1.0));
        strength *= step(0.8, mod(fUv.y * 10.0, 1.0));
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 13) {
        float strength = step(0.4, mod(fUv.x * 10.0, 1.0));
        strength *= step(0.8, mod(fUv.y * 10.0, 1.0));
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 14) {
        float barX = step(0.4, mod(fUv.x * 10.0, 1.0));
        barX *= step(0.8, mod(fUv.y * 10.0, 1.0));
        float barY = step(0.4, mod(fUv.y * 10.0, 1.0));
        barY *= step(0.8, mod(fUv.x * 10.0, 1.0));
        float strength = barX + barY;
        color = vec4(strength, strength, strength, 1.0);
    }else if (uCurrent == 15) {
        float barX = step(0.4, mod(fUv.x * 10.0, 1.0));
        barX *= step(0.8, mod(fUv.y * 10.0 + 0.2, 1.0));
        float barY = step(0.4, mod(fUv.y * 10.0, 1.0));
        barY *= step(0.8, mod(fUv.x * 10.0+ 0.2, 1.0));
        float strength = barX + barY;
        color = vec4(strength, strength, strength, 1.0);
    }else if (uCurrent == 16) {
        float strength = abs(fUv.x - 0.5);
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 17) {
        float strength = min(abs(fUv.x - 0.5), abs(fUv.y - 0.5));
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 18) {
        float strength = max(abs(fUv.x - 0.5), abs(fUv.y - 0.5));
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 19) {
        float strength = step(0.2, max(abs(fUv.x - 0.5), abs(fUv.y - 0.5)));
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 20) {
        float square1 = step(0.2, max(abs(fUv.x - 0.5), abs(fUv.y - 0.5)));
        float square2 = 1.0 - step(0.25, max(abs(fUv.x - 0.5), abs(fUv.y - 0.5)));
        float strength = square1 * square2;
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 21) {
        float strength = floor(fUv.x * 10.0) / 10.0 * floor(fUv.y * 10.0) / 10.0;
        color = vec4(strength, strength, strength, 1.0);
    } else if (uCurrent == 22) {
        float strength = random(fUv);
        color = vec4(strength, strength, strength, 1.0);
    }

    gl_FragColor = color;
}