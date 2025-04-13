import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputSvg = path.join(__dirname, 'client/public/favicon.svg');
const outputDir = path.join(__dirname, 'client/public');

// Make sure we have access to the SVG file
if (!fs.existsSync(inputSvg)) {
  console.error('Input SVG file not found:', inputSvg);
  process.exit(1);
}

// Define the sizes for our favicons
const sizes = [16, 32, 48, 64, 96, 128, 192, 256];

// Generate PNGs for each size
async function generateFavicons() {
  try {
    console.log('Reading SVG from:', inputSvg);
    const svgBuffer = fs.readFileSync(inputSvg);
    
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `favicon-${size}.png`);
      console.log(`Generating ${size}x${size} favicon...`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`Created ${outputFile}`);
    }
    
    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();