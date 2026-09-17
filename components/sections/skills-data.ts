import type { IconType } from 'react-icons';
import { FaAws, FaJava } from 'react-icons/fa';
import {
  SiCplusplus,
  SiDocker,
  SiDotnet,
  SiExpress,
  SiFastapi,
  SiFigma,
  SiFirebase,
  SiFlask,
  SiGit,
  SiGithubactions,
  SiGnubash,
  SiGooglecloud,
  SiHuggingface,
  SiJavascript,
  SiKubernetes,
  SiLangchain,
  SiLinux,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiNumpy,
  SiOcaml,
  SiPandas,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiScikitlearn,
  SiSplunk,
  SiStorybook,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from 'react-icons/si';
import {
  TbBrain,
  TbBrandCSharp,
  TbCloud,
  TbCpu,
  TbInfinity,
  TbServer2,
  TbSql,
} from 'react-icons/tb';
import { VscAzure } from 'react-icons/vsc';

export interface Skill {
  name: string;
  icon: IconType;
  /** Brand hue for the icon and hover glow; neutral grey for black marks so they read in both themes. */
  color: string;
  /** Short keycap legend; defaults to `name`. */
  key?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  /** Specializations are concepts rather than products, so they get wide keys with full names. */
  wide?: boolean;
  skills: Skill[];
}

const NEUTRAL = '#808080';
const ACCENT = 'var(--color-accent)';

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'specializations',
    label: 'Specializations',
    wide: true,
    skills: [
      { name: 'Systems', icon: TbCpu, color: ACCENT },
      { name: 'Machine Learning', icon: TbBrain, color: ACCENT },
      { name: 'CI/CD Pipelines', icon: TbInfinity, color: ACCENT },
      { name: 'Backend Infrastructure', icon: TbServer2, color: ACCENT },
      { name: 'Cloud Computing', icon: TbCloud, color: ACCENT },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Platforms',
    skills: [
      { name: 'Docker', icon: SiDocker, color: '#2496ED', key: 'DKR' },
      { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5', key: 'K8S' },
      { name: 'AWS', icon: FaAws, color: '#FF9900' },
      { name: 'Azure', icon: VscAzure, color: '#0078D4', key: 'AZR' },
      { name: 'Google Cloud', icon: SiGooglecloud, color: '#4285F4', key: 'GCP' },
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'GitHub Actions', icon: SiGithubactions, color: '#2088FF', key: 'GHA' },
      { name: 'Linux', icon: SiLinux, color: '#FCC624', key: 'LNX' },
      { name: 'Firebase', icon: SiFirebase, color: '#FFCA28', key: 'FIRE' },
      { name: 'Supabase', icon: SiSupabase, color: '#3FCF8E', key: 'SUPA' },
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', key: 'PSQL' },
      { name: 'MongoDB', icon: SiMongodb, color: '#47A248', key: 'MNGO' },
      { name: 'Splunk', icon: SiSplunk, color: '#65A637', key: 'SPLK' },
      { name: 'Vercel', icon: SiVercel, color: NEUTRAL, key: 'VRCL' },
      { name: 'Storybook', icon: SiStorybook, color: '#FF4785', key: 'SB' },
      { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks & Libraries',
    skills: [
      { name: 'PyTorch', icon: SiPytorch, color: '#EE4C2C', key: 'TORCH' },
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: NEUTRAL, key: 'NXT' },
      { name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E', key: 'NODE' },
      { name: 'ASP.NET Core', icon: SiDotnet, color: '#8B6CEF', key: '.NET' },
      { name: 'Flask', icon: SiFlask, color: NEUTRAL },
      { name: 'Express', icon: SiExpress, color: NEUTRAL, key: 'EXP' },
      { name: 'FastAPI', icon: SiFastapi, color: '#009688', key: 'FAPI' },
      { name: 'LangGraph', icon: SiLangchain, color: NEUTRAL, key: 'LANG' },
      { name: 'Hugging Face', icon: SiHuggingface, color: '#FFD21E', key: 'HF' },
      { name: 'scikit-learn', icon: SiScikitlearn, color: '#F7931E', key: 'SKL' },
      { name: 'Pandas', icon: SiPandas, color: '#E70488', key: 'PD' },
      { name: 'NumPy', icon: SiNumpy, color: '#4DABCF', key: 'NP' },
      { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4', key: 'TW' },
    ],
  },
  {
    id: 'languages',
    label: 'Languages',
    skills: [
      { name: 'Python', icon: SiPython, color: '#3776AB', key: 'PY' },
      { name: 'C++', icon: SiCplusplus, color: '#00599C' },
      { name: 'C#', icon: TbBrandCSharp, color: '#9B4F96' },
      { name: 'Java', icon: FaJava, color: '#E76F00' },
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', key: 'JS' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', key: 'TS' },
      { name: 'SQL', icon: TbSql, color: '#4479A1' },
      { name: 'OCaml', icon: SiOcaml, color: '#EC6813', key: 'OCAML' },
      { name: 'Bash', icon: SiGnubash, color: '#4EAA25', key: 'BASH' },
      { name: 'PHP', icon: SiPhp, color: '#777BB4' },
    ],
  },
];
