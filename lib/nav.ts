export interface NavLink {
  href: string;
  label: string;
  /** Show only in the mobile menu, not the desktop navbar. */
  mobileOnly?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/#work', label: 'Work' },
  { href: '/#about', label: 'About' },
  { href: '/writing', label: 'Writing' },
  { href: '/resume', label: 'Resume' },
  { href: '/#contact', label: 'Contact', mobileOnly: true },
];
