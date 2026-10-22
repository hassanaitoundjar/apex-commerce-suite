const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedWomensFashion() {
  console.log("Starting 100% Pure Women's Fashion database seed...");

  // 1. Delete previous products & categories
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 2. Insert Women's Fashion Categories
  const categoriesData = [
    {
      name: "Robes & Soirée",
      slug: "dresses",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Manteaux & Trenchs",
      slug: "coats",
      image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Mailles & Cachemire",
      slug: "knitwear",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Hauts & Chemisiers",
      slug: "tops",
      image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Pantalons & Jupes",
      slug: "pants-skirts",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Sacs & Maroquinerie",
      slug: "bags",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Escarpins & Bottines",
      slug: "shoes",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Bijoux & Accessoires",
      slug: "jewelry",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Costumes & Blazers",
      slug: "blazers",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }
  console.log(`Created ${categoriesData.length} women fashion categories.`);

  // 3. Insert 16+ rich Women's Fashion products
  const productsData = [
    {
      name: "Robe de Soirée Asymétrique en Soie",
      description: "Une robe longue fluide confectionnée en satin de soie d'exception. Encolure asymétrique dramatique, fente haute flatteuse et tombé sculptural pour vos réceptions d'exception.",
      price: 220,
      salePrice: 280,
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
      ],
      category: "dresses",
      brand: "Zara",
      sizes: ["XS", "S", "M", "L"],
      colors: ["#0f172a", "#ef4444", "#f59e0b"],
      stock: 25,
      ratings: 5.0,
      reviewsCount: 42,
      isFeatured: true,
      isOnSale: true,
      isAvailable: true
    },
    {
      name: "Trench Coat Camel en Gabardine de Coton",
      description: "Trench croisé intemporel taillé dans une gabardine de coton dense et déperlante. Bavolets élégants, ceinture surpiquée à boucle écaille et boutons en corne.",
      price: 340,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
      ],
      category: "coats",
      brand: "Prada",
      sizes: ["S", "M", "L", "XL"],
      colors: ["#d97706", "#1e293b"],
      stock: 18,
      ratings: 4.9,
      reviewsCount: 35,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Pull Col Roulé Cachemire Crème Impérial",
      description: "Pull en pur cachemire 4 fils de Mongolie, offrant une douceur et une chaleur incomparables. Coupe droite décontractée avec bordures côtelées raffinées.",
      price: 195,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
      ],
      category: "knitwear",
      brand: "Prada",
      sizes: ["XS", "S", "M", "L"],
      colors: ["#fef3c7", "#94a3b8"],
      stock: 30,
      ratings: 4.9,
      reviewsCount: 28,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Sac Porté Épaule en Cuir Grainé 'L'Éclipse'",
      description: "Sac à main signature aux lignes pures façon demi-lune. Cuir de veau pleine fleur italien avec boucle magnétique dorée et anse modulable pour un porté main ou épaule.",
      price: 290,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
      ],
      category: "bags",
      brand: "Prada",
      sizes: ["Taille Unique"],
      colors: ["#0f172a", "#78350f", "#fef3c7"],
      stock: 14,
      ratings: 5.0,
      reviewsCount: 46,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Escarpins Stiletto en Cuir Nappa 85mm",
      description: "Escarpins à bout pointu ultra-féminins confectionnés à la main à Florence. Cambrure étudiée pour un confort optimal et semelle cuir avec patin injecté.",
      price: 210,
      salePrice: 260,
      images: [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
      ],
      category: "shoes",
      brand: "Prada",
      sizes: ["36", "37", "38", "39", "40", "41"],
      colors: ["#0f172a", "#ef4444"],
      stock: 22,
      ratings: 4.9,
      reviewsCount: 24,
      isFeatured: true,
      isOnSale: true,
      isAvailable: true
    },
    {
      name: "Blazer Structuré Tailleur en Laine Froide",
      description: "Veste de tailleur à boutonnage croisé aux lignes architecturales. Épaules dessinées, revers en pointe et doublure intégrale en cupro soyeux.",
      price: 280,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
      ],
      category: "blazers",
      brand: "Prada",
      sizes: ["XS", "S", "M", "L"],
      colors: ["#1e293b", "#0f172a"],
      stock: 16,
      ratings: 4.8,
      reviewsCount: 22,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Blouse Fluide en Crêpe de Soie Noire",
      description: "Chemisier vaporeux en crêpe de Chine 100% soie. Boutons recouverts de soie assortie, poignets plissés et tombé aérien idéal sous un tailleur.",
      price: 115,
      salePrice: 145,
      images: [
        "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80"
      ],
      category: "tops",
      brand: "Zara",
      sizes: ["S", "M", "L"],
      colors: ["#0f172a", "#ffffff"],
      stock: 35,
      ratings: 4.8,
      reviewsCount: 19,
      isFeatured: false,
      isOnSale: true,
      isAvailable: true
    },
    {
      name: "Robe Midi Plissée à Imprimé Floral Doré",
      description: "Robe midi dansante aux micro-plis soleil permanents. Ceinture ruban en velours et décolleté cache-cœur délicat pour un look bohème chic raffiné.",
      price: 160,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
      ],
      category: "dresses",
      brand: "Zara",
      sizes: ["XS", "S", "M", "L"],
      colors: ["#f59e0b", "#10b981"],
      stock: 28,
      ratings: 4.7,
      reviewsCount: 31,
      isFeatured: false,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Pantalon Palazzio Fluide Taille Haute",
      description: "Pantalon large coupe palazzo à pinces profondes. Taille haute emboîtante, poches italiennes et fluidité incomparable à chaque pas.",
      price: 125,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
      ],
      category: "pants-skirts",
      brand: "Zara",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["#ffffff", "#0f172a", "#94a3b8"],
      stock: 32,
      ratings: 4.6,
      reviewsCount: 18,
      isFeatured: false,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Collier Maillons Chunky Plaqué Or 18K",
      description: "Collier ras-du-cou gourmette texturé plaqué or 18 carats 3 microns. Fermoir mousqueton bijou et finition brillante résistante à l'eau.",
      price: 140,
      salePrice: 180,
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
      ],
      category: "jewelry",
      brand: "Prada",
      sizes: ["Taille Unique"],
      colors: ["#f59e0b"],
      stock: 20,
      ratings: 5.0,
      reviewsCount: 39,
      isFeatured: true,
      isOnSale: true,
      isAvailable: true
    },
    {
      name: "Jupe Midi Trapèze en Satin Doux",
      description: "Jupe midi évasée coupée dans le biais pour un mouvement fluide époustouflant. Ceinture invisible et finition ourlet roulotté fin.",
      price: 105,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80"
      ],
      category: "pants-skirts",
      brand: "Zara",
      sizes: ["XS", "S", "M", "L"],
      colors: ["#fef3c7", "#1e293b"],
      stock: 24,
      ratings: 4.7,
      reviewsCount: 15,
      isFeatured: false,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Bottines Cuir Souple à Talon Sculptural",
      description: "Bottines seconde peau en cuir d'agneau plongé. Talon incurvé façon œuvre d'art de 7cm et fermeture zippée discrète à l'arrière.",
      price: 175,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80"
      ],
      category: "shoes",
      brand: "Zara",
      sizes: ["36", "37", "38", "39", "40"],
      colors: ["#0f172a", "#78350f"],
      stock: 19,
      ratings: 4.8,
      reviewsCount: 29,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Cardigan Côtelé en Mohair & Soie",
      description: "Gilet vaporeux tricoté en mohair doux certifié et fil de soie pure. Boutons nacrés vintage et col V sensuel.",
      price: 185,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80"
      ],
      category: "knitwear",
      brand: "Prada",
      sizes: ["XS", "S", "M", "L"],
      colors: ["#fef3c7", "#94a3b8"],
      stock: 15,
      ratings: 4.9,
      reviewsCount: 16,
      isFeatured: false,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Mini Sac Bandoulière Cuir Matelassé",
      description: "Mini sac pochette en cuir matelassé losange avec bandoulière gourmette dorée entrelacée de cuir. Intérieur doublé suédine avec fentes pour cartes.",
      price: 245,
      salePrice: 310,
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
      ],
      category: "bags",
      brand: "Prada",
      sizes: ["Taille Unique"],
      colors: ["#0f172a", "#ef4444"],
      stock: 18,
      ratings: 4.9,
      reviewsCount: 33,
      isFeatured: true,
      isOnSale: true,
      isAvailable: true
    },
    {
      name: "Robe Fourreau Noire Minimaliste 90s",
      description: "L'iconique petite robe noire réinterprétée dans un crêpe stretch galbant. Bretelles spaghettis fines et décolleté droit intemporel.",
      price: 145,
      salePrice: null,
      images: [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
      ],
      category: "dresses",
      brand: "Zara",
      sizes: ["XS", "S", "M", "L"],
      colors: ["#0f172a"],
      stock: 35,
      ratings: 4.8,
      reviewsCount: 27,
      isFeatured: true,
      isOnSale: false,
      isAvailable: true
    },
    {
      name: "Manteau Ceinturé en Laine Douce Vert Sauge",
      description: "Manteau peignoir non doublé confectionné en double-face de laine vierge. Emmanchures raglan confortables et large ceinture coordonnée.",
      price: 260,
      salePrice: 320,
      images: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
      ],
      category: "coats",
      brand: "Zara",
      sizes: ["S", "M", "L", "XL"],
      colors: ["#10b981", "#94a3b8"],
      stock: 14,
      ratings: 4.9,
      reviewsCount: 21,
      isFeatured: false,
      isOnSale: true,
      isAvailable: true
    }
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }
  console.log(`Created ${productsData.length} women fashion products.`);

  // 4. Update General Settings
  const countdown = new Date(Date.now() + 18 * 24 * 60 * 60 * 1000);
  await prisma.generalSettings.updateMany({
    data: {
      heroTitle: "L'Élégance Féminine Redéfinie",
      heroSubtitle: "Découvrez notre nouvelle collection femme 2026 : robes de créateurs, mailles en pur cachemire, trenchs ceinturés et maroquinerie d'exception.",
      heroImageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
      heroCountdownDate: countdown,
    }
  });

  console.log("Women's Fashion seed completed successfully!");
}

seedWomensFashion()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
