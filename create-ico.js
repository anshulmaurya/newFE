import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createFavicon() {
  try {
    // Set transparent background, then draw SVG on top
    const svgBuffer = fs.readFileSync(path.join(__dirname, 'client/public/favicon.svg'));
    
    // Create transparent PNG with just the SVG content (no background)
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, 'client/public/favicon.png'));
      
    console.log('Created favicon.png successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

createFavicon();