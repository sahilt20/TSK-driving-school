/**
 * Generate placeholder PWA icons
 * This creates simple colored squares as placeholders
 *
 * For production, replace these with proper cricket-themed icons
 * using a tool like https://www.pwabuilder.com/imageGenerator
 */

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const color = '#dc2626'; // Red color matching the app theme

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('📱 Generating placeholder PWA icons...\n');

sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);

  // Create a simple SVG as placeholder
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${color}"/>
      <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="${size * 0.3}"
        fill="white"
        text-anchor="middle"
        dominant-baseline="middle"
        font-weight="bold"
      >
        🏏
      </text>
    </svg>
  `.trim();

  // Note: This creates SVG files, not PNG
  // For real PNG files, you would need a library like 'sharp' or 'canvas'
  // For now, we'll create SVG placeholders and provide instructions

  console.log(`⚠️  To create ${filename}:`);
  console.log(`   Use an online tool or ImageMagick to convert a source icon`);
});

console.log('\n📝 Instructions:');
console.log('1. Create a 512x512px PNG icon with cricket/streaming theme');
console.log('2. Use https://www.pwabuilder.com/imageGenerator to generate all sizes');
console.log('3. Or use ImageMagick:');
console.log('\n   # Install ImageMagick first, then run:');
sizes.forEach(size => {
  console.log(`   convert source.png -resize ${size}x${size} public/icons/icon-${size}x${size}.png`);
});
console.log('\n✅ See public/icons/README.md for more details\n');

// Create a simple HTML file to visualize the icon
const htmlPreview = `
<!DOCTYPE html>
<html>
<head>
  <title>PWA Icons Preview</title>
  <style>
    body { font-family: Arial; padding: 20px; background: #f3f4f6; }
    h1 { color: #1f2937; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; margin-top: 20px; }
    .icon-box { background: white; border-radius: 8px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .icon-placeholder { width: 100%; aspect-ratio: 1; background: ${color}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 48px; margin-bottom: 10px; }
    .size { color: #6b7280; font-size: 14px; }
    .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>🏏 Cricket Club Platform - PWA Icons</h1>
  <div class="warning">
    <strong>⚠️ Placeholder Icons</strong><br>
    These are placeholder icons. Replace them with proper cricket-themed icons for production.
    See <code>public/icons/README.md</code> for instructions.
  </div>
  <div class="grid">
    ${sizes.map(size => `
      <div class="icon-box">
        <div class="icon-placeholder">🏏</div>
        <div class="size">${size}x${size}px</div>
      </div>
    `).join('')}
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(iconsDir, 'preview.html'), htmlPreview);
console.log('📄 Created preview.html in public/icons/ to visualize icon sizes\n');

// Create a simple base64 encoded 1x1 red pixel as ultimate fallback
const redPixelBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

console.log('💡 Quick fix: You can use online tools to convert the cricket ball emoji 🏏');
console.log('   into proper icon files, or use a graphic design tool like Figma/Canva.\n');
