// Almaya — every advisor in one place.
//
// This file is the single source for advisor data. It feeds:
//   * Tutors.dc.html (the advisor grid: name, photo, tier, rate, school, specialty)
//   * every "<Name> Profile.dc.html" page, which is now just SEO tags plus
//       <x-import component-from-global-scope="TutorProfile" data-slug="neva-hidajat"></x-import>
//
// To edit an advisor (price, bio, testimonial, school), change their entry below.
// To add one: add an entry, copy any Profile page, change its <meta> tags and data-slug.
// To remove one: delete the entry and the Profile page, add a redirect in _redirects.
//
// Fields: tier is t1 Advisor · t2 Senior Advisor · t3 Lead Advisor · t4 Principal Advisor.
// Text fields may contain simple HTML (<em>, <a>) and entities (&amp;).
// Optional: bookHref (own booking page), testimonials, band {label,text}, marquee {label,text}.
(() => {
  if (window.AM_TUTORS) return;

  window.AM_TUTORS = [
  {
    slug: "arjun-jaswal",
    name: "Arjun Jaswal",
    photo: "./assets/experts/arjun-jaswal.jpeg",
    tier: "t1",
    rate: 90,
    school: "Cornell",
    specialty: "Transfer Applications & Essays",
    heroSchool: "Cornell University",
    schools: [
      {
        logo: "./assets/logos/cornell-3.png",
        h: 64,
        name: "<div style=\"font-weight:500\">Cornell University</div><div style=\"font-size:13px;color:var(--text-muted)\">Undergraduate</div>"
      }
    ],
    about: {
      title: "About Arjun",
      subtitle: "Our transfer applicant specialist",
      paras: [
        "Hi I’m Arjun. I’m currently a junior studying Biological Sciences on the pre-med track. My path to Cornell was definitely not the perfect GPA, 1600 SAT route. Despite my ordinary high school transcript, I received several acceptances to top-20 schools.",
        "Admissions officers care about much more than just stats, and this holds especially true for transfer applications. Transfer admissions are a far more holistic process, and it’s more about fit than anything else. The strongest applications tell a clear, compelling narrative of what you’ve learned so far, why you’re making a move, why you need to be at that particular school, and why that school needs you. I know the ins and outs of the transfer process and I take the time to really get to know every student and where their ambitions lie to build that convincing story that admissions officers will love."
      ]
    },
    mentor: {
      title: "Meet Your Mentor",
      subtitle: "Where Arjun's expertise really shows up",
      paras: [
        "Arjun has helped a transfer applicant get into Cornell by rebuilding their essays around a clearer, more honest narrative arc — the same approach that got him into Cornell himself despite not having the highest GPA. He's also helped a friend with a low high-school GPA and no test scores get admitted to BU and Lafayette (with scholarship), and helped a neighbor's personal statement land her at the University of Miami. Across every essay, his focus is the same: find the real story first, then make the writing serve it."
      ]
    }
  },
  {
    slug: "neva-hidajat",
    name: "Neva Hidajat",
    photo: "./assets/experts/neva-hidajat.jpg",
    tier: "t1",
    rate: 95,
    school: "Stanford",
    specialty: "Personal Statements & Supplements",
    heroSchool: "Stanford University",
    schools: [
      {
        logo: "./assets/logos/stanford-shield.png",
        h: 64,
        name: "Stanford University",
        sub: "M.S. Sustainability Science &amp; Practice (Stanford Doerr School), in progress — Class of 2028"
      }
    ],
    about: {
      title: "About Neva",
      subtitle: "Your personal statement &amp; Stanford supplement specialist",
      paras: [
        "Hi, I'm Neva. I applied to college with pre-med in mind but ended up switching over to engineering and sustainability for my undergrad at Stanford. I know what it's like to have a wide range of seemingly disparate interests and wonder how one could possibly connect the dots in an application (literally me).",
        "I'm passionate about helping students reflect on their experiences to write captivating and unique essays that capture not just their accomplishments but the story and personality behind them. I'm serious about getting to know my student's full story to help them highlight strengths they might not even know they have.",
        "Some topics I wrote about in my college apps and would love to help students bring to life (not limited to these though): podcasting, starting a business, clinical research, volunteering/fundraising, teaching/playing music, AP art, journalism, debate, mock trial, public speaking. I can also add perspective from my more recent experiences across Stanford, entrepreneurship, finance, and sustainability, which I drew on for my M.S. application!"
      ]
    },
    mentor: {
      title: "Meet Your Mentor",
      subtitle: "Where Neva's expertise really shows up",
      paras: [
        "Neva has edited over 80+ college application essays — Personal Insight Questions and Stanford-specific supplements — helping students build a cohesive personal narrative across their essays and extracurriculars. She pushes students toward specificity and voice rather than what they think admissions officers want to hear, treating every supplement as part of one larger story. She has helped students get accepted into all of the UC schools, USC, and Purdue."
      ]
    },
    testimonials: [
      {
        quote: "\"Neva was so kind and amazing! She reached back out immediately and helped me the same day over Zoom. It was amazing having a different person look over my essay — I could see things about it I wasn't able to notice being the one writing it.\""
      }
    ]
  },
  {
    slug: "jonathan-mizrahi",
    name: "Jonathan Mizrahi",
    photo: "./assets/experts/jonathan-mizrahi.jpg",
    tier: "t1",
    rate: 90,
    school: "NYU",
    specialty: "Storytelling & Screenwriting Craft",
    bookHref: "./Jon Booking.dc.html",
    heroSchool: "NYU Tisch School of the Arts",
    schools: [
      {
        logo: "./assets/logos/nyu-shield.png",
        h: 64,
        name: "<div style=\"font-weight:500\">NYU Tisch School of the Arts</div><div style=\"font-size:13px;color:var(--text-muted)\">Film &amp; storytelling</div>"
      }
    ],
    about: {
      title: "About Jonathan",
      subtitle: "Your screenwriter &amp; storytelling coach",
      paras: [
        "Hi, I'm Jonathan. I'm a produced screenwriter and published author who spent several years in film development, and created a video essay series on LA urbanism funded by a local PAC.",
        "On set, I've managed and mentored film interns, and off set I've helped students at every stage of the college essay. Storytelling is the thread through all of it — figuring out the shape of a story, and where the real stakes are, translates directly into how I help students think about their own essays."
      ]
    },
    mentor: {
      title: "Meet Your Mentor",
      subtitle: "Where Jonathan's expertise really shows up",
      paras: [
        "He helped a musician land a multimedia project ahead of a PhD in music composition at CUNY, and helped a high schooler get into NYU Early Decision.",
        "He also helped a graduate applicant write her application essays; she was accepted to NYU, YU, and Fordham, and will attend Hunter for her MSW. He's equally comfortable with a personal statement, a supplement, or a portfolio essay for the arts."
      ]
    }
  },
  {
    slug: "arianna-zarka",
    name: "Arianna Zarka",
    photo: "./assets/experts/arianna-zarka.jpeg",
    tier: "t3",
    rate: 200,
    school: "Cornell",
    specialty: "Essay Coaching & Storytelling",
    heroSchool: "Cornell University · Cornell Law School",
    schools: [
      {
        logo: "./assets/logos/cornell-3.png",
        h: 52,
        name: "Cornell University",
        sub: "BA, Communication; minor, Law &amp; Society"
      },
      {
        logo: "./assets/logos/cornell-3.png",
        h: 52,
        name: "Cornell Law School",
        sub: "Juris Doctor (JD)"
      }
    ],
    about: {
      title: "About Arianna",
      subtitle: "Your college essay &amp; storytelling mentor",
      paras: [
        "Hi, I'm Arianna. I grew up attending a dual-curriculum school, splitting my day between secular and religious studies — English was always my strongest subject, and I'd tutor classmates after school. In college I majored in Communication with a minor in Law and Society — nearly every course was graded on essays rather than exams, so I wrote constantly.",
        "I later wrote dozens of essays for my own law school applications, including my personal statement and supplemental essays, and found I genuinely enjoyed the creative problem-solving of shaping a life story into a compelling narrative — a skill that turned out to be as useful in law as it was in college admissions."
      ]
    },
    mentor: {
      title: "Meet Your Mentor",
      subtitle: "Where Arianna's expertise really shows up",
      paras: [
        "Arianna now works full-time as an attorney, but she's held onto a real appreciation for essay writing and creativity outside the office. During and after law school she's helped friends and colleagues edit resumes, write cover letters, and draft law school personal statements — anything from brainstorming a story from scratch to polishing a nearly-finished draft.",
        "A friend she coached got into Hofstra Law with scholarship money after she helped him rework his personal statement, and she brings that same close, sentence-by-sentence attention to every student she works with — treating each essay as a piece of writing worth getting right, not just a box to check."
      ]
    }
  },
  {
    slug: "samantha-lofman",
    name: "Samantha Lofman",
    photo: "./assets/experts/samantha-lofman.jpg",
    tier: "t2",
    rate: 120,
    school: "Dartmouth",
    specialty: "Creative Writing & Storytelling",
    heroSchool: "Dartmouth College",
    schools: [
      {
        logo: "./assets/logos/dartmouth-shield.png",
        h: 56,
        name: "Dartmouth College",
        sub: "BA, Earth Science; minor, Government"
      },
      {
        logo: "./assets/logos/columbia-shield.png",
        h: 56,
        name: "Columbia SIPA",
        sub: "Master of International Affairs, expected May 2028"
      }
    ],
    about: {
      title: "About Samantha",
      subtitle: "Your writing &amp; storytelling mentor",
      paras: [
        "Hi, I'm Samantha. I'm a singer/songwriter who has told stories through lyrics, poems, and essays since childhood, releasing two EPs of original music. My Earth Science major and Government minor gave me heavy exposure to academic writing and science communication.",
        "As the Environmental Research Intern for the San Luis Valley Ecosystem Council, I wrote articles on land and mineral-rights disputes and helped draft a legislative proposal for wilderness expansion, which I presented to county commissioners."
      ]
    },
    mentor: {
      title: "Meet Your Mentor",
      subtitle: "Where Samantha's expertise really shows up",
      paras: [
        "As an Essay Specialist at Vanguard College Prep and independently as a freelance counselor, she coached students through the full application process — resume building, college lists, brainstorming, and essays. Her students were admitted to the University of Florida with Honors, UT Austin, and the University of Wisconsin.",
        "She has spent two years as a private guitar and piano teacher and as a freelance Hebrew tutor, building the same skill of diagnosing where a student is stuck and adapting to how they learn — and she brings a songwriter's ear for rhythm and voice to every essay she edits."
      ]
    }
  },
  {
    slug: "joseph-schlesinger",
    name: "Joseph Schlesinger",
    photo: "./assets/experts/joseph-schlesinger.jpeg",
    tier: "t2",
    rate: 105,
    school: "NYU",
    specialty: "Writing & Editing Craft",
    heroSchool: "New York University",
    schools: [
      {
        logo: "./assets/logos/nyu-shield.png",
        h: 52,
        name: "NYU",
        sub: "BA, English Literature; minor, Classical Civilization"
      },
      {
        logo: "./assets/logos/nyu-shield.png",
        h: 52,
        name: "NYU Schack",
        sub: "Masters in Real Estate (graduating this fall)"
      }
    ],
    about: {
      title: "About Joseph",
      subtitle: "Your writing &amp; editing coach",
      paras: [
        "Hi, I'm Joseph. I majored in English Literature at NYU with a minor in Classical Civilization, focused on writing and analyzing literature, and spent two years tutoring English-related subjects on Wyzant.",
        "I also worked as an editorial assistant for a professional freelance editor, editing fiction for grammar and story flow — work that sharpened my eye for pacing and voice as much as grammar."
      ]
    },
    mentor: {
      title: "Meet Your Mentor",
      subtitle: "Where Joseph's expertise really shows up",
      paras: [
        "Line-by-line clarity and story flow are his focus — he helps students brainstorm topics and ideas, then sharpens grammar and structure so the writing reads cleanly from start to finish. He treats every essay, personal or academic, as a piece of writing worth caring about, and is as comfortable untangling a five-paragraph history essay as he is a college personal statement."
      ]
    },
    testimonials: [
      {
        quote: "\"Joseph helped me with some difficult English courses and helped me brainstorm topics and ideas for my essays. He was always on time and would communicate with me in a quick and professional manner.\"",
        by: "— Claus"
      },
      {
        quote: "\"Helped in improving the resume of my sibling with grammatical corrections and formatting improvements. Patiently understood, read through the document, and had a working session — very engaging and helpful.\"",
        by: "— Deepak"
      }
    ]
  },
  {
    slug: "gabriel-nagel",
    name: "Gabriel Nagel",
    photo: "./assets/experts/gabriel.png",
    tier: "t2",
    rate: 120,
    school: "Stanford",
    specialty: "Essays & Passion Projects",
    heroSchool: "Stanford University",
    schools: [
      {
        logo: "./assets/logos/stanford-shield.png",
        h: 64,
        name: "Stanford University",
        sub: "Undergraduate"
      }
    ],
    about: {
      title: "About Gabriel",
      subtitle: "Your essay &amp; passion-project coach",
      paras: [
        "Hi, I'm Gabriel. I've tutored for a number of years on Wyzant, with direct experience helping students with passion projects and writing. My own personal statement won Stanford's Booth Undergraduate Prize, and I'm a Coca-Cola Scholar. Writing is genuinely something I love — I still think about essays the way I did when I was drafting my own, hunting for the detail that makes a story unmistakably someone's own."
      ]
    },
    mentor: {
      title: "Meet Your Mentor",
      subtitle: "Where Gabriel's expertise really shows up",
      paras: [
        "He gives thorough, asynchronous line-by-line edits with clear explanations, turned around quickly, and pairs that with patient college-counseling guidance on how top-tier colleges evaluate applicants. He's especially useful for students who already have a strong idea but need help shaping it into something concise and vivid rather than overwritten."
      ]
    },
    testimonials: [
      {
        quote: "\"Gabriel has made a remarkable impact on our children's academic journey. His expertise, patience, and personalized approach helped my daughter craft more concise, authentic, and compelling essays.\"",
        by: "— Linh"
      },
      {
        quote: "\"Gabriel provided asynchronous, line-by-line edits on my essays with clear, thoughtful explanations within 24 hours. His comments really helped improve my structure and storytelling.\"",
        by: "— Liaobo"
      }
    ],
    band: {
      label: "Recognition",
      text: "Stanford Booth Undergraduate Prize · Coca-Cola Scholar"
    }
  },
  {
    slug: "sarah-rosen",
    name: "Sarah Rosen",
    photo: "./assets/experts/sarah-rosen.jpeg",
    tier: "t3",
    rate: 300,
    school: "Yale",
    specialty: "Application Strategy & Positioning",
    heroSchool: "Yale University · BA 2012",
    schools: [
      {
        logo: "./assets/logos/yale-shield.png",
        h: 52,
        name: "Yale University",
        sub: "BA, 2012"
      },
      {
        logo: "./assets/logos/nyu-shield.png",
        h: 52,
        name: "NYU",
        sub: "MFA, Creative Writing (in progress)"
      }
    ],
    about: {
      title: "About Sarah",
      subtitle: "Your published essayist &amp; strategist",
      paras: [
        "Hi, I'm Sarah. I was the assistant director of the MFA in Creative Writing at JTS under director Etgar Keret, advising on curriculum and programming a storytelling festival. I studied Film for my BA at Yale, and as a writer, my creative non-fiction has been published in the New York Times as a Modern Love essay, in Harper's, and other publications. I've also written screenplays and TV show pitches, the latter in collaboration with major Netflix producers.",
        "I worked for years as a journalist, writing profiles on cultural figures and the arts for the Forward, JTA, the Times of Israel, the New York Times, and more. Feel free to browse my website, <a href=\"https://sarahrosen.net\" target=\"_blank\" rel=\"noopener\">sarahrosen.net</a>."
      ]
    },
    mentor: {
      title: "Meet Your Mentor",
      subtitle: "Where Sarah's expertise really shows up",
      paras: [
        "I bring two qualities to every essay I edit: technical editing — grammar, structure, and clarity — and personalization, shaping the piece so it still sounds like the student, not me. I've tutored students in college essay editing and the personal essay on and off since 2013, both independently and for companies like Ivy Global, a national test-prep and admissions firm.",
        "My students have gone on to Colgate, Harvard Law School, a PhD program in religious studies at Princeton, and Wharton. As a teacher, I've also taught high school students and younger in history and Hebrew school."
      ]
    }
  },
  {
    slug: "eitan-ginsburg",
    name: "Eitan Ginsburg",
    photo: "./assets/experts/eitan.png",
    tier: "t4",
    rate: 540,
    school: "NYU",
    specialty: "Storytelling & College Essays",
    heroSchool: "New York University",
    schools: [
      {
        logo: "./assets/logos/nyu-shield.png",
        h: 52,
        name: "NYU",
        sub: "BA"
      },
      {
        logo: "./assets/logos/nyu-shield.png",
        h: 52,
        name: "NYU",
        sub: "MFA, Fiction Writing"
      },
      {
        logo: "./assets/logos/nyu-shield.png",
        h: 52,
        name: "NYU Stern",
        sub: "MBA, Branding (in progress)"
      }
    ],
    about: {
      title: "About Eitan",
      subtitle: "Your storytelling &amp; college essay mentor",
      paras: [
        "Hi, I'm Eitan. I'm a published author, film producer, and NYU graduate three times over — a BA, followed by an MFA in Fiction Writing. I'm currently pursuing an MBA at NYU Stern, specializing in Branding — bringing a marketer's eye for narrative to every essay I touch.",
        "Over a decade of teaching, I've worked with students from kindergarten through grad school across literature, history, public speaking, and standardized tests, but my primary focus today is college counseling and the personal statement."
      ]
    },
    mentor: {
      title: "Meet Your Mentor",
      subtitle: "Where Eitan's expertise really shows up",
      paras: [
        "Since 2016, he has helped hundreds of students privately construct standout, authentic personal statements. His undergraduate students have been admitted to schools including Stanford, Berkeley, Columbia, Yale, and NYU, while his graduate students have gone on to top programs in Medicine, Dentistry, Nursing, Law, Business, and Engineering.",
        "As a creative writer and film producer, he treats the essay as what it really is — storytelling — and works to help each student articulate their story with clarity and confidence."
      ]
    },
    testimonials: [
      {
        quote: "\"Thanks to Eitan's exceptional guidance and expertise on her essay, our daughter was accepted into a remarkable list of universities and received over $284,000 in scholarships. She will be starting at a highly-ranked engineering college next month on scholarship, and I am certain her essay was a significant factor in her success. Eitan's dedication and skill made a profound impact — I cannot recommend his services enough.\"",
        by: "— A grateful parent"
      }
    ]
  },
  {
    slug: "razi-hecker",
    name: "Razi Hecker",
    photo: "./assets/experts/razi.png",
    tier: "t4",
    rate: 540,
    school: "Harvard",
    specialty: "Ivy League Strategy & Positioning",
    heroSchool: "Harvard University",
    schools: [
      {
        logo: "./assets/logos/harvard-shield.png",
        h: 72,
        name: "Harvard University",
        sub: "Undergraduate"
      }
    ],
    about: {
      title: "About Razi",
      subtitle: "Founder &amp; lead strategist",
      paras: [
        "Hi, I'm Razi. I'm the founder of League Bound Consulting, and I've helped 92% of the Ivy League applicants I've worked with get into their top-choice school. I've also published a collection of 50 successful Harvard application essays."
      ]
    },
    mentor: {
      title: "Meet Your Mentor",
      subtitle: "Where Razi's expertise really shows up",
      paras: [
        "He makes sure every student understands the reasoning behind each suggestion, replacing quick grammar edits and surface-level polish with deep, honest questions that lead to truly personal, standout essays — and students who leave able to write for themselves."
      ]
    },
    testimonials: [
      {
        quote: "\"I was accepted to Harvard, Yale, Cornell, and Dartmouth — not just because of Razi's top-tier college consulting, but because of his unmatched teaching and genuine care. Razi makes sure you understand every suggestion and idea, so you become increasingly confident and self-sufficient. Not only did he help me get into some of the world's best institutions, he gave me the lifelong skill of expressing myself clearly and powerfully through writing. Razi helped make my dream come true — Harvard Class of '29 — and he can, and will, do the same for you.\"",
        by: "— C.L., Harvard Class of '29"
      }
    ],
    marquee: {
      label: "Helped get into — the Top 30",
      text: "Princeton · MIT · Harvard · Stanford · Yale · Caltech · Duke · Johns Hopkins · Northwestern · UPenn · Cornell · UChicago · Brown · Columbia · Dartmouth · UCLA · UC Berkeley · Rice · Notre Dame · Vanderbilt · Carnegie Mellon · Michigan · Georgetown · UVA · UNC Chapel Hill · USC · NYU · UT Austin · Florida · Wisconsin ·&nbsp;"
    }
  }
];

  window.AM_TIERS = {
    t1: { label: 'Advisor', color: 'var(--forest-900)', bg: 'var(--sand-100)', hero: 'background:rgba(255,255,255,0.14);border:1px solid var(--ivory)' },
    t2: { label: 'Senior Advisor', color: 'var(--ivory)', bg: 'var(--sage)', hero: 'background:var(--copper)' },
    t3: { label: 'Lead Advisor', color: 'var(--ivory)', bg: 'var(--copper-600,#96492f)', hero: 'background:var(--copper-600)' },
    t4: { label: 'Principal Advisor', color: 'var(--ivory)', bg: 'var(--forest-900)', hero: 'background:var(--forest-800);border:1px solid var(--ivory)' },
  };

  const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/waXfk5QQ8VhoYMOXXoRN';

  // site-mobile.css matches inline styles by substring in the spaced form React
  // writes ("font-size: 14px"), so every style string is normalised to that form.
  const st = s => s.split(';').map(x => x.trim()).filter(Boolean).map(x => x.replace(/\s*:\s*/, ': ')).join('; ') + ';';
  const H2 = 'font-family:var(--font-serif-display);font-size:29px;color:var(--forest-900);margin:0 0 6px';
  const P = 'line-height:1.75;font-size:16.5px;';

  const schoolsHtml = list => {
    if (list.length === 1) {
      const s = list[0];
      return `<div style="${st('display:flex;justify-content:center;margin-bottom:40px')}"><div style="${st('display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;max-width:280px')}">
<img src="${s.logo}" alt="" style="${st('height:' + s.h + 'px')}"><div style="${st('font-size:16px;font-weight:500')}">${s.name}</div>${s.sub ? `<div style="${st('font-size:13px;color:var(--text-muted)')}">${s.sub}</div>` : ''}</div></div>`;
    }
    const three = list.length > 2;
    return `<div style="${st('display:grid;grid-template-columns:repeat(auto-fit,minmax(' + (three ? 160 : 180) + 'px,1fr));gap:18px;margin-bottom:40px;max-width:' + (three ? 640 : 460) + 'px;margin-left:auto;margin-right:auto')}">${list.map(s => `
<div style="${st('background:var(--white);border:1px solid var(--border-subtle);border-radius:8px;padding:18px 14px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;box-shadow:var(--shadow-card)')}"><img src="${s.logo}" alt="" style="${st('height:' + s.h + 'px')}"><div style="${st('font-size:16px;font-weight:500')}">${s.name}</div>${s.sub ? `<div style="${st('font-size:13px;color:var(--text-muted)')}">${s.sub}</div>` : ''}</div>`).join('')}</div>`;
  };

  const colHtml = c => `<div><h2 style="${st(H2)}">${c.title}</h2><div style="${st('font-size:14px;color:var(--copper-600);font-weight:500;margin-bottom:14px')}">${c.subtitle}</div>${c.paras.map((p, i) => `<p style="${st(P + 'margin:' + (i < c.paras.length - 1 ? '0 0 12px' : '0'))}">${p}</p>`).join('')}</div>`;

  const testimonialsHtml = list => {
    if (!list || !list.length) return '';
    const head = `<h2 style="${st(H2.replace('margin:0 0 6px', 'margin:36px 0 12px'))}">What families say</h2>`;
    if (list.length === 1) {
      const q = list[0];
      return head + `<div style="${st('background:var(--bg-band);border-radius:8px;padding:26px 28px;font-family:var(--font-serif-display);font-style:italic;font-size:18px;color:var(--forest-900)')}">${q.quote}</div>` +
        (q.by ? `<div style="${st('font-size:13px;color:var(--text-muted);margin-top:8px')}">${q.by}</div>` : '');
    }
    return head + `<div style="${st('display:flex;flex-direction:column;gap:16px')}">${list.map(q => `<div style="${st('background:var(--bg-band);border-radius:8px;padding:22px 24px')}"><div style="${st('font-family:var(--font-serif-display);font-style:italic;font-size:17px;color:var(--forest-900);margin-bottom:8px')}">${q.quote}</div>${q.by ? `<div style="${st('font-size:13px;color:var(--text-muted)')}">${q.by}</div>` : ''}</div>`).join('')}</div>`;
  };

  const bandHtml = t => {
    if (t.band) return `<div style="${st('background:var(--forest-900);padding:16px 48px;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap')}"><span style="${st('font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--sand)')}">${t.band.label}</span><span style="${st('font-family:var(--font-serif-display);font-size:16px;color:var(--ivory)')}">${t.band.text}</span></div>`;
    if (t.marquee) {
      const span = hidden => `<span style="${st('font-family:var(--font-serif-display);font-size:16px;color:var(--ivory);padding-right:20px')}"${hidden ? ' aria-hidden="true"' : ''}>${t.marquee.text}</span>`;
      return `<div style="${st('background:var(--forest-900);padding:20px 0;overflow:hidden')}"><div style="${st('font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--sand);text-align:center;margin-bottom:10px')}">${t.marquee.label}</div><div style="${st('display:flex;white-space:nowrap;width:max-content;animation:t30scroll 42s linear infinite')}">${span(false)}${span(true)}</div></div>`;
    }
    return '';
  };

  const profileHtml = t => {
    const tier = window.AM_TIERS[t.tier];
    const first = t.name.split(' ')[0];
    return `<div style="${st('position:relative;background:var(--forest-900);padding:40px 48px;display:flex;gap:28px;align-items:center;flex-wrap:wrap')}">
<img src="${t.photo}" alt="${t.name}" style="${st('width:140px;height:140px;border-radius:50%;object-fit:cover;border:3px solid var(--sand);flex-shrink:0')}">
<div><h1 style="${st('font-family:var(--font-serif-display);font-size:clamp(2rem,3vw,3rem);color:var(--ivory);font-weight:500;margin:0')}">${t.name}</h1>
<div style="${st('display:flex;align-items:center;gap:12px;margin-top:10px;flex-wrap:wrap')}"><span style="${st(tier.hero + ';color:var(--ivory);font-size:13px;font-weight:500;padding:6px 16px;border-radius:999px')}">${tier.label}</span><span style="${st('font-family:var(--font-serif-display);font-size:18px;color:var(--ivory)')}">$${t.rate}/hr</span></div>
<div style="${st('color:var(--sand);font-size:14px;margin-top:10px')}">${t.heroSchool}</div></div></div>
<div style="${st('max-width:1120px;margin:0 auto;padding:48px 40px 80px')}">${schoolsHtml(t.schools)}
<div style="${st('display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:40px')}">${colHtml(t.about)}${colHtml(t.mentor)}</div>${testimonialsHtml(t.testimonials)}</div>
${bandHtml(t)}
<div style="${st('text-align:center;padding:28px 40px 32px;border-top:1px solid var(--border-subtle)')}"><h2 style="${st('font-family:var(--font-serif-display);font-size:26px;color:var(--forest-900);margin:0 0 4px')}">Want to work with ${first}?</h2><p style="${st('font-size:15px;color:var(--text-muted);margin:0 0 12px;max-width:460px;margin-left:auto;margin-right:auto')}">Tell us about your student and we'll personally match you with ${first} or another advisor who fits.</p><a href="${BOOKING_URL}" class="am-btn am-btn--primary am-btn--md">Get matched now</a></div>
<div style="${st('background:var(--sand-100);padding:22px 48px;display:flex;align-items:center;justify-content:space-between;font-size:14px;color:var(--text-muted);flex-wrap:wrap;gap:8px')}"><div>almayaadmissions.com — College Admissions Guidance, Personally Matched</div><div>info@almayaadmissions.com</div></div>`;
  };
  window.AM_profileHtml = profileHtml;

  if (!document.getElementById('am-tutors-css')) {
    const s = document.createElement('style');
    s.id = 'am-tutors-css';
    s.textContent = '@keyframes t30scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}';
    (document.head || document.documentElement).appendChild(s);
  }

  function TutorProfile(props) {
    const slug = String(props['data-slug'] || '');
    const t = window.AM_TUTORS.find(x => x.slug === slug);
    if (!t) return React.createElement('div', { style: { padding: '80px 24px', textAlign: 'center' } }, 'Advisor not found.');
    return React.createElement('div', { style: { display: 'contents' }, dangerouslySetInnerHTML: { __html: profileHtml(t) } });
  }
  window.TutorProfile = TutorProfile;
})();
