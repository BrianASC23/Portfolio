export type CommandAction =
  | { type: 'navigate'; href: string }
  | { type: 'external'; href: string }
  | { type: 'callback'; id: string };

export interface Command {
  id: string;
  label: string;
  group: 'navigate' | 'social' | 'action';
  shortcut?: string;
  keywords?: string[];
  action: CommandAction;
}

export const commands: Command[] = [
  {
    id: 'nav-home',
    label: 'Go to home',
    group: 'navigate',
    keywords: ['home', 'index'],
    action: { type: 'navigate', href: '/' },
  },
  {
    id: 'nav-projects',
    label: 'Browse all projects',
    group: 'navigate',
    keywords: ['work', 'case studies'],
    action: { type: 'navigate', href: '/projects' },
  },
  {
    id: 'nav-writing',
    label: 'Read writing',
    group: 'navigate',
    keywords: ['blog', 'medium', 'posts'],
    action: { type: 'navigate', href: '/writing' },
  },
  {
    id: 'nav-resume',
    label: 'View resume',
    group: 'navigate',
    keywords: ['cv'],
    action: { type: 'navigate', href: '/resume' },
  },
  {
    id: 'social-github',
    label: 'Open GitHub',
    group: 'social',
    action: { type: 'external', href: 'https://github.com/BrianASC23' },
  },
  {
    id: 'social-linkedin',
    label: 'Open LinkedIn',
    group: 'social',
    action: { type: 'external', href: 'https://linkedin.com/in/brian-cao-7b9a89211' },
  },
  {
    id: 'action-email',
    label: 'Copy email address',
    group: 'action',
    action: { type: 'callback', id: 'copy-email' },
  },
];
