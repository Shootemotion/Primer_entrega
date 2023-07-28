import mongoose from 'mongoose';

const cartCollection = 'cart';

const cartSchema = new mongoose.Schema({
  products: {
    type: [{
      _id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
      },
      quantity: Number,
    }],
    default: []
  }
});

cartSchema.pre('findById', function () {
  this.populate('products.product'); 
});


mongoose.set('strictQuery', false);

export const cartModel = mongoose.model(cartCollection, cartSchema);