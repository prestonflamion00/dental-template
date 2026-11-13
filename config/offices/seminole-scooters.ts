import type { OfficeInput } from "../types";

/**
 * Seminole Scooters (Pinellas Park, FL): a REAL prospect, private preview for TJ. Content, prices
 * and photos come from their current site (seminolescooters.com, Nov 12, 2026); rating, reviews and
 * hours from their Google profile. Prices, hours and titles marked "confirm" are for the walkthrough.
 * Logo: our mock-up (option A); option B (round seal) is logo-seal.svg.
 */
const seminoleScooters: OfficeInput = {
  id: "seminole-scooters",
  stage: "demo",

  practice: {
    name: "Seminole Scooters",
    specialty: "scooters",
    logo: { text: "Seminole Scooters", mark: "Pinellas Park · St. Pete area", image: "/offices/seminole-scooters/logo.svg", width: 560, height: 96, icon: "/offices/seminole-scooters/icon.svg", shape: "wide" },
    acceptingNewPatients: true,
    tagline: "Scooter sales & repair in Pinellas Park, in the St. Petersburg area",
    description:
      "Scooter sales and repair in Pinellas Park, FL, serving St. Petersburg and all of Pinellas County. Authorized Kymco and Wolf Brand dealer, with quick oil changes, tires, belts and repairs for most makes and models.",
  },

  contact: {
    phone: "(727) 526-3000",
    address: { street: "6401 49th St N, Suite A", city: "Pinellas Park", region: "FL", postalCode: "33781", country: "US" },
    geo: { lat: 27.8303563, lng: -82.6996093 },
  },

  timezone: "America/New_York",
  // Confirm with TJ: Google says 9:30–5, Foster heard 9:30–4:30, the shop sign says Mon–Fri 9–5.
  hours: {
    mon: { open: "09:30", close: "16:30" },
    tue: { open: "09:30", close: "16:30" },
    wed: { open: "09:30", close: "16:30" },
    thu: { open: "09:30", close: "16:30" },
    fri: null,
    sat: null,
    sun: null,
  },

  doctors: [
    {
      name: "TJ",
      title: "Head mechanic",
      bio: "Riders mention TJ by name in almost every review: honest, fair, and happy to explain what your scooter needs in words that make sense.",
      highlights: ["Most makes and models", "Kymco & Wolf dealer"],
    },
  ],

  // Real Google rating and reviews (shortened), Nov 2026.
  rating: { value: 4.9, count: 142, source: "Google" },
  reviews: [
    { name: "Captain Curtis W.", rating: 5, text: "TJ in my opinion is the very best scooter mechanic I have ever done business with. I've owned scooters going back to 1992. He is honest, very fair and articulates his words in a way that his customers understand.", meta: "Google review" },
    { name: "Ryan K.", rating: 5, text: "Can't say enough about this scooter repair facility. I've brought our scoots here for the last decade when it comes time for larger upgrades and repairs: tires, brakes, electronics, engine maintenance.", meta: "Google review" },
    { name: "Minda G.", rating: 5, text: "TJ is great. Been taking care of my Kymco for 7 years. Very personable and knowledgeable, with fun conversation during oil changes and quick work.", meta: "Google review" },
    { name: "Scott B.", rating: 5, text: "TJ is great. Very friendly service with reasonable pricing. Will be my go-to for all of my servicing needs.", meta: "Google review" },
    { name: "A happy first-timer", rating: 5, text: "Incredible hospitality by TJ was not something I was expecting from a hole-in-the-wall place. Nothing less than outstanding customer service.", meta: "Google review" },
  ],

  areas: [
    { slug: "pinellas-park-fl", town: "Pinellas Park", region: "FL" },
    { slug: "st-petersburg-fl", town: "St. Petersburg", region: "FL" },
    { slug: "seminole-fl", town: "Seminole", region: "FL" },
    { slug: "largo-fl", town: "Largo", region: "FL" },
    { slug: "kenneth-city-fl", town: "Kenneth City", region: "FL" },
    { slug: "clearwater-fl", town: "Clearwater", region: "FL" },
  ],

  heroImage: {
    src: "/offices/seminole-scooters/lineup.webp",
    alt: "A row of new scooters lined up outside Seminole Scooters",
    position: "50% 60%",
    caption: "New scooters on the lot in Pinellas Park, near St. Pete",
    team: { src: "/offices/seminole-scooters/shop-floor.webp", alt: "Scooters on the shop floor at Seminole Scooters" },
  },
  heroLayout: "bleed",
  // Selling is TJ's main business, so the hero's main button goes to the scooters for sale.
  heroAction: { label: "Shop scooters", href: "#inventory" },

  design: "butter",
  theme: { preset: "sage-blue", accent: "#0d5560" },
  sections: ["inventory", "services", "reviews", "newPatients", "doctors", "faq"],

  services: [
    { id: "oil", name: "Oil Changes", icon: "fuel", short: "Full-synthetic Amsoil, just under $30 for most scooters.", detail: "Full-synthetic Amsoil oil changes for most 50–250cc scooters, just under $30. Not $60–80 like a lot of shops. Your first one is free with a new scooter." },
    { id: "tires", name: "Tires & Flats", icon: "refresh", short: "Tires in stock from $46. Flats fixed on most e-scooters.", detail: "Common sizes like 3.50-10 in stock from $46. We fix flats on most stand-up and sit-down electric scooters (not solid or fat tubeless tires)." },
    { id: "belts", name: "Drive Belts", icon: "cog", short: "Under $100 with parts, for most 50–150cc scooters.", detail: "High-quality belts only, installed for under $100 including parts on most 50–150cc scooters." },
    { id: "repairs", name: "Repairs & Tune-ups", icon: "wrench", short: "Won't start, runs rough or sounds wrong? We'll find out why.", detail: "Carbs, brakes, electrical and engine work, for most makes and models. We explain what it needs and the price before we start." },
    { id: "big-bore", name: "Big Bore Kits", icon: "zap", short: "More power for Wolf 50cc scooters, about $375 installed.", detail: "All-new head, cylinder, piston, rings, gaskets, upgraded carb and plug, with an oil change now and another after break-in. $100 off install right now (confirm)." },
    { id: "buy", name: "Buy a Scooter", icon: "bike", short: "New Kymco and Wolf scooters on the floor, tagged when you buy.", detail: "Come see what's in stock, sit on a few and ask anything. Every new scooter comes with a free first oil change and a full tank of gas." },
    { id: "sell", name: "Sell or Trade In", icon: "tag", short: "Tell us what you have and we'll take a look.", detail: "Send the make, model, year and miles through the form, and we'll let you know what we can do." },
    { id: "financing", name: "Financing", icon: "card", short: "Apply before you visit and know your payment.", detail: "Kymco financing through Roadrunner and Wolf financing through Magwitch. Approval depends on your credit. Cash and checks welcome; cards add a processing fee." },
  ],

  faqs: [
    { q: "Do you work on scooters you didn't sell?", a: "Yes, most makes and models. We're phasing out repairs on a few very low-budget online scooters with safety issues, so call first if yours came from online." },
    { q: "Do you fix electric scooter flats?", a: "Yes, on most stand-up and sit-down electric scooters. We can't repair solid tires or fat tubeless tires." },
    { q: "How do I pay?", a: "Cash or check, or any card with a processing fee. New scooters are tagged at the time of purchase." },
    { q: "Can I finance a scooter?", a: "Yes. Kymco financing is through Roadrunner and Wolf financing through Magwitch. You can apply before you visit so you know your payment. Approval depends on your credit." },
    { q: "Do you buy used scooters or take trade-ins?", a: "Tell us the make, model, year and miles through the request form and we'll let you know." },
  ],

  inventory: {
    eyebrow: "Scooters for sale",
    title: "New scooters, ready to ride",
    intro: "Authorized Kymco and Wolf Brand dealer. Every new scooter comes with a free first oil change and a full tank of gas.",
    groups: [
      {
        name: "Kymco",
        note: "Factory warranty covers parts and labor",
        items: [
          { name: "Kymco Agility 50", specs: "50cc · Easy, economical commuter", price: "$2,699 + fees", image: "/offices/seminole-scooters/kymco-agility-50.webp" },
          { name: "Kymco Like 50i", specs: "50cc fuel-injected · Brand new earlier model, full warranty", price: "$2,899 + fees", salePrice: "$2,500 + fees", saleEnds: "2026-11-11", badge: "New old stock", image: "/offices/seminole-scooters/kymco-like-50i.webp" },
          { name: "Kymco Like 150i", specs: "150cc fuel-injected · Retro style, highway-ready", price: "$3,299 + fees", image: "/offices/seminole-scooters/kymco-like-150i.webp" },
          { name: "Kymco 350i", specs: "350cc · Touring comfort", price: "$6,599 + fees", image: "/offices/seminole-scooters/kymco-350i.webp" },
          { name: "Kymco AK 550", specs: "550cc · 8-valve flagship, more power and speed", price: "$11,099 + fees", image: "/offices/seminole-scooters/kymco-ak550.webp" },
        ],
      },
      {
        name: "Wolf Brand",
        note: "2-year limited warranty",
        items: [
          { name: "Wolf Islander 50", specs: "50cc · Classic retro look", price: "$1,549 + fees", image: "/offices/seminole-scooters/wolf-islander-50.webp" },
          { name: "Wolf RX50", specs: "50cc · Sporty and light", salePrice: "$1,803.93 out the door", saleEnds: "2026-10-22", image: "/offices/seminole-scooters/wolf-rx50.webp" },
          { name: "Wolf EX150", specs: "150cc · All 150cc Wolf scooters, same price", price: "$1,949 + fees", image: "/offices/seminole-scooters/wolf-ex150.webp" },
          { name: "Wolf Rugby", specs: "50cc or 150cc · Rugged, chunky tires", price: "From $1,949 + fees", image: "/offices/seminole-scooters/wolf-rugby.webp" },
          { name: "Wolf 200cc", specs: "200cc · More power for longer rides", price: "$2,199 + fees" },
          { name: "Wolf & Flow e-bikes", specs: "Electric bikes · Closeout prices", badge: "Closeout", image: "/offices/seminole-scooters/ebikes.webp" },
        ],
      },
    ],
    brands: [
      { name: "Kymco", text: "Taiwanese scooters with more than 60 years behind them, starting as a Honda joint venture in 1963. We're an authorized Florida Kymco dealer." },
      { name: "Wolf Brand", text: "Affordable, easy-to-ride 50cc to 200cc scooters with a 2-year limited warranty. Some colors we order in for same or next-day pickup." },
    ],
    financing: {
      title: "Apply before you visit",
      text: "Kymco financing through Roadrunner and Wolf financing through Magwitch, so you know your payment ahead of time. Cash and checks welcome; cards add a processing fee.",
    },
    note: "Prices are plus freight, taxes and prep unless marked out the door. New scooters are tagged at purchase. Sale prices disappear on their own when the sale ends. Photos are from our current site; please confirm models and prices.",
  },

  copy: {
    heroEyebrow: "Scooter sales & service · Pinellas Park, St. Pete area",
    heroHeadline: "Find your next scooter.",
    heroHighlight: "next scooter",
    heroSubhead: "New Kymco and Wolf scooters in stock, financing, and honest repairs for most makes and models.",
    comfortPerks: ["Authorized Kymco & Wolf dealer", "Oil changes under $30", "4.9 stars from 142 riders", "Free first oil change with a new scooter"],
  },
};

export default seminoleScooters;
