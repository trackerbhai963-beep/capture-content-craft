import { useEffect, useState } from "react";

const NAV = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Packages", href: "/#packages" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Exact replica of the Home page (legacy) site header, so inner pages such as
 * /blog render the identical pill navbar. Styling comes from /site/header.css.
 */
export function SiteHeader({ active = "Blog" }: { active?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`} id="top">
      <a href="/" className="brand" aria-label="Himadri Creation home">
        <img className="brand-logo" src="/assets/logo-nav.jpeg" alt="Himadri Creation" />
      </a>

      <div className="nav-brand-note" aria-label="Trusted Memories Since 2018">
        <span></span>
        <p>Memorycrafted Since 2018</p>
        <span></span>
      </div>

      <nav className={`main-nav${open ? " open" : ""}`} aria-label="Main navigation">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={item.label === active ? "active" : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="/booking">
        Book Now
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
