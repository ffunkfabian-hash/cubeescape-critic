// Pages: the helmet (index.html), the robot reconstructed from video frames (robot.html) and the procedural robot
// built from the model sheet (robot_parts.html).
import { defineConfig } from 'vite';

export default defineConfig({
  build: { target: 'es2022', rollupOptions: { input: { helmet: 'index.html', robot: 'robot.html', robotParts: 'robot_parts.html' } } },
});
