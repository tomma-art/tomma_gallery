#!/usr/bin/env node
/**
 * Image Optimizer - Convert images to WebP
 * 
 * Usage:
 *   node scripts/optimize.js              # optimize public/images/gallery/*
 *   node scripts/optimize.js --folder gallery   # optimize specific folder
 *   node scripts/optimize.js --all          # optimize all folders
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'images');
const DEFAULT_QUALITY = 80;
const MAX_WIDTH = 2000;

const args = process.argv.slice(2);
const folderArg = args.find(a => a.startsWith('--folder='))?.replace('--folder=', '');
const allArg = args.includes('--all');

function getFolders() {
  if (folderArg) {
    const folder = folderArg.replace('--folder=', '');
    const folderPath = path.join(PUBLIC_DIR, folder);
    if (fs.existsSync(folderPath)) {
      return [folder];
    }
    console.error(`Folder not found: ${folder}`);
    process.exit(1);
  }
  if (allArg) {
    return fs.readdirSync(PUBLIC_DIR).filter(f => 
      fs.statSync(path.join(PUBLIC_DIR, f)).isDirectory()
    );
  }
  // Default to gallery
  if (fs.existsSync(path.join(PUBLIC_DIR, 'gallery'))) {
    return ['gallery'];
  }
  console.log('No folder specified. Available folders:');
  const dirs = fs.readdirSync(PUBLIC_DIR).filter(f => 
    fs.statSync(path.join(PUBLIC_DIR, f)).isDirectory()
  );
  dirs.forEach(d => console.log(`  - ${d}`));
  console.log('\nUsage: node optimize.js --folder=gallery');
  process.exit(0);
}

async function optimizeFolder(folder) {
  const folderPath = path.join(PUBLIC_DIR, folder);
  const files = fs.readdirSync(folderPath).filter(f => 
    /\.(jpg|jpeg|png)$/i.test(f)
  );

  if (files.length === 0) {
    console.log(`No JPG/PNG files in ${folder}`);
    return;
  }

  console.log(`\n📁 ${folder}/ - ${files.length} files`);

  for (const file of files) {
    const inputPath = path.join(folderPath, file);
    const outputPath = path.join(folderPath, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    
    try {
      await sharp(inputPath)
        .resize(MAX_WIDTH, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: DEFAULT_QUALITY })
        .toFile(outputPath);
      
      const originalSize = fs.statSync(inputPath).size;
      const optimizedSize = fs.statSync(outputPath).size;
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      
      console.log(`  ✅ ${file} → ${file.replace(/\.(jpg|jpeg|png)$/i, '.webp')} (-${savings}%)`);
      
      // Remove original
      fs.unlinkSync(inputPath);
    } catch (err) {
      console.log(`  ❌ ${file}: ${err.message}`);
    }
  }
}

async function main() {
  const folders = getFolders();
  console.log(`🎨 Optimizing images to WebP (max width: ${MAX_WIDTH}px, quality: ${DEFAULT_QUALITY})`);
  
  for (const folder of folders) {
    await optimizeFolder(folder);
  }
  
  console.log('\n✨ Done!');
}

main().catch(console.error);