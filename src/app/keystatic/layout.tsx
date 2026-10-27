import { notFound } from "next/navigation";
import { keystaticEnabled } from "@/lib/keystatic";
import KeystaticApp from "./keystatic";

export default function Layout() {
  if (!keystaticEnabled) notFound();
  return <KeystaticApp />;
}
