export interface SkillGroup {
  id: string;
  label: string;
  skills: string[];
}

/**
 * Skills as plain names, in the order a reader should meet them: what he
 * specializes in first, then the concrete stack underneath.
 *
 * Deliberately no icons or brand colours. Sixty logos in sixty hues fight the
 * page for attention and tell a recruiter scanning for keywords nothing the
 * word itself does not, and they cost sixty inline SVGs in the payload.
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'specializations',
    label: 'Specializations',
    skills: [
      'Systems',
      'Machine learning',
      'CI/CD pipelines',
      'Backend infrastructure',
      'Cloud computing',
    ],
  },
  {
    id: 'languages',
    label: 'Languages',
    skills: [
      'Python',
      'C++',
      'C#',
      'Java',
      'TypeScript',
      'JavaScript',
      'SQL',
      'OCaml',
      'Bash',
      'PHP',
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    skills: [
      'PyTorch',
      'scikit-learn',
      'Pandas',
      'NumPy',
      'Hugging Face',
      'LangGraph',
      'React',
      'Next.js',
      'Node.js',
      'Express',
      'FastAPI',
      'Flask',
      'ASP.NET Core',
      'Tailwind',
    ],
  },
  {
    id: 'tools',
    label: 'Tools & platforms',
    skills: [
      'Docker',
      'Kubernetes',
      'AWS',
      'Azure',
      'Google Cloud',
      'PostgreSQL',
      'MongoDB',
      'Supabase',
      'Firebase',
      'Git',
      'GitHub Actions',
      'Linux',
      'Splunk',
      'Vercel',
      'Storybook',
      'Figma',
    ],
  },
];
