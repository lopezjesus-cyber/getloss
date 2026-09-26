const fs = require('fs');
const path = require('path');
const { encode: encodePNG } = require('fast-png');

function renderGetLossIcon(size) {
  const width = size;
  const height = size;
  const data = new Uint8Array(width * height * 4);

  const radius = size * 0.22;
  const cx = size / 2;
  const cy = size / 2;

  // Helper to test if point (x, y) is inside rounded squircle
  function isInsideSquircle(x, y, r) {
    const rx = Math.max(0, Math.abs(x - cx) - (cx - r));
    const ry = Math.max(0, Math.abs(y - cy) - (cy - r));
    return (rx * rx + ry * ry) <= (r * r);
  }

  // Helper point in polygon
  function isInsidePoly(px, py, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0] * size, yi = poly[i][1] * size;
      const xj = poly[j][0] * size, yj = poly[j][1] * size;
      const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Shield vertices normalized [0..1]
  const outerShield = [
    [0.5, 0.16],
    [0.76, 0.29],
    [0.76, 0.53],
    [0.5, 0.83],
    [0.24, 0.53],
    [0.24, 0.29]
  ];

  const innerShield = [
    [0.5, 0.26],
    [0.68, 0.36],
    [0.68, 0.51],
    [0.5, 0.72],
    [0.32, 0.51],
    [0.32, 0.36]
  ];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      if (!isInsideSquircle(x, y, radius)) {
        // Transparent
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 0;
        continue;
      }

      // Titanium Dark Gradient Background (#1f1f24 to #09090b)
      const gradRatio = (x + y) / (width + height);
      let r = Math.round(31 * (1 - gradRatio) + 9 * gradRatio);
      let g = Math.round(31 * (1 - gradRatio) + 9 * gradRatio);
      let b = Math.round(36 * (1 - gradRatio) + 11 * gradRatio);
      let a = 255;

      // Outer Metallic Border check (1.5px border)
      const borderDist = 1.8 * (size / 64);
      if (!isInsideSquircle(x + (x < cx ? borderDist : -borderDist), y + (y < cy ? borderDist : -borderDist), radius)) {
        const borderGrad = 1 - (y / height);
        r = Math.round(255 * borderGrad + 113 * (1 - borderGrad));
        g = Math.round(255 * borderGrad + 113 * (1 - borderGrad));
        b = Math.round(255 * borderGrad + 122 * (1 - borderGrad));
      } else {
        // Upper Sapphire Highlight
        if (y < height * 0.45) {
          const highlight = (1 - (y / (height * 0.45))) * 0.18;
          r = Math.min(255, Math.round(r + 255 * highlight));
          g = Math.min(255, Math.round(g + 255 * highlight));
          b = Math.min(255, Math.round(b + 255 * highlight));
        }

        // Draw Shield
        if (isInsidePoly(x, y, outerShield)) {
          if (!isInsidePoly(x, y, innerShield)) {
            // Metallic Outer Shield Rim
            const shieldGrad = 1 - ((y - size * 0.16) / (size * 0.67));
            r = Math.round(255 * shieldGrad + 161 * (1 - shieldGrad));
            g = Math.round(255 * shieldGrad + 161 * (1 - shieldGrad));
            b = Math.round(255 * shieldGrad + 170 * (1 - shieldGrad));
          } else {
            // Shield Interior
            r = 14;
            g = 14;
            b = 18;
          }
        }

        // Upward Growth Vector Line & Arrow
        // Normalized arrow points: (0.38, 0.55) -> (0.48, 0.43) -> (0.55, 0.49) -> (0.63, 0.35)
        const lineDist1 = distToSegment(x, y, 0.38 * size, 0.55 * size, 0.48 * size, 0.43 * size);
        const lineDist2 = distToSegment(x, y, 0.48 * size, 0.43 * size, 0.55 * size, 0.49 * size);
        const lineDist3 = distToSegment(x, y, 0.55 * size, 0.49 * size, 0.63 * size, 0.35 * size);
        const headDist1 = distToSegment(x, y, 0.54 * size, 0.35 * size, 0.63 * size, 0.35 * size);
        const headDist2 = distToSegment(x, y, 0.63 * size, 0.35 * size, 0.63 * size, 0.44 * size);

        const minDist = Math.min(lineDist1, lineDist2, lineDist3, headDist1, headDist2);
        const strokeW = Math.max(1.2, 0.05 * size);

        if (minDist <= strokeW) {
          const antialias = Math.max(0, Math.min(1, 1 - (minDist - strokeW + 0.8) / 0.8));
          r = Math.round(r * (1 - antialias) + 255 * antialias);
          g = Math.round(g * (1 - antialias) + 255 * antialias);
          b = Math.round(b * (1 - antialias) + 255 * antialias);
        }

        // Top Precision Dot
        const dotDist = Math.hypot(x - 0.5 * size, y - 0.16 * size);
        const dotR = Math.max(1, 0.035 * size);
        if (dotDist <= dotR) {
          r = 255;
          g = 255;
          b = 255;
        }
      }

      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = a;
    }
  }

  return encodePNG({ width, height, data });
}

function distToSegment(px, py, vx, vy, wx, wy) {
  const l2 = (vx - wx) * (vx - wx) + (vy - wy) * (vy - wy);
  if (l2 === 0) return Math.hypot(px - vx, py - vy);
  let t = ((px - vx) * (wx - vx) + (py - vy) * (wy - vy)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (vx + t * (wx - vx)), py - (vy + t * (wy - vy)));
}

// Generate ICO format with multiple resolutions (16x16, 32x32, 48x48)
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + (16 * count);
  const entries = [];
  const imageBuffers = [];

  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 0); // width
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 1); // height
    entry.writeUInt8(0, 2); // colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(item.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset

    entries.push(entry);
    imageBuffers.push(item.buffer);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...imageBuffers]);
}

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');

const sizes = [16, 32, 48, 64, 180, 192, 512];
const generatedBuffers = [];

for (const s of sizes) {
  const pngBuf = renderGetLossIcon(s);
  let filename = `favicon-${s}x${s}.png`;
  if (s === 180) filename = 'apple-touch-icon.png';
  if (s === 192) filename = 'app-icon-192.png';
  if (s === 512) filename = 'app-icon-512.png';

  fs.writeFileSync(path.join(publicDir, filename), pngBuf);
  console.log(`Generated: ${filename} (${pngBuf.length} bytes)`);

  if (s === 16 || s === 32 || s === 48) {
    generatedBuffers.push({ size: s, buffer: Buffer.from(pngBuf) });
  }
}

// Generate multi-resolution ICO file
const icoBuffer = buildIco(generatedBuffers);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
console.log(`Generated: favicon.ico (${icoBuffer.length} bytes)`);
