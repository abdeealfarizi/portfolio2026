// Turns raw folders in bahan/ into Keystatic posts.
//
//   npm run import            import new folders, skip posts that already exist
//   npm run import -- --force re-import everything (overwrites YAML edited in /keystatic)
//
// Folder rules:
//   bahan/konten*/        → category "design" (TikTok carousel), one post per folder
//   bahan/fotografi/*.jpg → category "fotografi", one post per photo
//   bahan/fotografi/<sub> → category "fotografi", one album post per subfolder
//   bahan/code*/          → category "code"
//   anything else         → category "design"
//   bahan/profile.(png|jpg) → avatar
//
// Optional per-folder files:
//   caption.txt (or any .txt except laporan.txt): caption; lines starting with # become tags
//   konten.json: slide titles become alt text
//   info.json: { "title", "caption", "date", "views", "source", "tags", "stack", "featured", "accent", "ratio" }
//              e.g. { "views": 120000, "source": "https://www.tiktok.com/@kreativa.dev/photo/123" }
//   For single photos in fotografi/, use <photo-name>.json next to the photo.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const BAHAN = join(ROOT, "bahan");
const POSTS_DIR = join(ROOT, "content", "posts");
const PUBLIC_POSTS = join(ROOT, "public", "posts");
const FORCE = process.argv.includes("--force");

const IMAGE = /\.(png|jpe?g|webp)$/i;
const RATIOS = { "4/5": 0.8, "1/1": 1, "9/16": 9 / 16, "16/9": 16 / 9, "2/3": 2 / 3, "3/2": 1.5 };
const PALETTE = {
  pink: [255, 62, 165],
  yellow: [255, 225, 53],
  lime: [182, 255, 59],
  orange: [255, 122, 26],
  blue: [59, 91, 255],
  purple: [155, 92, 255],
};
const CATEGORY_ACCENT = { design: "orange", fotografi: "yellow", code: "lime" };

const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
const titleCase = (s) => s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
const q = (v) => JSON.stringify(v); // JSON strings are valid YAML scalars
const readJson = (file) => (existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {});
const listImages = (dir) => readdirSync(dir).filter((f) => IMAGE.test(f)).sort(naturalSort);

function categoryOf(folder) {
  if (/^foto/i.test(folder)) return "fotografi";
  if (/^code/i.test(folder)) return "code";
  return "design";
}

function nearestRatio(w, h) {
  const r = w / h;
  return Object.entries(RATIOS).reduce((best, cur) => (Math.abs(cur[1] - r) < Math.abs(best[1] - r) ? cur : best))[0];
}

// Pick the palette color closest to the image's dominant color; fall back for near-grey images.
async function accentFor(file, category) {
  const { dominant } = await sharp(file).stats();
  const { r, g, b } = dominant;
  const saturation = Math.max(r, g, b) - Math.min(r, g, b);
  if (saturation < 60) return CATEGORY_ACCENT[category];
  let best = CATEGORY_ACCENT[category];
  let bestDist = Infinity;
  for (const [name, [pr, pg, pb]] of Object.entries(PALETTE)) {
    const d = (pr - r) ** 2 + (pg - g) ** 2 + (pb - b) ** 2;
    if (d < bestDist) [best, bestDist] = [name, d];
  }
  return best;
}

// caption.txt / .txt: first non-hashtag lines are the caption, #lines become tags.
function readCaption(dir) {
  const txt = readdirSync(dir).find((f) => f.toLowerCase() === "caption.txt") ??
    readdirSync(dir).find((f) => f.toLowerCase().endsWith(".txt") && f.toLowerCase() !== "laporan.txt");
  if (!txt) return { caption: "", tags: [] };
  const lines = readFileSync(join(dir, txt), "utf8").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const tags = lines.filter((l) => l.startsWith("#")).flatMap((l) => l.split(/\s+/)).map((t) => t.replace(/^#/, "")).filter(Boolean);
  const caption = lines.filter((l) => !l.startsWith("#")).join("\n");
  return { caption, tags };
}

// konten.json (TikTok template) → alt text per slide.
function altsFromKontenJson(dir) {
  const data = readJson(join(dir, "konten.json"));
  if (!Array.isArray(data.slides)) return { title: null, alts: [] };
  const clean = (s) => s.replace(/[{}]/g, "");
  const alts = data.slides.map((s) => {
    if (s.tipe === "repo") return clean(`${s.nama}: ${s.subjudul ?? ""}`).trim();
    if (Array.isArray(s.judul)) return clean(s.judul.join(" "));
    return clean(s.nama ?? s.subjudul ?? "");
  });
  const cover = data.slides.find((s) => s.tipe === "cover");
  return { title: cover && Array.isArray(cover.judul) ? titleCase(clean(cover.judul.join(" "))) : null, alts };
}

async function writeImages(slug, files, maxSize) {
  const outDir = join(PUBLIC_POSTS, slug);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const slides = [];
  for (const [i, file] of files.entries()) {
    const name = `slide-${i + 1}.jpg`;
    await sharp(file)
      .rotate()
      .resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(join(outDir, name));
    slides.push(`/posts/${slug}/${name}`);
  }
  await sharp(files[0]).rotate().resize({ width: 720, withoutEnlargement: true }).flatten({ background: "#ffffff" })
    .jpeg({ quality: 78, mozjpeg: true }).toFile(join(outDir, "cover.jpg"));
  return { slides, cover: `/posts/${slug}/cover.jpg` };
}

async function importPost({ slug, category, files, title, caption, tags, alts, info }) {
  const yamlPath = join(POSTS_DIR, `${slug}.yaml`);
  if (existsSync(yamlPath) && !FORCE) {
    console.log(`  skip  ${slug} (sudah ada, pakai --force untuk menimpa)`);
    return;
  }
  const meta = await sharp(files[0]).rotate().metadata();
  const [w, h] = (meta.orientation ?? 1) >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];
  const { slides, cover } = await writeImages(slug, files, category === "fotografi" ? 2000 : 1440);
  const date = info.date ?? new Date(statSync(files[0]).mtime).toISOString().slice(0, 10);
  const finalTitle = info.title ?? title;
  const finalTags = info.tags ?? tags;
  const stack = info.stack ?? [];

  const yaml = [
    `title: ${q(finalTitle)}`,
    `category: ${category}`,
    `date: ${date}`,
    `featured: ${Boolean(info.featured)}`,
    ...(info.views != null ? [`views: ${Number(info.views)}`] : []),
    ...(info.source ? [`source: ${q(info.source)}`] : []),
    `accent: ${info.accent ?? (await accentFor(files[0], category))}`,
    `ratio: ${q(info.ratio ?? nearestRatio(w, h))}`,
    `cover: ${cover}`,
    `slides:`,
    ...slides.flatMap((image, i) => [`  - image: ${image}`, `    alt: ${q(alts[i] || `${finalTitle} — slide ${i + 1}`)}`]),
    `caption: ${q(info.caption ?? caption)}`,
    ...(finalTags.length ? [`tags:`, ...finalTags.map((t) => `  - ${q(t)}`)] : [`tags: []`]),
    ...(stack.length ? [`stack:`, ...stack.map((t) => `  - ${q(t)}`)] : [`stack: []`]),
    "",
  ].join("\n");
  writeFileSync(yamlPath, yaml);
  console.log(`  ok    ${slug} (${category}, ${slides.length} slide)`);
}

async function main() {
  if (!existsSync(BAHAN)) throw new Error("Folder bahan/ tidak ditemukan");
  mkdirSync(POSTS_DIR, { recursive: true });

  const avatar = readdirSync(BAHAN).find((f) => /^profile\.(png|jpe?g|webp)$/i.test(f));
  if (avatar) {
    mkdirSync(join(ROOT, "public", "profile"), { recursive: true });
    await sharp(join(BAHAN, avatar)).rotate().resize(640, 640, { fit: "cover" }).jpeg({ quality: 85, mozjpeg: true })
      .toFile(join(ROOT, "public", "profile", "avatar.jpg"));
    console.log("  ok    avatar → /profile/avatar.jpg");
  }

  for (const folder of readdirSync(BAHAN, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort(naturalSort)) {
    const dir = join(BAHAN, folder);
    const category = categoryOf(folder);

    if (category === "fotografi") {
      // Loose photos → one post each.
      for (const file of listImages(dir)) {
        const name = basename(file, extname(file));
        await importPost({
          slug: `foto-${slugify(name)}`,
          category,
          files: [join(dir, file)],
          title: titleCase(name),
          caption: "",
          tags: [],
          alts: [],
          info: readJson(join(dir, `${name}.json`)),
        });
      }
      // Subfolders → album posts.
      for (const sub of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory())) {
        const subDir = join(dir, sub.name);
        const images = listImages(subDir);
        if (!images.length) continue;
        const { caption, tags } = readCaption(subDir);
        await importPost({
          slug: `foto-${slugify(sub.name)}`,
          category,
          files: images.map((f) => join(subDir, f)),
          title: titleCase(sub.name),
          caption,
          tags,
          alts: [],
          info: readJson(join(subDir, "info.json")),
        });
      }
      continue;
    }

    const images = listImages(dir);
    if (!images.length) continue;
    const { caption, tags } = readCaption(dir);
    const fromJson = altsFromKontenJson(dir);
    const cleanName = folder.replace(/\bdesign\b/i, "").trim() || folder;
    await importPost({
      slug: slugify(cleanName),
      category,
      files: images.map((f) => join(dir, f)),
      title: fromJson.title ?? titleCase(cleanName),
      caption,
      tags,
      alts: fromJson.alts,
      info: readJson(join(dir, "info.json")),
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
