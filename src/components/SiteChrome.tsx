import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteChrome({ children, active = "Blog" }: { children: ReactNode; active?: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader active={active} />

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