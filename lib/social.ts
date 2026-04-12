import { CONTACT_EMAIL } from './nav';

export interface SocialLink {
  key: string;
  label: string;
  href: string;
  username?: string;
}

export const SOCIALS: SocialLink[] = [
  { key: 'email', label: 'Email', href: `mailto:${CONTACT_EMAIL}`, username: CONTACT_EMAIL },
  { key: 'github', label: 'GitHub', href: 'https://github.com/BrianASC23', username: 'BrianASC23' },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/brian-cao-cs',
    username: 'brian-cao',
  },
  {
    key: 'x',
    label: 'X / Twitter',
    href: 'https://x.com/BrianAmongStars',
    username: '@BrianAmongStars',
  },
  {
    key: 'medium',
    label: 'Medium',
    href: 'https://medium.com/@brianc40722',
    username: '@brianc40722',
  },
  {
    key: 'leetcode',
    label: 'LeetCode',
    href: 'https://leetcode.com/settings/profile/',
    username: 'BrianASC23',
  },
] as const;

export function getSocial(key: string): SocialLink | undefined {
  return SOCIALS.find((s) => s.key === key);
}
