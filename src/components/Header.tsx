"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <header>
      <div className="hd">
        <Link className="logo" href="/">
          <em>Silver</em>
          <b>EUN CHO</b>
        </Link>
        {!isAdmin && (
          <nav>
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={pathname === href ? "on" : undefined}>
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
