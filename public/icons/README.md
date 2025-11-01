# PWA Icons

This directory should contain the PWA app icons in various sizes.

## Required Icons

The following icon sizes are needed for the PWA manifest:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## How to Generate Icons

### Option 1: Using an Online Tool

1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload a source image (recommended: 512x512px PNG with transparent background)
3. Generate all required sizes
4. Download and place them in this directory

### Option 2: Using ImageMagick (Command Line)

If you have a source image called `icon-source.png`:

```bash
# Install ImageMagick first
# On macOS: brew install imagemagick
# On Ubuntu: sudo apt-get install imagemagick

# Generate all sizes
convert icon-source.png -resize 72x72 icon-72x72.png
convert icon-source.png -resize 96x96 icon-96x96.png
convert icon-source.png -resize 128x128 icon-128x128.png
convert icon-source.png -resize 144x144 icon-144x144.png
convert icon-source.png -resize 152x152 icon-152x152.png
convert icon-source.png -resize 192x192 icon-192x192.png
convert icon-source.png -resize 384x384 icon-384x384.png
convert icon-source.png -resize 512x512 icon-512x512.png
```

### Option 3: Using a Script

Create a Node.js script with the `sharp` library:

```bash
npm install sharp
```

```javascript
const sharp = require('sharp');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  sharp('icon-source.png')
    .resize(size, size)
    .toFile(`icon-${size}x${size}.png`)
    .then(() => console.log(`Generated icon-${size}x${size}.png`))
    .catch(err => console.error(err));
});
```

## Icon Design Guidelines

1. **Size**: Start with a 512x512px canvas
2. **Format**: PNG with transparency
3. **Safe Area**: Keep important content within 80% of the canvas (avoid edges)
4. **Background**: Can be transparent or use your brand color
5. **Subject**: Should be clear and recognizable at small sizes
6. **Colors**: Use your brand colors consistently

## Recommended Icon Content

For the Cricket Club Platform, consider:
- A cricket ball icon
- Stadium/cricket field icon
- Camera/streaming icon
- Combination of cricket + streaming elements

## Temporary Placeholder

Until you create proper icons, you can use a temporary colored square:

```bash
# Create a simple red square as placeholder (requires ImageMagick)
for size in 72 96 128 144 152 192 384 512; do
  convert -size ${size}x${size} xc:#dc2626 icon-${size}x${size}.png
done
```

## Testing

After adding icons:
1. Build the app: `npm run build`
2. Test on mobile device
3. Try "Add to Home Screen"
4. Verify icon appears correctly
