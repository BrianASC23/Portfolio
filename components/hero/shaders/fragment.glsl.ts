export const fragmentShader = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.2);

  float mixFactor = smoothstep(-0.2, 0.2, vDisplacement);
  vec3 base = mix(uColorA, uColorB, mixFactor);
  vec3 finalColor = mix(base, uColorC, fresnel);

  // Subtle scanline
  float scan = sin(vPosition.y * 60.0 + uTime * 0.8) * 0.04;
  finalColor += scan * uColorC;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;
