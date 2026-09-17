import { getBio } from '@/lib/content/site';
import { SummitHero } from './SummitHero';

export function HomeHero() {
  return <SummitHero bio={getBio()} />;
}
