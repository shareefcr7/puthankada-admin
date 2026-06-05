# Puthankada Logo Setup Instructions

## Logo Files Needed

To complete the logo setup, you need to replace these placeholder files with actual converted versions of your Puthankada logo:

### 1. Main Logo
- `/public/puthankada-logo.png` - Main logo for navbar/sidebar (recommended size: 200x200px)

### 2. Favicon Files
- `/public/favicon.ico` - ICO format for browser tab
- `/public/favicon.svg` - ✅ Already created (SVG version)
- `/public/favicon-16x16.png` - 16x16 PNG favicon
- `/public/favicon-32x32.png` - 32x32 PNG favicon

### 3. Apple Touch Icons  
- `/public/apple-touch-icon.png` - Replace existing (180x180px)
- `/public/apple-touch-icon-180x180.png` - Apple devices (180x180px)

### 4. Android Icons (for PWA)
- `/public/android-chrome-192x192.png` - Android (192x192px)  
- `/public/android-chrome-512x512.png` - Android (512x512px)

## Brand Colors Applied

✅ **Orange Primary**: `#f57c00` - Main brand color from logo
✅ **Green Secondary**: `#4caf50` - Secondary accent from logo  
✅ **Color Variables**: Added to globals.css for consistent theming

## Updated Components

✅ **Sidebar**: Updated with new logo and Puthankada branding
✅ **Login Page**: Updated with new logo and orange button color
✅ **Layout Metadata**: Updated title and favicon references
✅ **Global CSS**: Added Puthankada brand color variables and utilities

## CSS Classes Available

You can now use these brand-specific CSS classes:

```css
.text-puthankada-orange
.text-puthankada-green  
.bg-puthankada-orange
.bg-puthankada-green
.bg-puthankada-gradient
.btn-puthankada-primary
.btn-puthankada-secondary
.card-puthankada
```

## To Complete Setup:

1. Save your Puthankada logo image as `/public/puthankada-logo.png`
2. Convert the logo to various favicon formats and replace the placeholder files
3. Test the application to ensure all logos appear correctly
4. The color theme is already applied throughout the admin panel

## Tools for Favicon Generation

Use these online tools to convert your logo to favicon formats:
- https://favicon.io/
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/

Just upload your Puthankada logo and download all the generated files to replace the placeholders.