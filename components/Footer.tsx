import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Twitter, Mail, MapPin } from "lucide-react";

import logoWhite from "@/assets/images/JOMI long white.png";
import { formatAddress, getServiceTimes, getSiteSettings } from "@/lib/cms";

const explore = [
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Messages", href: "/media" },
  { name: "Gallery", href: "/gallery" },
  { name: "Testimonies", href: "/testimonies" },
];

const connect = [
  { name: "Partner with Us", href: "/partner" },
  { name: "Contact", href: "/contact" },
  { name: "Our Centres", href: "/branches" },
  { name: "Watch Online", href: "/#watch" },
];

export default async function Footer() {
  const [settings, serviceTimes] = await Promise.all([
    getSiteSettings(),
    getServiceTimes(),
  ]);

  const weekly = serviceTimes.filter((service) => service.cadence === "Weekly");
  const address = formatAddress(settings);

  const socialLinks = [
    { name: "Facebook", href: settings.socials.facebook, Icon: Facebook },
    { name: "Instagram", href: settings.socials.instagram, Icon: Instagram },
    { name: "YouTube", href: settings.socials.youtube, Icon: Youtube },
    { name: "X", href: settings.socials.x, Icon: Twitter },
  ].filter((link) => Boolean(link.href));

  return (
    <footer className="bg-navy-900 text-navy-200">
      <div className="container-custom py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Image
              src={logoWhite}
              alt={settings.name}
              width={170}
              height={53}
              className="h-12 w-auto object-contain"
            />
            <p className="mt-5 max-w-sm text-body-sm leading-relaxed text-navy-300">
              {settings.description}
            </p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${settings.shortName} on ${name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-navy-200 transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:bg-gold-500 hover:text-navy-900"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h2 className="text-caption font-semibold uppercase tracking-[0.14em] text-white">
              Explore
            </h2>
            <ul className="mt-5 space-y-3">
              {explore.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-navy-300 transition-colors hover:text-gold-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2">
            <h2 className="text-caption font-semibold uppercase tracking-[0.14em] text-white">
              Connect
            </h2>
            <ul className="mt-5 space-y-3">
              {connect.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-navy-300 transition-colors hover:text-gold-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit + contact */}
          <div className="lg:col-span-4">
            <h2 className="text-caption font-semibold uppercase tracking-[0.14em] text-white">
              Join Us
            </h2>
            {weekly.length > 0 && (
              <ul className="mt-5 space-y-3 text-body-sm text-navy-300">
                {weekly.map((service) => (
                  <li key={service.name}>
                    <span className="text-white">{service.name}</span>
                    <br />
                    {service.day}, {service.time}
                  </li>
                ))}
              </ul>
            )}

            <ul className="mt-6 space-y-3 text-body-sm text-navy-300">
              {address && (
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                  <span>{address}</span>
                </li>
              )}
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <a
                  href={`mailto:${settings.emails.general}`}
                  className="transition-colors hover:text-gold-400"
                >
                  {settings.emails.general}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-caption text-navy-400 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {settings.name}
          </p>
          <p>{settings.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
