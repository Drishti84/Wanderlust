require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Listing  = require("../models/listing.js");
const Review   = require("../models/review.js");
const User     = require("../models/user.js");

const listings = [
  { title: "Luxury Villa in Santorini", description: "Perched on the caldera cliffs, this stunning villa offers breathtaking views of the Aegean Sea and iconic blue domes. Enjoy private plunge pool access and a rooftop terrace.", image: { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", filename: "listing" }, price: 15000, location: "Santorini", country: "Greece", category: "trending", coordinates: { lat: 36.3932, lng: 25.4615 } },
  { title: "Cozy Tokyo Apartment", description: "Modern apartment in the heart of Shibuya. Walk to top restaurants, shopping, and nightlife. Fully equipped kitchen and high-speed WiFi.", image: { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", filename: "listing" }, price: 5500, location: "Tokyo", country: "Japan", category: "trending", coordinates: { lat: 35.6762, lng: 139.6503 } },
  { title: "Boutique Room in Jaipur Haveli", description: "Stay in a beautifully restored 18th-century haveli in the Pink City. Stunning courtyard with a central fountain and rooftop views of the Amber Fort.", image: { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", filename: "listing" }, price: 2800, location: "Jaipur", country: "India", category: "rooms", coordinates: { lat: 26.9124, lng: 75.7873 } },
  { title: "Parisian Studio Near Eiffel Tower", description: "Charming Haussmann-era studio with exposed beams, parquet floors, and city views. Walk to the Eiffel Tower in 10 minutes. Perfect for couples.", image: { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", filename: "listing" }, price: 7500, location: "Paris", country: "France", category: "rooms", coordinates: { lat: 48.8566, lng: 2.3522 } },
  { title: "Penthouse in New York City", description: "Stunning penthouse with panoramic Manhattan skyline views. Steps from Central Park and the best restaurants in the city. Doorman building, gym access.", image: { url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80", filename: "listing" }, price: 25000, location: "New York City", country: "United States", category: "cities", coordinates: { lat: 40.7128, lng: -74.0060 } },
  { title: "Modern Flat in Mumbai", description: "Sleek apartment in Bandra West with sea views. Close to the best cafes, galleries, and nightlife. Features a private balcony overlooking the Arabian Sea.", image: { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", filename: "listing" }, price: 4500, location: "Mumbai", country: "India", category: "cities", coordinates: { lat: 19.0760, lng: 72.8777 } },
  { title: "Pine Chalet in Manali", description: "Cozy log cabin surrounded by snow-capped Himalayan peaks. Perfect for trekking, skiing, and stargazing. Includes a wood-burning fireplace and outdoor hot tub.", image: { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", filename: "listing" }, price: 3500, location: "Manali", country: "India", category: "mountains", coordinates: { lat: 32.2432, lng: 77.1892 } },
  { title: "Alpine Lodge in Swiss Alps", description: "Traditional Swiss chalet with fireside comfort and panoramic mountain views. Direct access to world-class ski slopes and summer hiking trails.", image: { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", filename: "listing" }, price: 18000, location: "Zermatt", country: "Switzerland", category: "mountains", coordinates: { lat: 46.0207, lng: 7.7491 } },
  { title: "Medieval Castle in Scotland", description: "Live like royalty in a fully restored 14th-century castle. Sweeping Highland views, a private loch, and a grand dining hall seating 30.", image: { url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80", filename: "listing" }, price: 35000, location: "Inverness", country: "Scotland", category: "castles", coordinates: { lat: 57.4778, lng: -4.2247 } },
  { title: "Château in Loire Valley", description: "Magnificent 16th-century château surrounded by vineyards and formal gardens. Wine tastings, horse riding, and farm-to-table dinners all included.", image: { url: "https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=800&q=80", filename: "listing" }, price: 28000, location: "Loire Valley", country: "France", category: "castles", coordinates: { lat: 47.6588, lng: 0.3264 } },
  { title: "Bali Jungle Pool Villa", description: "Private infinity pool overlooking lush rice terraces and jungle canopy. Includes daily breakfast and a personal villa attendant. A true tropical paradise.", image: { url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80", filename: "listing" }, price: 12000, location: "Ubud", country: "Indonesia", category: "pools", coordinates: { lat: -8.5069, lng: 115.2625 } },
  { title: "Desert Pool Retreat in Rajasthan", description: "Luxurious tented camp with a shimmering pool amid the Thar Desert dunes. Camel safaris, cultural performances, and starlit dinners included.", image: { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", filename: "listing" }, price: 9000, location: "Jaisalmer", country: "India", category: "pools", coordinates: { lat: 26.9157, lng: 70.9083 } },
  { title: "Glamping Pod in Coorg", description: "Luxury eco-pod nestled in a coffee and cardamom plantation. Wake up to birdsong and forest mist. Guided plantation walks and bonfire evenings.", image: { url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80", filename: "listing" }, price: 4200, location: "Coorg", country: "India", category: "camping", coordinates: { lat: 12.3375, lng: 75.8069 } },
  { title: "Safari Tent in Masai Mara", description: "Luxurious tented camp on the edge of the Mara. Nightly wildlife sightings from your veranda, guided game drives, and gourmet bush dinners.", image: { url: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80", filename: "listing" }, price: 22000, location: "Masai Mara", country: "Kenya", category: "camping", coordinates: { lat: -1.5022, lng: 35.1430 } },
  { title: "Organic Farm Stay in Wayanad", description: "Peaceful farmhouse set on a working organic spice plantation. Cooking classes, nature walks, and yoga sessions among the pepper vines.", image: { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", filename: "listing" }, price: 2500, location: "Wayanad", country: "India", category: "farms", coordinates: { lat: 11.6854, lng: 76.1320 } },
  { title: "Tuscan Agriturismo", description: "Charming stone farmhouse surrounded by centuries-old olive groves and vineyards. Daily wine tastings, truffle hunting, and farm-to-table dinners.", image: { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", filename: "listing" }, price: 11000, location: "Tuscany", country: "Italy", category: "farms", coordinates: { lat: 43.7711, lng: 11.2486 } },
  { title: "Glass Igloo in Lapland", description: "Sleep directly under the Northern Lights in a heated glass igloo. Husky sledding, snowmobile safaris, and reindeer farm visits all available.", image: { url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80", filename: "listing" }, price: 32000, location: "Rovaniemi", country: "Finland", category: "arctic", coordinates: { lat: 66.5039, lng: 25.7294 } },
  { title: "Arctic Cabin in Norway", description: "Cozy wooden cabin overlooking a frozen fjord. Snowshoeing, reindeer sleigh rides, and the best aurora borealis viewing in northern Europe.", image: { url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80", filename: "listing" }, price: 19000, location: "Tromsø", country: "Norway", category: "arctic", coordinates: { lat: 69.6496, lng: 18.9560 } },
  { title: "Geodesic Dome in Spiti Valley", description: "Futuristic transparent dome with 360° views of the high-altitude Himalayan landscape. One of the darkest skies in India — perfect for stargazing.", image: { url: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80", filename: "listing" }, price: 6500, location: "Spiti Valley", country: "India", category: "domes", coordinates: { lat: 32.2461, lng: 78.0339 } },
  { title: "Bubble Dome in Provence", description: "Transparent bubble surrounded by fragrant lavender fields. Fall asleep gazing at the Milky Way through the panoramic ceiling. Breakfast delivered to your dome.", image: { url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80", filename: "listing" }, price: 14000, location: "Provence", country: "France", category: "domes", coordinates: { lat: 43.9493, lng: 5.5049 } },
  { title: "Houseboat on Dal Lake", description: "Iconic hand-carved cedar-wood houseboat floating on the serene Dal Lake. Himalayan peaks reflect in the glassy water at sunrise.", image: { url: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80", filename: "listing" }, price: 5000, location: "Srinagar", country: "India", category: "boating", coordinates: { lat: 34.0837, lng: 74.7973 } },
  { title: "Sailing Yacht in Maldives", description: "Private luxury sailing yacht moored in a crystal-clear Maldivian lagoon. Snorkelling, diving, sunset cocktails, and bioluminescent night swims.", image: { url: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&q=80", filename: "listing" }, price: 45000, location: "Male Atoll", country: "Maldives", category: "boating", coordinates: { lat: 4.1755, lng: 73.5093 } },
];

const reviewPools = [
  { comment: "Absolutely breathtaking! Exceeded every expectation. The host was incredibly welcoming and the space was immaculate.", rating: 5 },
  { comment: "Such a magical place. We didn't want to leave. Will definitely be back next year!", rating: 5 },
  { comment: "Great location and beautiful views. The amenities were top-notch. A few small things could be improved but overall fantastic.", rating: 4 },
  { comment: "Really enjoyed our stay. Comfortable, clean, and the surroundings are stunning. Highly recommended!", rating: 5 },
  { comment: "Lovely place with a great atmosphere. The host gave excellent local tips that made our trip even better.", rating: 4 },
  { comment: "Good stay overall. The location is perfect and the space is exactly as described. Would visit again.", rating: 4 },
  { comment: "Wonderful experience. The place has so much character and the views are unlike anything I've seen.", rating: 5 },
  { comment: "Decent stay. A bit pricey for what it is, but the location makes up for it. Nice and clean.", rating: 3 },
  { comment: "Fantastic host and beautiful property. Everything was ready when we arrived. Truly a 5-star experience!", rating: 5 },
  { comment: "Very cozy and peaceful. Exactly what we needed for a relaxing getaway. The sunrise views are incredible.", rating: 5 },
  { comment: "Great value for the location. Space was clean and well-equipped. Would definitely recommend to friends.", rating: 4 },
  { comment: "Unique and unforgettable. You won't find anything like this anywhere else. Booking again for sure!", rating: 5 },
];

function pickReviews(n) {
  const shuffled = [...reviewPools].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

async function seed() {
  await mongoose.connect(process.env.ATLASDB_URL);
  console.log("Connected to DB");

  const user = await User.findOne({});
  if (!user) {
    console.error("No users found — sign up at /signup first, then re-run.");
    process.exit(1);
  }
  console.log(`Using owner/reviewer: ${user.username}`);

  // Clear existing data
  await Review.deleteMany({});
  await Listing.deleteMany({});

  // Insert listings with reviews
  for (const data of listings) {
    const listing = new Listing({ ...data, owner: user._id });
    const reviewCount = 2 + Math.floor(Math.random() * 3); // 2–4 reviews
    const picks = pickReviews(reviewCount);
    for (const r of picks) {
      const review = new Review({ ...r, author: user._id });
      await review.save();
      listing.reviews.push(review._id);
    }
    await listing.save();
  }

  console.log(`Seeded ${listings.length} listings with 2–4 reviews each`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
