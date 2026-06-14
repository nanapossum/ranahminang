import { redirect } from "next/navigation";

export default function LegacyProducerPage() {
  redirect("/dashboard/producer");
}
