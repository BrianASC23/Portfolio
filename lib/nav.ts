export interface NavLink {
  href: string;
  label: string;
  /** Show only in the mobile menu, not the desktop navbar. */
  mobileOnly?: boolean;
  /** Trigger a file download instead of client-side navigation. */
  download?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' },
  { href: '/resume/BrianCao-Resume.pdf', label: 'Resume', download: true },
];

export const CONTACT_EMAIL = 'brianc40722@gmail.com';
