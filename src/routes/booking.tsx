import { createFileRoute } from "@tanstack/react-router";
import { LegacyPage } from "@/components/LegacyPage";
import { bookingHtml } from "@/site/booking-html";

const title = "Book a Photography Session | Himadri Creation";
const description =
  "Book your wedding, pre-wedding, birthday or event shoot with Himadri Creation. Share your date, location, package and budget in one quick form.";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "stylesheet", href: "/site/styles.css" }],
  }),
  component: BookingPage,
});

function BookingPage() {
  return <LegacyPage html={bookingHtml} script="/site/booking.js" />;
}