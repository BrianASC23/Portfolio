export interface WorkProject {
  id: string;
  title: string;
  company: string;
  role: string;
  client: string;
  tags: string[];
  imageUrl: string;
  description: string;
}

export const WORK_PROJECTS: WorkProject[] = [
  {
    id: 'neural-genesis',
    title: 'Neural Genesis',
    company: 'Quantum Labs',
    role: 'Lead Engineer',
    client: 'NeuroTech Inc.',
    tags: ['AI/ML', 'TensorFlow', 'Python'],
    imageUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    description:
      'A real-time neural network visualization platform that maps cognitive patterns into interactive 3D landscapes, enabling researchers to explore AI decision-making processes intuitively.',
  },
  {
    id: 'chrono-mesh',
    title: 'Chrono Mesh',
    company: 'Temporal Systems',
    role: 'Full-Stack Architect',
    client: 'DataStream Corp.',
    tags: ['React', 'Go', 'WebSocket'],
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    description:
      'A distributed event-streaming pipeline with sub-millisecond latency, processing 2M+ events per second with real-time anomaly detection and adaptive load balancing.',
  },
  {
    id: 'void-protocol',
    title: 'Void Protocol',
    company: 'CipherSec',
    role: 'Security Engineer',
    client: 'Fortis Defense',
    tags: ['Rust', 'Cryptography', 'Systems'],
    imageUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80',
    description:
      'A zero-knowledge proof framework for verifiable computation, enabling privacy-preserving audits across distributed systems without exposing sensitive data.',
  },
  {
    id: 'flux-engine',
    title: 'Flux Engine',
    company: 'Parallax Studios',
    role: 'Graphics Engineer',
    client: 'Neon Interactive',
    tags: ['C++', 'Vulkan', 'GLSL'],
    imageUrl:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
    description:
      'A high-performance physics engine featuring GPU-accelerated particle simulations, real-time fluid dynamics, and deterministic replay for competitive gaming applications.',
  },
  {
    id: 'phantom-grid',
    title: 'Phantom Grid',
    company: 'Decentralized Labs',
    role: 'Protocol Engineer',
    client: 'ChainVault DAO',
    tags: ['Solidity', 'TypeScript', 'P2P'],
    imageUrl:
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1400&q=80',
    description:
      'A peer-to-peer mesh network protocol enabling censorship-resistant communication with end-to-end encryption and onion-routed message delivery.',
  },
  {
    id: 'echo-synthesis',
    title: 'Echo Synthesis',
    company: 'Harmonic AI',
    role: 'ML Engineer',
    client: 'SoundScape Inc.',
    tags: ['PyTorch', 'WebAudio', 'Next.js'],
    imageUrl:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=80',
    description:
      'An AI-powered audio processing platform that separates, enhances, and spatializes sound sources in real-time using transformer-based neural architectures.',
  },
];
