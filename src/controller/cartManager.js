import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

class CartManager {
  constructor() {
    this.path = './src/dataBase/cart.json';
  }


// Traigo todo los carritos
  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al buscar el cart:', error)
      return []
    }
  }



  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: uuidv4(), // Agregar una coma después de esta línea
      products: []
    };
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }


  async saveCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.error('Error saving carts:', error);
    }
  }



  async getProductsInCart(cartId) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === cartId);
    return cart ? cart.products : [];
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) {
      return null; // Carrito no encontrado
    }

    const existingProduct = cart.products.find((p) => p.product === productId);

    if (existingProduct) {
      existingProduct.quantity++; // Incrementar la cantidad si el producto ya existe en el carrito
    } else {
      cart.products.push({ product: productId, quantity: 1 }); // Agregar el nuevo producto al carrito
    }

    await this.saveCarts(carts);
    return cart;
  }
}

export default CartManager;
