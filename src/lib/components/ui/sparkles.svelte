<script lang="ts">
  import { cn } from '$lib/utils';
  import { onMount } from 'svelte';

  export let id: string;
  export let background: string = 'transparent';
  export let minSize: number = 0.6;
  export let maxSize: number = 1.4;
  export let particleDensity: number = 70;
  export let className: string = '';
  export let particleColor: string = '#FFFFFF';

  onMount(() => {
    const initParticles = async () => {
      try {
        // In a real implementation, you would initialize tsparticles here
        // This is a simplified version that creates a basic particle effect
        const container = document.getElementById(id);
        if (container) {
          // Create a canvas element
          const canvas = document.createElement('canvas');
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
          canvas.style.position = 'absolute';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          container.appendChild(canvas);

          // Create particles
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Calculate number of particles based on density and container size
          const area = container.clientWidth * container.clientHeight;
          const particleCount = Math.floor((area / 10000) * particleDensity);

          const particles = Array.from({ length: particleCount }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * (maxSize - minSize) + minSize,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.3
          }));

          // Animation loop
          function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
              // Update position
              particle.x += particle.speedX;
              particle.y += particle.speedY;

              // Wrap around edges
              if (particle.x < 0) particle.x = canvas.width;
              if (particle.x > canvas.width) particle.x = 0;
              if (particle.y < 0) particle.y = canvas.height;
              if (particle.y > canvas.height) particle.y = 0;

              // Draw particle
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fillStyle = `${particleColor}${Math.floor(particle.opacity * 255)
                .toString(16)
                .padStart(2, '0')}`;
              ctx.fill();
            });

            requestAnimationFrame(animate);
          }

          animate();
        }
      } catch (error) {
        console.error('Error initializing particles:', error);
      }
    };

    initParticles();
  });
</script>

<div {id} class={cn('h-full w-full', className)} style="background: {background};">
  <!-- Particles will be rendered here by the script -->
</div>
