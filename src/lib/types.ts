export type Category = "design" | "fotografi" | "code";
export type Accent = "pink" | "yellow" | "lime" | "orange" | "blue" | "purple";

export type Slide = {
  image: string;
  alt: string;
  caption: string;
};

export type Post = {
  slug: string;
  title: string;
  category: Category;
  date: string;
  featured: boolean;
  /** TikTok/IG views, null when not tracked. */
  views: number | null;
  /** Link to the original post (TikTok/IG). */
  source: string | null;
  accent: Accent;
  /** "4/5", "1/1", "9/16", "16/9", "2/3" or "3/2" */
  ratio: string;
  cover: string;
  slides: Slide[];
  caption: string;
  tags: string[];
  stack: string[];
  links: { live: string | null; repo: string | null };
};

export type Social = { platform: string; url: string };

export type Profile = {
  name: string;
  handle: string;
  role: string;
  avatar: string | null;
  bio: string;
  location: string;
  email: string;
  available: boolean;
  skills: string[];
  socials: Social[];
};
