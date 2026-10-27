// Two pages: the helmet (index.html) and the robot reconstructed from video frames (robot.html).
import { defineConfig } from 'vite';

export default defineConfig({
  build: { target: 'es2022', rollupOptions: { input: { helmet: 'index.html', robot: 'robot.html' } } },
});
