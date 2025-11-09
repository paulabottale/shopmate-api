import app from "./app";
import { connectDB } from "./config/connectDB";
import { env } from "./config/env";

async function boot() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`API lista en http://localhost:${env.port}`);
  });
}
boot();
