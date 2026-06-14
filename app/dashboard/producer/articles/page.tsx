import { redirect } from "next/navigation";

export default function ProducerArticlesRedirectPage() {
  redirect("/dashboard/producer?tab=articles");
}
