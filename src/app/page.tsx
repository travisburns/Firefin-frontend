import { redirect } from "next/navigation";

export default function HomePage() {
  // The Lab is the first usable surface; the storefront comes later.
  redirect("/lab");
}
