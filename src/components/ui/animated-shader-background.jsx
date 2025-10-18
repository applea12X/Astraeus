import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AnimatedShaderBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        #define NUM_OCTAVES 3

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);

          float res = mix(
            mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
            mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
          return res * res;
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.3;
          vec2 shift = vec2(100);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.4;
          }
          return v;
        }

        // Star field
        float star(vec2 uv, float flicker) {
          float d = length(uv);
          float brightness = 0.002 / d;
          brightness *= sin(flicker * 3.0 + length(uv) * 50.0) * 0.5 + 0.5;
          brightness = smoothstep(0.0, 0.2, brightness);
          return brightness;
        }

        void main() {
          vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
          vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
          vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
          vec2 v;
          vec4 o = vec4(0.0);

          float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

          // Enhanced for shooting stars effect
          for (float i = 0.0; i < 35.0; i++) {
            // Make lines move faster horizontally (shooting stars)
            v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 5.0 + i) * 0.015, cos(iTime * 1.5 - i) * 0.003);
            
            float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
            
            // White shooting stars with subtle brightness variation
            float brightness = 0.9 + 0.1 * sin(i * 0.5 + iTime * 0.3);
            vec4 auroraColors = vec4(brightness, brightness, brightness, 1.0);
            
            vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.05, v.y * 1.5)));
            float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 1.2;
            o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
          }

          // Add star field
          vec2 starUV = uv * 2.0;
          for (float i = 0.0; i < 50.0; i++) {
            vec2 offset = vec2(
              sin(i * 123.45) * 5.0,
              cos(i * 234.56) * 5.0
            );
            vec2 starPos = starUV - offset;
            float s = star(starPos, iTime + i);
            o += vec4(s * 0.8, s * 0.85, s, 0.0) * 0.3;
          }

          // Deep space background gradient
          vec2 centerDist = uv;
          float vignette = 1.0 - length(centerDist) * 0.3;
          vec4 spaceColor = vec4(0.01, 0.01, 0.05, 1.0) * vignette;

          o = tanh(pow(o / 100.0, vec4(1.6)));
          gl_FragColor = o * 1.2 + spaceColor;
        }
      `
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId;
    const animate = () => {
      material.uniforms.iTime.value += 0.016;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
};

export default AnimatedShaderBackground;
