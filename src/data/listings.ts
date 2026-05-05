export type Listing = {
  id: number;
  title: string;
  location: string;
  city: string;
  state: string;
  distance: string;
  dates: string;
  price: number;
  rating: number;
  tag: string;
  image: string;
  lat: number;
  lng: number;
};

type CitySeed = {
  city: string;
  state: string;
  count: number;
  center: {
    lat: number;
    lng: number;
  };
  basePrice: number;
  image: string;
};

const citySeeds: CitySeed[] = [
  {
    city: "Coimbatore",
    state: "Tamil Nadu",
    count: 42,
    center: { lat: 11.0168, lng: 76.9558 },
    basePrice: 3500,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    count: 28,
    center: { lat: 12.9716, lng: 77.5946 },
    basePrice: 2200,
    image:
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80",
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    count: 24,
    center: { lat: 17.385, lng: 78.4867 },
    basePrice: 2400,
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    count: 18,
    center: { lat: 13.0827, lng: 80.2707 },
    basePrice: 2100,
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    city: "Delhi",
    state: "Delhi",
    count: 20,
    center: { lat: 28.6139, lng: 77.209 },
    basePrice: 2600,
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    city: "Mumbai",
    state: "Maharashtra",
    count: 16,
    center: { lat: 19.076, lng: 72.8777 },
    basePrice: 2800,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  },
];

const programFormats = [
  "Inner Engineering",
  "Bhava Spandana",
  "Hatha Yoga",
  "Shoonya Intensive",
  "Surya Kriya",
  "Yogasanas",
];

const tags = [
  "Residential",
  "Weekend format",
  "Advanced",
  "Most requested",
  "Beginner friendly",
  "Limited seats",
];

const dateRanges = [
  "May 3-5",
  "May 10-12",
  "May 17-19",
  "May 24-26",
  "June 1-3",
  "June 8-10",
];

const teachers = [
  "Guided by trained Isha teachers",
  "Offered at local Isha center",
  "Includes guided practices",
  "Program with in-person support",
  "Focused immersive format",
  "Popular regional offering",
];

export const listings: Listing[] = citySeeds.flatMap((seed, cityIndex) =>
  Array.from({ length: seed.count }, (_, programIndex) => {
    const id = cityIndex * 100 + programIndex + 1;
    const latOffset = ((programIndex % 5) - 2) * 0.03;
    const lngOffset = ((Math.floor(programIndex / 5) % 5) - 2) * 0.04;

    return {
      id,
      title: `${programFormats[programIndex % programFormats.length]} Program`,
      location: `${seed.city}, ${seed.state}`,
      city: seed.city,
      state: seed.state,
      distance: teachers[programIndex % teachers.length],
      dates: dateRanges[programIndex % dateRanges.length],
      price: seed.basePrice + (programIndex % 7) * 300,
      rating: Number((4.7 + (programIndex % 6) * 0.05).toFixed(2)),
      tag: tags[programIndex % tags.length],
      image: seed.image,
      lat: Number((seed.center.lat + latOffset).toFixed(4)),
      lng: Number((seed.center.lng + lngOffset).toFixed(4)),
    };
  }),
);
