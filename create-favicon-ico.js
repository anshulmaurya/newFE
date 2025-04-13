import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate the favicon specifically for Safari
async function createSafariFavicon() {
  try {
    // Get the SVG buffer
    const svgPath = path.join(__dirname, 'client/public/favicon.svg');
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Create a PNG version at 32x32 pixels for favicon.ico
    // Use a colored background to increase visibility in Safari
    const pngBuffer = await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toBuffer();
    
    // Save to the public directory
    fs.writeFileSync(path.join(__dirname, 'client/public/favicon.ico'), pngBuffer);
    fs.writeFileSync(path.join(__dirname, 'client/public/apple-touch-icon.png'), pngBuffer);
    
    console.log('Created safari-compatible favicon.ico and apple-touch-icon.png');
  } catch (error) {
    console.error('Error creating Safari favicon:', error);
  }
}

createSafariFavicon();