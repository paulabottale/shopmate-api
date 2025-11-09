import { connectDB } from "./config/connectDB";
import { Product } from "./models/Product";
import { User } from "./models/User";

async function run() {
  await connectDB();

  // Limpia productos anteriores (solo para entorno demo)
  await Product.deleteMany({});

  // Nos aseguramos de tener un usuario dueño (admin demo)
  let admin = await User.findOne({ email: "admin@shopmate.dev" });
  if (!admin) {
    admin = await User.create({
      email: "admin@shopmate.dev",
      passwordHash: "$2a$10$abcdefghijklmnopqrstuv", // placeholder, no se usa
      role: "ADMIN"
    });
  }

  const demoProducts = [
    {
      name: "Monitor 24\" Full HD",
      description: "Ideal para desarrollo y gaming casual.",
      price: 120000,
      ownerId: admin.id
    },
    {
      name: "Teclado mecánico RGB",
      description: "Switches rojos, silencioso, perfecto para codear.",
      price: 80000,
      ownerId: admin.id
    },
    {
      name: "Mouse inalámbrico",
      description: "Preciso, cómodo, sin cable molestando.",
      price: 35000,
      ownerId: admin.id
    },
    {
      name: "Auriculares con micrófono",
      description: "Para calls, focus y Spotify mientras programás.",
      price: 40000,
      ownerId: admin.id
    }
  ];

  await Product.insertMany(demoProducts);

  console.log("Seed completado con productos demo.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
