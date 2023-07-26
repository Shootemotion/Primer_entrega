import mongoose from 'mongoose';

const cartCollection = 'cart';

const cartSchema = new mongoose.Schema({
  products: {
    type: [{
      _id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' // Aquí debes asegurarte de que el nombre 'Product' coincida con el modelo de productos definido en tu aplicación.
      },
      quantity: Number,
    }],
    default: []
  }
});

cartSchema.pre('findOne', function () {
  this.populate('products.product'); // La referencia a productos debe ser 'products.product' en lugar de 'products,product'
});

mongoose.set('strictQuery', false);

export const cartModel = mongoose.model(cartCollection, cartSchema);