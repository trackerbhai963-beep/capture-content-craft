import { useEffect, useRef } from "react";

function loadScript(src: string, module = false): Promise<void> {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-legacy="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.dataset["legacy"] = src;
    if (module) el.type = "module";
    el.onload = () => resolve();
    el.onerror = () => resolve();
    document.body.appendChild(el);
  });
}

/**
 * Renders the original Himadri Creation static markup untouched and boots the
 * original vanilla scripts after hydration, so existing design, animations,
 * gallery and booking behaviour keep working exactly as before.
 */
export function LegacyPage({ html, script }: { html: string; script: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadScript("https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js", true);
      await loadScript("https://cdn.jsdelivr.net/npm/three@0.146.0/build/three.min.js");
      await loadScript(
        "https://cdn.jsdelivr.net/npm/three@0.146.0/examples/js/loaders/GLTFLoader.js",
      );
      if (cancelled) return;
      const el = document.createElement("script");
      el.src = script;
      document.body.appendChild(el);
    })();
    return () => {
      cancelled = true;
      document.body.classList.remove("menu-open");
    };
  }, [script]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}