import {
  BehanceLogo,
  DribbbleLogo,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  TiktokLogo,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";

// Server-safe icons (the /ssr build has no React context), shared by the About page and the footer.
export const socialIcons: Record<string, Icon> = {
  instagram: InstagramLogo,
  tiktok: TiktokLogo,
  behance: BehanceLogo,
  dribbble: DribbbleLogo,
  github: GithubLogo,
  linkedin: LinkedinLogo,
};

export const socialNames: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  behance: "Behance",
  dribbble: "Dribbble",
  github: "GitHub",
  linkedin: "LinkedIn",
};
