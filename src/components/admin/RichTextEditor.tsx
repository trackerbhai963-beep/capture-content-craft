import { useEffect, useRef } from "react";

const BUTTONS: { label: string; cmd: string; value?: string; title: string }[] = [
  { label: "H1", cmd: "formatBlock", value: "h1", title: "Heading 1" },
  { label: "H2", cmd: "formatBlock", value: "h2", title: "Heading 2" },
  { label: "H3", cmd: "formatBlock", value: "h3", title: "Heading 3" },
  { label: "P", cmd: "formatBlock", value: "p", title: "Paragraph" },
  { label: "B", cmd: "bold", title: "Bold" },
  { label: "I", cmd: "italic", title: "Italic" },
  { label: "• List", cmd: "insertUnorderedList", title: "Bullet list" },
  { label: "1. List", cmd: "insertOrderedList", title: "Numbered list" },
  { label: "Quote", cmd: "formatBlock", value: "blockquote", title: "Quote" },
  { label: "Left", cmd: "justifyLeft", title: "Align left" },
  { label: "Center", cmd: "justifyCenter", title: "Align center" },
  { label: "Right", cmd: "justifyRight", title: "Align right" },
];

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value;
  }, [value]);

  function run(cmd: string, val?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, val);
    onChange(ref.current?.innerHTML ?? "");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap gap-1 border-b border-border bg-secondary p-2">
        {BUTTONS.map((b) => (
          <button
            key={b.label}
            type="button"
            title={b.title}
            onClick={() => run(b.cmd, b.value)}
            className="rounded-lg bg-card px-2.5 py-1 text-xs font-semibold text-foreground/80 hover:bg-primary hover:text-primary-foreground"
          >
            {b.label}
          </button>
        ))}
        <button
          type="button"
          title="Insert link"
          onClick={() => {
            const url = window.prompt("Link URL (https://…)");
            if (url) run("createLink", url);
          }}
          className="rounded-lg bg-card px-2.5 py-1 text-xs font-semibold text-foreground/80 hover:bg-primary hover:text-primary-foreground"
        >
          Link
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
        onBlur={() => onChange(ref.current?.innerHTML ?? "")}
        className="prose-hc min-h-[22rem] max-w-none px-5 py-4 outline-none"
      />
    </div>
  );
}