import type { OfficeConfig } from "../types";

/** Demo 3 — a cheerful pediatric practice. Theme: soft blue-sage. */
const littleSprouts: OfficeConfig = {
  id: "little-sprouts",

  practice: {
    name: "Little Sprouts Pediatric Dentistry",
    tagline: "Happy, healthy smiles from first tooth to teens",
    logo: { text: "Little Sprouts", mark: "Pediatric Dentistry" },
    yearsInPractice: 9,
    acceptingNewPatients: true,
    description:
      "A playful, gentle pediatric dental office in Austin for babies, kids and teens, including children with special needs.",
  },

  contact: {
    phone: "(512) 555-0119",
    email: "smiles@littlesprouts.example",
    address: {
      street: "4600 Burnet Rd, Building B",
      city: "Austin",
      region: "TX",
      postalCode: "78756",
      country: "US",
    },
    geo: { lat: 30.3186, lng: -97.7393 },
    directionsNote: "Stroller-friendly entrance and free parking right out front.",
  },

  timezone: "America/Chicago",
  hours: {
    mon: { open: "08:00", close: "17:00" },
    tue: { open: "08:00", close: "17:00" },
    wed: { open: "08:00", close: "17:00" },
    thu: { open: "08:00", close: "18:00" },
    fri: { open: "08:00", close: "15:00" },
    sat: { open: "08:30", close: "12:30" },
    sun: null,
  },

  doctors: [
    {
      name: "Dr. Hannah Brooks",
      credentials: "DDS, MS",
      title: "Board-Certified Pediatric Dentist",
      bio: "Dr. Hannah has spent her career helping kids feel brave at the dentist. She’s a mom of two, a big fan of silly voices, and especially gifted with anxious kids and children with special needs.",
      photo: "/doctors/doctor-3.svg",
      highlights: ["Board-certified pediatric dentist", "Special-needs friendly"],
    },
    {
      name: "Dr. Leo Tran",
      credentials: "DMD",
      title: "Pediatric Dentist",
      bio: "Dr. Leo turns every visit into an adventure, with tooth counting, superhero stickers and plenty of patience. Teens appreciate that he talks to them, not just their parents.",
      photo: "/doctors/doctor-1.svg",
      highlights: ["Teen & sports guards", "Speaks Vietnamese"],
    },
  ],

  services: [
    {
      id: "first-visit",
      name: "Baby’s First Visit",
      icon: "baby",
      short: "A happy hello by the first birthday, with tips for parents.",
      detail:
        "A quick, gentle look in a lap-to-lap position, plus friendly advice on teething, brushing and bottles. It’s more of a meet-and-greet than an appointment.",
      points: ["Knee-to-knee exam", "Teething & brushing tips", "About 20 minutes"],
      durationMin: 30,
    },
    {
      id: "cleanings",
      name: "Cleanings & Checkups",
      icon: "sparkles",
      short: "Fun, gentle cleanings with tooth-counting and prize picks.",
      detail:
        "We explain every step in kid-friendly words using tell-show-do, so there are no surprises. Ceiling TVs and a prize wall help too.",
      points: ["Tell-show-do approach", "Flavored polish", "Prize wall"],
      durationMin: 45,
    },
    {
      id: "sealants",
      name: "Sealants & Fluoride",
      icon: "shield",
      short: "Quick, painless ways to help protect growing teeth.",
      detail:
        "Sealants are a thin coating painted on back teeth to help keep cavity-causing food and bacteria out. No needles, no drilling, just a quick paint-on.",
      points: ["No numbing needed", "Takes minutes", "Often covered by insurance"],
      durationMin: 30,
    },
    {
      id: "orthodontics",
      name: "Early Orthodontics",
      icon: "aligners",
      short: "Bite checks and guidance on when braces or aligners make sense.",
      detail:
        "We keep an eye on how your child’s jaw and teeth develop and let you know if and when an orthodontic evaluation makes sense, with no pressure.",
      points: ["Growth monitoring", "Space maintainers", "Orthodontist referrals"],
      durationMin: 30,
    },
    {
      id: "special-needs",
      name: "Special Needs Dentistry",
      icon: "heart",
      short: "Extra time, sensory-friendly rooms and a team that gets it.",
      detail:
        "We’ll learn what works for your child before the visit, from quiet rooms and dimmed lights to visual schedules and extra time.",
      points: ["Sensory-friendly room", "Longer appointments", "Pre-visit planning call"],
      durationMin: 60,
    },
    {
      id: "emergency",
      name: "Emergency Visits",
      icon: "siren",
      short: "Bumped or broken tooth? Call us and we’ll see you fast.",
      detail:
        "Kids are adventurous. If a tooth gets knocked, chipped or starts hurting, call us right away. We save daily emergency spots.",
      points: ["Same-day emergency spots", "Knocked-out tooth guidance", "After-hours line"],
      durationMin: 30,
    },
    {
      id: "sedation",
      name: "Gentle Sedation",
      icon: "leaf",
      short: "Laughing gas and other comfort options for anxious kiddos.",
      detail:
        "For kids who need a little extra help relaxing, we offer nitrous oxide (laughing gas) and can discuss other options. We’ll always talk it through with you first.",
      points: ["Nitrous oxide available", "Parent consultation first", "Monitored by trained staff"],
      durationMin: 45,
    },
  ],

  insurances: ["Texas Medicaid", "CHIP", "Delta Dental", "Cigna", "Aetna", "MetLife", "United Healthcare", "Guardian"],

  rating: { value: 4.9, count: 587, source: "Google" },
  reviews: [
    {
      name: "Brianna, mom of 3",
      rating: 5,
      text: "My son has autism and dentist visits used to be really hard. Dr. Hannah called before the appointment to plan and the quiet room made all the difference. We cried happy tears.",
      meta: "Google review",
    },
    {
      name: "Tom & Gabe",
      rating: 5,
      text: "My 4-year-old asks every week when he gets to see Dr. Leo again. That’s all I need to say.",
      meta: "Patients since 2023",
    },
    {
      name: "Rachel S.",
      rating: 5,
      text: "Baby’s first visit was so sweet and quick. Lots of practical teething tips and zero judgment about the bottle at bedtime!",
      meta: "Google review",
    },
    {
      name: "Monique D.",
      rating: 5,
      text: "My teenager actually likes coming here. They treat her like a grown-up and the Saturday hours are a lifesaver.",
      meta: "Google review",
    },
    {
      name: "Kevin H.",
      rating: 5,
      text: "My daughter chipped her front tooth at the playground. They saw us within the hour and were so calm and reassuring.",
      meta: "Emergency visit",
    },
  ],

  faqs: [
    {
      q: "When should my child first see a dentist?",
      a: "By their first birthday or within six months of their first tooth. Early visits are short and happy, and they help your child get comfortable with us.",
    },
    {
      q: "Do you accept Medicaid and CHIP?",
      a: "Yes. We accept Texas Medicaid and CHIP, along with most major PPO plans. Give us a call and we’ll gladly check your child’s coverage.",
    },
    {
      q: "My child is scared of the dentist. How do you help?",
      a: "We never force anything. We use tell-show-do, lots of praise, ceiling TVs and breaks whenever needed. For some kids, laughing gas helps, and we’ll always talk with you first.",
    },
    {
      q: "Can I come back with my child?",
      a: "Of course. Parents are always welcome chairside. Some older kids like a little independence, and that’s fine too.",
    },
    {
      q: "What should I do if my child knocks out a tooth?",
      a: "Call us right away. For an adult (permanent) tooth, hold it by the top, gently rinse it, and keep it in milk on the way. Don’t try to put a baby tooth back in.",
    },
    {
      q: "Do you offer payment plans?",
      a: "Yes. We offer interest-free payment plans for larger treatments and will always share costs with you before we begin.",
    },
  ],

  booking: { slotMinutes: 30 },
  newPatientFormsUrl: "/forms/new-patient-forms.pdf",

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    google: "https://maps.google.com/",
  },

  theme: { preset: "sage-blue" },

  // No before/after gallery for a pediatric office; emergency card promoted higher.
  sections: ["hero", "quickInfo", "emergency", "services", "newPatients", "doctors", "reviews", "cta", "faq", "contact"],

  copy: {
    heroEyebrow: "Pediatric dentistry in Austin",
    heroHeadline: "Where little smiles grow up happy.",
    heroHighlight: "grow up happy",
    heroSubhead: "Gentle, playful dental care for babies, kids and teens, with patient people who never rush and never scold.",
    servicesIntro: "Kid-sized care, explained in kid-friendly words (and grown-up ones too).",
    newPatientsIntro: "First time with us? Here’s how we make it easy for kids and parents alike.",
    firstVisitSteps: [
      { title: "Book a happy visit", text: "Schedule online or call. Tell us anything that helps your child feel safe.", icon: "calendar" },
      { title: "Explore & play", text: "A tour of the office, a ride in the big chair and a peek at our tooth-counting tools.", icon: "smile" },
      { title: "Gentle checkup", text: "A quick, kind exam and cleaning, plus practical tips for parents. Then the prize wall!", icon: "star" },
    ],
    doctorsIntro: "Specially trained pediatric dentists with endless patience and plenty of silly jokes.",
    ctaHeadline: "Let’s make the dentist their favorite place.",
    ctaText: "We’re welcoming new families now, including weekend appointments.",
    emergencyHeadline: "Bumped or broken tooth? Call now.",
    emergencyText: "Kids are adventurous. We save same-day emergency spots every day, so call us right away.",
    reviewsIntro: "From the parents (and kids!) who visit us.",
    faqIntro: "Answers for parents, from first teeth to braces.",
    contactIntro: "Have a question about your child’s smile? We’d love to help.",
    comfortPerks: ["Ceiling TVs", "Prize wall", "Parents chairside"],
  },

  seo: {
    siteUrl: "https://littlesprouts.example",
    title: "Little Sprouts Pediatric Dentistry | Kids’ Dentist in Austin, TX",
    description:
      "Gentle, playful pediatric dentistry in Austin for babies, kids and teens. Special-needs friendly, Medicaid & CHIP accepted, same-day emergencies. New families welcome.",
    priceRange: "$$",
  },
};

export default littleSprouts;
