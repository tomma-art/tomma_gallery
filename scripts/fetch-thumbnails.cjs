const https = require('https');
const fs = require('fs');
const path = require('path');

const films = [
  { slug: 'water-brings-hope', vimeoId: '1008161545' },
  { slug: 'film-1', vimeoId: '1164782732' },
  { slug: 'florence-trio', vimeoId: '890409960' },
  { slug: 'wave-project', vimeoId: '823197525' },
  { slug: 'mastermind', vimeoId: '711014311' },
  { slug: 'reverse-irreversible', vimeoId: '465815372' },
  { slug: 'peter-siwa', vimeoId: '465156129' },
  { slug: 'kensington-annual-report', vimeoId: '465155775' },
  { slug: 'second-chance', vimeoId: '465129038' },
  { slug: 'motion-graphics-reel', vimeoId: '354785295' },
];

function fetchThumbnail(vimeoId) {
  return new Promise((resolve, reject) => {
    const url = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.thumbnail_url);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  for (const film of films) {
    try {
      console.log(`Fetching thumbnail for ${film.slug} (${film.vimeoId})...`);
      const thumbUrl = await fetchThumbnail(film.vimeoId);
      
      // Use highest res thumbnail from Vimeo
      const hdThumb = thumbUrl.replace(/_\d+\.jpg$/, '_1280.jpg');
      
      const destDir = path.join(__dirname, '..', 'public', 'images', 'films', film.slug);
      const dest = path.join(destDir, 'thumbnail.webp');
      
      // Download as jpg first, then convert to webp
      const tempJpg = path.join(destDir, 'thumbnail.jpg');
      await downloadImage(hdThumb, tempJpg);
      
      // Convert to webp using sharp
      const sharp = require('sharp');
      await sharp(tempJpg)
        .resize(1280, null, { withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: 85 })
        .toFile(dest);
      
      fs.unlinkSync(tempJpg);
      console.log(`  ✅ Saved to ${dest}`);
    } catch (err) {
      console.log(`  ❌ Failed: ${err.message}`);
    }
  }
  console.log('Done!');
}

main();
