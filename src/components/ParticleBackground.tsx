
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import type { Container, Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

export const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      console.log(container);
    },
    []
  );

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        detectRetina: true,
        fpsLimit: 120,
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: {
              enable: true,
              mode: 'bubble'
            },
            resize: true
          },
          modes: {
            bubble: {
              color: "#9AA6B2",
              distance: 100,
              duration: 2,
              opacity: 1,
              size: 10,
              speed: 3
            }
          }
        },
        particles: {
          color: {
            value: "#9AA6B2"
          },
          links: {
            blink: false,
            color: "#BCCCDC",
            consent: false,
            distance: 200,
            enable: true,
            opacity: 0.8,
            width: 1
          },
          move: {
            attract: {
              enable: false,
              rotate: {
                x: 600,
                y: 1200
              }
            },
            bounce: false,
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: false,
            speed: 1,
            straight: false
          },
          number: {
            density: {
              enable: false,
              area: 2000
            },
            limit: 0,
            value: 300
          },
          opacity: {
            animation: {
              enable: true,
              minimumValue: 0.05,
              speed: 3,
              sync: false
            },
            random: false,
            value: 1
          },
          shape: {
            type: "circle"
          },
          size: {
            animation: {
              enable: false,
              minimumValue: 0.1,
              speed: 40,
              sync: false
            },
            random: true,
            value: 3
          }
        }
      }}
    />
  );
};
