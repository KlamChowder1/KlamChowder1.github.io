export type TimelineCategory = 'work' | 'break' | 'education' | 'volunteer';

export type TimelineEntry = {
  id: string;
  category: TimelineCategory;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD or 'present' for ongoing roles
  title: string;
  subtitle?: string;
  subtitleUrl?: string;
  highlights: string[];
  skills?: string[];
  badge?: string;
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function formatPeriod(startDate: string, endDate: string): string {
  if (endDate === 'present') {
    const [sy, sm] = startDate.split('-').map(Number);
    return `${MONTHS[sm - 1]} ${sy} \u2014 Present`;
  }
  const [sy, sm] = startDate.split('-').map(Number);
  const [ey, em] = endDate.split('-').map(Number);
  if (sy === ey && sm === em) return `${MONTHS[sm - 1]} ${sy}`;
  if (sy === ey) return `${MONTHS[sm - 1]} \u2014 ${MONTHS[em - 1]} ${ey}`;
  return `${MONTHS[sm - 1]} ${sy} \u2014 ${MONTHS[em - 1]} ${ey}`;
}

export const personalInfo = {
  name: 'Kevin Lam',
  location: 'Vancouver, BC',
  github: 'KlamChowder1',
  githubUrl: 'https://github.com/KlamChowder1',
  linkedin: 'kevin-kf-lam',
  linkedinUrl: 'https://www.linkedin.com/in/kevin-kf-lam',
};

export const technicalSkills: Record<string, string[]> = {
  'Languages & Frameworks': [
    'TypeScript',
    'JavaScript',
    'Python',
    'React',
    'Vue',
    'Angular',
    'Node.js',
    'Express',
    'HTML/CSS',
  ],
  'Database & APIs': [
    'GraphQL',
    'REST',
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'DynamoDB',
  ],
  'Tools & Platforms': [
    'Git',
    'Jira',
    'Figma',
    'Postman',
    'Docker',
    'AWS',
    'GCP',
    'Azure',
    'Sentry',
    'Grafana',
    'Datadog',
    'Linux',
  ],
};

export const timelineEntries: TimelineEntry[] = [
  {
    id: 'tetra-tech',
    category: 'work',
    startDate: '2025-04-01',
    endDate: 'present',
    title: 'Full Stack Developer',
    subtitle: 'Tetra Tech',
    subtitleUrl: 'https://www.tetratech.com/',
    highlights: [
      'Working on the FusionMap web application with React, TypeScript, Express, Node.js, PostgreSQL, and Azure to develop a data-driven mapping tool to accelerate project planning for geotechnical engineers.',
      'Refactoring legacy Python scripts used in the flagship predictive hazard detection project to become more resilient and accurate, increasing uptime by 80% and reducing false positives by 50%.',
      'Review pull requests, mentor co-op students, co-lead sprint planning, backlog grooming, and retrospective meetings.',
    ],
    skills: [
      'React',
      'TypeScript',
      'Express',
      'Node.js',
      'HTML/CSS',
      'REST',
      'Postman',
      'PostgreSQL',
      'Azure',
      'Python',
      'Git',
      'Docker',
      'Jira',
      'Sentry',
    ],
  },
  {
    id: 'porton-health',
    category: 'work',
    startDate: '2024-09-01',
    endDate: '2025-03-31',
    title: 'Full Stack Developer',
    subtitle: 'Porton Health',
    subtitleUrl: 'https://www.portonhealth.com/',
    highlights: [
      'Used MongoDB, Express, React, and Node.js to digitize the workflow of healthcare clinics and improve patient care.',
      'Improved the UI/UX flow of appointment booking and automated email reminder systems, reducing phone appointments by 60% and decreasing missed appointments by 20%.',
      'Maintained and improved the browser extension to support all browsers and multiple Electronic Medical Records (EMR) programs for providers and clinical assistants.',
    ],
    skills: [
      'MongoDB',
      'Express',
      'React',
      'Node.js',
      'JavaScript',
      'HTML/CSS',
      'REST',
      'Git',
    ],
  },
  {
    id: 'elections-bc-2024',
    category: 'work',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    title: 'Voting Equipment Officer',
    subtitle: 'Elections BC',
    subtitleUrl: 'https://www.elections.bc.ca/',
    highlights: [
      'Oversaw the setup, troubleshooting, and security of voting technology at an assigned voting place, ensuring proper functioning throughout election day and reporting results to the district electoral office.',
    ],
  },
  {
    id: 'ski-patrol',
    category: 'volunteer',
    startDate: '2024-09-01',
    endDate: 'present',
    title: 'Ski Patroller',
    subtitle: 'Canadian Ski Patrol',
    subtitleUrl: 'https://www.skipatrol.ca/',
    highlights: [
      'Providing first aid and ensuring mountain safety at Cypress Mountain.',
      'Advanced First Aid (with CPR-HCP)',
    ],
  },
  {
    id: 'vass',
    category: 'volunteer',
    startDate: '2023-10-01',
    endDate: '2024-04-30',
    title: 'Ski Instructor',
    subtitle: 'Vancouver Adaptive Snow Sports',
    subtitleUrl: 'https://www.vass.ca/',
    highlights: [
      'Instructed skiing to individuals with disabilities to foster increased accessibility and inclusivity to snow sports.',
      'CADS Ski Level 1',
    ],
  },
  {
    id: 'career-break',
    category: 'break',
    startDate: '2023-05-31',
    endDate: '2024-08-31',
    title: 'Career Break',
    highlights: [
      "Took a break after being laid off during Shopify's 20% reduction in force.",
      'Helped rebuild a backcountry hut with the UBC Varsity Outdoors Club.',
      'Backpacked the West Coast Trail and Sunshine Coast Trail, bike toured the Southern Gulf Islands, and ski toured in the Rockies.',
    ],
  },
  {
    id: 'shopify',
    category: 'work',
    startDate: '2022-05-01',
    endDate: '2023-05-30',
    title: 'Frontend Developer',
    subtitle: 'Shopify',
    subtitleUrl: 'https://www.shopify.com/ca/markets',
    highlights: [
      "Utilized React, TypeScript, and GraphQL to create performant, robust, and accessible interfaces for Markets and Markets Pro within Shopify's admin, affecting 100,000+ merchants worldwide.",
      'Worked closely with 1 frontend developer, 2 UI/UX designers, and 4 backend developers, giving input on Figma prototypes and GraphQL API design decisions.',
      'Hosted daily cross-team collaborations with 8 other frontend developers for learnings, project presentations, code reviews, and discussions on best practices.',
    ],
    skills: [
      'React',
      'TypeScript',
      'HTML/CSS',
      'GraphQL',
      'Figma',
      'Datadog',
      'Grafana',
      'Git',
      'Jira',
    ],
  },
  {
    id: 'agriculture-canada',
    category: 'work',
    startDate: '2021-09-01',
    endDate: '2022-06-30',
    title: 'Software Developer',
    subtitle: 'Agriculture and Agri-Food Canada',
    subtitleUrl: 'https://agriculture.canada.ca/',
    highlights: [
      'Enhanced the BeeBiome platform using Angular, JavaScript, and GCP for bee-related information and metadata queried from the National Center for Biotechnology Information, in collaboration with a research team in Switzerland.',
    ],
    skills: ['Angular', 'JavaScript', 'HTML/CSS', 'REST', 'Postman', 'GCP', 'Git'],
  },
  {
    id: 'bioconversion',
    category: 'work',
    startDate: '2021-05-01',
    endDate: '2021-08-31',
    title: 'Software Engineer (Co-op)',
    subtitle: 'BioConversion Databank Foundation',
    subtitleUrl: 'https://www.bio-conversion.org/',
    highlights: [
      'Developed the Maximizer web application from scratch with 3 other developers using Figma, Vue, Vuetify, JavaScript, and AWS for use by the general public to increase open access to the biological sciences.',
    ],
    skills: [
      'Vue',
      'Vuetify',
      'JavaScript',
      'HTML/CSS',
      'REST',
      'Postman',
      'DynamoDB',
      'AWS',
      'Figma',
      'Git',
      'Jira',
    ],
  },
  {
    id: 'bc-cancer',
    category: 'work',
    startDate: '2020-09-01',
    endDate: '2021-04-30',
    title: 'Full Stack Developer (Co-op)',
    subtitle: 'BC Cancer (Qurit Lab)',
    subtitleUrl: 'https://jnm.snmjournals.org/content/62/supplement_1/1183',
    highlights: [
      'Built the RAIVEN web application with 1 other developer using Vue, Vuetify, JavaScript, Nuxt, Python, and PostgreSQL for use by physicists and research scientists on DICOM image processing and manipulation.',
    ],
    skills: [
      'Vue',
      'Vuetify',
      'Nuxt',
      'JavaScript',
      'HTML/CSS',
      'REST',
      'Postman',
      'Python',
      'PostgreSQL',
      'Git',
      'Docker',
    ],
  },
  {
    id: 'maths-no-problem',
    category: 'work',
    startDate: '2020-05-01',
    endDate: '2020-08-31',
    title: 'Full Stack Developer (Co-op)',
    subtitle: 'Maths — No Problem!',
    subtitleUrl: 'https://mathsnoproblem.com/en/products/insights/',
    highlights: [
      'Developed mobile-friendly and accessible web applications for the Insights Math Assessment Tool, using HTML/CSS, React/Redux, JavaScript, and MySQL, in collaboration with UI/UX designers and other developers.',
    ],
    skills: [
      'React',
      'Redux',
      'JavaScript',
      'Node.js',
      'Express',
      'HTML/CSS',
      'REST',
      'Postman',
      'MySQL',
      'Git',
      'Docker',
      'Jira',
    ],
  },
  {
    id: 'ig-micromed',
    category: 'work',
    startDate: '2018-04-01',
    endDate: '2019-09-30',
    title: 'Laboratory Technician (Co-op)',
    subtitle: 'I.G. MicroMed',
    subtitleUrl: 'http://www.igmicromed.com/',
    highlights: [
      'Performed aseptic technique for sample analysis following standard methods (Health Canada, ISO, FDA-BAM) of food and pharmaceutical products.',
      'Followed Good Laboratory Practices (GLP) and Good Documentation Practices (GDP) to ensure accurate follow through with each individual sample.',
    ],
  },
  {
    id: 'bcit',
    category: 'education',
    startDate: '2017-09-01',
    endDate: '2019-05-31',
    title: 'Diploma (Biotechnology)',
    subtitle: 'BCIT',
    subtitleUrl: 'https://www.bcit.ca/',
    highlights: [
      'WHMIS Certified 2019',
      'Radiation Safety Training in Handling, Disposal, and Decontamination of Radionuclides 2019',
      'UBC-BCIT Biotechnology Club – VP Technology (Sept 2018 – May 2019)',
      'UBC-BCIT Biotechnology Club – Social Media Coordinator (Sept 2017 – May 2018)',
    ],
    skills: ['Git', 'HTML/CSS', 'Python'],
  },
  {
    id: 'ubc',
    category: 'education',
    startDate: '2016-09-01',
    endDate: '2022-05-31',
    title: 'B.Sc. (Computer Science and Microbiology & Immunology)',
    subtitle: 'University of British Columbia',
    subtitleUrl: 'https://www.ubc.ca/',
    highlights: [
      'UBC Varsity Outdoors Club – Member (Nov 2021 – Present)',
      'International Collegiate Programming Contest (Jan – May 2021)',
      'Food Saver – nwHacks 2020 (Jan 2020)',
      'UBC-BCIT Biotechnology Club – Fourth Year Representative (Sept 2019 – May 2020)',
      'Virtual Lanes – Decode Congestion (Nov 2019)',
      'Sepsis Analysis – Directed Study Project (May – Aug 2019)',
      'Viral Voyager – hackseq18 (Oct 2018)',
      'UBC iGEM (Feb – Oct 2018)',
    ],
    skills: [
      'TypeScript',
      'JavaScript',
      'Python',
      'React',
      'Node.js',
      'HTML/CSS',
      'MySQL',
      'REST',
      'Git',
      'Figma',
      'GCP',
      'Linux',
    ],
  },
  {
    id: 'flux-2017',
    category: 'work',
    startDate: '2017-05-01',
    endDate: '2017-08-31',
    title: 'Games Attendant',
    subtitle: 'FLUX Entertainment',
    subtitleUrl: 'https://www.fluxentertainment.ca/',
    highlights: [
      'Monitored play, enforced rules and helped patrons with prize redemption at the Illumination Summer Night Market.',
    ],
  },
  {
    id: 'flux-2016',
    category: 'work',
    startDate: '2016-05-01',
    endDate: '2016-08-31',
    title: 'Games Attendant',
    subtitle: 'FLUX Entertainment',
    subtitleUrl: 'https://www.fluxentertainment.ca/',
    highlights: [
      'Monitored play, enforced rules and helped patrons with prize redemption at the Illumination Summer Night Market.',
      'FLUX Employee of the Year 2016',
    ],
  },
  {
    id: 'gap',
    category: 'work',
    startDate: '2016-12-01',
    endDate: '2017-08-31',
    title: 'Sales Associate',
    subtitle: 'GAP',
    subtitleUrl: 'https://www.gapcanada.ca/',
    highlights: [
      'Assisted customers find new and exciting clothing while providing them with an enjoyable shopping experience.',
    ],
  },
  {
    id: 'elections-bc',
    category: 'work',
    startDate: '2017-05-01',
    endDate: '2017-05-31',
    title: 'Voting Officer',
    subtitle: 'Elections BC',
    subtitleUrl: 'https://www.elections.bc.ca/',
    highlights: [
      'Served voters in a friendly and efficient manner while checking for voter identification and giving instructions for the appropriate ballot markings.',
    ],
  },
  {
    id: 'aquarium',
    category: 'volunteer',
    startDate: '2015-01-01',
    endDate: '2021-08-31',
    title: 'Gallery Educator',
    subtitle: 'Vancouver Aquarium',
    subtitleUrl: 'https://www.vanaqua.org/',
    highlights: ['Educated guests about the conservation of aquatic animals.'],
  },
  {
    id: 'pne',
    category: 'work',
    startDate: '2015-08-01',
    endDate: '2015-09-01',
    title: 'Games Attendant',
    subtitle: 'Pacific National Exhibition',
    subtitleUrl: 'https://www.pne.ca/',
    highlights: [
      'Handled cash exchanges while maintaining a balanced cash float in a quick-paced environment.',
      'Pacific National Exhibition Spotlight Award 2015',
      'Pacific National Exhibition On-the-Spot Superstar Award 2015',
    ],
  },
];

export const categoryMeta: Record<
  TimelineCategory,
  { label: string; color: string }
> = {
  work: { label: 'Work', color: '#6366f1' },
  break: { label: 'Break', color: '#f59e0b' },
  education: { label: 'Education', color: '#14b8a6' },
  volunteer: { label: 'Volunteer', color: '#ec4899' },
};
