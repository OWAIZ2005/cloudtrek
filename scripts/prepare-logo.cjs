// Derives website logo assets (crops/optimised copies only) from the official uploaded logo.
const sharp = require("sharp");
const src = process.argv[2];
const out = "public/images/brand";
(async () => {
  const base = sharp(src);
  const corner = await sharp(src).extract({ left: 2, top: 2, width: 1, height: 1 }).raw().toBuffer();
  console.log("corner rgb", [...corner]);
  const pad = (b) => b.extend({ top: 16, bottom: 16, left: 16, right: 16, background: "#ffffff" });
  const trimmed = async (region) => {
    let img = sharp(src);
    if (region) img = img.extract(region);
    const buf = await img.png().toBuffer();
    return sharp(buf).trim({ threshold: 18 });
  };
  const save = async (name, s, width) => {
    const b = await pad(s).resize({ width, withoutEnlargement: true }).png({ compressionLevel: 9 }).toBuffer();
    await sharp(b).toFile(`${out}/${name}`);
    const m = await sharp(b).metadata();
    console.log(name, m.width, m.height);
  };
  await save("cloudtrek-logo-full.png", await trimmed(null), 2000);
  await save("cloudtrek-logo-navbar.png", await trimmed({ left: 400, top: 0, width: 1200, height: 612 }), 1400);
  await save("cloudtrek-logo-emblem.png", await trimmed({ left: 690, top: 0, width: 590, height: 474 }), 700);
  const em = await trimmed({ left: 690, top: 0, width: 590, height: 474 });
  const eb = await em.png().toBuffer();
  const md = await sharp(eb).metadata();
  const side = Math.max(md.width, md.height);
  await sharp(eb).resize(256, 256, { fit: "contain", background: "#ffffff" }).png().toFile(`${out}/favicon.png`);
  await sharp(eb).resize(512, 512, { fit: "contain", background: "#ffffff" }).png().toFile(`${out}/favicon-512.png`);
})();
