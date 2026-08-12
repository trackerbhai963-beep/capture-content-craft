import { createFileRoute } from "@tanstack/react-router";
import { LegacyPage } from "@/components/LegacyPage";
import { homeHtml } from "@/site/home-html";

const title = "Himadri Creation | Wedding & Event Photography in Bankura";
const description =
  "Professional wedding, pre-wedding and event photography, 4K cinematic videography, premium retouching and drone shoots by Himadri Creation in Bankura.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "theme-color", content: "#6b1f22" },
    ],
    links: [{ rel: "stylesheet", href: "/site/styles.css" }],
  }),
  component: Index,
});

function Index() {
  return <LegacyPage html={homeHtml} script="/site/script.js" />;
}
