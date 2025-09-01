const coffeeProducts = [
  {
    id: "CP-1001",
    name: "Ethiopia Yirgacheffe",
    type: "single-origin",
    origin: "Ethiopia",
    region: "Yirgacheffe",
    farm: "Kochere Cooperative",
    altitude: "1900-2200m",
    process: "Washed",
    roastLevel: "light",
    tastingNotes: ["Jasmine", "Lemon Zest", "Stone Fruit", "Bergamot"],
    description:
      "A classic Yirgacheffe with bright acidity and floral aromatics. Perfect for pour-over and light roast enthusiasts.",
    price: 18.5,
    wholesalePrice: 14.8,
    weight: 340, // grams
    inventory: 125,
    roastDate: "2023-11-15",
    isFeatured: true,
    images: ["/img/yirgacheffe-bag.webp", "/img/yirgacheffe-beans.webp"],
    certifications: ["Organic", "Fair Trade"],
    brewMethods: ["Pour Over", "Aeropress", "Chemex"],
    score: 87.5, // Q-score
    variants: [
      {
        size: "12oz",
        sku: "CP-1001-12",
        price: 18.5,
      },
      {
        size: "5lb",
        sku: "CP-1001-5LB",
        price: 120.0,
        wholesaleOnly: true,
      },
    ],
  },
  {
    id: "CP-1002",
    name: "Colombia Huila Excelso",
    type: "single-origin",
    origin: "Colombia",
    region: "Huila",
    farm: "Finca El Mirador",
    altitude: "1600-1800m",
    process: "Honey",
    roastLevel: "medium",
    tastingNotes: ["Caramel", "Red Apple", "Hazelnut", "Milk Chocolate"],
    description:
      "Well-balanced with sweet caramel notes and medium body. Excellent as espresso or drip coffee.",
    price: 16.75,
    wholesalePrice: 13.4,
    weight: 340,
    inventory: 89,
    roastDate: "2023-11-12",
    isFeatured: false,
    images: ["/img/huila-bag.webp", "/img/huila-beans.webp"],
    certifications: ["Rainforest Alliance"],
    brewMethods: ["Espresso", "Drip", "French Press"],
    score: 85.0,
    variants: [
      {
        size: "12oz",
        sku: "CP-1002-12",
        price: 16.75,
      },
      {
        size: "2lb",
        sku: "CP-1002-2LB",
        price: 45.0,
      },
      {
        size: "10lb",
        sku: "CP-1002-10LB",
        price: 150.0,
        wholesaleOnly: true,
      },
    ],
  },
  {
    id: "CP-1003",
    name: "Dark Roast Blend",
    type: "blend",
    origin: "Brazil Santos",
    region: " Antigua",
    composition: ["Brazil Santos", "Sumatra Mandheling", "Guatemala Antigua"],
    roastLevel: "dark",
    tastingNotes: ["Dark Chocolate", "Molasses", "Smoky", "Walnut"],
    description:
      "Our signature dark roast with full body and low acidity. Ideal for espresso or those who prefer bold flavors.",
    price: 17.99,
    wholesalePrice: 14.39,
    weight: 340,
    inventory: 142,
    roastDate: "2023-11-14",
    isFeatured: true,
    images: ["/img/darkblend-bag.webp", "/img/darkblend-beans.webp"],
    brewMethods: ["Espresso", "Moka Pot", "Cold Brew"],
    score: 83.5,
    variants: [
      {
        size: "12oz",
        sku: "CP-1003-12",
        price: 17.99,
      },
      {
        size: "5lb",
        sku: "CP-1003-5LB",
        price: 110.0,
        wholesaleOnly: true,
      },
    ],
    popularWith: ["Cafés", "Restaurants", "Office Coffee Services"],
  },
  {
    id: "CP-1004",
    name: "Decaf Swiss Water",
    type: "single-origin",
    origin: "Peru",
    region: "Cajamarca",
    decafProcess: "Swiss Water",
    roastLevel: "medium-dark",
    tastingNotes: ["Brown Sugar", "Toasted Almond", "Dried Cherry"],
    description:
      "Smooth, naturally decaffeinated coffee without chemical processing. Retains flavor complexity despite decaffeination.",
    price: 19.25,
    wholesalePrice: 15.4,
    weight: 340,
    inventory: 67,
    roastDate: "2023-11-10",
    isFeatured: false,
    images: ["/img/decaf-bag.webp", "/img/decaf-beans.webp"],
    certifications: ["Organic", "Swiss Water Process"],
    brewMethods: ["Drip", "French Press", "Espresso"],
    variants: [
      {
        size: "12oz",
        sku: "CP-1004-12",
        price: 19.25,
      },
      {
        size: "2lb",
        sku: "CP-1004-2LB",
        price: 52.0,
      },
    ],
  },
];

const roastLevels = [
  {
    id: 1,
    name: "Light",
    description: "Light brown, dry surface, highlights origin characteristics",
  },
  {
    id: 2,
    name: "Medium",
    description: "Medium brown, balanced flavor and acidity",
  },
  {
    id: 3,
    name: "Medium-Dark",
    description: "Rich dark color, some oil on surface, bittersweet notes",
  },
  {
    id: 4,
    name: "Dark",
    description: "Shiny black, oily surface, pronounced bitterness",
  },
];

const processes = [
  "Washed",
  "Natural",
  "Honey",
  "Anaerobic",
  "Carbonic Maceration",
];

const packagingOptions = [
  { size: "12oz", type: "retail", material: "foil-lined bag with valve" },
  {
    size: "2lb",
    type: "retail/wholesale",
    material: "foil-lined bag with valve",
  },
  { size: "5lb", type: "wholesale", material: "foil-lined bag with valve" },
  { size: "10lb", type: "wholesale", material: "bulk bag" },
];

export { coffeeProducts, roastLevels, processes, packagingOptions };
