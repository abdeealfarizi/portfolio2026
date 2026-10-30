import { config, collection, singleton, fields } from "@keystatic/core";

// Local mode writes straight to disk while developing. Set NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO
// (e.g. "username/portfolio") on Vercel to edit through GitHub commits in production.
const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

const accentOptions = [
  { label: "Pink", value: "pink" },
  { label: "Yellow", value: "yellow" },
  { label: "Lime", value: "lime" },
  { label: "Orange", value: "orange" },
  { label: "Blue", value: "blue" },
  { label: "Purple", value: "purple" },
] as const;

export default config({
  storage: githubRepo ? { kind: "github", repo: githubRepo } : { kind: "local" },
  ui: { brand: { name: "Portfolio admin" } },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*",
      format: "yaml",
      columns: ["title", "category", "date"],
      schema: {
        title: fields.slug({ name: { label: "Judul (Indonesia)" } }),
        titleEn: fields.text({ label: "Title (English)", description: "Kosongkan untuk memakai judul Indonesia." }),
        category: fields.select({
          label: "Kategori",
          options: [
            { label: "Design", value: "design" },
            { label: "Fotografi", value: "fotografi" },
            { label: "Code", value: "code" },
          ],
          defaultValue: "design",
        }),
        date: fields.date({ label: "Tanggal", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
        featured: fields.checkbox({ label: "Pin di atas", defaultValue: false }),
        views: fields.integer({ label: "Views (untuk konten TikTok, kosongkan kalau tidak ada)" }),
        source: fields.url({ label: "Link postingan asli (TikTok/IG)" }),
        accent: fields.select({ label: "Warna aksen", options: accentOptions, defaultValue: "pink" }),
        ratio: fields.select({
          label: "Rasio slide",
          options: [
            { label: "4:5 (feed IG)", value: "4/5" },
            { label: "1:1", value: "1/1" },
            { label: "9:16 (story/TikTok)", value: "9/16" },
            { label: "16:9 (landscape)", value: "16/9" },
            { label: "2:3 (foto portrait)", value: "2/3" },
            { label: "3:2 (foto landscape)", value: "3/2" },
          ],
          defaultValue: "4/5",
        }),
        cover: fields.image({
          label: "Cover (thumbnail grid)",
          directory: "public/posts",
          publicPath: "/posts/",
          validation: { isRequired: true },
        }),
        slides: fields.array(
          fields.object({
            image: fields.image({
              label: "Gambar",
              directory: "public/posts",
              publicPath: "/posts/",
              validation: { isRequired: true },
            }),
            alt: fields.text({ label: "Alt text (Indonesia)", validation: { isRequired: true } }),
            altEn: fields.text({ label: "Alt text (English)", description: "Kosongkan untuk memakai versi Indonesia." }),
            caption: fields.text({ label: "Caption slide (opsional)" }),
          }),
          {
            label: "Slides",
            itemLabel: (props) => props.fields.alt.value || "Slide",
            validation: { length: { min: 1 } },
          },
        ),
        caption: fields.text({ label: "Caption (Indonesia)", multiline: true }),
        captionEn: fields.text({
          label: "Caption (English)",
          multiline: true,
          description: "Kosongkan untuk memakai caption Indonesia.",
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        stack: fields.array(fields.text({ label: "Tool / tech" }), {
          label: "Tools & stack",
          itemLabel: (props) => props.value,
        }),
        links: fields.object(
          {
            live: fields.url({ label: "Live / demo URL" }),
            repo: fields.url({ label: "Repo URL" }),
          },
          { label: "Link (untuk post code)" },
        ),
      },
    }),
  },
  singletons: {
    profile: singleton({
      label: "Profil",
      path: "content/profile",
      format: "yaml",
      schema: {
        name: fields.text({ label: "Nama", validation: { isRequired: true } }),
        handle: fields.text({ label: "Nama pendek (logo di header)" }),
        role: fields.text({ label: "Role singkat (Indonesia)" }),
        roleEn: fields.text({ label: "Short role (English)" }),
        avatar: fields.image({ label: "Avatar", directory: "public/profile", publicPath: "/profile/" }),
        bio: fields.text({ label: "Bio (Indonesia)", multiline: true }),
        bioEn: fields.text({ label: "Bio (English)", multiline: true }),
        location: fields.text({ label: "Lokasi" }),
        email: fields.text({ label: "Email" }),
        available: fields.checkbox({ label: "Open for work", defaultValue: true }),
        skills: fields.array(fields.text({ label: "Skill" }), {
          label: "Skills (Indonesia)",
          itemLabel: (props) => props.value,
        }),
        skillsEn: fields.array(fields.text({ label: "Skill" }), {
          label: "Skills (English)",
          description: "Kosongkan untuk memakai daftar Indonesia.",
          itemLabel: (props) => props.value,
        }),
        socials: fields.array(
          fields.object({
            platform: fields.select({
              label: "Platform",
              options: [
                { label: "Instagram", value: "instagram" },
                { label: "TikTok", value: "tiktok" },
                { label: "Behance", value: "behance" },
                { label: "Dribbble", value: "dribbble" },
                { label: "GitHub", value: "github" },
                { label: "LinkedIn", value: "linkedin" },
              ],
              defaultValue: "instagram",
            }),
            url: fields.url({ label: "URL", validation: { isRequired: true } }),
          }),
          { label: "Sosial media", itemLabel: (props) => props.fields.platform.value },
        ),
      },
    }),
  },
});
