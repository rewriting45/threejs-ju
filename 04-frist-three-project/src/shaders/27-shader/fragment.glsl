precision mediump float;

varying vec2 fUv;
uniform sampler2D fTexture;

void main() {
    vec4 textureColor = texture2D(fTexture, fUv);
    gl_FragColor = textureColor;
}