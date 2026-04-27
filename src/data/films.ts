// Films data - edit this file to update films
// Add your film projects here

const placeholderStills = [
  'https://images.unsplash.com/photo-1500382017468-9049fed837ef?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1541976844349-0c4edc4b5f54?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1538300342682-cf57afb97285?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=450&fit=crop'
];

export const getFilm = (slug: string) => films.find(f => f.slug === slug);
export const getAllFilms = () => films;

export const films = [
  {
    slug: 'water-brings-hope',
    title: 'Water Brings Hope',
    description: 'A documentary exploring the impact of clean water access on rural communities in developing nations. Through intimate portraits of families and workers, the film reveals the transformative power of simple infrastructure.',
    videoUrl: 'https://player.vimeo.com/video/1008161545',
    runtime: '18:42',
    format: 'DCP',
    resolution: '4K',
    year: '2023',
    client: 'WaterAid',
    role: 'Director / Editor',
    awards: [],
    stills: placeholderStills,
    credits: [
      { role: 'Director', name: 'Tom Maher' },
      { role: 'Producer', name: 'Sarah Chen' },
      { role: 'Cinematographer', name: 'Marcus Webb' },
      { role: 'Editor', name: 'Tom Maher' },
      { role: 'Sound Design', name: 'Jake Morrison' },
      { role: 'Music', name: 'Elena Rivers' },
      { role: 'Colorist', name: 'David Park' },
      { role: 'Executive Producer', name: 'James Wright' }
    ]
  },
  {
    slug: 'neon-pulse',
    title: 'NEON_PULSE',
    description: 'An abstract visual journey through Tokyo\'s neon-lit streets at night.',
    videoUrl: '',
    runtime: '04:12',
    format: 'Digital',
    resolution: '4K',
    year: '2023',
    client: 'Personal Project',
    role: 'Filmmaker / Editor',
    awards: [],
    stills: placeholderStills,
    credits: [
      { role: 'Director', name: 'Tom Maher' },
      { role: 'Editor', name: 'Tom Maher' }
    ]
  },
  {
    slug: 'void-stare',
    title: 'VOID_STARE',
    videoUrl: '',
    runtime: '08:45',
    format: 'Digital',
    resolution: '8K',
    year: '2024',
    stills: placeholderStills,
    credits: []
  },
  {
    slug: 'static-wave',
    title: 'STATIC_WAVE',
    videoUrl: '',
    runtime: '02:33',
    year: '2023',
    stills: placeholderStills,
    credits: []
  },
  {
    slug: 'echo-chamber',
    title: 'ECHO_CHAMBER',
    videoUrl: '',
    runtime: '15:22',
    year: '2024',
    stills: placeholderStills,
    credits: []
  },
  {
    slug: 'flux-state',
    title: 'FLUX_STATE',
    videoUrl: '',
    runtime: '00:47',
    year: '2024',
    stills: placeholderStills,
    credits: []
  },
  {
    slug: 'ghost-signal',
    title: 'GHOST_SIGNAL',
    videoUrl: '',
    runtime: '06:18',
    year: '2023',
    stills: placeholderStills,
    credits: []
  }
];