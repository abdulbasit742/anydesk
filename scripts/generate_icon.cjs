/**
 * generate_icon.cjs
 * Generates a simple .ico file for gtool.exe
 * Uses raw bitmap data - no external deps needed
 */
const fs = require('fs');
const path = require('path');

// Create build directory
const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

// We'll create a 32x32 BMP icon with "G" letter in cyan on dark background
// ICO format: ICO header + directory entry + BMP data

function createIco() {
    const size = 32;
    const bpp  = 24; // 24-bit color
    
    // Create pixel data (BGR format for BMP)
    const pixels = [];
    
    // Background color: dark navy #1a1a2e -> BGR: 46, 26, 26
    const bgB = 46, bgG = 26, bgR = 26;
    // Primary color: cyan #00d4ff -> BGR: 255, 212, 0
    const fgB = 255, fgG = 212, fgR = 0;
    // Accent: lighter cyan #88eeff
    const acB = 255, acG = 238, acR = 136;
    
    // Simple "G" shape pixel map (32x32 grid)
    // 1 = foreground, 0 = background
    const letterG = [
        [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    
    // BMP pixel data (bottom-up, row-padded to 4 bytes)
    const rowSize = Math.ceil(size * bpp / 8 / 4) * 4;
    const pixelDataSize = rowSize * size;
    const bitmapDataSize = 40 + pixelDataSize; // BITMAPINFOHEADER + pixels
    
    const bmpData = Buffer.alloc(bitmapDataSize);
    
    // BITMAPINFOHEADER (40 bytes)
    bmpData.writeUInt32LE(40, 0);         // biSize
    bmpData.writeInt32LE(size, 4);         // biWidth
    bmpData.writeInt32LE(size * 2, 8);     // biHeight (x2 for ICO = img+mask)
    bmpData.writeUInt16LE(1, 12);          // biPlanes
    bmpData.writeUInt16LE(bpp, 14);        // biBitCount
    bmpData.writeUInt32LE(0, 16);          // biCompression = BI_RGB
    bmpData.writeUInt32LE(pixelDataSize, 20); // biSizeImage
    bmpData.writeInt32LE(0, 24);           // biXPelsPerMeter
    bmpData.writeInt32LE(0, 28);           // biYPelsPerMeter
    bmpData.writeUInt32LE(0, 32);          // biClrUsed
    bmpData.writeUInt32LE(0, 36);          // biClrImportant
    
    // Write pixel data (BMP is bottom-up)
    for (let row = size - 1; row >= 0; row--) {
        const rowIdx = (size - 1 - row);
        const bmpRow = letterG[row] || new Array(size).fill(0);
        for (let col = 0; col < size; col++) {
            const byteOffset = 40 + rowIdx * rowSize + col * 3;
            if (bmpRow[col] === 1) {
                bmpData[byteOffset]     = fgB;
                bmpData[byteOffset + 1] = fgG;
                bmpData[byteOffset + 2] = fgR;
            } else {
                bmpData[byteOffset]     = bgB;
                bmpData[byteOffset + 1] = bgG;
                bmpData[byteOffset + 2] = bgR;
            }
        }
    }
    
    // AND mask (all zeros = fully opaque), padded to 4 bytes per row
    const maskRowSize = Math.ceil(size / 8 / 4) * 4;
    const maskData = Buffer.alloc(maskRowSize * size, 0);
    const fullBmp = Buffer.concat([bmpData, maskData]);
    
    // ICO header (6 bytes)
    const icoHeader = Buffer.alloc(6);
    icoHeader.writeUInt16LE(0, 0);  // Reserved
    icoHeader.writeUInt16LE(1, 2);  // Type = ICO
    icoHeader.writeUInt16LE(1, 4);  // Count = 1 image
    
    // ICO directory entry (16 bytes)
    const dirEntry = Buffer.alloc(16);
    dirEntry.writeUInt8(size, 0);         // Width
    dirEntry.writeUInt8(size, 1);         // Height
    dirEntry.writeUInt8(0, 2);            // ColorCount (0 = 256+)
    dirEntry.writeUInt8(0, 3);            // Reserved
    dirEntry.writeUInt16LE(1, 4);         // Planes
    dirEntry.writeUInt16LE(bpp, 6);       // BitCount
    dirEntry.writeUInt32LE(fullBmp.length, 8);  // SizeInBytes
    dirEntry.writeUInt32LE(22, 12);       // ImageOffset (6+16=22)
    
    const ico = Buffer.concat([icoHeader, dirEntry, fullBmp]);
    
    const outPath = path.join(buildDir, 'gtool.ico');
    fs.writeFileSync(outPath, ico);
    console.log(`Icon written: ${outPath} (${ico.length} bytes)`);
    return outPath;
}

createIco();
