import { notFound } from "next/navigation";
import { keystaticEnabled } from "@/lib/keystatic";
import KeystaticApp from "./keystatic";

// The admin is its own root layout: it sits outside the /[lang] site and brings its own styling.
export default function Layout() {
  if (!keystaticEnabled) notFound();
  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
