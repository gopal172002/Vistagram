const User = require('../models/User');
const Post = require('../models/Post');

const sampleUsers = [
  {
    username: 'traveler_jane',
    email: 'jane@example.com',
    password: 'password123',
    fullName: 'Jane Traveler',
    bio: 'Exploring the world one photo at a time 📸✈️',
    location: 'New York, USA',
    website: 'https://janetravels.com'
  },
  {
    username: 'adventure_mike',
    email: 'mike@example.com',
    password: 'password123',
    fullName: 'Mike Adventure',
    bio: 'Adventure seeker and nature lover 🌿🏔️',
    location: 'Colorado, USA',
    website: 'https://mikeadventures.com'
  },
  {
    username: 'city_explorer',
    email: 'sarah@example.com',
    password: 'password123',
    fullName: 'Sarah Explorer',
    bio: 'Urban explorer and street photographer 🏙️📷',
    location: 'London, UK',
    website: 'https://sarahexplores.com'
  },
  {
    username: 'beach_lover',
    email: 'alex@example.com',
    password: 'password123',
    fullName: 'Alex Beach',
    bio: 'Beach enthusiast and sunset chaser 🌅🏖️',
    location: 'Miami, USA',
    website: 'https://alexbeach.com'
  },
  {
    username: 'mountain_climber',
    email: 'david@example.com',
    password: 'password123',
    fullName: 'David Climber',
    bio: 'Professional mountaineer and outdoor guide 🏔️🧗‍♂️',
    location: 'Denver, USA',
    website: 'https://davidclimbs.com'
  },
  {
    username: 'food_traveler',
    email: 'emma@example.com',
    password: 'password123',
    fullName: 'Emma Foodie',
    bio: 'Food blogger and culinary explorer 🍜🍕',
    location: 'Tokyo, Japan',
    website: 'https://emmafoodie.com'
  },
  {
    username: 'culture_seeker',
    email: 'maria@example.com',
    password: 'password123',
    fullName: 'Maria Culture',
    bio: 'Cultural enthusiast and history lover 🏛️📚',
    location: 'Rome, Italy',
    website: 'https://mariaculture.com'
  },
  {
    username: 'wildlife_photographer',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Wildlife',
    bio: 'Wildlife photographer and conservationist 🦁📸',
    location: 'Nairobi, Kenya',
    website: 'https://johnwildlife.com'
  }
];

const samplePosts = [
  {
    caption: "Just discovered this hidden gem in the heart of the city! The architecture here is absolutely breathtaking. Every corner tells a story of centuries past. #HiddenGems #Architecture #CityLife",
    location: "Historic District, Rome",
    tags: ["architecture", "history", "rome", "hidden-gems"]
  },
  {
    caption: "Sunset at the beach never gets old! The colors tonight were absolutely magical. Perfect end to a perfect day. 🌅 #Sunset #BeachLife #MagicHour",
    location: "Maldives Beach",
    tags: ["sunset", "beach", "maldives", "magic-hour"]
  },
  {
    caption: "Hiking through the mountains today and found this incredible viewpoint. The fresh mountain air and stunning vistas make every step worth it! 🏔️ #MountainLife #Hiking #Adventure",
    location: "Swiss Alps",
    tags: ["mountains", "hiking", "alps", "adventure"]
  },
  {
    caption: "Street art that speaks to the soul! This mural perfectly captures the spirit of the neighborhood. Art has the power to transform spaces and bring communities together. 🎨 #StreetArt #UrbanArt #Community",
    location: "Brooklyn, NYC",
    tags: ["street-art", "mural", "brooklyn", "urban-art"]
  },
  {
    caption: "Coffee culture at its finest! This local café serves the most amazing brew with a view that's equally impressive. Perfect spot for people watching and inspiration. ☕ #CoffeeCulture #LocalCafe #Inspiration",
    location: "Melbourne, Australia",
    tags: ["coffee", "cafe", "melbourne", "local"]
  },
  {
    caption: "Ancient temples hold such mystery and beauty. The intricate carvings and spiritual atmosphere here are truly humbling. A reminder of the incredible craftsmanship of our ancestors. 🏛️ #AncientTemples #Spirituality #History",
    location: "Angkor Wat, Cambodia",
    tags: ["temple", "ancient", "cambodia", "spirituality"]
  },
  {
    caption: "Wildlife encounter of a lifetime! This majestic lion was so close, I could feel its presence. Nature's beauty in its purest form. 🦁 #Wildlife #Lion #Nature #Safari",
    location: "Serengeti, Tanzania",
    tags: ["wildlife", "lion", "safari", "serengeti"]
  },
  {
    caption: "Cherry blossom season is here! The delicate pink petals falling like snow create such a magical atmosphere. Spring has never looked more beautiful! 🌸 #CherryBlossom #Spring #Japan #Magic",
    location: "Tokyo, Japan",
    tags: ["cherry-blossom", "spring", "tokyo", "japan"]
  },
  {
    caption: "Desert landscapes have their own unique beauty. The vastness and silence here are absolutely mesmerizing. A perfect place for reflection and finding inner peace. 🏜️ #Desert #Landscape #Peace #Reflection",
    location: "Sahara Desert",
    tags: ["desert", "landscape", "sahara", "peace"]
  },
  {
    caption: "Underwater world is like entering another dimension! The coral reefs and marine life here are absolutely stunning. Protecting our oceans has never been more important. 🐠 #Underwater #CoralReef #MarineLife #Ocean",
    location: "Great Barrier Reef",
    tags: ["underwater", "coral-reef", "marine-life", "ocean"]
  },
  {
    caption: "City lights at night create such a magical atmosphere! The energy and vibrancy of urban life never sleep. Every light tells a story of dreams and aspirations. 🌃 #CityLights #NightLife #Urban #Dreams",
    location: "Hong Kong",
    tags: ["city-lights", "night", "hong-kong", "urban"]
  },
  {
    caption: "Local market vibes! The colors, smells, and sounds here are absolutely intoxicating. This is where you truly experience the heart and soul of a culture. 🥘 #LocalMarket #Culture #Food #Vibes",
    location: "Marrakech, Morocco",
    tags: ["market", "local", "marrakech", "culture"]
  },
  {
    caption: "Mountain lake reflecting the sky like a perfect mirror. The tranquility here is absolutely healing. Nature's way of showing us true beauty and peace. 🏔️ #MountainLake #Reflection #Tranquility #Nature",
    location: "Lake Louise, Canada",
    tags: ["mountain-lake", "reflection", "canada", "tranquility"]
  },
  {
    caption: "Ancient ruins tell stories of civilizations long gone. Walking through these stones, you can almost hear the echoes of the past. History comes alive here. 🏛️ #AncientRuins #History #Civilization #Echoes",
    location: "Machu Picchu, Peru",
    tags: ["ruins", "ancient", "machu-picchu", "history"]
  },
  {
    caption: "Northern lights dancing in the sky! This natural light show is absolutely mesmerizing. Mother Nature's most spectacular performance. 🌌 #NorthernLights #Aurora #Nature #Spectacular",
    location: "Iceland",
    tags: ["northern-lights", "aurora", "iceland", "spectacular"]
  },
  {
    caption: "Traditional festival celebrating centuries of culture and tradition. The energy and joy here are absolutely contagious! 🎭 #Festival #Tradition #Culture #Celebration",
    location: "Kyoto, Japan",
    tags: ["festival", "tradition", "kyoto", "celebration"]
  },
  {
    caption: "Hidden waterfall in the middle of the jungle! The sound of rushing water and the lush greenery create such a peaceful sanctuary. 🌿 #Waterfall #Jungle #Hidden #Sanctuary",
    location: "Costa Rica",
    tags: ["waterfall", "jungle", "hidden", "sanctuary"]
  },
  {
    caption: "Sunrise over the mountains is pure magic! The golden light painting the peaks is absolutely breathtaking. Early mornings are always worth it for moments like this. 🌄 #Sunrise #Mountains #GoldenHour #Magic",
    location: "Nepal Himalayas",
    tags: ["sunrise", "mountains", "himalayas", "golden-hour"]
  },
  {
    caption: "Street food heaven! The flavors and aromas here are absolutely incredible. This is where you find the soul of a city through its food. 🍜 #StreetFood #Flavors #Local #Soul",
    location: "Bangkok, Thailand",
    tags: ["street-food", "thailand", "bangkok", "flavors"]
  },
  {
    caption: "Desert oasis in the middle of nowhere! The contrast between the harsh desert and this lush paradise is absolutely stunning. Nature's surprises never cease to amaze. 🌴 #DesertOasis #Contrast #Paradise #Surprise",
    location: "Dubai, UAE",
    tags: ["oasis", "desert", "dubai", "paradise"]
  }
];

// Sample images (base64 encoded placeholders)
const sampleImages = [
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
];

const seedData = async () => {
  try {
    console.log('🌱 Starting seed data generation...');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.username}`);
    }

    // Create posts
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      
      // Create random likes
      const randomLikes = [];
      const numLikes = Math.floor(Math.random() * 5); // 0-4 likes
      for (let j = 0; j < numLikes; j++) {
        const randomLiker = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        if (!randomLikes.includes(randomLiker._id)) {
          randomLikes.push(randomLiker._id);
        }
      }

      // Create random shares
      const randomShares = {
        count: Math.floor(Math.random() * 3), // 0-2 shares
        sharedBy: []
      };
      for (let j = 0; j < randomShares.count; j++) {
        const randomSharer = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        if (!randomShares.sharedBy.includes(randomSharer._id)) {
          randomShares.sharedBy.push(randomSharer._id);
        }
      }

      const post = new Post({
        author: randomUser._id,
        image: randomImage,
        caption: postData.caption,
        location: postData.location,
        tags: postData.tags,
        likes: randomLikes,
        shares: randomShares,
        viewCount: Math.floor(Math.random() * 100),
        engagement: {
          impressions: Math.floor(Math.random() * 500),
          reach: Math.floor(Math.random() * 200)
        }
      });

      await post.save();
      
      // Add post to user's posts array
      randomUser.posts.push(post._id);
      await randomUser.save();

      console.log(`📸 Created post: ${postData.caption.substring(0, 50)}...`);
    }

    console.log('✅ Seed data generation completed!');
    console.log(`📊 Created ${createdUsers.length} users and ${samplePosts.length} posts`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

// Run seed data if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('🎉 Seed data completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed data failed:', error);
      process.exit(1);
    });
}

module.exports = { seedData };
