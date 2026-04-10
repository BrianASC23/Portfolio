export interface NavLink {
  href: string;
  label: string;
  /** Show only in the mobile menu, not the desktop navbar. */
  mobileOnly?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' },
  { href: '/resume', label: 'Resume' },
];

export const CONTACT_EMAIL = 'brianc40722@gmail.com';
