import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  ownerId: { type: String, required: true }
}, { timestamps: true });

export const Product = model("Product", productSchema);
