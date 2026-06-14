import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const bookmarkModel = (prisma as any).bookmark;

async function main() {
  console.log("🌱 Starting RanahMinang Database Seeding...\n");

  const defaultPassword = "Password123!";
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

  // 1. Create or Find Required Users
  const usersToSeed = [
    {
      name: "Aditya Pratama",
      email: "admin@ranahminang.dev",
      passwordHash,
      role: "superadmin" as const,
      approvalStatus: "APPROVED" as const
    },
    {
      name: "Siti Rahma",
      email: "producer1@ranahminang.dev",
      passwordHash,
      role: "producer" as const,
      approvalStatus: "APPROVED" as const
    },
    {
      name: "Budi Santoso",
      email: "producer2@ranahminang.dev",
      passwordHash,
      role: "producer" as const,
      approvalStatus: "APPROVED" as const
    },
    {
      name: "Dian Lestari",
      email: "tourist1@ranahminang.dev",
      passwordHash,
      role: "tourist" as const,
      approvalStatus: "APPROVED" as const
    },
    {
      name: "Rian Hidayat",
      email: "tourist2@ranahminang.dev",
      passwordHash,
      role: "tourist" as const,
      approvalStatus: "APPROVED" as const
    }
  ];

  const seededUsers: Record<string, any> = {};

  for (const userData of usersToSeed) {
    let user = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: userData
      });
      console.log(`✓ Created user: ${user.email} (${user.role})`);
    } else {
      console.log(`→ Skipped user: ${user.email} (already exists)`);
    }
    seededUsers[userData.email] = user;
  }

  // Get Producer IDs for Destination Ownership
  const producer1 = seededUsers["producer1@ranahminang.dev"];
  const producer2 = seededUsers["producer2@ranahminang.dev"];
  const adminUser = seededUsers["admin@ranahminang.dev"];

  // 2. Seed 15 Realistic West Sumatra Destinations
  const destinationsData = [
    {
      title: "Jam Gadang",
      description: "The historic clock tower of Bukittinggi, built in 1926 as a gift from the Dutch Queen. Known for its unique roof shaped like a traditional Minangkabau Rumah Gadang and its location at the symbolic heart of the city.",
      location: "Bukittinggi",
      category: "Historical",
      latitude: -0.3052,
      longitude: 100.3692,
      image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80&w=800",
      createdBy: producer1.id
    },
    {
      title: "Ngarai Sianok",
      description: "A breathtaking canyon with vertical green cliffs and the winding Sianok river flowing through it. Popular for scenic photography, trekking, and nature trails.",
      location: "Bukittinggi",
      category: "Nature",
      latitude: -0.3077,
      longitude: 100.3624,
      image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800",
      createdBy: producer2.id
    },
    {
      title: "Lembah Harau",
      description: "A lush, dramatic valley framed by vertical granite cliffs rising up to 100 meters. Adorned with multiple pristine waterfalls and picturesque rice fields.",
      location: "Payakumbuh",
      category: "Nature",
      latitude: -0.1049,
      longitude: 100.6654,
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
      createdBy: producer1.id
    },
    {
      title: "Danau Maninjau",
      description: "A majestic volcanic caldera lake surrounded by steep hills. Famous for its breathtaking sunset views, traditional floating fish nets, and serene atmosphere.",
      location: "Agam",
      category: "Nature",
      latitude: -0.3093,
      longitude: 100.2036,
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
      createdBy: producer2.id
    },
    {
      title: "Pantai Air Manis",
      description: "A historical beach famous for the stone of Malin Kundang, a legendary figure turned to stone due to his rebellion against his mother.",
      location: "Padang",
      category: "Beach",
      latitude: -0.9718,
      longitude: 100.3329,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
      createdBy: producer1.id
    },
    {
      title: "Istano Basa Pagaruyung",
      description: "The royal palace of the Pagaruyung Kingdom, reconstructed in traditional Minangkabau style with three stories and ornate wood carvings showing matrilineal values.",
      location: "Tanah Datar",
      category: "Cultural",
      latitude: -0.4716,
      longitude: 100.6215,
      image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&q=80&w=800",
      createdBy: producer2.id
    },
    {
      title: "Danau Singkarak",
      description: "The largest lake in West Sumatra, famous for bilih fish which only live in this lake. Surrounded by mountains, it offers spectacular panoramic drives.",
      location: "Solok",
      category: "Nature",
      latitude: -0.6128,
      longitude: 100.5517,
      image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800",
      createdBy: producer1.id
    },
    {
      title: "Pantai Padang",
      description: "A popular city beach locally called Taplau (Tapi Lauik). Ideal for evening sunset strolls, local culinary treats like spicy clams, and coastal recreation.",
      location: "Padang",
      category: "Beach",
      latitude: -0.9025,
      longitude: 100.3508,
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800",
      createdBy: producer2.id
    },
    {
      title: "Gunung Marapi",
      description: "An active volcano central to Minangkabau mythology as the origin place of the ancestors. Popular among local hikers and mountaineers for its panoramic views.",
      location: "Tanah Datar",
      category: "Mountain",
      latitude: -0.3812,
      longitude: 100.4735,
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
      createdBy: producer1.id
    },
    {
      title: "Lubang Jepang",
      description: "An extensive Japanese military tunnel system built during WWII by forced labor (romusha). It features multiple meeting rooms, ammunition stores, and dungeons.",
      location: "Bukittinggi",
      category: "Historical",
      latitude: -0.3082,
      longitude: 100.3642,
      image: "https://images.unsplash.com/photo-1544085311-115f02c6fe9c?auto=format&fit=crop&q=80&w=800",
      createdBy: producer2.id
    },
    {
      title: "Air Terjun Lembah Anai",
      description: "A beautiful 35-meter waterfall located directly beside the highway connecting Padang and Bukittinggi, generating a mist over passing vehicles.",
      location: "Tanah Datar",
      category: "Nature",
      latitude: -0.4785,
      longitude: 100.3382,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
      createdBy: producer1.id
    },
    {
      title: "Pulau Pasumpahan",
      description: "A tropical island paradise with pristine white sand, coral gardens, and clear turquoise waters. Excellent for snorkeling, camping, and boat excursions.",
      location: "Padang",
      category: "Beach",
      latitude: -1.1218,
      longitude: 100.3685,
      image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800",
      createdBy: producer2.id
    },
    {
      title: "Bukit Langkisau",
      description: "A scenic hill offering sweeping views of the bay of Painan and the surrounding mountains. Famous for paragliding and viewing the golden ocean sunset.",
      location: "Solok",
      category: "Mountain",
      latitude: -1.3533,
      longitude: 100.5694,
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800",
      createdBy: producer1.id
    },
    {
      title: "Kelok 9",
      description: "A majestic multi-tiered flyover bridge connecting West Sumatra with Riau. Represents a modern engineering marvel winding through dense tropical forest canyons.",
      location: "Payakumbuh",
      category: "Historical",
      latitude: -0.0682,
      longitude: 100.6985,
      image: "https://images.unsplash.com/photo-1545137683-0975b9c11f92?auto=format&fit=crop&q=80&w=800",
      createdBy: producer2.id
    },
    {
      title: "Desa Pariangan",
      description: "Voted as one of the most beautiful villages in the world. It is the legendary birthplace of the Minangkabau people, showcasing ancient architecture.",
      location: "Tanah Datar",
      category: "Cultural",
      latitude: -0.4502,
      longitude: 100.4851,
      image: "https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&q=80&w=800",
      createdBy: producer1.id
    }
  ];

  for (const destData of destinationsData) {
    const existing = await prisma.destination.findFirst({
      where: { title: destData.title }
    });

    if (!existing) {
      await prisma.destination.create({
        data: destData
      });
      console.log(`✓ Created destination: ${destData.title}`);
    } else {
      console.log(`→ Skipped destination: ${destData.title} (already exists)`);
    }
  }

  // 3. Seed 10 Cultural Articles
  const articlesData = [
    {
      title: "The Sacred Architecture of Rumah Gadang",
      category: "Architecture",
      content: "The Rumah Gadang, meaning 'Big House,' is the traditional house of the Minangkabau people. Its most distinctive feature is the curved roof structure with multi-tiered gables that rise to sharp points, resembling buffalo horns (gonjong). The house is built on stilts and is made entirely of wood and bamboo without using a single nail, utilizing smart joinery that makes it highly earthquake-resistant. Every Rumah Gadang represents a specific clan and is owned matrilineally by the women of the family. The interior layout indicates status and family size, where the main room is shared while young girls sleep in specific chambers (biliak). The exterior wood carvings represent local plants and animals, translating natural observation into spiritual wisdom.",
      image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&q=80&w=800",
      createdBy: producer1.id
    },
    {
      title: "Rendang: More Than Just a Dish",
      category: "Culinary",
      content: "Rendang is widely recognized as one of the world's most delicious foods, but in Minangkabau society, it holds deep cultural philosophy. The preparation of Rendang requires four main elements: dagiang (meat, representing the elders), karambia (coconut milk, representing intellectuals), lado (chili, representing religious leaders), and pemasak (spices, representing the general society). The slow-cooking process, which takes up to seven hours of stirring, represents patience, wisdom, and mutual cooperation (gotong royong). Traditionally, Rendang is prepared for major events such as weddings, clan inaugurations, and religious festivals. Its high durability allowed traveling Minang merchants and migrants to preserve food for weeks.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
      createdBy: producer2.id
    },
    {
      title: "The Matrilineal System of Minangkabau",
      category: "History",
      content: "The Minangkabau people of West Sumatra form the largest matrilineal society in the world. Clan name, lineage, and ancestral property (sako and pusako) are passed down from mother to daughter. Men, however, are expected to lead the family and clan as Ninik Mamak (uncles/elders). This system creates a balance of power, where women inherit the land and home to ensure security, while men oversee the community structure and travel outside the village to gain wealth and wisdom. It reflects the adat proverb: 'Nature is our teacher,' teaching that everything in creation works in dual balance.",
      image: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&q=80&w=800",
      createdBy: adminUser.id
    },
    {
      title: "Merantau: The Minang Tradition of Migration",
      category: "Tradition",
      content: "Merantau is a cultural rite of passage where young Minangkabau men leave their homeland to seek fortune, knowledge, and experience in other parts of the world. Because the matrilineal system leaves ancestral land inheritance to women, young men are encouraged to be independent and self-reliant. Upon returning, they bring back wealth and knowledge to build their home villages. This tradition has spread the Minang diaspora and culinary heritage across Southeast Asia. Famous figures like Mohammad Hatta and Tan Malaka were product of this migrating mindset.",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800",
      createdBy: producer1.id
    },
    {
      title: "Silek: Traditional Art of Self-Defense",
      category: "Tradition",
      content: "Silek Minangkabau is a traditional martial art that combines physical self-defense with spiritual philosophy. Unlike sports-focused combat, Silek is taught in traditional training spaces called Sasaran. It incorporates low stances, fluid movements inspired by animals, and sudden strikes. Traditionally, Silek was taught to protect villages and to prepare young men for merantau. Today, Silek is performed as a beautiful dance drama accompanied by traditional instruments. It teaches control, patience, and respect, aligning physical fitness with mental clarity.",
      image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800",
      createdBy: producer2.id
    },
    {
      title: "Tari Piring: The Plate Dance of West Sumatra",
      category: "Culture",
      content: "Tari Piring, or the Plate Dance, is a traditional Minangkabau dance where performers hold ceramic plates in both hands, dancing dynamically to fast talempong beats without dropping the plates. At the climax of the dance, performers step and jump on broken shards of glass with bare feet, remaining completely uninjured. This dance originally served as a ritual of thanksgiving to the gods after a successful harvest, and is now performed at weddings and official ceremonies. It showcases structural agility, trust, and absolute focus.",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800",
      createdBy: adminUser.id
    },
    {
      title: "The Philosophy of Minang Culinary Culture",
      category: "Culinary",
      content: "Minangkabau food, commonly known as Padang food, is famous for its rich coconut milk, bold spices, and spicy chili. The food is served in a unique style called hidang, where dozens of small plates are stacked on top of each other in a display of abundance. The culinary culture is deeply rooted in hospitality and respect. Every dish, from the slow-cooked Gulai to the crispy Dendeng, represents Minangkabau ancestors' adaptation to the natural environment and resources. The presentation teaches cleanliness and community sharing.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
      createdBy: producer1.id
    },
    {
      title: "Traditional Ceremonies: Batagak Pangulu",
      category: "Tradition",
      content: "Batagak Pangulu is the traditional ceremony for inaugurating a new clan leader (Pangulu or Datuk) in Minangkabau. The title represents high moral and cultural responsibility. The ceremony lasts for several days, involving animal sacrifices (buffaloes), feasts, and traditional speech-making. It is attended by the entire village community and neighboring elders to ensure the candidate has the support and integrity required to guide the clan according to traditional Minang laws (Adat). The leader represents community consensus.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      createdBy: producer2.id
    },
    {
      title: "Folklore: The Legend of Malin Kundang",
      category: "Folklore",
      content: "The legend of Malin Kundang is a classic moral tale from the coast of Padang. It tells the story of a poor boy who leaves his mother to seek fortune at sea. After becoming a wealthy merchant, he returns to Padang with his beautiful wife. Ashamed of his poor mother, he denies knowing her. Brokenhearted, his mother prays for justice, and a violent storm turns Malin and his ship into stone. Today, the Malin Kundang stone can still be visited at Pantai Air Manis. The story is a central pillar of family values and respect for parents.",
      image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800",
      createdBy: adminUser.id
    },
    {
      title: "Islam and Adat: The Dual Pillars of Minang Life",
      category: "History",
      content: "The relationship between Minangkabau custom (Adat) and Islam is defined by the famous cultural maxim: 'Adat basandi Syarak, Syarak basandi Kitabullah' (Custom is based on Islamic Law, and Islamic Law is based on the Quran). Historically, this was established after the Padri War to reconcile traditional matrilineal customs with Islamic teachings. Today, being Minang is synonymous with being Muslim, and the two systems guide family structures, inheritance, and social ethics in harmony. It represents a unique syncretic model of indigenous identity.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
      createdBy: producer1.id
    }
  ];

  for (const artData of articlesData) {
    const existing = await prisma.article.findFirst({
      where: { title: artData.title }
    });

    if (!existing) {
      await prisma.article.create({
        data: artData
      });
      console.log(`✓ Created article: ${artData.title}`);
    } else {
      console.log(`→ Skipped article: ${artData.title} (already exists)`);
    }
  }

  console.log("\n✅ RanahMinang Seeding Completed Successfully!");
  console.log("\n🔑 Demo Credentials:");
  console.log("   Password for all accounts: Password123!");
  console.log("   ----------------------------------------");
  console.log("   1. Superadmin (APPROVED): admin@ranahminang.dev");
  console.log("   2. Producer 1 (APPROVED): producer1@ranahminang.dev");
  console.log("   3. Producer 2 (APPROVED): producer2@ranahminang.dev");
  console.log("   4. Tourist 1  (APPROVED): tourist1@ranahminang.dev");
  console.log("   5. Tourist 2  (APPROVED): tourist2@ranahminang.dev");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
