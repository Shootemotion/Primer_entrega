import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import ProductManager from './productManager.js'

const productManager = new ProductManager('./src/dataBase/products.json') 

class CartManager {
  constructor() {
    this.path = './src/dataBase/cart.json'
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
      id: uuidv4(),
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
    const cart = carts.find((c) => c.id === cartId)
    if (!cart) {
      throw { status: 404, message: 'Carrito no encontrado' }
    }
    return cart.products
  }



  async addProductToCart(cartId, productId, quantity) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === cartId);


    let product
    try {
      product = await productManager.getProductById(productId);
    } catch (error) {
      throw { status: 404, message: 'Producto no encontrado' };
    }

    if (!cart) {
      throw { status: 404, message: 'Carrito no encontrado' };
    }
  
    if (product.stock < quantity) {
      throw { status: 400, message: 'No hay suficiente stock disponible' };
    }

    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.products.find((p) => p.product === productId)
    if (existingProduct) {
      existingProduct.quantity += quantity
    } else {
      cart.products.push({ product: productId, quantity })
    }
  
    await this.saveCarts(carts)
    return cart
  }
}
export default CartManager
