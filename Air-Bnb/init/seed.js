require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const listings = [
  // Trending
  { title: "Luxury Villa in Santorini", description: "Perched on the caldera cliffs, this stunning villa offers breathtaking views of the Aegean Sea and iconic blue domes.", image: { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", filename: "listing" }, price: 15000, location: "Santorini", country: "Greece", category: "trending" },
  { title: "Cozy Tokyo Apartment", description: "Modern apartment in the heart of Shibuya. Walk to top restaurants, shopping, and nightlife.", image: { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", filename: "listing" }, price: 5500, location: "Tokyo", country: "Japan", category: "trending" },

  // Rooms
  { title: "Boutique Room in Jaipur Haveli", description: "Stay in a beautifully restored 18th-century haveli in the Pink City. Stunning courtyard and rooftop views.", image: { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", filename: "listing" }, price: 2800, location: "Jaipur", country: "India", category: "rooms" },
  { title: "Parisian Studio Near Eiffel Tower", description: "Charming Haussmann-era studio with exposed beams and city views. Walk to the Eiffel Tower in 10 minutes.", image: { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", filename: "listing" }, price: 7500, location: "Paris", country: "France", category: "rooms" },

  // Cities
  { title: "Penthouse in New York City", description: "Stunning penthouse with panoramic Manhattan skyline views. Steps from Central Park and the best restaurants.", image: { url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80", filename: "listing" }, price: 25000, location: "New York City", country: "United States", category: "cities" },
  { title: "Modern Flat in Mumbai", description: "Sleek apartment in Bandra West with sea views. Close to the best cafes, galleries, and nightlife.", image: { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", filename: "listing" }, price: 4500, location: "Mumbai", country: "India", category: "cities" },

  // Mountains
  { title: "Pine Chalet in Manali", description: "Cozy log cabin surrounded by snow-capped Himalayan peaks. Perfect for trekking, skiing, and stargazing.", image: { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", filename: "listing" }, price: 3500, location: "Manali", country: "India", category: "mountains" },
  { title: "Alpine Lodge in Swiss Alps", description: "Traditional Swiss chalet with fireside comfort. Access to world-class ski slopes and hiking trails.", image: { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", filename: "listing" }, price: 18000, location: "Zermatt", country: "Switzerland", category: "mountains" },

  // Castles
  { title: "Medieval Castle in Scotland", description: "Live like royalty in a fully restored 14th-century castle. Sweeping Highland views and a private loch.", image: { url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80", filename: "listing" }, price: 35000, location: "Inverness", country: "Scotland", category: "castles" },
  { title: "Château in Loire Valley", description: "Magnificent 16th-century château surrounded by vineyards and formal gardens. An unparalleled French experience.", image: { url: "https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=800&q=80", filename: "listing" }, price: 28000, location: "Loire Valley", country: "France", category: "castles" },

  // Pools
  { title: "Bali Jungle Pool Villa", description: "Private infinity pool overlooking lush rice terraces. Includes daily breakfast and a personal villa attendant.", image: { url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80", filename: "listing" }, price: 12000, location: "Ubud", country: "Indonesia", category: "pools" },
  { title: "Desert Pool Retreat in Rajasthan", description: "Luxurious tented camp with a stunning pool in the Thar Desert. Camel safaris and starlit dinners included.", image: { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", filename: "listing" }, price: 9000, location: "Jaisalmer", country: "India", category: "pools" },

  // Camping
  { title: "Glamping Pod in Coorg", description: "Luxury eco-pod nestled in a coffee plantation. Wakeup to birdsong and forest mist.", image: { url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80", filename: "listing" }, price: 4200, location: "Coorg", country: "India", category: "camping" },
  { title: "Safari Tent in Masai Mara", description: "Tented camp on the edge of the Mara with nightly wildlife sightings and guided game drives.", image: { url: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80", filename: "listing" }, price: 22000, location: "Masai Mara", country: "Kenya", category: "camping" },

  // Farms
  { title: "Organic Farm Stay in Wayanad", description: "Peaceful farmhouse set on a working organic spice plantation. Cooking classes and nature walks included.", image: { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", filename: "listing" }, price: 2500, location: "Wayanad", country: "India", category: "farms" },
  { title: "Tuscan Agriturismo", description: "Charming stone farmhouse surrounded by olive groves and vineyards. Wine tastings and farm-to-table dinners daily.", image: { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", filename: "listing" }, price: 11000, location: "Tuscany", country: "Italy", category: "farms" },

  // Arctic
  { title: "Glass Igloo in Lapland", description: "Sleep under the Northern Lights in a heated glass igloo. Experience the midnight sun and husky sledding.", image: { url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80", filename: "listing" }, price: 32000, location: "Rovaniemi", country: "Finland", category: "arctic" },
  { title: "Arctic Cabin in Norway", description: "Cozy wooden cabin overlooking a frozen fjord. Perfect base for snowshoeing, reindeer sleigh rides, and aurora watching.", image: { url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80", filename: "listing" }, price: 19000, location: "Tromsø", country: "Norway", category: "arctic" },

  // Domes
  { title: "Geodesic Dome in Spiti Valley", description: "Futuristic transparent dome with 360° views of the high-altitude Himalayan landscape and starry skies.", image: { url: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80", filename: "listing" }, price: 6500, location: "Spiti Valley", country: "India", category: "domes" },
  { title: "Bubble Dome in Provence", description: "Transparent bubble surrounded by lavender fields. Fall asleep gazing at stars through the panoramic ceiling.", image: { url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80", filename: "listing" }, price: 14000, location: "Provence", country: "France", category: "domes" },

  // Boating
  { title: "Houseboat on Dal Lake", description: "Iconic cedar-wood houseboat floating on the serene Dal Lake with Himalayan peaks in the background.", image: { url: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80", filename: "listing" }, price: 5000, location: "Srinagar", country: "India", category: "boating" },
  { title: "Sailing Yacht in Maldives", description: "Private luxury yacht moored in a crystal-clear Maldivian lagoon. Snorkelling, diving, and sundowners included.", image: { url: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&q=80", filename: "listing" }, price: 45000, location: "Male Atoll", country: "Maldives", category: "boating" },
];

async function seed() {
  await mongoose.connect(process.env.ATLASDB_URL);
  console.log("Connected to DB");

  const user = await User.findOne({});
  if (!user) {
    console.error("No users found — sign up first, then run this script.");
    process.exit(1);
  }
  console.log(`Using owner: ${user.username}`);

  await Listing.deleteMany({});
  const withOwner = listings.map(l => ({ ...l, owner: user._id }));
  await Listing.insertMany(withOwner);
  console.log(`Seeded ${withOwner.length} listings`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
