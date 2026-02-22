import { redirect } from "next/navigation";

export default function TestVisionRedirect(): never {
  redirect("/dashboard");
}
