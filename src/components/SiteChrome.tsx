import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Packages", href: "/#packages" },
  { label: "Contact", href: "/#contact" },
];

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/logo-nav.jpeg"
              alt="Himadri Creation"
              width={48}
              height={48}
              className="h-11 w-11 rounded-full object-cover shadow-soft"
            />
            <span className="font-display text-lg leading-tight font-semibold text-primary">
              Himadri Creation
              <span className="block text-[0.62rem] tracking-[0.22em] text-muted-foreground uppercase">
                Memorycrafted Since 2018
              </span>
            </span>
          </Link>
          <nav className="order-3 flex w-full flex-wrap items-center gap-x-5 gap-y-2 text-sm sm:order-none sm:w-auto sm:ml-auto">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-foreground/80 hover:text-primary">
                {item.label}
              </a>
            ))}
            <Link to="/blog" className="font-semibold text-primary">
              Blog
            </Link>
          </nav>
          <Link
            to="/booking"
            className="ml-auto rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary-dark sm:ml-0"
          >
            Book Now
          </Link>
        </div>
      </header>

      {children}

      <footer className="mt-20 border-t border-border bg-primary-dark text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="font-display text-xl">Himadri Creation</p>
            <p className="mt-2 text-sm text-primary-foreground/75">
              Wedding, pre-wedding and event photography in Bankura. Your Memories, Our Promise.
            </p>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold tracking-wide uppercase">Explore</p>
            <ul className="space-y-1 text-primary-foreground/80">
              <li>
                <a href="/#gallery">Gallery</a>
              </li>
              <li>
                <a href="/#packages">Packages</a>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/booking">Book a shoot</Link>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold tracking-wide uppercase">Contact</p>
            <ul className="space-y-1 text-primary-foreground/80">
              <li>
                <a href="tel:+918327482228">+91 83274 82228</a>
              </li>
              <li>
                <a href="https://wa.me/918327482228">WhatsApp us</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="pb-8 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Himadri Creation. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export function BrandCTA() {
  return (
    <section className="mx-auto mt-16 max-w-4xl rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground shadow-lift sm:px-12">
      <h2 className="font-display text-3xl tracking-wide sm:text-4xl">LET'S CAPTURE YOUR STORY.</h2>
      <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/85">
        Planning a wedding, pre-wedding shoot or special event? Let Himadri Creation turn your
        moments into memories you'll love forever.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/booking"
          className="rounded-full bg-accent px-7 py-3 text-sm font-semibold tracking-wide text-accent-foreground uppercase transition hover:brightness-95"
        >
          Book a Shoot
        </Link>
        <a
          href="/#contact"
          className="rounded-full border border-primary-foreground/60 px-7 py-3 text-sm font-semibold tracking-wide uppercase transition hover:bg-primary-foreground/10"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
}