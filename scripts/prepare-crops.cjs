// Generates subject-aware crops so photos are not arbitrarily cut by CSS object-fit.
// Originals are kept in /source-images. Run: node scripts/prepare-crops.cjs
const sharp = require("sharp");
const fs = require("fs");
const P = "public/images";
const S = "source-images/images";
const att = sharp.strategy.attention;

const crop = async (src, out, w, h) => {
  await sharp(`${S}/${src}`).resize(w, h, { fit: "cover", position: att }).jpeg({ quality: 82, progressive: true }).toFile(`${P}/${out}`);
  console.log("wrote", out, `${w}x${h}`);
};

(async () => {
  // 1) Product photography: consistent 1:1 squares, subject-centred.
  for (const f of fs.readdirSync(`${S}/products`)) {
    if (!f.endsWith(".jpg")) continue;
    if (f === "executive-gift-box.jpg") {
      // The supplied 2.2:1 photo cannot be framed as a square without cutting the subject; use a square-native photo.
      await crop("gifting/festive-boxes.jpg", `products/${f}`, 1200, 1200);
      continue;
    }
    if (f === "crystal-award.jpg") {
      // Attention picks the wrong region; frame the crystal ball explicitly.
      await sharp(`${S}/products/${f}`).extract({ left: 262, top: 0, width: 933, height: 933 }).resize(1200, 1200).jpeg({ quality: 82, progressive: true }).toFile(`${P}/products/${f}`);
      console.log("wrote products/crystal-award.jpg (manual)");
      continue;
    }
    if (f === "travel-mug.jpg") {
      await sharp(`${S}/products/${f}`).extract({ left: 0, top: 300, width: 1400, height: 1400 }).resize(1200, 1200).jpeg({ quality: 82, progressive: true }).toFile(`${P}/products/${f}`);
      console.log("wrote products/travel-mug.jpg (manual)");
      continue;
    }
    await crop(`products/${f}`, `products/${f}`, 1200, 1200);
  }
  // 2) Technique thumbnails: squares.
  for (const f of fs.readdirSync(`${S}/techniques`)) if (f.endsWith(".jpg")) await crop(`techniques/${f}`, `techniques/${f}`, 640, 640);
  // 3) Portrait (4:5) variants for tall slots.
  await crop("events/conference-stage.jpg", "events/conference-stage-portrait.jpg", 1000, 1250);
  await crop("advertising/billboards-night.jpg", "advertising/billboards-night-portrait.jpg", 1000, 1250);
  await crop("advertising/digital-billboards.jpg", "advertising/digital-billboards-portrait.jpg", 1000, 1250);
  await crop("events/exhibition-counter.jpg", "events/exhibition-counter-portrait.jpg", 1000, 1250);
  await crop("categories/stationery.jpg", "categories/stationery-portrait.jpg", 1000, 1250);
  // 4) Wide (4:3) variants for landscape slots fed by portrait photos.
  await crop("gifting/client-appreciation.jpg", "gifting/client-appreciation-wide.jpg", 1400, 1050);
  await crop("hero/gift-boxes-ribbon.jpg", "hero/gift-boxes-wide.jpg", 1400, 1050);
  await crop("products/welcome-kit.jpg", "products/welcome-kit-tall.jpg", 1000, 1500);
  // 5) Hero strip (2.6:1).
  await crop("hero/gift-boxes-ribbon.jpg", "hero/gift-boxes-strip.jpg", 1400, 540);
})();
