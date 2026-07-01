import Link from 'next/link';
import { Cpu, Mail, X } from 'lucide-react';
import { LogoGithub } from '@gravity-ui/icons';


const FOOTER_LINKS = {
  Shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Smartphones', href: '/products?category=Smartphones' },
    { label: 'Laptops', href: '/products?category=Laptops' },
    { label: 'Audio', href: '/products?category=Audio' },
    { label: 'Wearables', href: '/products?category=Wearables' },
    { label: 'Accessories', href: '/products?category=Accessories' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Partners', href: '/partners' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Track Order', href: '/orders/track' },
    { label: 'Returns', href: '/returns' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

const SOCIALS = [
  { icon: X, label: 'Twitter', href: 'https://twitter.com' },
  { icon: LogoGithub, label: 'GitHub', href: 'https://github.com' },
  { icon: Mail, label: 'Email', href: 'mailto:hello@techmart.io' },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-white">
      {/* Main Footer Grid */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow duration-300">
                <Cpu className="size-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                TechMart
              </span>
            </Link>

            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Your one-stop destination for premium tech gadgets. Discover smart
              devices, powerful hardware, and the latest innovations — delivered
              fast.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2 mt-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-4">
              <h3 className="text-xs font-extrabold tracking-widest uppercase text-zinc-500">
                {title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800/60 bg-zinc-950/60">
        <div className="container mx-auto px-4 max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <span>
            &copy; {new Date().getFullYear()} TechMart. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-zinc-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-zinc-300 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="hover:text-zinc-300 transition-colors"
            >
              Cookies
            </Link>
          </div>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
