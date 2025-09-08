import Link from "next/link";
import React from "react";

interface TopMenuItemProps {
  href: string;
  text: string;
}

export default function TopMenuItem({ href, text }: TopMenuItemProps) {
  return (
    <Link
      href={href}
      className="font-bold text-white no-underline hover:text-blue-400 transition-colors z-20"
    >
      {text}
    </Link>
  );
}
