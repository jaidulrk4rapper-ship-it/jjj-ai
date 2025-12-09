const fs = require('fs');
const path = require('path');

// Check if sharp is available, if not, provide instructions
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Error: sharp package is not installed.');
  console.log('Please install it by running: npm install sharp');
  console.log('\nAlternatively, you can use an online SVG to PNG converter:');
  console.log('1. Open public/logo.svg in a browser');
  console.log('2. Use an online tool like https://svgtopng.com/');
  console.log('3. Export as 1024x1024 for logo.png and 512x512 for favicon.png');
  process.exit(1);
}

async function generateLogos() {
  const svgPath = path.join(__dirname, '../public/logo.svg');
  const logoPath = path.join(__dirname, '../public/logo.png');
  const faviconPath = path.join(__dirname, '../public/favicon.png');

  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(svgPath);

    // Generate 1024x1024 logo.png
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile(logoPath);
    console.log('✅ Generated logo.png (1024x1024)');

    // Generate 512x512 favicon.png
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(faviconPath);
    console.log('✅ Generated favicon.png (512x512)');

    console.log('\n🎉 Logo generation complete!');
  } catch (error) {
    console.error('Error generating logos:', error.message);
    process.exit(1);
  }
}

generateLogos();

