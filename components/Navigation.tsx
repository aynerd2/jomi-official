"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

import logoBlack from "@/assets/images/JOMI short black.png";
import type { MinistryArm } from "@/content/ministryArms";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/media", label: "Messages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonies", label: "Testimonies" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation({ arms }: { arms: MinistryArm[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [armsOpen, setArmsOpen] = useState(false);
  const [mobileArmsOpen, setMobileArmsOpen] = useState(false);
  const armsWrapper = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setMobileOpen(false);
    setMobileArmsOpen(false);
    setArmsOpen(false);
  }, [pathname]);

  // Escape closes the dropdown and returns focus to its trigger.
  useEffect(() => {
    if (!armsOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setArmsOpen(false);
      armsWrapper.current?.querySelector("button")?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [armsOpen]);

  // Stop the page scrolling behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // A short delay on mouse-leave, so the pointer can cross the gap to the menu.
  const openArms = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setArmsOpen(true);
  };
  const closeArmsSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setArmsOpen(false), 120);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(20,29,46,0.08)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="container-custom" aria-label="Main">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex shrink-0 items-center" aria-label="JOMI home">
            <Image
              src={logoBlack}
              alt="Jide Ojo Ministry International"
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled ? "h-10" : "h-12"
              }`}
              priority
            />
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.slice(0, 2).map((link) => (
              <NavLink key={link.href} {...link} active={isActive(link.href)} />
            ))}

            <div
              className="relative"
              ref={armsWrapper}
              onMouseEnter={openArms}
              onMouseLeave={closeArmsSoon}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setArmsOpen(false);
                }
              }}
            >
              <button
                type="button"
                aria-expanded={armsOpen}
                aria-haspopup="true"
                onClick={() => setArmsOpen((open) => !open)}
                className={`flex items-center gap-1.5 text-body-sm font-medium transition-colors hover:text-gold-600 ${
                  armsOpen ? "text-gold-600" : "text-navy-900"
                }`}
              >
                Ministries
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${armsOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {armsOpen && (
                  <motion.div
                    initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3"
                  >
                    <div className="rounded-2xl border border-ink-100 bg-white p-2 shadow-lift">
                      {arms.map((arm) => (
                        <Link
                          key={arm.slug}
                          href={`/about#${arm.slug}`}
                          className="block rounded-xl px-3 py-2 transition-colors hover:bg-surface-muted"
                        >
                          <span className="block text-body-sm font-semibold text-navy-900">
                            {arm.name}
                          </span>
                          <span className="block truncate text-caption text-ink-500">
                            {arm.fullName}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.slice(2).map((link) => (
              <NavLink key={link.href} {...link} active={isActive(link.href)} />
            ))}

            <Link href="/partner" className="btn-primary">
              Give
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg p-2 text-navy-900 lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile sheet */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, height: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1, height: "auto" }}
              exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-4 max-h-[75vh] overflow-y-auto rounded-2xl border border-ink-100 bg-white p-5 shadow-lift">
                <div className="flex flex-col">
                  {navLinks.slice(0, 2).map((link) => (
                    <MobileLink key={link.href} {...link} active={isActive(link.href)} />
                  ))}

                  <div className="border-y border-ink-100 py-1">
                    <button
                      type="button"
                      onClick={() => setMobileArmsOpen((open) => !open)}
                      aria-expanded={mobileArmsOpen}
                      className="flex w-full items-center justify-between py-3 text-body font-medium text-navy-900"
                    >
                      Ministries
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${mobileArmsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileArmsOpen && (
                      <div className="grid gap-1 pb-3 pl-3">
                        {arms.map((arm) => (
                          <Link
                            key={arm.slug}
                            href={`/about#${arm.slug}`}
                            className="py-1.5 text-body-sm text-ink-600 hover:text-gold-600"
                          >
                            <span className="font-semibold text-navy-900">
                              {arm.name}
                            </span>{" "}
                            {arm.fullName}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {navLinks.slice(2).map((link) => (
                    <MobileLink key={link.href} {...link} active={isActive(link.href)} />
                  ))}

                  <Link href="/partner" className="btn-primary mt-5 w-full">
                    Give
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative text-body-sm font-medium transition-colors hover:text-gold-600 ${
        active ? "text-gold-600" : "text-navy-900"
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-1.5 left-0 h-px bg-gold-500 transition-all duration-300 ${
          active ? "w-full" : "w-0"
        }`}
      />
    </Link>
  );
}

function MobileLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`py-3 text-body font-medium transition-colors ${
        active ? "text-gold-600" : "text-navy-900 hover:text-gold-600"
      }`}
    >
      {label}
    </Link>
  );
}
