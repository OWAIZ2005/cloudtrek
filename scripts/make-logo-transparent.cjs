// Removes the near-white background from the logo crops (colour-preserving "unmultiply against white").
// Reads opaque originals from source-images/brand-opaque and writes transparent PNGs to public/images/brand.
const sharp = require("sharp");
const IN = "source-images/brand-opaque", OUT = "public/images/brand";
const HI = 246, LO = 205; // >=HI is background; ramps to full opacity by LO
(async () => {
  for (const f of ["cloudtrek-logo-full.png", "cloudtrek-logo-navbar.png", "cloudtrek-logo-emblem.png"]) {
    const { data, info } = await sharp(`${IN}/${f}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
      const m = Math.min(data[i], data[i + 1], data[i + 2]);
      const a = m >= HI ? 0 : m <= LO ? 1 : (HI - m) / (HI - LO);
      if (a === 0) { data[i] = data[i + 1] = data[i + 2] = 0; data[i + 3] = 0; continue; }
      for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round((data[i + c] - 255 * (1 - a)) / a)));
      data[i + 3] = Math.round(a * 255);
    }
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png({ compressionLevel: 9 }).toFile(`${OUT}/${f}`);
    console.log("transparent:", f);
  }
})();
