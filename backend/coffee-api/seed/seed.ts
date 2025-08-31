import mongoose from "mongoose";
import dotenv from "dotenv";

import { Product } from "../src/models/Products";
import { RoastLevel } from "../src/models/RoastLevel";
import { Process } from "../src/models/Process";
import { PackagingOption } from "../src/models/PackagingOptions";

import coffeeProducts from "./data/products.json";
import roastLevels from "./data/roastLevels.json";
import processes from "./data/processes.json";
import packagingOptions from "./data/packagingOptions.json";

dotenv.config();

async function seedDatabase() {
  try {
    //  Connect
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");

    //  Clear old data
    await Product.deleteMany({});
    await RoastLevel.deleteMany({});
    await Process.deleteMany({});
    await PackagingOption.deleteMany({});
    console.log(" Cleared old data");

    // Insert fresh data
    await Product.insertMany(coffeeProducts);
    await RoastLevel.insertMany(roastLevels);
    await Process.insertMany(processes.map((p) => ({ name: p })));
    await PackagingOption.insertMany(packagingOptions);
    console.log(" Database seeded successfully!");
  } catch (err) {
    console.error(" Error seeding database:", err);
  } finally {
    // Disconnect
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  }
}

seedDatabase();
