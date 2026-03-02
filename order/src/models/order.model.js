import mongoose from "mongoose";

const addressesSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\+?[1-9]\d{1,14}$/.test(v); 
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, default: 1, min: 1 },
      price: {
        amount: { type: Number, required: true },  
        currency: { type: String, required: true, enum: [ 'USD', 'INR' ], default: 'INR'}
      }
    }
  ],
  totalPrice: {
    amount: { type: Number, required: true },
    currency: { type: String, required: true, enum: [ 'USD', 'INR' ], default: 'INR' }
  },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PENDING' },
  shippingAddress: { type: addressesSchema, required: true }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;