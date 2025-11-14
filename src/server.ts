import app from "./app";
import { connectDB } from "./config/connectDB";
import { env } from "./config/env";

async function boot() {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`API lista en http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error("Error al iniciar el servidor:", err);
    process.exit(1);
  }
}

boot();

