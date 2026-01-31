import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: {
    amount: { type: Number, required: true },
    currency: { 
      type: String,
      enum: [ "USD", "INR" ],
      default: "INR",
    }, 
  },
  stock: { type: Number, default: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, required: true },
  images: [{ url: String, thumbnail: String, id: String }],  
  category: [String]
}, { timestamps: true });

productSchema.index({ title: "text", description: "text", category: "text" });

const Product = mongoose.model("product", productSchema);
export default Product;