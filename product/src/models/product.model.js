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
  seller: { type: mongoose.Schema.Types.ObjectId, required: true },
  images: [{ url: String, thumbnail: String, id: String }],  
  category: [String]
});

const Product = mongoose.model("product", productSchema);
export default Product;