import { notFound } from "next/navigation";

// Any unknown path under a language (/id/typo) lands here, so it gets the styled 404 inside the site layout.
export default function UnknownPath() {
  return notFound();
}
