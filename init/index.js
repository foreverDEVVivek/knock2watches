const mongoose = require('mongoose');
const Watches = require('../models/watchSchema'); // adjust path as needed

mongoose.connect('mongodb://127.0.0.1:27017/knock_watches')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const sampleWatches = [
  {
    name: "Classic Analog Watch",
    brand: "Titan",
    description: "Elegant analog watch with leather strap and classic dial.",
    category: "Analog",
    images: [{ url: "/images/titan_classic.jpg", alt: "Titan Classic Watch" }],
    price: 2499,
    discount: 10,
    stock: 15,
    tags: ["leather", "classic", "waterproof"],
    specifications: {
      caseMaterial: "Stainless Steel",
      strapMaterial: "Leather",
      waterResistance: "50m",
      movementType: "Quartz",
      dialColor: "White",
      strapColor: "Brown",
      weight: "120g",
      dimensions: "42mm"
    },
    averageRating: 4.2,
    reviewCount: 18,
    isFeatured: true
  },
  {
    name: "Sports Digital Watch",
    brand: "Casio",
    description: "Durable digital watch with stopwatch and alarm functions.",
    category: "Digital",
    images: [{ url: "/images/casio_sports.jpg", alt: "Casio Sports Watch" }],
    price: 1999,
    discount: 15,
    stock: 30,
    tags: ["sports", "durable", "stopwatch"],
    specifications: {
      caseMaterial: "Resin",
      strapMaterial: "Rubber",
      waterResistance: "100m",
      movementType: "Digital",
      dialColor: "Black",
      strapColor: "Black",
      weight: "90g",
      dimensions: "45mm"
    },
    averageRating: 4.5,
    reviewCount: 25,
    isFeatured: false
  },
  {
    name: "Luxury Chronograph",
    brand: "Rolex",
    description: "Premium luxury watch with chronograph functionality.",
    category: "Luxury",
    images: [{ url: "/images/rolex_luxury.jpg", alt: "Rolex Luxury Watch" }],
    price: 550000,
    discount: 5,
    stock: 5,
    tags: ["luxury", "chronograph", "automatic"],
    specifications: {
      caseMaterial: "Gold",
      strapMaterial: "Gold",
      waterResistance: "100m",
      movementType: "Automatic",
      dialColor: "Black",
      strapColor: "Gold",
      weight: "150g",
      dimensions: "40mm"
    },
    averageRating: 4.9,
    reviewCount: 12,
    isFeatured: true
  },
  {
    name: "Smart Fitness Watch",
    brand: "Apple",
    description: "Smartwatch with fitness tracking and notifications.",
    category: "Smartwatch",
    images: [{ url: "/images/apple_smartwatch.jpg", alt: "Apple Smart Watch" }],
    price: 34999,
    discount: 12,
    stock: 20,
    tags: ["smartwatch", "fitness", "bluetooth"],
    specifications: {
      caseMaterial: "Aluminium",
      strapMaterial: "Silicone",
      waterResistance: "50m",
      movementType: "Digital",
      dialColor: "Black",
      strapColor: "White",
      weight: "50g",
      dimensions: "44mm"
    },
    averageRating: 4.7,
    reviewCount: 50,
    isFeatured: true
  },
  {
    name: "Rugged Outdoor Watch",
    brand: "Garmin",
    description: "Shock-resistant watch built for outdoor adventures.",
    category: "Sports",
    images: [{ url: "/images/garmin_rugged.jpg", alt: "Garmin Outdoor Watch" }],
    price: 22999,
    discount: 8,
    stock: 10,
    tags: ["rugged", "gps", "outdoor"],
    specifications: {
      caseMaterial: "Fiber-reinforced polymer",
      strapMaterial: "Silicone",
      waterResistance: "100m",
      movementType: "Quartz",
      dialColor: "Black",
      strapColor: "Green",
      weight: "65g",
      dimensions: "46mm"
    },
    averageRating: 4.6,
    reviewCount: 32,
    isFeatured: false
  },
  {
    name: "Minimalist Analog Watch",
    brand: "Fossil",
    description: "Simple and stylish analog watch for everyday wear.",
    category: "Analog",
    images: [{ url: "/images/fossil_minimal.jpg", alt: "Fossil Minimalist Watch" }],
    price: 7999,
    discount: 20,
    stock: 25,
    tags: ["minimalist", "leather", "lightweight"],
    specifications: {
      caseMaterial: "Stainless Steel",
      strapMaterial: "Leather",
      waterResistance: "30m",
      movementType: "Quartz",
      dialColor: "Blue",
      strapColor: "Black",
      weight: "100g",
      dimensions: "40mm"
    },
    averageRating: 4.3,
    reviewCount: 40,
    isFeatured: false
  },
  {
    name: "Diver’s Watch",
    brand: "Seiko",
    description: "Professional diver’s watch with high water resistance.",
    category: "Sports",
    images: [{ url: "/images/seiko_diver.jpg", alt: "Seiko Diver Watch" }],
    price: 18999,
    discount: 18,
    stock: 12,
    tags: ["diver", "waterproof", "automatic"],
    specifications: {
      caseMaterial: "Stainless Steel",
      strapMaterial: "Rubber",
      waterResistance: "200m",
      movementType: "Automatic",
      dialColor: "Blue",
      strapColor: "Black",
      weight: "130g",
      dimensions: "44mm"
    },
    averageRating: 4.8,
    reviewCount: 22,
    isFeatured: false
  },
  {
    name: "Luxury Skeleton Watch",
    brand: "Hublot",
    description: "Skeleton design luxury watch showcasing movement.",
    category: "Luxury",
    images: [{ url: "/images/hublot_skeleton.jpg", alt: "Hublot Skeleton Watch" }],
    price: 420000,
    discount: 7,
    stock: 4,
    tags: ["skeleton", "luxury", "automatic"],
    specifications: {
      caseMaterial: "Titanium",
      strapMaterial: "Rubber",
      waterResistance: "100m",
      movementType: "Automatic",
      dialColor: "Transparent",
      strapColor: "Black",
      weight: "140g",
      dimensions: "45mm"
    },
    averageRating: 4.9,
    reviewCount: 10,
    isFeatured: true
  },
  {
    name: "Retro Digital Watch",
    brand: "Timex",
    description: "Retro-style digital watch with LED backlight.",
    category: "Digital",
    images: [{ url: "/images/timex_retro.jpg", alt: "Timex Retro Watch" }],
    price: 2999,
    discount: 5,
    stock: 18,
    tags: ["retro", "digital", "lightweight"],
    specifications: {
      caseMaterial: "Resin",
      strapMaterial: "Stainless Steel",
      waterResistance: "30m",
      movementType: "Digital",
      dialColor: "Black",
      strapColor: "Silver",
      weight: "80g",
      dimensions: "38mm"
    },
    averageRating: 4.1,
    reviewCount: 14,
    isFeatured: false
  },
  {
    name: "Hybrid Smartwatch",
    brand: "Fossil",
    description: "Analog-digital hybrid smartwatch with activity tracking.",
    category: "Smartwatch",
    images: [{ url: "/images/fossil_hybrid.jpg", alt: "Fossil Hybrid Watch" }],
    price: 12999,
    discount: 10,
    stock: 16,
    tags: ["hybrid", "bluetooth", "fitness"],
    specifications: {
      caseMaterial: "Stainless Steel",
      strapMaterial: "Silicone",
      waterResistance: "50m",
      movementType: "Hybrid",
      dialColor: "Black",
      strapColor: "Black",
      weight: "75g",
      dimensions: "42mm"
    },
    averageRating: 4.4,
    reviewCount: 28,
    isFeatured: true
  }
];

Watches.insertMany(sampleWatches)
  .then(() => {
    console.log("Sample watches inserted!");
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
