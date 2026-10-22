const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedFashion() {
  console.log("Starting fashion database seed for Men & Women...");

  // 1. Clear old furniture products & categories
  const deletedProds = await prisma.product.deleteMany({});
  console.log(`Deleted ${deletedProds.count} old products.`);
  const deletedCats = await prisma.category.deleteMany({});
  console.log(`Deleted ${deletedCats.count} old categories.`);

  // 2. Insert curated Fashion Categories (Men, Women, Apparel, Footwear, Accessories)
  const categoriesData = [
    {
      name: "Femmes",
      slug: "women",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Hommes",
      slug: "men",
      image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Vestes & Manteaux",
      slug: "jackets",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Robes & Combinaisons",
      slug: "dresses",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Sweats & Hoodies",
      slug: "hoodies",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Hauts & T-Shirts",
      slug: "tops",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Pantalons & Denim",
      slug: "pants",
      image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Chaussures & Baskets",
      slug: "shoes",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Sacs & Accessoires",
      slug: "accessories",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Costumes & Blazers",
      slug: "suits",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    }
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }
  console.log(`Created ${categoriesData.length} fashion categories.`);

  // 3. Insert 16 rich realistic fashion products for Men & Women
  const productsData = [
    // WOMEN PIECES
    {
      name: "Robe Longue en Soie Végétale",
      description: "Une robe longue fluide confectionnée en soie délicate. Coupe sirène flatteuse et dos nu sophistiqué pour vos soirées inoubliables.",
      price: 189,
      salePrice: 239,
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
      ],
      category: "dresses",
      brand: "Zara",
      sizes: ["XS", "S", "M", "L"],
      colors: ["#0f172a", "#ef4444", "#f59e0b"],
      stock: 24,
      ratings: 4.9,
      reviewsCount: 38,
      isFeatured: true,
      isOnSale: true,
      isAvailable: true
    },
    {
      name: "Trench Coat Classique Surdimensionné",
      description: "Trench croisé intemporel en sergé de coton déperlant. Bavolet tempête, ceinture à boucle et boutons en corne véritable.",
      price: 295,
      salePrice: 350,
      images: [
        "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
      ],
      category: "jackets",
      brand: "Prada",
      sizes: ["S", "M", "L"],
      colors: ["#d97706", "#1e293b"],
      stock: 18,
      ratings: 5.0,
      reviewsCount: 29,
      isFeatured: true,
      isOnSale: true,
      isAvailable: true
    },
    {
      name: "Pull Cachemire Col Roulé Oversize",
      description: "Pull en pur cachemire peigné d'une douceur absolue. Coupe décontractée avec finitions côtelées aux poignets et à l'ourlet.",
      price: 175,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
      ],
      category: "tops",
      brand: "Zara",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["#fef3c7", "#94a3b8"],
      stock: 35,
      ratings: 4.8,
      reviewsCount: 22,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Sac Trapèze Cuir Italien Sculpté",
      description: "Sac à main structuré en cuir grainé pleine fleur avec fermoir signature doré et bandoulière amovible ajustable.",
      price: 260,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
      ],
      category: "accessories",
      brand: "Prada",
      sizes: ["Taille Unique"],
      colors: ["#0f172a", "#78350f", "#ffffff"],
      stock: 12,
      ratings: 4.9,
      reviewsCount: 31,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Bottines en Cuir Souple à Bout Carré",
      description: "Bottines zippées en cuir nappa avec talon bloc graphique de 6cm. Confort et allure moderne pour toute la journée.",
      price: 165,
      salePrice: 199,
      images: [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
      ],
      category: "shoes",
      brand: "Zara",
      sizes: ["36", "37", "38", "39", "40", "41"],
      colors: ["#0f172a", "#78350f"],
      stock: 20,
      ratings: 4.7,
      reviewsCount: 19,
      isFeatured: false,
      isOnSale: true,
      isAvailable: true
    },
    {
      name: "Blazer Tailleur Coupe Droite",
      description: "Veste de costume structurée aux épaules affirmées, confectionnée en laine mélangée italienne. Poches à rabat et doublure satinée.",
      price: 195,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
      ],
      category: "suits",
      brand: "Prada",
      sizes: ["XS", "S", "M", "L"],
      colors: ["#1e293b", "#94a3b8"],
      stock: 15,
      ratings: 4.8,
      reviewsCount: 16,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Robe Midi Fleurie en Lin Léger",
      description: "Robe midi d'été à imprimé floral exclusif. Encolure cœur, taille cintrée et fente latérale fluide.",
      price: 110,
      salePrice: 140,
      images: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
      ],
      category: "dresses",
      brand: "Zara",
      sizes: ["S", "M", "L"],
      colors: ["#ef4444", "#10b981"],
      stock: 28,
      ratings: 4.6,
      reviewsCount: 14,
      isFeatured: false,
      isOnSale: true,
      isAvailable: true
    },
    {
      name: "Pantalon Fluide Taille Haute Palazzio",
      description: "Pantalon large à pinces avec taille montante élégante. Tomber impeccable et poches cavalières latérales.",
      price: 95,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
      ],
      category: "pants",
      brand: "Zara",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["#ffffff", "#0f172a", "#94a3b8"],
      stock: 30,
      ratings: 4.7,
      reviewsCount: 20,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },

    // MEN PIECES
    {
      name: "Manteau Minimaliste en Laine Vierge",
      description: "Manteau droit d'inspiration scandinave en drap de laine vierge thermorégulateur. Lignes épurées et finitions intérieures soignées.",
      price: 299,
      salePrice: 380,
      images: [
        "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
      ],
      category: "jackets",
      brand: "Prada",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["#0f172a", "#78350f"],
      stock: 20,
      ratings: 5.0,
      reviewsCount: 42,
      isFeatured: true,
      isOnSale: true,
      isAvailable: true
    },
    {
      name: "Hoodie Streetwear Coton Lourd 450 GSM",
      description: "Sweat à capuche oversize taillé dans un molleton de coton peigné ultra-épais. Capuche doublée sans cordon pour une esthétique moderne.",
      price: 98,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
      ],
      category: "hoodies",
      brand: "Nike",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["#0f172a", "#94a3b8", "#10b981"],
      stock: 45,
      ratings: 4.9,
      reviewsCount: 35,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Costume Deux Pièces Coupe Slim Moderne",
      description: "Ensemble veste et pantalon taillé sur mesure dans une étoffe respirante. Revers crantés, poches passepoilées et fentes d'aisance au dos.",
      price: 349,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
      ],
      category: "suits",
      brand: "Prada",
      sizes: ["46", "48", "50", "52", "54"],
      colors: ["#0f172a", "#1e293b"],
      stock: 14,
      ratings: 4.9,
      reviewsCount: 26,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Blouson Bombardier Cuir Véritable",
      description: "Blouson aviateur en cuir d'agneau souple avec col montant, zips métalliques renforcés et poches intérieures zippées.",
      price: 320,
      salePrice: 390,
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
      ],
      category: "jackets",
      brand: "Levi's",
      sizes: ["M", "L", "XL"],
      colors: ["#0f172a", "#78350f"],
      stock: 10,
      ratings: 4.8,
      reviewsCount: 19,
      isFeatured: true,
      isOnSale: true,
      isAvailable: true
    },
    {
      name: "Baskets Basses en Cuir Italien",
      description: "Sneakers minimalistes confectionnées à la main avec semelle cousue en caoutchouc naturel et doublure cuir respirante.",
      price: 179,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
      ],
      category: "shoes",
      brand: "Prada",
      sizes: ["40", "41", "42", "43", "44", "45"],
      colors: ["#ffffff", "#0f172a"],
      stock: 30,
      ratings: 4.9,
      reviewsCount: 33,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Chemise Oxford Col Boutonné Coupe Relax",
      description: "Chemise en tissu oxford épais 100% coton peigné. Résistante, facile d'entretien, parfaite pour un look décontracté chic.",
      price: 68,
      salePrice: 85,
      images: [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
      ],
      category: "tops",
      brand: "Zara",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["#3b82f6", "#ffffff", "#94a3b8"],
      stock: 50,
      ratings: 4.6,
      reviewsCount: 18,
      isFeatured: false,
      isOnSale: true,
      isAvailable: true
    },
    {
      name: "Jean Selvedge Brut Coupe Droite",
      description: "Denim japonais selvedge 14oz non délavé. Liseré rouge sur le revers, rivets en cuivre et boutons gravés.",
      price: 129,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80"
      ],
      category: "pants",
      brand: "Levi's",
      sizes: ["30", "32", "34", "36", "38"],
      colors: ["#0f172a", "#1e293b"],
      stock: 25,
      ratings: 4.8,
      reviewsCount: 24,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Montre Chronographe Boîtier Acier Brossé",
      description: "Montre chronographe étanche 50m avec mouvement de précision, cadran noir satiné et bracelet en cuir végétal grainé.",
      price: 240,
      salePrice: 299,
      images: [
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
      ],
      category: "accessories",
      brand: "Prada",
      sizes: ["Taille Unique"],
      colors: ["#0f172a", "#94a3b8"],
      stock: 15,
      ratings: 5.0,
      reviewsCount: 27,
      isFeatured: true,
      isOnSale: true,
      isAvailable: true
    }
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }
  console.log(`Created ${productsData.length} fashion products.`);

  // 4. Update General Settings hero configuration
  const countdown = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
  await prisma.generalSettings.updateMany({
    data: {
      heroTitle: "L'Élégance Moderne : Mode Homme & Femme",
      heroSubtitle: "Explorez notre collection exclusive alliant coupe impeccable, matières d'exception et allure contemporaine.",
      heroImageUrl: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1200&q=85",
      heroCountdownDate: countdown,
    }
  });
  console.log("Updated general settings hero data.");

  console.log("Fashion database seed completed successfully!");
}

seedFashion()
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
